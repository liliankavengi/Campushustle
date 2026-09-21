/**
 * Link Security & SSRF Protection Engine
 * Implements OWASP recommendations for safe outbound URL validation,
 * HTTPS enforcement, domain normalization, and private IP blocking.
 */

export interface LinkValidationResult {
  isValid: boolean;
  isHttps: boolean;
  isApprovedDomain: boolean;
  isPrivateNetwork: boolean;
  normalizedDomain: string;
  trustScore: number; // 0 - 100
  trustLevel: 'VERIFIED' | 'KNOWN_PORTAL' | 'COMMUNITY_UNVERIFIED' | 'SUSPICIOUS';
  warningMessage?: string;
}

// Known legitimate job portals and approved platforms
export const APPROVED_SOURCE_DOMAINS: Record<string, { name: string; trustScore: number; category: string }> = {
  'alignerr.com': { name: 'Alignerr AI', trustScore: 98, category: 'AI_LAB' },
  'outlier.ai': { name: 'Outlier.ai / Scale AI', trustScore: 98, category: 'AI_LAB' },
  'dataannotation.tech': { name: 'DataAnnotation.tech', trustScore: 98, category: 'AI_LAB' },
  'mindrift.ai': { name: 'Mindrift AI', trustScore: 92, category: 'AI_LAB' },
  'oneforma.com': { name: 'OneForma by Centific', trustScore: 94, category: 'AI_LAB' },
  'clickworker.com': { name: 'Clickworker', trustScore: 90, category: 'AI_LAB' },
  'fuzu.com': { name: 'Fuzu Kenya', trustScore: 95, category: 'KENYAN_PORTAL' },
  'brightermonday.co.ke': { name: 'BrighterMonday Kenya', trustScore: 95, category: 'KENYAN_PORTAL' },
  'myjobmag.co.ke': { name: 'MyJobMag Kenya', trustScore: 92, category: 'KENYAN_PORTAL' },
  'remoteok.com': { name: 'Remote OK', trustScore: 94, category: 'GLOBAL_REMOTE' },
  'weworkremotely.com': { name: 'We Work Remotely', trustScore: 95, category: 'GLOBAL_REMOTE' },
  'wellfound.com': { name: 'Wellfound (AngelList)', trustScore: 96, category: 'GLOBAL_REMOTE' },
  'flexjobs.com': { name: 'FlexJobs', trustScore: 93, category: 'GLOBAL_REMOTE' },
  'linkedin.com': { name: 'LinkedIn Jobs', trustScore: 96, category: 'GLOBAL_REMOTE' },
  'greenhouse.io': { name: 'Greenhouse ATS', trustScore: 99, category: 'COMPANY_CAREERS' },
  'lever.co': { name: 'Lever ATS', trustScore: 99, category: 'COMPANY_CAREERS' },
  'workable.com': { name: 'Workable ATS', trustScore: 98, category: 'COMPANY_CAREERS' },
  'ashbyhq.com': { name: 'Ashby ATS', trustScore: 99, category: 'COMPANY_CAREERS' },
};

// Private / Internal IP blocks and dangerous hostnames (SSRF prevention)
const PRIVATE_OR_RESERVED_HOSTS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '169.254.169.254', // AWS metadata
  'metadata.google.internal',
];

export function validateExternalLink(rawUrl: string): LinkValidationResult {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return {
      isValid: false,
      isHttps: false,
      isApprovedDomain: false,
      isPrivateNetwork: false,
      normalizedDomain: '',
      trustScore: 0,
      trustLevel: 'SUSPICIOUS',
      warningMessage: 'Missing or empty URL provided.'
    };
  }

  try {
    const parsed = new URL(rawUrl.trim());
    const isHttps = parsed.protocol === 'https:';
    const hostname = parsed.hostname.toLowerCase();

    // 1. SSRF Check: Is hostname private / reserved?
    const isPrivate = PRIVATE_OR_RESERVED_HOSTS.some(
      (h) => hostname === h || hostname.endsWith(`.${h}`)
    ) || isPrivateIp(hostname);

    if (isPrivate) {
      return {
        isValid: false,
        isHttps,
        isApprovedDomain: false,
        isPrivateNetwork: true,
        normalizedDomain: hostname,
        trustScore: 0,
        trustLevel: 'SUSPICIOUS',
        warningMessage: 'Security Alert: Target points to internal or restricted IP network.'
      };
    }

    // 2. Normalize Domain (strip subdomains like www. or jobs.)
    const cleanDomain = normalizeDomain(hostname);
    const approvedInfo = APPROVED_SOURCE_DOMAINS[cleanDomain] || APPROVED_SOURCE_DOMAINS[hostname];

    let trustScore = 50;
    let trustLevel: LinkValidationResult['trustLevel'] = 'COMMUNITY_UNVERIFIED';
    let warningMessage: string | undefined;

    if (!isHttps) {
      trustScore -= 30;
      warningMessage = 'Warning: Target link is not secured with HTTPS.';
    }

    if (approvedInfo) {
      trustScore = isHttps ? approvedInfo.trustScore : approvedInfo.trustScore - 20;
      trustLevel = 'VERIFIED';
    } else if (cleanDomain.endsWith('.edu') || cleanDomain.endsWith('.ac.ke') || cleanDomain.endsWith('.go.ke')) {
      trustScore = 90;
      trustLevel = 'VERIFIED';
    } else {
      trustScore = 60;
      trustLevel = 'COMMUNITY_UNVERIFIED';
      warningMessage = 'External domain is community-indexed. Confirm the job details on the original site.';
    }

    return {
      isValid: isHttps && !isPrivate,
      isHttps,
      isApprovedDomain: Boolean(approvedInfo),
      isPrivateNetwork: false,
      normalizedDomain: cleanDomain,
      trustScore,
      trustLevel,
      warningMessage
    };
  } catch {
    return {
      isValid: false,
      isHttps: false,
      isApprovedDomain: false,
      isPrivateNetwork: false,
      normalizedDomain: '',
      trustScore: 0,
      trustLevel: 'SUSPICIOUS',
      warningMessage: 'Malformed URL format.'
    };
  }
}

function normalizeDomain(hostname: string): string {
  const parts = hostname.split('.');
  if (parts.length > 2) {
    // Handle domains like brightermonday.co.ke or fuzu.com
    if (parts[parts.length - 2] === 'co' || parts[parts.length - 2] === 'ac' || parts[parts.length - 2] === 'or') {
      return parts.slice(-3).join('.');
    }
    return parts.slice(-2).join('.');
  }
  return hostname;
}

function isPrivateIp(ip: string): boolean {
  // Simple check for RFC1918 ranges
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = ip.match(ipv4Regex);
  if (!match) return false;

  const octet1 = parseInt(match[1], 10);
  const octet2 = parseInt(match[2], 10);

  if (octet1 === 10) return true; // 10.0.0.0/8
  if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return true; // 172.16.0.0/12
  if (octet1 === 192 && octet2 === 168) return true; // 192.168.0.0/16
  if (octet1 === 127) return true; // 127.0.0.0/8
  if (octet1 === 169 && octet2 === 254) return true; // Link-local

  return false;
}
