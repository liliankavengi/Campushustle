import { RawJobPayload } from '../normalizers/jobNormalizer';

export const BRIGHTER_MONDAY_METADATA = {
  sourceId: 'src-brightermonday-ke',
  sourceName: 'BrighterMonday Kenya',
  sourceType: 'KENYAN_PORTAL' as const,
  officialUrl: 'https://www.brightermonday.co.ke/jobs',
  termsUrl: 'https://www.brightermonday.co.ke/terms',
  ingestionMethod: 'API' as const,
  verifiedDomain: 'brightermonday.co.ke',
  trustScore: 95,
};

export async function fetchBrighterMondayJobs(): Promise<RawJobPayload[]> {
  return [
    {
      sourceId: BRIGHTER_MONDAY_METADATA.sourceId,
      sourceJobId: 'bm-2026-112',
      title: 'Remote PowerBI & Excel Junior Data Analyst Intern',
      companyName: 'Twiga Logistics Services',
      description: 'Assist the analytics department in cleaning weekly regional dispatch records in Excel, querying SQLite / PostgreSQL tables, and designing interactive PowerBI KPI executive dashboards. Fully remote with weekly mentor check-ins.',
      category: 'Kenyan Remote',
      rewardUsd: 215,
      rewardKes: 28000,
      externalApplyUrl: 'https://www.brightermonday.co.ke/jobs',
      location: 'Remote (Kenya)',
      skills: ['PowerBI', 'Excel', 'SQL', 'Data Cleaning'],
      platformName: 'BrighterMonday',
      deviceRequirement: 'LAPTOP_REQUIRED',
      qualificationGuide: 'Requires basic knowledge of Excel formulas (VLOOKUP/XLOOKUP) and PowerBI visuals.',
      isKenyaEligible: true,
      isStudentAccepted: true,
    },
    {
      sourceId: BRIGHTER_MONDAY_METADATA.sourceId,
      sourceJobId: 'bm-2026-145',
      title: 'Digital Copywriter & SEO Blog Specialist (Student Freelance)',
      companyName: 'Apex Media Africa',
      description: 'Write engaging 800–1200 word articles on youth personal finance, campus lifestyle, and tech trends. Optimized for Google SEO search rankings and Kenyan youth readership. Flexible submission deadlines.',
      category: 'Research & Writing',
      rewardUsd: 140,
      rewardKes: 18200,
      externalApplyUrl: 'https://www.brightermonday.co.ke/jobs',
      location: 'Remote (Kenya)',
      skills: ['Copywriting', 'SEO', 'Content Writing', 'Research'],
      platformName: 'BrighterMonday',
      deviceRequirement: 'LAPTOP_REQUIRED',
      qualificationGuide: 'Share 2 writing samples or links to existing blog articles.',
      isKenyaEligible: true,
      isStudentAccepted: true,
    }
  ];
}
