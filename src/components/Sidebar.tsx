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
  BarChart3,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'GIGS' | 'RUNWAY' | 'MMF' | 'LEDGER' | 'GUIDES' | 'ADMIN';
  setActiveTab: (tab: 'GIGS' | 'RUNWAY' | 'MMF' | 'LEDGER' | 'GUIDES' | 'ADMIN') => void;
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

  // Minimized Desktop Sidebar View
  if (isCollapsed && !isOpenMobile) {
    return (
      <aside className={`hidden lg:flex flex-col items-center justify-between py-5 px-2 w-16 border-r select-none transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950/95 border-slate-800 text-slate-100'
      }`}>
        <div className="space-y-4 flex flex-col items-center">
          <button
            onClick={() => setIsCollapsed(false)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
            title="Expand Classifications Sidebar"
          >
            <ChevronRight className="w-4 h-4 text-emerald-600" />
          </button>

          <div className={`space-y-2 pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <button
              onClick={() => setActiveTab('GIGS')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
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
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
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
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'MMF' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
              title="MMF Yield Trackers"
            >
              <TrendingUp className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('GUIDES')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'GUIDES' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
              title="AI Guides & Playbooks"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('LEDGER')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'LEDGER' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
              title="M-Pesa Ledger Audit"
            >
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          {!hasPass && (
            <button
              onClick={onOpenPaywall}
              className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm animate-pulse cursor-pointer"
              title="Unlock $1 All-Access Pass"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity" 
        />
      )}

      {/* Main Full Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 flex flex-col justify-between p-4 border-r transition-all duration-300
        lg:static lg:w-64 lg:z-auto
        ${isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950/95 border-slate-800 text-slate-100'}
      `}>
        <div className="space-y-5 overflow-y-auto pr-1">
          {/* Top Branding (Mobile only) or Collapse Toggle */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-sm tracking-tight">
                Campus<span className="text-emerald-600">Hustle</span>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsCollapsed(true)}
                className={`hidden lg:flex p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Module Navigation */}
          <div className="space-y-1">
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
              Modules
            </span>

            {[
              { id: 'GIGS', label: 'Opportunities Board', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'RUNWAY', label: 'HELB & Daily Runway', icon: <Flame className="w-4 h-4" /> },
              { id: 'MMF', label: 'MMF Yield Trackers', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'GUIDES', label: 'AI Guides & Playbooks', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'LEDGER', label: 'Daraja M-Pesa Ledger', icon: <History className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : isLight 
                    ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Opportunities Category Filters (When in GIGS tab) */}
          {activeTab === 'GIGS' && (
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                Hustle Categories
              </span>
              <div className="space-y-0.5">
                {gigCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      if (isOpenMobile) onCloseMobile();
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      selectedCategory === cat.id
                        ? isLight ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200' : 'bg-slate-900 text-emerald-400 font-bold border border-slate-800'
                        : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {cat.icon}
                      <span className="truncate">{cat.label}</span>
                    </div>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      selectedCategory === cat.id 
                        ? 'bg-emerald-600 text-white' 
                        : isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Campus Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
              Campus Region
            </span>
            <div className="grid grid-cols-4 gap-1">
              {campuses.map((c) => (
                <button
                  key={c}
                  onClick={() => store.setCampus(c)}
                  className={`py-1 text-[11px] font-mono font-bold rounded-lg transition-colors cursor-pointer ${
                    store.user.campus === c
                      ? 'bg-emerald-600 text-white'
                      : isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer: Unlock Banner or Post Task */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {!hasPass ? (
            <div className={`p-3 rounded-xl border text-center space-y-2 ${
              isLight ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-center gap-1.5 text-xs font-black text-emerald-600">
                <Lock className="w-3.5 h-3.5" />
                <span>$1 All-Access Pass</span>
              </div>
              <p className={`text-[11px] leading-tight ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                KSh 130 one-time via M-Pesa. Unlocks all poster contacts, tools, and AI guides.
              </p>
              <button
                onClick={onOpenPaywall}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
              >
                Pay KSh 130 via M-Pesa
              </button>
            </div>
          ) : (
            <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
              isLight ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-emerald-950/30 text-emerald-400 border-emerald-800'
            }`}>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <div className="text-[11px] font-bold leading-tight">
                <span>All Functionalities Unlocked</span>
              </div>
            </div>
          )}

          <button
            onClick={onOpenEscrowModal}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Post Campus Escrow Task</span>
          </button>
        </div>
      </aside>
    </>
  );
};
