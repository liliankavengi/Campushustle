import { RawJobPayload } from '../normalizers/jobNormalizer';

export const REMOTE_OK_METADATA = {
  sourceId: 'src-remote-ok',
  sourceName: 'Remote OK',
  sourceType: 'GLOBAL_REMOTE' as const,
  officialUrl: 'https://remoteok.com',
  termsUrl: 'https://remoteok.com/terms',
  ingestionMethod: 'API' as const,
  verifiedDomain: 'remoteok.com',
  trustScore: 94,
};

export async function fetchRemoteOkJobs(): Promise<RawJobPayload[]> {
  return [
    {
      sourceId: REMOTE_OK_METADATA.sourceId,
      sourceJobId: 'rok-2026-301',
      title: 'Junior Frontend React / Next.js Component Bug-Fixer (Worldwide Remote)',
      companyName: 'Superscale Digital US',
      description: 'Help an open-source development team fix UI accessibility bugs, refactor Tailwind CSS components, and build responsive landing pages in Next.js and TypeScript. Work asynchronously on your own campus schedule.',
      category: 'Global Remote',
      rewardUsd: 320,
      rewardKes: 41600,
      externalApplyUrl: 'https://remoteok.com',
      location: 'Worldwide Remote (Kenya eligible)',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      platformName: 'Remote OK',
      deviceRequirement: 'LAPTOP_REQUIRED',
      qualificationGuide: 'Link your GitHub profile and complete a 1-hour take-home bugfix PR.',
      isKenyaEligible: true,
      isStudentAccepted: true,
    },
    {
      sourceId: REMOTE_OK_METADATA.sourceId,
      sourceJobId: 'rok-2026-318',
      title: 'Junior QA Manual Tester & Bug Reproducer (Worldwide Remote)',
      companyName: 'AppMetrics Global Labs',
      description: 'Test new features on Android & iOS staging builds across different network speeds (2G/3G/4G). Document reproduction steps in Jira, record screen recordings of crashes, and verify bug fixes.',
      category: 'Global Remote',
      rewardUsd: 260,
      rewardKes: 33800,
      externalApplyUrl: 'https://remoteok.com',
      location: 'Worldwide Remote (Kenya eligible)',
      skills: ['QA Testing', 'Bug Reporting', 'Android', 'Attention to Detail'],
      platformName: 'Remote OK',
      deviceRequirement: 'SMARTPHONE_OK',
      qualificationGuide: 'No prior formal QA degree required. Pass simple bug reporting test.',
      isKenyaEligible: true,
      isStudentAccepted: true,
    }
  ];
}
