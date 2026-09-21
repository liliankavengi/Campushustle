import { Gig, GigCategory, RemoteType, EmploymentType, ExperienceLevel, VerificationStatus } from '../../types';
import { sanitizeHtml } from '../../lib/sanitize';
import { generateContentHash } from '../deduplication/duplicateDetector';
import { APPROVED_SOURCE_DOMAINS, validateExternalLink } from '../security/linkValidator';

export interface RawJobPayload {
  sourceId?: string;
  sourceJobId?: string;
  title: string;
  companyName?: string;
  posterName?: string;
  description: string;
  category?: string;
  rewardUsd?: number;
  rewardKes?: number;
  externalApplyUrl?: string;
  location?: string;
  skills?: string[];
  platformName?: string;
  deviceRequirement?: 'SMARTPHONE_OK' | 'LAPTOP_REQUIRED';
  qualificationGuide?: string;
  publishedAt?: string;
  deadline?: string;
  isKenyaEligible?: boolean;
  isStudentAccepted?: boolean;
}

export function normalizeJobPayload(raw: RawJobPayload, sourceDomain?: string): Gig {
  const cleanTitle = (raw.title || 'Untitled Opportunity').trim();
  const cleanDescription = sanitizeHtml(raw.description || '').trim();
  const company = raw.companyName || raw.posterName || 'Verified Partner';
  
  // Calculate compensation in both USD and KES ($1 USD ~ KSh 130)
  let rewardUsd = raw.rewardUsd;
  let rewardKes = raw.rewardKes;

  if (rewardUsd && !rewardKes) {
    rewardKes = Math.round(rewardUsd * 130);
  } else if (rewardKes && !rewardUsd) {
    rewardUsd = Math.round(rewardKes / 130);
  } else if (!rewardUsd && !rewardKes) {
    rewardUsd = 25;
    rewardKes = 3250;
  }

  // Detect Remote Type
  let remoteType: RemoteType = 'REMOTE';
  const descLower = cleanDescription.toLowerCase();
  const titleLower = cleanTitle.toLowerCase();
  const textCombo = `${titleLower} ${descLower}`;

  if (textCombo.includes('on-site') || textCombo.includes('onsite') || textCombo.includes('in-office') || textCombo.includes('nairobi cbd')) {
    remoteType = 'ON_SITE';
  } else if (textCombo.includes('hybrid')) {
    remoteType = 'HYBRID';
  }

  // Detect Employment Type
  let employmentType: EmploymentType = 'PART_TIME';
  if (textCombo.includes('intern') || textCombo.includes('attachment')) {
    employmentType = 'INTERNSHIP';
  } else if (textCombo.includes('microtask') || textCombo.includes('annotation') || textCombo.includes('evaluat')) {
    employmentType = 'MICROTASK';
  } else if (textCombo.includes('freelance') || textCombo.includes('bounty') || textCombo.includes('contract')) {
    employmentType = 'FREELANCE';
  } else if (textCombo.includes('full-time') || textCombo.includes('full time')) {
    employmentType = 'FULL_TIME';
  }

  // Detect Experience Level
  let experienceLevel: ExperienceLevel = 'BEGINNER';
  if (textCombo.includes('senior') || textCombo.includes('lead') || textCombo.includes('5+ years')) {
    experienceLevel = 'ADVANCED';
  } else if (textCombo.includes('intermediate') || textCombo.includes('mid-level') || textCombo.includes('2+ years')) {
    experienceLevel = 'INTERMEDIATE';
  }

  // Category normalization
  let category: GigCategory = 'Global Remote';
  if (raw.category) {
    category = mapCategory(raw.category);
  } else if (textCombo.includes('swahili') || textCombo.includes('sheng') || textCombo.includes('ai evaluation') || textCombo.includes('llm')) {
    category = 'AI Annotation';
  } else if (textCombo.includes('kenya') || textCombo.includes('nairobi')) {
    category = 'Kenyan Remote';
  } else if (textCombo.includes('attachment') || textCombo.includes('internship')) {
    category = 'Attachment & Internship';
  } else if (textCombo.includes('tutor') || textCombo.includes('proofreading') || textCombo.includes('spss')) {
    category = 'Tutoring';
  } else if (textCombo.includes('flutter') || textCombo.includes('react') || textCombo.includes('python') || textCombo.includes('code')) {
    category = 'Tech & Design';
  }

  // Determine Verification Status
  let verificationStatus: VerificationStatus = 'COMMUNITY_INDEXED';
  if (raw.externalApplyUrl) {
    const linkCheck = validateExternalLink(raw.externalApplyUrl);
    if (linkCheck.trustLevel === 'VERIFIED') {
      verificationStatus = 'VERIFIED_BY_CAMPUSHUSTLE';
    }
  }

  // Skills Extraction fallback
  const skills = raw.skills && raw.skills.length > 0 ? raw.skills : extractBasicSkills(textCombo);

  // Expiry calculation
  const publishedAt = raw.publishedAt || new Date().toISOString();
  const expiresAt = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString();

  const draft: Partial<Gig> = {
    title: cleanTitle,
    companyName: company,
    description: cleanDescription,
  };

  const contentHash = generateContentHash(draft);

  return {
    id: `gig-agg-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    sourceId: raw.sourceId,
    sourceJobId: raw.sourceJobId,
    title: cleanTitle,
    companyName: company,
    posterName: company,
    description: cleanDescription,
    category,
    rewardUsd: rewardUsd!,
    rewardKes: rewardKes!,
    salaryMin: rewardUsd,
    salaryMax: rewardUsd ? Math.round(rewardUsd * 1.3) : undefined,
    salaryCurrency: 'USD',
    escrowStatus: 'HELD',
    originType: raw.externalApplyUrl ? 'EXTERNAL_PARTNER' : 'SCRAPED',
    externalApplyUrl: raw.externalApplyUrl,
    campus: 'ALL',
    location: raw.location || (remoteType === 'REMOTE' ? 'Remote (Kenya Eligible)' : 'Nairobi, Kenya'),
    remoteType,
    employmentType,
    experienceLevel,
    deviceRequirement: raw.deviceRequirement || (skills.includes('Python') || skills.includes('Coding') ? 'LAPTOP_REQUIRED' : 'SMARTPHONE_OK'),
    skills,
    platformName: raw.platformName || company,
    qualificationGuide: raw.qualificationGuide,
    verificationStatus,
    contentHash,
    publishedAt,
    expiresAt,
    lastSeenAt: new Date().toISOString(),
    deadline: raw.deadline || 'Ongoing application',
    createdAt: publishedAt,
    applicantCount: Math.floor(Math.random() * 25) + 3,
    isFeatured: Boolean(rewardUsd && rewardUsd > 100),
    isKenyaEligible: raw.isKenyaEligible ?? true,
    isStudentAccepted: raw.isStudentAccepted ?? true,
  };
}

function mapCategory(rawCat: string): GigCategory {
  const c = rawCat.toLowerCase();
  if (c.includes('annotation') || c.includes('ai')) return 'AI Annotation';
  if (c.includes('intern') || c.includes('attachment')) return 'Attachment & Internship';
  if (c.includes('tutor')) return 'Tutoring';
  if (c.includes('tech') || c.includes('design') || c.includes('dev')) return 'Tech & Design';
  if (c.includes('kenya')) return 'Kenyan Remote';
  if (c.includes('research') || c.includes('writing')) return 'Research & Writing';
  if (c.includes('microtask')) return 'Microtask';
  if (c.includes('campus')) return 'Campus Task';
  return 'Global Remote';
}

function extractBasicSkills(text: string): string[] {
  const recognizedSkills = [
    'Python', 'JavaScript', 'TypeScript', 'React', 'SQL', 'Excel',
    'Swahili / Sheng', 'Logic Reasoning', 'Prompt Evaluation', 'Content Moderation',
    'Research', 'Proofreading', 'Data Entry', 'Audio Transcription', 'PowerBI',
    'SPSS', 'Flutter', 'Graphic Design', 'Customer Support', 'Copywriting'
  ];

  const found: string[] = [];
  for (const s of recognizedSkills) {
    if (text.includes(s.toLowerCase())) {
      found.push(s);
    }
  }

  return found.length > 0 ? found.slice(0, 4) : ['General Assessment', 'Attention to Detail'];
}
