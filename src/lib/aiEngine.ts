import { Gig, UserProfile } from '../types';

/**
 * AI Engine for CampusHustle 2.0
 * Handles intelligent skill matching, scam risk signal analysis,
 * automated 4-point job summarization, and student skill gap discovery.
 */

// Scam indicators and high-risk keywords
const SCAM_PATTERNS = [
  { pattern: /pay (?:a )?(?:registration|upfront|training|deposit) fee/i, signal: 'Demands upfront registration or training deposit' },
  { pattern: /send (?:money|ksh|usd|\$) to/i, signal: 'Requests student to send money before starting' },
  { pattern: /earn \$?(?:500|1000|2000) (?:per day|daily) (?:typing|copying)/i, signal: 'Unrealistically inflated earnings for basic entry tasks' },
  { pattern: /telegram only|contact on telegram/i, signal: 'Unofficial recruitment channel without verified corporate portal' },
  { pattern: /no experience needed.*\$100\/hr/i, signal: 'Disproportionate compensation for zero-skill entry role' },
  { pattern: /bank account details.*before interview/i, signal: 'Premature bank/financial credential request' },
];

export function detectScamRiskSignals(job: Partial<Gig>): string[] {
  const signals: string[] = [];
  const textToScan = `${job.title || ''} ${job.description || ''} ${job.qualificationGuide || ''}`.toLowerCase();

  for (const item of SCAM_PATTERNS) {
    if (item.pattern.test(textToScan)) {
      signals.push(item.signal);
    }
  }

  // Check for suspicious URLs
  if (job.externalApplyUrl) {
    const url = job.externalApplyUrl.toLowerCase();
    if (url.includes('bit.ly') || url.includes('tinyurl.com') || url.includes('t.me/')) {
      signals.push('Shortened or anonymous redirect link (requires caution)');
    }
  }

  return signals;
}

export function summarizeJob(job: Partial<Gig>): string[] {
  const bullets: string[] = [];

  // Bullet 1: Core Responsibility
  bullets.push(`Role Scope: ${job.title || 'Student Opportunity'} at ${job.companyName || job.platformName || 'Partner'}.`);

  // Bullet 2: Essential Skills
  if (job.skills && job.skills.length > 0) {
    bullets.push(`Key Skills: Requires proficiency in ${job.skills.slice(0, 3).join(', ')}.`);
  } else {
    bullets.push(`Key Skills: Foundational digital literacy and attention to detail.`);
  }

  // Bullet 3: Compensation & Workload
  if (job.rewardUsd) {
    bullets.push(`Compensation: Estimated at $${job.rewardUsd} USD (~KSh ${(job.rewardKes || job.rewardUsd * 130).toLocaleString()}) for project milestone or weekly batch.`);
  } else {
    bullets.push(`Compensation: Direct milestone payout upon milestone approval.`);
  }

  // Bullet 4: Application Route
  if (job.externalApplyUrl) {
    bullets.push(`Application Route: Direct external application via official ${job.platformName || 'portal'}.`);
  } else {
    bullets.push(`Application Route: CampusHustle verified internal application.`);
  }

  return bullets;
}

export interface MatchScoreResult {
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendation: string;
}

export function matchStudentProfile(profile: UserProfile | undefined, job: Gig): MatchScoreResult {
  if (!profile || !profile.skills || profile.skills.length === 0) {
    return {
      matchPercentage: 70, // Baseline general readiness
      matchingSkills: [],
      missingSkills: job.skills.slice(0, 3),
      recommendation: 'Complete your student skill profile for personalized precision scores.'
    };
  }

  const studentSkills = new Set(profile.skills.map((s) => s.toLowerCase().trim()));
  const matching: string[] = [];
  const missing: string[] = [];

  for (const s of job.skills) {
    if (studentSkills.has(s.toLowerCase().trim())) {
      matching.push(s);
    } else {
      missing.push(s);
    }
  }

  const totalJobSkills = Math.max(1, job.skills.length);
  const skillMatchRatio = matching.length / totalJobSkills;

  // Additional boosts
  let boost = 0;
  if (job.remoteType === 'REMOTE' && (profile.preferredRemoteType === 'REMOTE' || profile.preferredRemoteType === 'ANY')) {
    boost += 0.15;
  }
  if (profile.experienceLevel === 'BEGINNER' && job.experienceLevel === 'BEGINNER') {
    boost += 0.15;
  }

  const rawScore = Math.min(100, Math.round((skillMatchRatio * 0.7 + boost) * 100));
  const finalScore = Math.max(30, rawScore);

  let recommendation = 'High fit: You meet key technical and operational requirements.';
  if (finalScore < 50) {
    recommendation = `Consider brushing up on ${missing.slice(0, 2).join(', ')} before applying.`;
  } else if (finalScore < 75) {
    recommendation = `Good match. Highlight your ${matching.slice(0, 2).join(', ')} experience in your application.`;
  }

  return {
    matchPercentage: finalScore,
    matchingSkills: matching,
    missingSkills: missing,
    recommendation
  };
}

export interface SkillGapItem {
  skill: string;
  demandCount: number;
  avgRewardUsd: number;
  category: string;
  recommendedPlaybook: string;
  marketDescription: string;
}

export function analyzeSkillGaps(profile: UserProfile | undefined, activeCatalog: Gig[]): SkillGapItem[] {
  const studentSkills = new Set((profile?.skills || []).map((s) => s.toLowerCase().trim()));
  const skillFrequency: Record<string, { count: number; totalReward: number; categories: Set<string> }> = {};

  for (const gig of activeCatalog) {
    for (const skill of gig.skills) {
      const cleanSkill = skill.trim();
      if (!skillFrequency[cleanSkill]) {
        skillFrequency[cleanSkill] = { count: 0, totalReward: 0, categories: new Set() };
      }
      skillFrequency[cleanSkill].count += 1;
      skillFrequency[cleanSkill].totalReward += gig.rewardUsd || 25;
      skillFrequency[cleanSkill].categories.add(gig.category);
    }
  }

  const gapList: SkillGapItem[] = [];

  for (const [skill, stats] of Object.entries(skillFrequency)) {
    const isOwned = studentSkills.has(skill.toLowerCase().trim());
    if (!isOwned && stats.count >= 1) {
      const avgReward = Math.round(stats.totalReward / stats.count);
      const topCat = Array.from(stats.categories)[0] || 'Global Remote';

      let playbook = 'AI Evaluation Masterclass';
      if (skill.includes('Python') || skill.includes('SQL') || skill.includes('React') || skill.includes('Flutter')) {
        playbook = 'Developer Code Benchmarking Guide';
      } else if (skill.includes('PowerBI') || skill.includes('Excel') || skill.includes('SPSS')) {
        playbook = 'Junior Data Analytics Sprint';
      } else if (skill.includes('Swahili') || skill.includes('Sheng')) {
        playbook = 'Kenyan Sheng/Swahili Prompt Evaluation Cheat Sheet';
      }

      gapList.push({
        skill,
        demandCount: stats.count,
        avgRewardUsd: avgReward,
        category: topCat,
        recommendedPlaybook: playbook,
        marketDescription: `Featured in ${stats.count} active listing${stats.count > 1 ? 's' : ''} with average payouts of ~$${avgReward} USD.`
      });
    }
  }

  // Sort by highest demand count and reward
  return gapList.sort((a, b) => (b.demandCount * b.avgRewardUsd) - (a.demandCount * a.avgRewardUsd)).slice(0, 6);
}
