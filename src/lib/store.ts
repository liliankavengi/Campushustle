import { useState, useEffect } from 'react';
import { 
  User, 
  Gig, 
  FinancialLog, 
  Subscription, 
  MpesaTransaction, 
  NetworkCondition, 
  CampusName,
  ServiceSubscriptionMetric,
  ExternalApplication,
  SavedGig,
  JobReport,
  JobSource,
  UserProfile,
  GeminiFamilyRequest
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_GIGS, 
  INITIAL_FINANCIAL_LOGS, 
  INITIAL_STUDENT_ACCOUNTS, 
  INITIAL_SERVICE_METRICS 
} from './mockData';
import { runIngestionPipeline, IngestionSyncResult, REGISTERED_JOB_SOURCES } from '../ingestion/scheduler/ingestionScheduler';

const STORAGE_KEYS = {
  USER: 'campushustle_user',
  GIGS: 'campushustle_gigs',
  FINANCES: 'campushustle_finances',
  SUBSCRIPTION: 'campushustle_subscription',
  TRANSACTIONS: 'campushustle_transactions',
  NETWORK: 'campushustle_network',
  STUDENTS: 'campushustle_students',
  SERVICES: 'campushustle_services',
  IS_LOGGED_IN: 'campushustle_is_logged_in',
  APPLICATIONS: 'campushustle_applications',
  SAVED_GIGS: 'campushustle_saved_gigs',
  JOB_REPORTS: 'campushustle_job_reports',
  GEMINI_REQUESTS: 'campushustle_gemini_requests',
  THEME: 'campushustle_theme',
};

export interface TaskToastNotification {
  id: string;
  title: string;
  rewardUsd: number;
  rewardKes?: number;
  campus: string;
  launchedAt: string;
}

export class CampusHustleStore {
  private static instance: CampusHustleStore;
  
  readonly ADMIN_EMAIL: string = 'liliankavengi502@gmail.com';
  isAdminAuthenticated: boolean = false;

  isLoggedIn: boolean = false;
  theme: 'dark' | 'light' = 'dark';
  user: User = INITIAL_USER;
  gigs: Gig[] = INITIAL_GIGS;
  finances: FinancialLog[] = INITIAL_FINANCIAL_LOGS;
  subscription: Subscription | null = null;
  transactions: MpesaTransaction[] = [];
  network: NetworkCondition = 'FAST_4G';
  students: User[] = INITIAL_STUDENT_ACCOUNTS;
  services: ServiceSubscriptionMetric[] = INITIAL_SERVICE_METRICS;
  
  // Aggregator 2.0 Entities
  applications: ExternalApplication[] = [];
  savedGigs: SavedGig[] = [];
  jobReports: JobReport[] = [];
  jobSources: JobSource[] = REGISTERED_JOB_SOURCES;
  geminiRequests: GeminiFamilyRequest[] = [];
  isSyncingIngestion: boolean = false;
  lastIngestionSync: string | null = null;

  // Real-time task update engine
  isAutoUpdating: boolean = false;
  lastTaskLaunchedAt: string = new Date().toISOString();
  nextAutoUpdateSeconds: number = 25;
  taskPoolIndex: number = 0;
  latestTaskToast: TaskToastNotification | null = null;
  
  listeners: Set<() => void> = new Set();
  private countdownTimer: NodeJS.Timeout | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  static getInstance(): CampusHustleStore {
    if (!CampusHustleStore.instance) {
      CampusHustleStore.instance = new CampusHustleStore();
    }
    return CampusHustleStore.instance;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    if (typeof window !== 'undefined') {
      this.saveToStorage();
    }
    this.listeners.forEach((l) => l());
  }

  private loadFromStorage() {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) this.user = JSON.parse(storedUser);

      const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (storedTheme === 'light' || storedTheme === 'dark') this.theme = storedTheme;

