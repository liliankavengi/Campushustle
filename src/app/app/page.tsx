'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCampusStore } from '../../lib/store';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { GigBoard } from '../../components/GigBoard';
import { RunwayEngine } from '../../components/RunwayEngine';
import { YieldSparklines } from '../../components/YieldSparklines';
import { GuidesModule } from '../../components/GuidesModule';
import { MpesaModal } from '../../components/MpesaModal';
import { EscrowModal } from '../../components/EscrowModal';
import { DarajaArchitectureInspector } from '../../components/DarajaArchitectureInspector';
import { AuthCard } from '../../components/AuthCard';
import { 
  Briefcase, 
  Flame, 
  TrendingUp, 
  History, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  CheckCircle2,
  BarChart3,
  Home,
  Zap,
  ArrowLeft,
  Sparkles,
  Globe,
  Star,
  BookOpen
} from 'lucide-react';

export default function StudentAppPage() {
  const store = useCampusStore();
  const isLoggedIn = store.isLoggedIn;
  const isLight = store.theme === 'light';
  const hasPass = store.hasActivePass();

  const [activeTab, setActiveTab] = useState<'GIGS' | 'RUNWAY' | 'MMF' | 'LEDGER' | 'GUIDES' | 'ADMIN'>('GIGS');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [deviceFilter, setDeviceFilter] = useState<'ALL' | 'SMARTPHONE_OK' | 'LAPTOP_REQUIRED'>('ALL');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Modals
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallFeatureName, setPaywallFeatureName] = useState<string>('Full CampusHustle Access');
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  const handleTriggerPaywall = (featureName: string) => {
    setPaywallFeatureName(featureName);
    setIsPaywallOpen(true);
  };

  // ─── NOT LOGGED IN: Show Auth Gate ─────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex flex-col transition-colors ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}>
        <header className={`border-b px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <span className="text-base font-extrabold tracking-tight">
              Campus<span className="text-emerald-600">Hustle</span>
            </span>
          </div>
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Overview & Info</span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Sign In Required
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold">
                Sign In or Sign Up to Launch App
              </h1>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Create your student account or continue with Google to access your gigs board, runway calculator, and MMF yield charts.
              </p>
            </div>
            <AuthCard
              initialMode="SIGN_UP"
              onSuccess={() => {}}
            />
          </div>
        </main>
      </div>
    );
  }

  // Compute Quick Stats
  const totalIncome = store.finances
    .filter((f) => f.transactionType === 'INCOME')
    .reduce((acc, f) => acc + f.amount, 0);
  const totalExpense = store.finances
    .filter((f) => f.transactionType === 'EXPENSE')
    .reduce((acc, f) => acc + f.amount, 0);
  const netBalance = Math.max(0, totalIncome - totalExpense);
  const daysOfRunway = Math.floor(netBalance / 350);

  const escrowLockedKes = store.gigs
    .filter((g) => g.escrowStatus === 'HELD')
    .reduce((acc, g) => acc + g.rewardKes, 0);

  return (
    <div className={`min-h-screen flex flex-col pb-16 lg:pb-0 transition-colors ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Compact Top Header */}
      <Header
        onOpenPaywall={() => handleTriggerPaywall('Full CampusHustle All-Access Pass')}
        onOpenEscrowModal={() => setIsEscrowModalOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onToggleSidebar={() => setIsSidebarOpenMobile(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Full-Width Layout */}
      <div className="flex-1 flex w-full relative">
        {/* Left Minimizable / Mobile Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          deviceFilter={deviceFilter}
          setDeviceFilter={setDeviceFilter}
          onOpenPaywall={() => handleTriggerPaywall('Full CampusHustle All-Access Pass')}
          onOpenEscrowModal={() => setIsEscrowModalOpen(true)}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        {/* Main Content Area — Opens freely for exploration */}
        <main className="flex-1 min-w-0 px-3 sm:px-4 lg:px-5 py-3 space-y-3">
          {/* Quick Metrics Ribbon (Clickable to switch modules freely) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
            <div 
              onClick={() => setActiveTab('GIGS')}
              className={`rounded-xl p-3 border transition-all cursor-pointer ${
                activeTab === 'GIGS' 
                  ? isLight ? 'border-emerald-500 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-500/20' : 'border-emerald-500 bg-slate-900 shadow-sm ring-1 ring-emerald-500/20'
                  : isLight ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Campus Gigs</span>
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-base sm:text-lg font-extrabold mt-0.5">
                {store.gigs.length} <span className={`text-[10px] font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Live</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold block truncate">
                {store.gigs.filter((g) => g.originType === 'INTERNAL_ESCROW').length} Escrow Secured
              </span>
            </div>

            <div 
              onClick={() => setActiveTab('RUNWAY')}
              className={`rounded-xl p-3 border transition-all cursor-pointer ${
                activeTab === 'RUNWAY' 
                  ? isLight ? 'border-emerald-500 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-500/20' : 'border-emerald-500 bg-slate-900 shadow-sm ring-1 ring-emerald-500/20'
                  : isLight ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>HELB Runway</span>
                <Flame className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-base sm:text-lg font-extrabold mt-0.5">
                {daysOfRunway} <span className={`text-[10px] font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Days</span>
              </div>
              <span className={`text-[10px] block truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                KSh {netBalance.toLocaleString()} Net Left
              </span>
            </div>

            <div 
              onClick={() => setActiveTab('MMF')}
              className={`rounded-xl p-3 border transition-all cursor-pointer ${
                activeTab === 'MMF' 
                  ? isLight ? 'border-emerald-500 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-500/20' : 'border-emerald-500 bg-slate-900 shadow-sm ring-1 ring-emerald-500/20'
                  : isLight ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Top MMF Yield</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-base sm:text-lg font-extrabold mt-0.5">
                16.85% <span className={`text-[10px] font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>EAR</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold block truncate">
                Etica Wealth Daily Comp
              </span>
            </div>

            <div 
              onClick={() => setActiveTab('GUIDES')}
              className={`rounded-xl p-3 border transition-all cursor-pointer ${
                activeTab === 'GUIDES' 
                  ? isLight ? 'border-emerald-500 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-500/20' : 'border-emerald-500 bg-slate-900 shadow-sm ring-1 ring-emerald-500/20'
                  : isLight ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Hustle Playbooks</span>
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-base sm:text-lg font-extrabold text-emerald-600 mt-0.5">
                4 AI Guides
              </div>
              <span className={`text-[10px] block truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Prompts & Earning Maps
              </span>
            </div>
          </div>

          {/* Module Views */}
          {activeTab === 'GIGS' && (
            <GigBoard
              selectedCategory={selectedCategory}
              deviceFilter={deviceFilter}
              setSelectedCategory={setSelectedCategory}
              setDeviceFilter={setDeviceFilter}
              onOpenPaywall={handleTriggerPaywall}
              onOpenEscrowModal={() => setIsEscrowModalOpen(true)}
            />
          )}
          {activeTab === 'RUNWAY' && <RunwayEngine onOpenPaywall={handleTriggerPaywall} />}
          {activeTab === 'MMF' && <YieldSparklines onOpenPaywall={handleTriggerPaywall} />}
          {activeTab === 'GUIDES' && <GuidesModule onOpenPaywall={handleTriggerPaywall} />}
          {activeTab === 'LEDGER' && (
            <div className={`rounded-xl p-4 border space-y-4 transition-colors ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <History className="w-4 h-4 text-emerald-600" />
                    <span>PayHero / Daraja M-Pesa Micro-Audit Ledger</span>
                  </h2>
                  <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Real-time settlement trace for PayHero & Daraja C2B transactions
                  </p>
                </div>
                <button
                  onClick={() => setIsArchitectureOpen(true)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200'
                  }`}
                >
                  Architecture Inspector
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[550px]">
                  <thead className={`border-b text-[11px] ${
                    isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}>
                    <tr>
                      <th className="p-3">M-Pesa Receipt</th>
                      <th className="p-3">Handset Phone</th>
                      <th className="p-3">Feature Unlocked</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Network Status</th>
                      <th className="p-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y font-mono ${isLight ? 'divide-slate-200' : 'divide-slate-800'}`}>
                    {store.transactions.map((tx) => (
                      <tr key={tx.id} className={isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}>
                        <td className="p-3 text-emerald-600 font-bold">{tx.mpesaReceipt || 'MPESA_PENDING'}</td>
                        <td className={`p-3 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{tx.phoneNumber}</td>
                        <td className={`p-3 font-sans ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{tx.purpose || 'Campus Pass'}</td>
                        <td className="p-3 text-emerald-600 font-bold">KSh {tx.amount || 130}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-950/40 text-emerald-400 border-emerald-800'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className={`p-3 text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {new Date(tx.createdAt || Date.now()).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t flex items-center justify-around h-14 backdrop-blur-md transition-colors ${
        isLight ? 'bg-white/95 border-slate-200 text-slate-600' : 'bg-slate-950/95 border-slate-800 text-slate-400'
      }`}>
        <button
          onClick={() => setActiveTab('GIGS')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer ${
            activeTab === 'GIGS' ? 'text-emerald-600' : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Gigs</span>
        </button>

        <button
          onClick={() => setActiveTab('RUNWAY')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer ${
            activeTab === 'RUNWAY' ? 'text-emerald-600' : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Runway</span>
        </button>

        <button
          onClick={() => setActiveTab('MMF')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer ${
            activeTab === 'MMF' ? 'text-emerald-600' : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>MMF</span>
        </button>

        <button
          onClick={() => setActiveTab('GUIDES')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer ${
            activeTab === 'GUIDES' ? 'text-emerald-600' : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Guides</span>
        </button>

        <button
          onClick={() => setActiveTab('LEDGER')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer ${
            activeTab === 'LEDGER' ? 'text-emerald-600' : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Ledger</span>
        </button>

        {!hasPass && (
          <button
            onClick={() => handleTriggerPaywall('Full CampusHustle Access')}
            className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-emerald-600 animate-pulse cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>$1 Pass</span>
          </button>
        )}
      </nav>

      {/* Global Modals */}
      <MpesaModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        targetFeatureName={paywallFeatureName}
      />

      <EscrowModal
        isOpen={isEscrowModalOpen}
        onClose={() => setIsEscrowModalOpen(false)}
      />

      <DarajaArchitectureInspector
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
}
