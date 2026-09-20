'use client';

import React, { useState } from 'react';
import { useCampusStore } from '../lib/store';
import { CampusName } from '../types';
import { 
  Users, 
  CreditCard, 
  ShieldCheck, 
  TrendingUp, 
  Search, 
  Plus, 
  Building2, 
  Layers, 
  Lock,
  CheckCircle,
  ArrowRight,
  Sun,
  Moon,
  LogOut,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const store = useCampusStore();
  const isAdmin = store.isAdmin();
  const isLight = store.theme === 'light';

  // Admin Login Form State
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Dashboard Filters and Modals
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampusFilter, setSelectedCampusFilter] = useState<string>('ALL');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentCampus, setNewStudentCampus] = useState<CampusName>('MMU');
  const [newStudentService, setNewStudentService] = useState('1-Semester All-Access Pass');
  const [showAddModal, setShowAddModal] = useState(false);

  // Handle Admin Verification
  const handleAdminEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError(null);

    setTimeout(() => {
      if (adminEmailInput.trim().toLowerCase() === store.ADMIN_EMAIL.toLowerCase()) {
        store.loginAsAdmin();
        setIsAuthLoading(false);
      } else {
        setAuthError(`Access Denied: Only ${store.ADMIN_EMAIL} is authorized to access the Admin Portal.`);
        setIsAuthLoading(false);
      }
    }, 400);
  };

  const handleAdminGoogleLogin = () => {
    setIsAuthLoading(true);
    setAuthError(null);

    setTimeout(() => {
      // Simulate Google auth for authorized admin
      store.loginAsAdmin();
      setIsAuthLoading(false);
    }, 500);
  };

  // If NOT authorized as liliankavengi502@gmail.com, render the restricted Admin Gate
  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className={`w-full max-w-md p-6 sm:p-8 rounded-2xl border shadow-xl space-y-6 transition-colors ${
          isLight 
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50' 
            : 'bg-slate-900 border-slate-800 text-white shadow-black/40'
        }`}>
          {/* Lock Icon & Title */}
          <div className="text-center space-y-2">
            <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${
              isLight ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}>
              <Lock className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold tracking-tight">
              Admin Portal Gate
            </h2>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Restricted platform command center for <strong className="text-emerald-600 font-mono">liliankavengi502@gmail.com</strong> only.
            </p>
          </div>

          {/* Error Alert */}
          {authError && (
            <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
              isLight ? 'bg-slate-100 border border-slate-300 text-slate-800' : 'bg-slate-800 border border-slate-700 text-slate-200'
            }`}>
              <AlertCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* 1-Click Continue with Authorized Google Email */}
          <button
            type="button"
            onClick={handleAdminGoogleLogin}
            disabled={isAuthLoading}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-3 transition-all ${
              isLight
                ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-800 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-white'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with liliankavengi502@gmail.com</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className={`border-t w-full ${isLight ? 'border-slate-200' : 'border-slate-800'}`} />
            <span className={`px-2 text-[10px] font-mono uppercase tracking-wider ${isLight ? 'bg-white text-slate-400' : 'bg-slate-900 text-slate-500'}`}>
              Or verify email
            </span>
          </div>

          {/* Manual Email Input Form */}
          <form onSubmit={handleAdminEmailLogin} className="space-y-3">
            <div>
              <label className={`block text-[11px] font-semibold mb-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Administrator Email Address
              </label>
              <input
                type="email"
                value={adminEmailInput}
                onChange={(e) => setAdminEmailInput(e.target.value)}
                placeholder="liliankavengi502@gmail.com"
                required
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:border-emerald-600 transition-colors ${
                  isLight 
                    ? 'bg-slate-50 border-slate-300 text-slate-900' 
                    : 'bg-slate-950 border-slate-800 text-white'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {isAuthLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Authenticate Admin Access</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <p className={`text-[10px] text-center ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            Security Policy: Only authorized email has access to student databases and escrow audits.
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated as liliankavengi502@gmail.com -> Render Minimalist 2-Color Admin Dashboard
  const totalAccounts = store.students.length;
  const totalActiveSubscribers = store.students.filter((s) => s.subscriptionStatus === 'ACTIVE').length;
  const totalServiceRevenue = store.services.reduce((acc, s) => acc + s.revenueKes, 0);
  const totalEscrowHeld = store.gigs
    .filter((g) => g.escrowStatus === 'HELD')
    .reduce((acc, g) => acc + g.rewardKes, 0);

  // Campus distribution
  const campusCounts: Record<string, number> = {};
  store.students.forEach((s) => {
    campusCounts[s.campus] = (campusCounts[s.campus] || 0) + 1;
  });

  // Filter students
  const filteredStudents = store.students.filter((s) => {
    const matchesSearch = 
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phoneNumber.includes(searchQuery) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.subscribedService && s.subscribedService.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCampus = selectedCampusFilter === 'ALL' || s.campus === selectedCampusFilter;

    return matchesSearch && matchesCampus;
  });

  const handleSimulateRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentPhone) return;

    store.addStudentAccount(newStudentName, newStudentPhone, newStudentCampus, newStudentService);
    setNewStudentName('');
    setNewStudentPhone('');
    setShowAddModal(false);
  };

  return (
    <div className={`space-y-3 transition-colors ${
      isLight ? 'text-slate-900' : 'text-slate-100'
    }`}>
      {/* Top Strip: Minimalist Admin Header */}
      <div className={`rounded-xl px-4 py-3 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight">
                Platform Command Center
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {store.ADMIN_EMAIL}
              </span>
            </div>
            <span className={`text-[11px] block -mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              PostgreSQL Ledger & Subscriptions Audit
            </span>
          </div>
        </div>

        {/* Right Controls: Theme Toggle, Simulate Student, Logout */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => store.setTheme(isLight ? 'dark' : 'light')}
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' 
                : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
          >
            {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="text-[11px]">{isLight ? 'Dark' : 'Light'}</span>
          </button>

          {/* Simulate Student Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate Student</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={() => store.logout()}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-400'
            }`}
            title="Log out from Admin session"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Strip (Minimalist 2-Color) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Total Accounts */}
        <div className={`p-3.5 rounded-xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className={`flex items-center justify-between text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Registered Students</span>
            <Users className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black mt-1">
            {totalAccounts.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>{store.students.filter(s => s.isVerified).length} ID Verified</span>
          </div>
        </div>

        {/* Active Passes */}
        <div className={`p-3.5 rounded-xl border ${
          isLight ? 'bg-white border-emerald-300 shadow-sm' : 'bg-slate-900 border-emerald-800'
        }`}>
          <div className="flex items-center justify-between text-[11px] text-emerald-600 font-semibold">
            <span>Active Subscriptions</span>
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
            {totalActiveSubscribers.toLocaleString()}
          </div>
          <span className={`text-[10px] block mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {Math.round((totalActiveSubscribers / (totalAccounts || 1)) * 100)}% Conversion Rate
          </span>
        </div>

        {/* Total Service Revenue */}
        <div className={`p-3.5 rounded-xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className={`flex items-center justify-between text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Daraja Gross Revenue</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black mt-1">
            KSh {totalServiceRevenue.toLocaleString()}
          </div>
          <span className={`text-[9px] block mt-0.5 font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Safaricom Paybill 400200
          </span>
        </div>

        {/* Escrow Pool Held */}
        <div className={`p-3.5 rounded-xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className={`flex items-center justify-between text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Escrow Funds Held</span>
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black mt-1">
            KSh {totalEscrowHeld.toLocaleString()}
          </div>
          <span className="text-[9px] text-emerald-600 block mt-0.5 font-mono">
            {store.gigs.filter(g => g.escrowStatus === 'HELD').length} Active Task Bounties
          </span>
        </div>
      </div>

      {/* Specific Service Subscriptions Breakdown */}
      <div className={`rounded-xl p-3.5 border space-y-2.5 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Subscription Breakdown by Specific Service</span>
            </h3>
            <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Active subscribers and gross billing generated per micro-service.
            </p>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-lg font-mono font-semibold border ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-300'
          }`}>
            4 Automated Services
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {store.services.map((srv) => (
            <div
              key={srv.serviceId}
              className={`p-3 rounded-lg border flex flex-col justify-between transition-colors ${
                isLight 
                  ? 'bg-slate-50/80 border-slate-200 hover:border-emerald-500' 
                  : 'bg-slate-950/80 border-slate-800 hover:border-emerald-600'
              }`}
            >
              <div>
                <span className={`text-[9px] uppercase font-bold block mb-0.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  {srv.category}
                </span>
                <h4 className="text-xs font-bold leading-snug">
                  {srv.serviceName}
                </h4>
                <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
                  KSh {srv.priceKes} / Pass
                </span>
              </div>

              <div className={`mt-2.5 pt-2 border-t space-y-0.5 text-[11px] ${
                isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
              }`}>
                <div className="flex justify-between">
                  <span>Subscribers:</span>
                  <span className={`font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {srv.subscriberCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Gross Revenue:</span>
                  <span className="text-emerald-600 font-bold font-mono">
                    KSh {srv.revenueKes.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* University Campus Distribution Strip */}
      <div className={`rounded-xl p-3.5 border space-y-2 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <h3 className="text-xs font-bold flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Campus Geographic Distribution</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {(['MMU', 'UoN', 'KU', 'JKUAT', 'Strathmore', 'Egerton', 'Moi'] as CampusName[]).map((campus) => {
            const count = campusCounts[campus] || 0;
            return (
              <div 
                key={campus}
                className={`p-2.5 rounded-lg border text-center ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <span className={`text-[10px] font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{campus}</span>
                <span className="text-sm font-black mt-0.5 block">{count}</span>
                <span className="text-[9px] text-emerald-600 font-medium">Students</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Account Registry Table */}
      <div className={`rounded-xl p-3.5 border space-y-2.5 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h3 className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Registered Student Accounts Directory</span>
            </h3>
            <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Verified student accounts, enrolled campuses, and active subscriptions.
            </p>
          </div>

          {/* Search and Campus Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className={`w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, email..."
                className={`pl-7 pr-2.5 py-1 rounded-lg text-xs border focus:outline-none focus:border-emerald-600 ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                }`}
              />
            </div>

            <select
              value={selectedCampusFilter}
              onChange={(e) => setSelectedCampusFilter(e.target.value)}
              className={`px-2 py-1 rounded-lg text-xs border focus:outline-none focus:border-emerald-600 ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
              }`}
            >
              <option value="ALL">All Campuses</option>
              {['MMU', 'UoN', 'KU', 'JKUAT', 'Strathmore', 'Egerton', 'Moi'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[11px] font-mono ${isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Contact</th>
                <th className="py-2.5 px-3">Campus</th>
                <th className="py-2.5 px-3">Subscribed Service</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Registered Date</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-100 text-slate-700' : 'divide-slate-800/60 text-slate-300'}`}>
              {filteredStudents.map((student) => (
                <tr key={student.id} className={`transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'}`}>
                  <td className="py-2.5 px-3 font-semibold flex items-center gap-1.5">
                    <span className={isLight ? 'text-slate-900' : 'text-white'}>{student.fullName}</span>
                    {student.isVerified && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">
                        VERIFIED
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">
                    <div>{student.phoneNumber}</div>
                    {student.email && <div className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{student.email}</div>}
                  </td>
                  <td className="py-2.5 px-3 font-semibold">{student.campus}</td>
                  <td className="py-2.5 px-3 text-emerald-600 font-medium">
                    {student.subscribedService || 'Free Tier'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        student.subscriptionStatus === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {student.subscriptionStatus}
                    </span>
                  </td>
                  <td className={`py-2.5 px-3 font-mono text-[11px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to simulate adding new student account */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 border ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <h3 className="text-base font-bold">
              Simulate New Student Account
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Simulate a Kenyan student registering and subscribing to a micro-service.
            </p>

            <form onSubmit={handleSimulateRegister} className="space-y-3">
              <div>
                <label className={`block text-[11px] font-semibold mb-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Student Full Name
                </label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Emmanuel Kiprotich"
                  required
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-emerald-600 ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-semibold mb-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Safaricom Phone Number
                </label>
                <input
                  type="text"
                  value={newStudentPhone}
                  onChange={(e) => setNewStudentPhone(e.target.value)}
                  placeholder="254712998877"
                  required
                  className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:border-emerald-600 ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block text-[11px] font-semibold mb-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    Campus
                  </label>
                  <select
                    value={newStudentCampus}
                    onChange={(e) => setNewStudentCampus(e.target.value as CampusName)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-emerald-600 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  >
                    {['MMU', 'UoN', 'KU', 'JKUAT', 'Strathmore', 'Egerton', 'Moi'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-[11px] font-semibold mb-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    Subscribed Service
                  </label>
                  <select
                    value={newStudentService}
                    onChange={(e) => setNewStudentService(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-emerald-600 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  >
                    <option value="1-Semester All-Access Hustle Pass">1-Semester Pass (KSh 130)</option>
                    <option value="AI Platform Screening & Benchmark Guides">AI Guides (KSh 80)</option>
                    <option value="M-Pesa SMS Auto-Parser & Budget Exporter">SMS Parser (KSh 50)</option>
                    <option value="Campus Escrow Dispute Insurance & Priority Payout">Escrow Guard (KSh 100)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
                >
                  Create and Increment Stats
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
