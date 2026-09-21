import { Gig, JobSource } from '../../types';
import { fetchFuzuJobs, FUZU_SOURCE_METADATA } from '../connectors/fuzuConnector';
import { fetchBrighterMondayJobs, BRIGHTER_MONDAY_METADATA } from '../connectors/brighterMondayConnector';
import { fetchRemoteOkJobs, REMOTE_OK_METADATA } from '../connectors/remoteOkConnector';
import { fetchWeWorkRemotelyJobs, WE_WORK_REMOTELY_METADATA } from '../connectors/weWorkRemotelyConnector';
import { fetchAiEvaluationJobs, AI_LABS_METADATA } from '../connectors/aiEvaluationConnector';
import { normalizeJobPayload, RawJobPayload } from '../normalizers/jobNormalizer';
import { validateIncomingJob } from '../validation/jobValidator';
import { checkDuplicate } from '../deduplication/duplicateDetector';
import { detectScamRiskSignals, summarizeJob } from '../../lib/aiEngine';

export interface IngestionSyncResult {
  timestamp: string;
  totalFetched: number;
  newGigsAdded: number;
  duplicatesSkipped: number;
  invalidSkipped: number;
  sourcesSynced: string[];
  addedGigs: Gig[];
}

export const REGISTERED_JOB_SOURCES: JobSource[] = [
  {
    id: FUZU_SOURCE_METADATA.sourceId,
    sourceName: FUZU_SOURCE_METADATA.sourceName,
    sourceType: FUZU_SOURCE_METADATA.sourceType,
    officialUrl: FUZU_SOURCE_METADATA.officialUrl,
    termsUrl: FUZU_SOURCE_METADATA.termsUrl,
    ingestionMethod: FUZU_SOURCE_METADATA.ingestionMethod,
    verifiedDomain: FUZU_SOURCE_METADATA.verifiedDomain,
    trustScore: FUZU_SOURCE_METADATA.trustScore,
    isActive: true,
  },
  {
    id: BRIGHTER_MONDAY_METADATA.sourceId,
    sourceName: BRIGHTER_MONDAY_METADATA.sourceName,
    sourceType: BRIGHTER_MONDAY_METADATA.sourceType,
    officialUrl: BRIGHTER_MONDAY_METADATA.officialUrl,
    termsUrl: BRIGHTER_MONDAY_METADATA.termsUrl,
    ingestionMethod: BRIGHTER_MONDAY_METADATA.ingestionMethod,
    verifiedDomain: BRIGHTER_MONDAY_METADATA.verifiedDomain,
    trustScore: BRIGHTER_MONDAY_METADATA.trustScore,
    isActive: true,
  },
  {
    id: REMOTE_OK_METADATA.sourceId,
    sourceName: REMOTE_OK_METADATA.sourceName,
    sourceType: REMOTE_OK_METADATA.sourceType,
    officialUrl: REMOTE_OK_METADATA.officialUrl,
    termsUrl: REMOTE_OK_METADATA.termsUrl,
    ingestionMethod: REMOTE_OK_METADATA.ingestionMethod,
    verifiedDomain: REMOTE_OK_METADATA.verifiedDomain,
    trustScore: REMOTE_OK_METADATA.trustScore,
    isActive: true,
  },
  {
    id: WE_WORK_REMOTELY_METADATA.sourceId,
    sourceName: WE_WORK_REMOTELY_METADATA.sourceName,
    sourceType: WE_WORK_REMOTELY_METADATA.sourceType,
    officialUrl: WE_WORK_REMOTELY_METADATA.officialUrl,
    termsUrl: WE_WORK_REMOTELY_METADATA.termsUrl,
    ingestionMethod: WE_WORK_REMOTELY_METADATA.ingestionMethod,
    verifiedDomain: WE_WORK_REMOTELY_METADATA.verifiedDomain,
    trustScore: WE_WORK_REMOTELY_METADATA.trustScore,
    isActive: true,
  },
  {
    id: AI_LABS_METADATA.sourceId,
    sourceName: AI_LABS_METADATA.sourceName,
    sourceType: AI_LABS_METADATA.sourceType,
    officialUrl: AI_LABS_METADATA.officialUrl,
    termsUrl: AI_LABS_METADATA.termsUrl,
    ingestionMethod: AI_LABS_METADATA.ingestionMethod,
    verifiedDomain: AI_LABS_METADATA.verifiedDomain,
    trustScore: AI_LABS_METADATA.trustScore,
    isActive: true,
  },
];

export async function runIngestionPipeline(existingGigs: Gig[]): Promise<IngestionSyncResult> {
  const syncTimestamp = new Date().toISOString();
  const rawPool: RawJobPayload[] = [];
  const sourcesSynced: string[] = [];

  try {
    const fuzu = await fetchFuzuJobs();
    rawPool.push(...fuzu);
    sourcesSynced.push('Fuzu Kenya');
  } catch (e) {
    console.error('Fuzu connector error:', e);
  }

  try {
    const bm = await fetchBrighterMondayJobs();
    rawPool.push(...bm);
    sourcesSynced.push('BrighterMonday');
  } catch (e) {
    console.error('BrighterMonday connector error:', e);
  }

  try {
    const rok = await fetchRemoteOkJobs();
    rawPool.push(...rok);
    sourcesSynced.push('Remote OK');
  } catch (e) {
    console.error('RemoteOK connector error:', e);
  }

  try {
    const wwr = await fetchWeWorkRemotelyJobs();
    rawPool.push(...wwr);
    sourcesSynced.push('We Work Remotely');
  } catch (e) {
    console.error('WeWorkRemotely connector error:', e);
  }

  try {
    const ai = await fetchAiEvaluationJobs();
    rawPool.push(...ai);
    sourcesSynced.push('AI Training Labs');
  } catch (e) {
    console.error('AI connector error:', e);
  }

  let duplicatesSkipped = 0;
  let invalidSkipped = 0;
  const addedGigs: Gig[] = [];
  const activeCatalog = [...existingGigs];

  for (const raw of rawPool) {
    // 1. Normalize
    const normalized = normalizeJobPayload(raw);

    // 2. Validate
    const valResult = validateIncomingJob(normalized);
    if (!valResult.isValid) {
      invalidSkipped += 1;
      continue;
    }

    // 3. Deduplicate
    const dupResult = checkDuplicate(normalized, activeCatalog);
    if (dupResult.isDuplicate) {
      duplicatesSkipped += 1;
      continue;
    }

    // 4. Enrich with AI summaries & scam risk analysis
    normalized.summaryBullets = summarizeJob(normalized);
    normalized.scamRiskSignals = detectScamRiskSignals(normalized);

    addedGigs.push(normalized);
    activeCatalog.unshift(normalized); // Keep local tracking fresh for subsequent loop iterations
  }

  return {
    timestamp: syncTimestamp,
    totalFetched: rawPool.length,
    newGigsAdded: addedGigs.length,
    duplicatesSkipped,
    invalidSkipped,
    sourcesSynced,
    addedGigs,
  };
}
