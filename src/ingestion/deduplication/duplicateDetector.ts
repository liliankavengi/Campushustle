import { Gig } from '../../types';

/**
 * Computes a fast deterministic hash string for content deduplication
 */
export function generateContentHash(job: Partial<Gig>): string {
  const normTitle = (job.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const normCompany = (job.companyName || job.posterName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const normDesc = (job.description || '').toLowerCase().slice(0, 120).replace(/[^a-z0-9]/g, '');
  
  const combined = `${normTitle}__${normCompany}__${normDesc}`;
  
  // Simple fast string hashing (DJB2 variant)
  let hash = 5381;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) + hash) + combined.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return `hash-${Math.abs(hash).toString(36)}`;
}

export interface DeduplicationReport {
  isDuplicate: boolean;
  existingMatch?: Gig;
  matchConfidence: number; // 0 - 100
}

/**
 * Checks if incoming job is a duplicate of existing active jobs
 */
export function checkDuplicate(incoming: Partial<Gig>, existingGigs: Gig[]): DeduplicationReport {
  const incomingHash = generateContentHash(incoming);
  
  // 1. Exact Content Hash match
  const exactMatch = existingGigs.find((g) => g.contentHash === incomingHash);
  if (exactMatch) {
    return {
      isDuplicate: true,
      existingMatch: exactMatch,
      matchConfidence: 100
    };
  }

  // 2. Exact URL match (if externalApplyUrl exists)
  if (incoming.externalApplyUrl) {
    const urlMatch = existingGigs.find((g) => g.externalApplyUrl && g.externalApplyUrl.toLowerCase() === incoming.externalApplyUrl?.toLowerCase());
    if (urlMatch) {
      return {
        isDuplicate: true,
        existingMatch: urlMatch,
        matchConfidence: 95
      };
    }
  }

  // 3. Fuzzy Title + Company match
  const incomingTitle = (incoming.title || '').toLowerCase().trim();
  const incomingCompany = (incoming.companyName || incoming.posterName || '').toLowerCase().trim();

  if (incomingTitle && incomingCompany) {
    const fuzzyMatch = existingGigs.find((g) => {
      const gTitle = g.title.toLowerCase().trim();
      const gCompany = (g.companyName || g.posterName || '').toLowerCase().trim();
      return gTitle === incomingTitle && (gCompany === incomingCompany || g.platformName?.toLowerCase() === incomingCompany);
    });

    if (fuzzyMatch) {
      return {
        isDuplicate: true,
        existingMatch: fuzzyMatch,
        matchConfidence: 85
      };
    }
  }

  return {
    isDuplicate: false,
    matchConfidence: 0
  };
}
