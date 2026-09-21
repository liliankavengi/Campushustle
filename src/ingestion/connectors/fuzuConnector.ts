import { RawJobPayload } from '../normalizers/jobNormalizer';

export const FUZU_SOURCE_METADATA = {
  sourceId: 'src-fuzu-ke',
  sourceName: 'Fuzu Kenya',
  sourceType: 'KENYAN_PORTAL' as const,
  officialUrl: 'https://www.fuzu.com/kenya',
  termsUrl: 'https://www.fuzu.com/terms',
  ingestionMethod: 'PARTNER_FEED' as const,
  verifiedDomain: 'fuzu.com',
  trustScore: 95,
};

export async function fetchFuzuJobs(): Promise<RawJobPayload[]> {
  // Simulates fetching verified Kenyan remote & hybrid student postings
  return [
    {
      sourceId: FUZU_SOURCE_METADATA.sourceId,
      sourceJobId: 'fz-2026-081',
      title: 'Junior Remote Social Media & Community Moderator (Kenya)',
      companyName: 'Adanian Labs Kenya',
      description: 'Coordinate digital community engagement across Telegram, Twitter/X, and student developer groups. Monitor forums for brand guidelines, schedule announcements, and provide weekly sentiment reports. Remote flexible shifts (15–20 hrs/week).',
      category: 'Kenyan Remote',
      rewardUsd: 180,
      rewardKes: 23400,
      externalApplyUrl: 'https://www.fuzu.com/kenya',
      location: 'Remote (Kenya)',
      skills: ['Social Media', 'Content Moderation', 'Community Management', 'Canva'],
      platformName: 'Fuzu Kenya',
      deviceRequirement: 'SMARTPHONE_OK',
      qualificationGuide: 'Submit 1-page CV and link to any managed social handle.',
      isKenyaEligible: true,
      isStudentAccepted: true,
    },
    {
      sourceId: FUZU_SOURCE_METADATA.sourceId,
      sourceJobId: 'fz-2026-094',
      title: 'Graduate Trainee / Attachment — Operations & FinTech Support',
      companyName: 'Wapi Pay Financials',
      description: 'Assist the merchant onboarding desk with KYC documentation verification, M-Pesa API reconciliation tests, and student merchant customer service inquiries. Hybrid arrangement in Nairobi with remote flexible days.',
      category: 'Attachment & Internship',
      rewardUsd: 220,
      rewardKes: 28600,
      externalApplyUrl: 'https://www.fuzu.com/kenya',
      location: 'Nairobi / Hybrid',
      skills: ['KYC Operations', 'Customer Support', 'Excel', 'Fintech'],
      platformName: 'Fuzu Kenya',
      deviceRequirement: 'LAPTOP_REQUIRED',
      qualificationGuide: 'Open to continuing diploma/degree students looking for industrial attachment.',
      isKenyaEligible: true,
      isStudentAccepted: true,
    }
  ];
}
