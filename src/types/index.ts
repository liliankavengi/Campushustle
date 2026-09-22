export type CampusName = 'MMU' | 'UoN' | 'KU' | 'JKUAT' | 'Strathmore' | 'Egerton' | 'Moi';

export interface User {
  id: string;
  phoneNumber: string; // 2547XXXXXXXX
  email?: string;
  fullName: string;
  campus: CampusName;
  isVerified: boolean;
  createdAt: string;
  subscribedService?: string;
  subscriptionStatus: SubscriptionStatus;
  profile?: UserProfile;
}

export interface UserProfile {
  skills: string[];
  university: CampusName;
  major?: string;
  graduationYear?: number;
  careerGoals: string[];
  experienceLevel: ExperienceLevel;
  preferredRemoteType: RemoteType | 'ANY';
  weeklyHoursAvailable: number;
  bio?: string;
}

export type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED';

export interface Subscription {
  id: string;
  userId: string;
  amount: number; // 130.00 KES or 200.00 KES
  mpesaReceipt?: string;
  status: SubscriptionStatus;
  serviceType: 'SEMESTER_ALL_ACCESS' | 'AI_SCREENING_GUIDES' | 'SMS_STATEMENT_SYNC' | 'ESCROW_INSURANCE' | 'GEMINI_PRO_FAMILY';
  expiresAt: string;
  createdAt: string;
}

export interface GeminiFamilyRequest {
  id: string;
  userId: string;
  fullName?: string;
  googleEmail: string;
  phoneNumber: string;
  amountKes: number; // 200 KES
  mpesaReceipt?: string;
  status: 'INVITATION_PENDING' | 'ADDED_TO_FAMILY' | 'CANCELLED';
  requestedAt: string;
  activatedAt?: string;
}

export type TransactionType = 'INCOME' | 'EXPENSE';
export type ExpenseCategory = 'Kibanda' | 'Rent' | 'Bundles' | 'HELB' | 'Printing' | 'Transport' | 'SideHustle' | 'Other';

export interface FinancialLog {
  id: string;
  userId: string;
  category: ExpenseCategory;
  amount: number;
  transactionType: TransactionType;
  description?: string;
  loggedAt: string;
}

export type GigCategory = 
  | 'Campus Task' 
  | 'AI Annotation' 
  | 'Tutoring' 
  | 'Tech & Design' 
  | 'Attachment & Internship'
  | 'Global Remote'
  | 'Kenyan Remote'
  | 'Research & Writing'
  | 'Microtask';

export type EscrowStatus = 'UNFUNDED' | 'HELD' | 'RELEASED' | 'REFUNDED';
export type OriginType = 'INTERNAL_ESCROW' | 'EXTERNAL_PARTNER' | 'SCRAPED' | 'COMMUNITY_POSTED';
export type DeviceRequirement = 'SMARTPHONE_OK' | 'LAPTOP_REQUIRED';
export type RemoteType = 'REMOTE' | 'HYBRID' | 'ON_SITE';
export type EmploymentType = 'FREELANCE' | 'PART_TIME' | 'INTERNSHIP' | 'MICROTASK' | 'FULL_TIME';
export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type VerificationStatus = 'VERIFIED_BY_CAMPUSHUSTLE' | 'COMMUNITY_INDEXED' | 'AWAITING_REVIEW';

export interface JobSource {
  id: string;
  sourceName: string;
  sourceType: 'KENYAN_PORTAL' | 'GLOBAL_REMOTE' | 'AI_LAB' | 'CAMPUS_CAREERS' | 'FREELANCE';
  officialUrl: string;
  ingestionMethod: 'API' | 'RSS_FEED' | 'PARTNER_FEED' | 'APPROVED_CRAWLER';
  termsUrl: string;
  isActive: boolean;
  trustScore: number; // 0 - 100
  lastSuccessfulSync?: string;
  verifiedDomain: string;
}

export interface Gig {
  id: string;
  sourceId?: string;
  sourceJobId?: string;
  companyName?: string;
  posterId?: string;
  posterName?: string;
  posterPhone?: string;
  workerId?: string;
  title: string;
  description: string;
  category: GigCategory;
  rewardUsd: number; // Compensation in USD ($)
  rewardKes: number; // KES equivalent (KSh)
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: 'USD' | 'KES';
  escrowStatus: EscrowStatus;
  originType: OriginType;
  externalApplyUrl?: string;
  originalUrl?: string;
  campus?: CampusName | 'ALL';
  location?: string;
  remoteType?: RemoteType;
  employmentType?: EmploymentType;
  experienceLevel?: ExperienceLevel;
  deviceRequirement: DeviceRequirement;
  skills: string[];
  platformName?: string;
  qualificationGuide?: string;
  summaryBullets?: string[];
  scamRiskSignals?: string[];
  verificationStatus?: VerificationStatus;
  contentHash?: string;
  publishedAt?: string;
  expiresAt?: string;
  lastSeenAt?: string;
  deadline?: string;
  createdAt: string;
  applicantCount: number;
  isFeatured?: boolean;
  isKenyaEligible?: boolean;
  isStudentAccepted?: boolean;
}

export type ApplicationStatus = 'PREPARING' | 'APPLIED' | 'INTERVIEWING' | 'ACCEPTED' | 'REJECTED';

export interface ExternalApplication {
  id: string;
  gigId: string;
  jobTitle: string;
  companyName: string;
  platformName: string;
  externalUrl?: string;
  status: ApplicationStatus;
  appliedDate: string;
  rewardUsd?: number;
  rewardKes?: number;
  notes?: string;
  followUpDate?: string;
  lastUpdated: string;
}

export interface SavedGig {
  gigId: string;
  savedAt: string;
  notes?: string;
}

export interface JobReport {
  id: string;
  gigId: string;
  jobTitle: string;
  reporterId: string;
  reason: 'SCAM_OR_FEE_REQUEST' | 'EXPIRED_LINK' | 'MISLEADING_INFO' | 'WRONG_CATEGORY' | 'OTHER';
  details: string;
  reportedAt: string;
  status: 'PENDING_REVIEW' | 'RESOLVED' | 'DISMISSED';
}

export interface JobAlert {
  id: string;
  userId: string;
  keyword: string;
  category?: GigCategory | 'ALL';
  remoteOnly: boolean;
  minPayUsd?: number;
  isActive: boolean;
  createdAt: string;
}

export type MpesaPurpose = 'SUBSCRIPTION_PASS' | 'GIG_ESCROW' | 'B2C_PAYOUT';
export type MpesaTxStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface MpesaTransaction {
  id: string;
  checkoutRequestId: string;
  merchantRequestId: string;
  mpesaReceipt?: string;
  phoneNumber: string;
  amount: number;
  purpose: MpesaPurpose;
  resultCode?: number;
  resultDesc?: string;
  status: MpesaTxStatus;
  createdAt: string;
}

export interface MmfFund {
  id: string;
  name: string;
  dailyYieldPct: number;
  effectiveAnnualRatePct: number;
  minInvestmentKes: number;
  managementFeePct: number;
  riskProfile: 'Low' | 'Moderate';
  sparklineData: number[];
  withholdingTaxPct: number;
}

export type NetworkCondition = 'FAST_4G' | 'FLAKY_CAMPUS' | '2G_EDGE' | 'OFFLINE';

export interface ServiceSubscriptionMetric {
  serviceId: string;
  serviceName: string;
  priceKes: number;
  subscriberCount: number;
  revenueKes: number;
  category: string;
  description?: string;
}
