import { Gig } from '../../types';
import { validateExternalLink } from '../security/linkValidator';

export interface ValidationIssue {
  field: string;
  message: string;
  severity: 'ERROR' | 'WARNING';
}

export interface JobValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  sanitizedJob?: Partial<Gig>;
}

export function validateIncomingJob(job: Partial<Gig>): JobValidationResult {
  const issues: ValidationIssue[] = [];

  // 1. Mandatory Title
  if (!job.title || job.title.trim().length < 5) {
    issues.push({
      field: 'title',
      message: 'Job title is missing or too short (minimum 5 characters required).',
      severity: 'ERROR'
    });
  }

  // 2. Mandatory Description
  if (!job.description || job.description.trim().length < 20) {
    issues.push({
      field: 'description',
      message: 'Job description is too brief to evaluate (minimum 20 characters required).',
      severity: 'ERROR'
    });
  }

  // 3. Compensation Bounds Check
  if (job.rewardUsd !== undefined && (job.rewardUsd < 0 || job.rewardUsd > 10000)) {
    issues.push({
      field: 'rewardUsd',
      message: 'Reported compensation is outside realistic student gig bounds.',
      severity: 'WARNING'
    });
  }

  // 4. URL and Link Safety Check
  if (job.externalApplyUrl) {
    const linkCheck = validateExternalLink(job.externalApplyUrl);
    if (!linkCheck.isValid) {
      issues.push({
        field: 'externalApplyUrl',
        message: linkCheck.warningMessage || 'Invalid external application URL.',
        severity: linkCheck.isPrivateNetwork ? 'ERROR' : 'WARNING'
      });
    }
  }

  const hasErrors = issues.some((i) => i.severity === 'ERROR');

  return {
    isValid: !hasErrors,
    issues,
    sanitizedJob: hasErrors ? undefined : job
  };
}