      const storedGigs = localStorage.getItem(STORAGE_KEYS.GIGS);
      if (storedGigs) {
        const parsed: Gig[] = JSON.parse(storedGigs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((g) => g.id));
          const missing = INITIAL_GIGS.filter((g) => !existingIds.has(g.id));
          this.gigs = [...missing, ...parsed];
        }
      } else {
        this.gigs = INITIAL_GIGS;
      }

      const storedFinances = localStorage.getItem(STORAGE_KEYS.FINANCES);
      if (storedFinances) this.finances = JSON.parse(storedFinances);

      const storedSub = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
      if (storedSub) this.subscription = JSON.parse(storedSub);

      const storedTxs = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (storedTxs) this.transactions = JSON.parse(storedTxs);

      const storedNet = localStorage.getItem(STORAGE_KEYS.NETWORK);
      if (storedNet) this.network = storedNet as NetworkCondition;

      const storedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (storedStudents) this.students = JSON.parse(storedStudents);

      const storedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (storedServices) this.services = JSON.parse(storedServices);

      const storedLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
      if (storedLoggedIn) this.isLoggedIn = storedLoggedIn === 'true';

      const storedApps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (storedApps) this.applications = JSON.parse(storedApps);

      const storedSaved = localStorage.getItem(STORAGE_KEYS.SAVED_GIGS);
      if (storedSaved) this.savedGigs = JSON.parse(storedSaved);

      const storedReports = localStorage.getItem(STORAGE_KEYS.JOB_REPORTS);
      if (storedReports) this.jobReports = JSON.parse(storedReports);

      const storedGemini = localStorage.getItem(STORAGE_KEYS.GEMINI_REQUESTS);
      if (storedGemini) this.geminiRequests = JSON.parse(storedGemini);
    } catch (e) {
      console.error('Error loading from local storage', e);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
      localStorage.setItem(STORAGE_KEYS.THEME, this.theme);
      localStorage.setItem(STORAGE_KEYS.GIGS, JSON.stringify(this.gigs));
      localStorage.setItem(STORAGE_KEYS.FINANCES, JSON.stringify(this.finances));
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(this.subscription));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(this.transactions));
      localStorage.setItem(STORAGE_KEYS.NETWORK, this.network);
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(this.students));
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(this.services));
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, String(this.isLoggedIn));
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(this.applications));
      localStorage.setItem(STORAGE_KEYS.SAVED_GIGS, JSON.stringify(this.savedGigs));
      localStorage.setItem(STORAGE_KEYS.JOB_REPORTS, JSON.stringify(this.jobReports));
      localStorage.setItem(STORAGE_KEYS.GEMINI_REQUESTS, JSON.stringify(this.geminiRequests));
    } catch (e) {
      console.error('Error saving to local storage', e);
    }
  }

  // --- Ingestion Pipeline Sync ---
  async runLiveIngestionSync(): Promise<IngestionSyncResult> {
    this.isSyncingIngestion = true;
    this.notify();

    try {
      const result = await runIngestionPipeline(this.gigs);
      if (result.addedGigs.length > 0) {
        this.gigs = [...result.addedGigs, ...this.gigs];
      }
      this.lastIngestionSync = result.timestamp;
      this.isSyncingIngestion = false;
      this.notify();
      return result;
    } catch (error) {
      this.isSyncingIngestion = false;
      this.notify();
      throw error;
    }
  }

  // --- External Application Tracker ---
  addExternalApplication(app: {
    gigId?: string;
    jobTitle: string;
    companyName: string;
    platformName: string;
    externalUrl?: string;
    status: ExternalApplication['status'];
    rewardUsd?: number;
    rewardKes?: number;
    notes?: string;
    followUpDate?: string;
  }) {
    const now = new Date().toISOString();
    const newApp: ExternalApplication = {
      id: `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      gigId: app.gigId || `custom-${Date.now()}`,
      jobTitle: app.jobTitle,
      companyName: app.companyName,
      platformName: app.platformName,
      externalUrl: app.externalUrl,
      status: app.status,
      appliedDate: now,
      rewardUsd: app.rewardUsd,
      rewardKes: app.rewardKes,
      notes: app.notes,
      followUpDate: app.followUpDate,
      lastUpdated: now,
    };

    this.applications = [newApp, ...this.applications];
    this.notify();
    return newApp;
  }

  updateExternalApplication(id: string, updates: Partial<ExternalApplication>) {
    this.applications = this.applications.map((app) =>
      app.id === id ? { ...app, ...updates, lastUpdated: new Date().toISOString() } : app
    );
    this.notify();
  }

  deleteExternalApplication(id: string) {
    this.applications = this.applications.filter((a) => a.id !== id);
    this.notify();
  }

  // --- Bookmarks / Saved Gigs ---
  toggleSaveGig(gigId: string, notes?: string) {
    const exists = this.savedGigs.some((s) => s.gigId === gigId);
    if (exists) {
      this.savedGigs = this.savedGigs.filter((s) => s.gigId !== gigId);
    } else {
      this.savedGigs = [{ gigId, savedAt: new Date().toISOString(), notes }, ...this.savedGigs];
    }
    this.notify();
  }

  isGigSaved(gigId: string): boolean {
    return this.savedGigs.some((s) => s.gigId === gigId);
  }

  getSavedGigsList(): Gig[] {
    const savedIds = new Set(this.savedGigs.map((s) => s.gigId));
    return this.gigs.filter((g) => savedIds.has(g.id));
  }

  // --- Student User Profile & AI Matching ---
  updateUserProfile(profile: Partial<UserProfile>) {
    const currentProfile = this.user.profile || {
      skills: ['Swahili / Sheng', 'Logic Reasoning', 'Research'],
      university: this.user.campus || 'MMU',
      careerGoals: ['AI Evaluation & RLHF', 'Global Remote Tech'],
      experienceLevel: 'BEGINNER',
      preferredRemoteType: 'REMOTE',
      weeklyHoursAvailable: 15,
    };

    this.user = {
      ...this.user,
      profile: {
        ...currentProfile,
        ...profile,
      } as UserProfile
    };
    this.notify();
  }

  // --- Job Reports ---
  addJobReport(report: Omit<JobReport, 'id' | 'reportedAt' | 'status'>) {
    const newReport: JobReport = {
      id: `rep-${Date.now()}`,
      reportedAt: new Date().toISOString(),
      status: 'PENDING_REVIEW',
      ...report,
    };
    this.jobReports = [newReport, ...this.jobReports];
    this.notify();
  }

  // --- Auto-updating Task Engine (preserved) ---
  startAutoTaskEngine() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);

    this.countdownTimer = setInterval(() => {
      if (!this.isAutoUpdating) return;

      if (this.nextAutoUpdateSeconds <= 1) {
        this.nextAutoUpdateSeconds = 25;
        this.injectNewLiveTask();
      } else {
        this.nextAutoUpdateSeconds -= 1;
        this.notify();
      }
    }, 1000);
  }

  toggleAutoUpdate() {
    this.isAutoUpdating = !this.isAutoUpdating;
    this.notify();
  }

  triggerManualTaskLaunch() {
    this.nextAutoUpdateSeconds = 25;
    this.injectNewLiveTask();
  }

  injectNewLiveTask() {
    const defaultTemplates: Partial<Gig>[] = [
      {
        title: 'Bilingual Sheng/Swahili Prompt Evaluation Batch',
        companyName: 'Alignerr AI Lab',
        description: 'Review generative AI dialogue transcripts for authentic Kenyan street syntax and local dialect nuances.',
        category: 'AI Annotation',
        rewardUsd: 175,
        rewardKes: 22750,
        skills: ['Swahili / Sheng', 'Logic Reasoning', 'Prompt Evaluation'],
        platformName: 'Alignerr AI',
        deviceRequirement: 'LAPTOP_REQUIRED',
        verificationStatus: 'VERIFIED_BY_CAMPUSHUSTLE',
      },
      {
        title: 'Python Algorithm Verification & Edge Case Generator',
        companyName: 'DataAnnotation.tech',
        description: 'Evaluate code quality, generate unit test edge cases, and rate AI programming responses.',
        category: 'AI Annotation',
        rewardUsd: 300,
        rewardKes: 39000,
        skills: ['Python', 'DSA', 'Unit Testing'],
        platformName: 'DataAnnotation.tech',
        deviceRequirement: 'LAPTOP_REQUIRED',
        verificationStatus: 'VERIFIED_BY_CAMPUSHUSTLE',
      }
    ];

    const template = defaultTemplates[this.taskPoolIndex % defaultTemplates.length];
    this.taskPoolIndex += 1;

    const launchedIso = new Date().toISOString();
    const newTask: Gig = {
      id: `gig-live-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: launchedIso,
      publishedAt: launchedIso,
      applicantCount: 0,
      escrowStatus: 'HELD',
      originType: 'EXTERNAL_PARTNER',
      verificationStatus: 'VERIFIED_BY_CAMPUSHUSTLE',
      skills: template.skills || ['General Assessment'],
      title: template.title || 'Live Remote Task',
      description: template.description || 'Verified student task.',
      category: template.category || 'Global Remote',
      rewardUsd: template.rewardUsd || 150,
      rewardKes: template.rewardKes || 19500,
      companyName: template.companyName,
      platformName: template.platformName,
      deviceRequirement: template.deviceRequirement || 'LAPTOP_REQUIRED',
    };

    this.gigs = [newTask, ...this.gigs];
    this.lastTaskLaunchedAt = launchedIso;
    
    this.latestTaskToast = {
      id: newTask.id,
      title: newTask.title,
      rewardUsd: newTask.rewardUsd,
      rewardKes: newTask.rewardKes,
      campus: newTask.campus || 'ALL',
      launchedAt: launchedIso,
    };

    this.notify();

    setTimeout(() => {
      if (this.latestTaskToast?.id === newTask.id) {
        this.latestTaskToast = null;
        this.notify();
      }
    }, 6000);
  }

  dismissTaskToast() {
    this.latestTaskToast = null;
    this.notify();
  }

  // --- Existing User, M-Pesa & Financial methods (100% Preserved) ---
  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.notify();
  }

  setCampus(campus: CampusName) {
    this.user = { ...this.user, campus };
    this.notify();
  }

  setNetwork(net: NetworkCondition) {
    this.network = net;
    this.notify();
  }

  addFinancialLog(log: Omit<FinancialLog, 'id' | 'loggedAt' | 'userId'>) {
    const newLog: FinancialLog = {
      id: `fin-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: this.user.id,
      loggedAt: new Date().toISOString(),
      ...log,
    };
    this.finances = [newLog, ...this.finances];
    this.notify();
    return newLog;
  }

  addGig(gig: Omit<Gig, 'id' | 'createdAt' | 'applicantCount'>) {
    const launchedIso = new Date().toISOString();
    const newGig: Gig = {
      id: `gig-user-${Date.now()}`,
      createdAt: launchedIso,
      publishedAt: launchedIso,
      applicantCount: 0,
      ...gig,
    };
    this.gigs = [newGig, ...this.gigs];
    this.lastTaskLaunchedAt = launchedIso;
    this.notify();
    return newGig;
  }

  updateEscrowStatus(gigId: string, status: Gig['escrowStatus']) {
    this.gigs = this.gigs.map((g) => (g.id === gigId ? { ...g, escrowStatus: status } : g));
    this.notify();
  }

  applyToGig(gigId: string) {
    this.gigs = this.gigs.map((g) => (g.id === gigId ? { ...g, applicantCount: g.applicantCount + 1 } : g));
    this.notify();
  }

  addStudentAccount(fullName: string, phoneNumber: string, campus: CampusName, service: string = '1-Semester All-Access Pass') {
    const newStudent: User = {
      id: `usr-${campus.toLowerCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
      phoneNumber,
      fullName,
      campus,
      isVerified: true,
      createdAt: new Date().toISOString(),
      subscribedService: service,
      subscriptionStatus: 'ACTIVE',
    };

    this.students = [newStudent, ...this.students];
    this.notify();
  }

  setSubscription(sub: Subscription) {
    this.subscription = sub;
    this.user = {
      ...this.user,
      subscriptionStatus: sub.status,
      subscribedService: '1-Semester Hustle Pass (Active)',
    };
    this.notify();
  }

  activateStandardPass(mpesaReceipt?: string): Subscription {
    const now = new Date();
    const expires = new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000);
    const receipt = mpesaReceipt || `QKD${Math.floor(10000000 + Math.random() * 90000000)}KE`;
    const sub: Subscription = {
      id: `sub-${Date.now()}`,
      userId: this.user.id,
      amount: 130,
      mpesaReceipt: receipt,
      status: 'ACTIVE',
      serviceType: 'SEMESTER_ALL_ACCESS',
      expiresAt: expires.toISOString(),
      createdAt: now.toISOString(),
    };
    this.setSubscription(sub);

    const tx: MpesaTransaction = {
      id: `tx-${Date.now()}`,
      checkoutRequestId: `ws_CO_${Date.now()}`,
      merchantRequestId: `MR_${Date.now()}`,
      phoneNumber: this.user.phoneNumber || '254712000000',
      amount: 130,
      purpose: 'SUBSCRIPTION_PASS',
      mpesaReceipt: receipt,
      status: 'SUCCESS',
      createdAt: now.toISOString(),
    };
    this.transactions = [tx, ...this.transactions];
    this.notify();
    return sub;
  }

  addTransaction(tx: Omit<MpesaTransaction, 'id' | 'createdAt'>) {
    const newTx: MpesaTransaction = {
      id: `tx-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...tx,
    };
    this.transactions = [newTx, ...this.transactions];

    if (tx.status === 'SUCCESS' && tx.purpose === 'SUBSCRIPTION_PASS') {
      const now = new Date();
      const expires = new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000); // 120 days
      this.setSubscription({
        id: `sub-${Date.now()}`,
        userId: this.user.id,
        amount: tx.amount,
        mpesaReceipt: tx.mpesaReceipt,
        status: 'ACTIVE',
        serviceType: 'SEMESTER_ALL_ACCESS',
        expiresAt: expires.toISOString(),
        createdAt: now.toISOString(),
      });
    }

    this.notify();
    return newTx;
  }

  async initiateDarajaStk(phoneNumber: string, amount: number, purpose: import('../types').MpesaPurpose = 'SUBSCRIPTION_PASS'): Promise<MpesaTransaction> {
    const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(10000 + Math.random() * 90000)}`;
    const merchantRequestId = `MR_${Date.now()}`;
    const tx: MpesaTransaction = {
      id: `tx-${Date.now()}`,
      checkoutRequestId,
      merchantRequestId,
      phoneNumber,
      amount,
      purpose,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.transactions = [tx, ...this.transactions];
    this.notify();
    return tx;
  }

  resolveMpesaCallback(checkoutRequestId: string, isSuccess: boolean, receiptNumber?: string) {
    this.transactions = this.transactions.map((tx) => {
      if (tx.checkoutRequestId === checkoutRequestId) {
        const updated: MpesaTransaction = {
          ...tx,
          status: isSuccess ? 'SUCCESS' : 'FAILED',
          mpesaReceipt: receiptNumber || `QKD${Math.floor(10000000 + Math.random() * 90000000)}KE`,
        };
        if (isSuccess && tx.purpose === 'SUBSCRIPTION_PASS') {
          const now = new Date();
          const expires = new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000);
          this.setSubscription({
            id: `sub-${Date.now()}`,
            userId: this.user.id,
            amount: tx.amount,
            mpesaReceipt: updated.mpesaReceipt,
            status: 'ACTIVE',
            serviceType: 'SEMESTER_ALL_ACCESS',
            expiresAt: expires.toISOString(),
            createdAt: now.toISOString(),
          });
        }
        return updated;
      }
      return tx;
    });
    this.notify();
  }

  hasActivePass(): boolean {
    return this.subscription?.status === 'ACTIVE' || this.user.subscriptionStatus === 'ACTIVE';
  }

  login(phoneNumber: string, fullName: string, campus: CampusName) {
    this.isLoggedIn = true;
    this.user = {
      id: `usr-${campus.toLowerCase()}-${Date.now().toString().slice(-4)}`,
      phoneNumber,
      fullName,
      campus,
      isVerified: true,
      createdAt: new Date().toISOString(),
      subscriptionStatus: 'PENDING',
      subscribedService: 'Free Tier (Unpaid)',
      profile: {
        skills: ['Swahili / Sheng', 'Logic Reasoning', 'Research'],
        university: campus,
        careerGoals: ['AI Evaluation & RLHF', 'Global Remote Tech'],
        experienceLevel: 'BEGINNER',
        preferredRemoteType: 'REMOTE',
        weeklyHoursAvailable: 15,
      }
    };
    this.notify();
  }

  isAdmin(): boolean {
    return this.isAdminAuthenticated;
  }

  loginAsAdmin() {
    this.isAdminAuthenticated = true;
    this.notify();
  }

  logoutAdmin() {
    this.isAdminAuthenticated = false;
    this.notify();
  }

  setTheme(theme: 'dark' | 'light') {
    this.theme = theme;
    this.notify();
  }

  deleteStudentAccount(studentId: string) {
    this.students = this.students.filter((s) => s.id !== studentId);
    this.notify();
  }

  updateServiceRevenue(serviceId: string, additionalAmount: number) {
    this.services = this.services.map((s) =>
      s.serviceId === serviceId
        ? { ...s, revenueKes: s.revenueKes + additionalAmount, subscriberCount: s.subscriberCount + 1 }
        : s
    );
    this.notify();
  }

  authenticateUser(fullName: string, emailOrPhone: string, campus: CampusName, isGoogle: boolean = false) {
    this.isLoggedIn = true;
    const isPhone = !emailOrPhone.includes('@');
    this.user = {
      id: `usr-${campus.toLowerCase()}-${Date.now().toString().slice(-4)}`,
      phoneNumber: isPhone ? emailOrPhone : (this.user.phoneNumber || '254712000000'),
      email: isPhone ? undefined : emailOrPhone,
      fullName: fullName || (emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Student User'),
      campus,
      isVerified: true,
      createdAt: new Date().toISOString(),
      subscriptionStatus: this.user.subscriptionStatus || 'PENDING',
      subscribedService: this.user.subscribedService || 'Free Tier (Unpaid)',
      profile: {
        skills: this.user.profile?.skills || ['Swahili / Sheng', 'Logic Reasoning', 'Research'],
        university: campus,
        careerGoals: ['AI Evaluation & RLHF', 'Global Remote Tech'],
        experienceLevel: 'BEGINNER',
        preferredRemoteType: 'REMOTE',
        weeklyHoursAvailable: 15,
      }
    };
    this.notify();
  }

  // --- Gemini Pro Google Family Group Access (KES 200) ---
  requestGeminiFamilyAccess(googleEmail: string, phoneNumber: string, mpesaReceipt?: string): GeminiFamilyRequest {
    const now = new Date().toISOString();
    const receipt = mpesaReceipt || `QKD${Math.floor(10000000 + Math.random() * 90000000)}KE`;
    const req: GeminiFamilyRequest = {
      id: `gem-${Date.now()}`,
      userId: this.user.id,
      fullName: this.user.fullName || 'Student Applicant',
      googleEmail: googleEmail.trim().toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      amountKes: 200,
      mpesaReceipt: receipt,
      status: 'INVITATION_PENDING',
      requestedAt: now,
    };
    this.geminiRequests = [req, ...this.geminiRequests];

    // Record KES 200 transaction
    const tx: MpesaTransaction = {
      id: `tx-${Date.now()}`,
      checkoutRequestId: `ws_CO_${Date.now()}`,
      merchantRequestId: `MR_${Date.now()}`,
      phoneNumber,
      amount: 200,
      purpose: 'SUBSCRIPTION_PASS',
      mpesaReceipt: receipt,
      status: 'SUCCESS',
      createdAt: now,
    };
    this.transactions = [tx, ...this.transactions];

    // Increment revenue in services
    this.updateServiceRevenue('srv-gemini-family', 200);

    this.notify();
    return req;
  }

  activateGeminiFamilyMember(requestId: string) {
    this.geminiRequests = this.geminiRequests.map((r) =>
      r.id === requestId
        ? { ...r, status: 'ADDED_TO_FAMILY', activatedAt: new Date().toISOString() }
        : r
    );
    this.notify();
  }

  getStudentGeminiRequest(): GeminiFamilyRequest | undefined {
    return this.geminiRequests.find((r) => r.userId === this.user.id || (this.user.email && r.googleEmail.toLowerCase() === this.user.email.toLowerCase()));
  }

  logout() {
    this.isLoggedIn = false;
    this.isAdminAuthenticated = false;
    this.user = { ...INITIAL_USER };
    this.subscription = null;
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION);
      }
    } catch (e) {
      console.error('Error during logout', e);
    }
    this.notify();
  }
}

export function useCampusStore(): CampusHustleStore {
  const [storeState, setStoreState] = useState<CampusHustleStore>(CampusHustleStore.getInstance());

  useEffect(() => {
    const store = CampusHustleStore.getInstance();
    store.startAutoTaskEngine();
    const unsubscribe = store.subscribe(() => {
      setStoreState(Object.assign(Object.create(Object.getPrototypeOf(store)), store));
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return storeState;
}

export function formatLaunchTime(isoDateString?: string): string {
  if (!isoDateString) return 'Just now';
  try {
    const diffMs = Date.now() - new Date(isoDateString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  } catch {
    return 'Recently';
  }
}
