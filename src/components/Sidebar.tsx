'use client';

import React from 'react';
import Link from 'next/link';
import { useCampusStore } from '../lib/store';
import { CampusName } from '../types';
import { 
  Briefcase, 
  Flame, 
  TrendingUp, 
  History, 
  ShieldCheck, 
  Lock, 
  GraduationCap, 
  Smartphone, 
  Laptop, 
  Layers, 
  Terminal, 
  Utensils, 
  Wifi, 
  Home, 
  FileText, 
  Bot, 
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Zap,
  X,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'GIGS' | 'RUNWAY' | 'MMF' | 'LEDGER' | 'ADMIN';
  setActiveTab: (tab: 'GIGS' | 'RUNWAY' | 'MMF' | 'LEDGER' | 'ADMIN') => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  deviceFilter: 'ALL' | 'SMARTPHONE_OK' | 'LAPTOP_REQUIRED';
  setDeviceFilter: (dev: 'ALL' | 'SMARTPHONE_OK' | 'LAPTOP_REQUIRED') => void;
  onOpenPaywall: () => void;
  onOpenEscrowModal: () => void;
  onOpenArchitecture: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  deviceFilter,
  setDeviceFilter,
  onOpenPaywall,
  onOpenEscrowModal,
  onOpenArchitecture,
  isOpenMobile,
  onCloseMobile,
  isCollapsed,
  setIsCollapsed
}) => {
  const store = useCampusStore();
  const isLight = store.theme === 'light';
  const hasPass = store.hasActivePass();

  const campuses: CampusName[] = ['MMU', 'UoN', 'KU', 'JKUAT', 'Strathmore', 'Egerton', 'Moi'];

  const gigCategories = [
    { id: 'ALL', label: 'All Opportunities', icon: <Layers className="w-4 h-4 text-slate-400" />, count: store.gigs.length },
    { id: 'INTERNAL_ESCROW', label: 'Campus Escrow Bounties', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />, count: store.gigs.filter(g => g.originType === 'INTERNAL_ESCROW').length },
    { id: 'AI Annotation', label: 'Remote AI Batches', icon: <Bot className="w-4 h-4 text-emerald-600" />, count: store.gigs.filter(g => g.category === 'AI Annotation').length },
    { id: 'Tutoring', label: 'Tutoring & Tech Help', icon: <FileText className="w-4 h-4 text-slate-400" />, count: store.gigs.filter(g => g.category === 'Tutoring' || g.category === 'Tech & Design').length },
    { id: 'Attachment & Internship', label: 'Campus Attachments', icon: <Briefcase className="w-4 h-4 text-slate-400" />, count: store.gigs.filter(g => g.category === 'Attachment & Internship').length },
  ];

  const runwayClassifications = [
    { label: 'Kibanda Food Budget', icon: <Utensils className="w-3.5 h-3.5 text-emerald-600" /> },
    { label: 'Safaricom Bundles', icon: <Wifi className="w-3.5 h-3.5 text-emerald-600" /> },
    { label: 'Bedsitter & Hostel Rent', icon: <Home className="w-3.5 h-3.5 text-slate-400" /> },
    { label: 'Cyber & Printing Logs', icon: <FileText className="w-3.5 h-3.5 text-slate-400" /> },
  ];

  // Minimized Desktop Sidebar View
  if (isCollapsed && !isOpenMobile) {
    return (
      <aside className={`hidden lg:flex flex-col items-center justify-between py-5 px-2 w-16 border-r select-none transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950/95 border-slate-800 text-slate-100'
      }`}>
        <div className="space-y-4 flex flex-col items-center">
          <button
            onClick={() => setIsCollapsed(false)}
            className={`p-2 rounded-xl border transition-colors ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
            title="Expand Classifications Sidebar"
          >
            <ChevronRight className="w-4 h-4 text-emerald-600" />
          </button>

          <div className={`space-y-2 pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <button
              onClick={() => setActiveTab('GIGS')}
              className={`p-2.5 rounded-xl transition-all ${
                activeTab === 'GIGS' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
              title="Opportunities Board"
            >
              <Briefcase className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('RUNWAY')}
              className={`p-2.5 rounded-xl transition-all ${
                activeTab === 'RUNWAY' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
              title="HELB & Daily Runway"
            >
              <Flame className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('MMF')}
              className={`p-2.5 rounded-xl transition-all ${
                activeTab === 'MMF' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
              title="MMF Yield Trackers"
            >
              <TrendingUp className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('LEDGER')}
              className={`p-2.5 rounded-xl transition-all ${
                activeTab === 'LEDGER' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
              title="M-Pesa Ledger Audit"
            >
              <History className="w-4 h-4" />
            </button>

            <Link
              href="/admin"
              className={`p-2.5 rounded-xl transition-all block ${
                isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
              title="Admin Portal"
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
            </Link>
          </div>
        </div>

        <div className={`pt-4 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <button
            onClick={hasPass ? undefined : onOpenPaywall}
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              hasPass 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : isLight ? 'bg-slate-100 text-slate-600 border border-slate-300' : 'bg-slate-850 text-slate-400 border border-slate-800'
            }`}
            title={hasPass ? 'Pass Active' : 'Unlock Pass (KSh 130)'}
          >
            {hasPass ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    );
  }

  // Full Expanded Sidebar View (Desktop Static & Mobile Sliding Drawer)
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-150"
        />
      )}

      {/* Full Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 border-r flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 lg:static ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
        } ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Header Brand with Minimize / Close Button */}
          <div className={`flex items-center justify-between pb-3 border-b ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                <Zap className="w-4 h-4 fill-white text-white" />
              </div>
              <div>
                <span className="text-sm font-extrabold tracking-tight block">
                  Campus<span className="text-emerald-600">Hustle</span>
                </span>
                <span className={`text-[10px] block -mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Modules & Scope
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsCollapsed(true)}
                className={`hidden lg:flex p-1.5 rounded-lg border transition-colors ${
                  isLight ? 'text-slate-500 hover:bg-slate-100 border-slate-200' : 'text-slate-400 hover:bg-slate-900 border-slate-800'
                }`}
                title="Minimize Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button 
                onClick={onCloseMobile}
                className={`lg:hidden p-1.5 rounded-lg border transition-colors ${
                  isLight ? 'text-slate-600 hover:bg-slate-100 border-slate-200' : 'text-slate-400 hover:bg-slate-900 border-slate-800'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Section: Main System Pillars */}
          <div className="space-y-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 block mb-1.5 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              System Modules
            </span>

            {/* Pillar 1: Gigs */}
            <button
              onClick={() => {
                setActiveTab('GIGS');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'GIGS'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" />
                <span>Opportunities Board</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === 'GIGS' ? 'bg-white/20 text-white' : isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'
              }`}>
                {store.gigs.length}
              </span>
            </button>

            {/* Pillar 2: Runway */}
            <button
              onClick={() => {
                setActiveTab('RUNWAY');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'RUNWAY'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-emerald-600" />
                <span>HELB & Daily Runway</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Pillar 3: MMF */}
            <button
              onClick={() => {
                setActiveTab('MMF');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'MMF'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>MMF Yield Trackers</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-mono font-bold">16.85%</span>
            </button>

            {/* Pillar 4: Ledger */}
            <button
              onClick={() => {
                setActiveTab('LEDGER');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'LEDGER'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4 text-slate-500" />
                <span>M-Pesa Ledger Audit</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === 'LEDGER' ? 'bg-white/20 text-white' : isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'
              }`}>
                {store.transactions.length}
              </span>
            </button>

            {/* Pillar 5: Admin Dashboard Link */}
            <Link
              href="/admin"
              onClick={onCloseMobile}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isLight ? 'text-slate-800 hover:bg-slate-100 border-slate-200' : 'text-slate-300 hover:bg-slate-900 hover:text-white border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>Admin Portal</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-850 text-slate-400'
              }`}>
                {store.students.length} Accounts
              </span>
            </Link>
          </div>

          {/* Section: Category Classifications */}
          {activeTab === 'GIGS' && (
            <div className={`space-y-1 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 block mb-1.5 ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Categories
              </span>
              {gigCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedCategory === cat.id
                      ? isLight ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200' : 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                      : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {cat.icon}
                    <span className="truncate">{cat.label}</span>
                  </div>
                  <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{cat.count}</span>
                </button>
              ))}
            </div>
          )}

          {/* Section: Runway Categories */}
          {activeTab === 'RUNWAY' && (
            <div className={`space-y-1.5 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 block mb-1.5 ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Expense Logs
              </span>
              {runwayClassifications.map((item, idx) => (
                <div 
                  key={idx}
                  className={`px-2.5 py-1.5 rounded-lg text-xs border flex items-center gap-2 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-300'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Section: Device Hardware Filter */}
          <div className={`space-y-1.5 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 block mb-1 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Hardware Filter
            </span>
            <div className={`grid grid-cols-3 gap-1 p-1 rounded-xl border text-[11px] ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <button
                onClick={() => setDeviceFilter('ALL')}
                className={`py-1 rounded-lg font-medium text-center transition-colors ${
                  deviceFilter === 'ALL' 
                    ? isLight ? 'bg-white text-slate-900 font-bold shadow-xs' : 'bg-slate-800 text-white font-bold' 
                    : 'text-slate-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDeviceFilter('SMARTPHONE_OK')}
                className={`py-1 rounded-lg font-medium text-center transition-colors flex items-center justify-center gap-1 ${
                  deviceFilter === 'SMARTPHONE_OK' 
                    ? 'bg-emerald-600 text-white font-bold' 
                    : 'text-slate-400'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>Phone</span>
              </button>
              <button
                onClick={() => setDeviceFilter('LAPTOP_REQUIRED')}
                className={`py-1 rounded-lg font-medium text-center transition-colors flex items-center justify-center gap-1 ${
                  deviceFilter === 'LAPTOP_REQUIRED' 
                    ? 'bg-emerald-600 text-white font-bold' 
                    : 'text-slate-400'
                }`}
              >
                <Laptop className="w-3 h-3" />
                <span>PC</span>
              </button>
            </div>
          </div>

          {/* Section: Campus Scope */}
          <div className={`space-y-1.5 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <div className="flex items-center justify-between px-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Selected University
              </span>
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <select
              value={store.user.campus}
              onChange={(e) => store.setCampus(e.target.value as CampusName)}
              className={`w-full px-3 py-1.5 border rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
              }`}
            >
              {campuses.map((c) => (
                <option key={c} value={c} className={isLight ? 'bg-white text-slate-900' : 'bg-slate-950 text-white'}>
                  {c} Campus
                </option>
              ))}
            </select>
          </div>

          {/* Quick Actions */}
          <div className={`pt-3 border-t space-y-2 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <button
              onClick={() => {
                onOpenEscrowModal();
                onCloseMobile();
              }}
              className={`w-full py-2 border text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-slate-850 hover:bg-slate-800 border-slate-750 text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Lock Task Escrow</span>
            </button>

            <button
              onClick={() => {
                onOpenArchitecture();
                onCloseMobile();
              }}
              className={`w-full py-2 border text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
                isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              <span>Daraja Architecture & API</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer: Student Pass Status Card */}
        <div className={`p-4 border-t ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
          <div className={`p-3 border rounded-xl space-y-2 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>
                {store.user.fullName}
              </span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                isLight ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {store.user.campus}
              </span>
            </div>

            {hasPass ? (
              <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Semester Pass Active</span>
              </div>
            ) : (
              <div>
                <span className={`text-[10px] block mb-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Unlock all contacts & reports.
                </span>
                <button
                  onClick={() => {
                    onOpenPaywall();
                    onCloseMobile();
                  }}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-sm flex items-center justify-center gap-1 transition-all"
                >
                  <Lock className="w-3 h-3" />
                  <span>Unlock Pass (KSh 130)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
