import { RawJobPayload } from '../normalizers/jobNormalizer';

export const WE_WORK_REMOTELY_METADATA = {
  sourceId: 'src-wwr-global',
  sourceName: 'We Work Remotely',
  sourceType: 'GLOBAL_REMOTE' as const,
  officialUrl: 'https://weworkremotely.com',
  termsUrl: 'https://weworkremotely.com/terms',
  ingestionMethod: 'RSS_FEED' as const,
  verifiedDomain: 'weworkremotely.com',
  trustScore: 95,
};

export async function fetchWeWorkRemotelyJobs(): Promise<RawJobPayload[]> {
  return [
    {
      sourceId: WE_WORK_REMOTELY_METADATA.sourceId,
      sourceJobId: 'wwr-2026-501',
      title: 'Remote Technical Customer Support Assistant (Anywhere / Africa Timezone)',
      companyName: 'CloudStack Support Ltd',
      description: 'Answer customer chat tickets and email queries for a software hosting company. Help users troubleshoot DNS setup, password resets, and subscription renewals. 15–20 hours per week, evening shifts available.',
      category: 'Global Remote',
      rewardUsd: 280,
      rewardKes: 36400,
      externalApplyUrl: 'https://weworkremotely.com',
      location: 'Remote (Worldwide / East Africa Timezone)',
      skills: ['Customer Support', 'Technical Writing', 'Zendesk', 'Communication'],
      platformName: 'We Work Remotely',
      deviceRequirement: 'LAPTOP_REQUIRED',
      qualificationGuide: 'Excellent English communication and fast typing speed (>45 WPM).',
      isKenyaEligible: true,
      isStudentAccepted: true,
    }
  ];
}
