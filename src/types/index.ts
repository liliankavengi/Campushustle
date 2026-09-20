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
}

export type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED';

export interface Subscription {
  id: string;
  userId: string;
  amount: number; // 130.00 KES
  mpesaReceipt?: string;
  status: SubscriptionStatus;
  serviceType: 'SEMESTER_ALL_ACCESS' | 'AI_SCREENING_GUIDES' | 'SMS_STATEMENT_SYNC' | 'ESCROW_INSURANCE';
  expiresAt: string;
  createdAt: string;
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

export type GigCategory = 'Campus Task' | 'AI Annotation' | 'Tutoring' | 'Tech & Design' | 'Attachment & Internship';
export type EscrowStatus = 'UNFUNDED' | 'HELD' | 'RELEASED' | 'REFUNDED';
export type OriginType = 'INTERNAL_ESCROW' | 'EXTERNAL_PARTNER' | 'SCRAPED';
export type DeviceRequirement = 'SMARTPHONE_OK' | 'LAPTOP_REQUIRED';

export interface Gig {
  id: string;
  posterId?: string;
  posterName?: string;
  posterPhone?: string;
  workerId?: string;
  title: string;
  description: string;
  category: GigCategory;
  rewardKes: number;
  escrowStatus: EscrowStatus;
  originType: OriginType;
  externalApplyUrl?: string;
  campus?: CampusName | 'ALL';
  deviceRequirement: DeviceRequirement;
  skills: string[];
  platformName?: string;
  qualificationGuide?: string;
  deadline?: string;
  createdAt: string;
  applicantCount: number;
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
}
