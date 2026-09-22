'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCampusStore } from '../lib/store';
import { CampusName } from '../types';
import { 
  Briefcase, 
  Flame, 
  TrendingUp, 
  History, 
  Bookmark, 
  CheckSquare, 
  BrainCircuit, 
  ChevronRight,
  ChevronLeft,
  X,
  BookOpen,
  Sparkles,
  LogOut
} from 'lucide-react';

export type AppTabType = 'GIGS' | 'TRACKER' | 'SAVED' | 'SKILLS' | 'RUNWAY' | 'MMF' | 'LEDGER' | 'GUIDES' | 'ADMIN';

interface SidebarProps {
  activeTab: AppTabType;
  setActiveTab: (tab: AppTabType) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  deviceFilter: 'ALL' | 'SMARTPHONE_OK' | 'LAPTOP_REQUIRED';
  setDeviceFilter: (dev: 'ALL' | 'SMARTPHONE_OK' | 'LAPTOP_REQUIRED') => void;
  onOpenPaywall: () => void;
  onOpenEscrowModal: () => void;
  onOpenArchitecture: () => void;
  onOpenGeminiFamily: () => void;
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
  onOpenGeminiFamily,
  isOpenMobile,
  onCloseMobile,
  isCollapsed,
  setIsCollapsed
}) => {
  const router = useRouter();
  const store = useCampusStore();
  const isLight = store.theme === 'light';

  const campuses: CampusName[] = ['MMU', 'UoN', 'KU', 'JKUAT', 'Strathmore', 'Egerton', 'Moi'];

  const navItems = [
    { id: 'GIGS' as AppTabType, label: 'Gig Aggregator', icon: <Briefcase className="w-4 h-4" />, count: store.gigs.length },
    { id: 'TRACKER' as AppTabType, label: 'Application Tracker', icon: <CheckSquare className="w-4 h-4 text-blue-500" />, count: store.applications.length },
    { id: 'SAVED' as AppTabType, label: 'Saved Gigs', icon: <Bookmark className="w-4 h-4 text-amber-500" />, count: store.savedGigs.length },
    { id: 'SKILLS' as AppTabType, label: 'AI Skill Matrix', icon: <BrainCircuit className="w-4 h-4 text-purple-500" /> },
    { id: 'RUNWAY' as AppTabType, label: 'HELB Runway Survival', icon: <Flame className="w-4 h-4 text-rose-500" /> },
    { id: 'MMF' as AppTabType, label: 'MMF Yield Sparklines', icon: <TrendingUp className="w-4 h-4 text-emerald-600" /> },
    { id: 'GUIDES' as AppTabType, label: 'Hustle Playbooks', icon: <BookOpen className="w-4 h-4 text-slate-400" /> },
    { id: 'LEDGER' as AppTabType, label: 'Audit Ledger', icon: <History className="w-4 h-4 text-slate-400" /> },
  ];

  const handleSignOut = () => {
    store.logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  // Minimized Desktop Sidebar View
  if (isCollapsed && !isOpenMobile) {
    return (
      <aside className={`hidden lg:flex flex-col items-center justify-between py-4 px-2 w-16 border-r select-none transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950/95 border-slate-800 text-slate-100'
      }`}>
        <div className="space-y-3 flex flex-col items-center">
          <button
            onClick={() => setIsCollapsed(false)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
            title="Expand Navigation Sidebar"
          >
            <ChevronRight className="w-4 h-4 text-emerald-600" />
          </button>

          <div className={`space-y-2 pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-2.5 rounded-xl transition-all cursor-pointer relative ${
                  activeTab === item.id 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'
                }`}
                title={item.label}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Minimized Sign Out */}
        <button
          onClick={handleSignOut}
          className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden backdrop-blur-xs animate-fade-in"
        />
      )}

      {/* Main Full Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 bottom-0 z-50 lg:z-10 w-64 border-r flex flex-col justify-between py-4 px-3 select-none overflow-y-auto transition-all ${
        isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
      } ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950/95 border-slate-800 text-slate-100'
      }`}>
        <div className="space-y-4">
          {/* Header Row */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              CampusHustle 2.0
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsCollapsed(true)}
                className={`hidden lg:flex p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300' : 'bg-slate-900 hover:bg-slate-800 border-slate-800'
                }`}
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Primary Navigation Tabs */}
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isLight 
                      ? 'text-slate-700 hover:bg-slate-100' 
                      : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === item.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Featured Service: Gemini Pro AI Access (KES 200) */}
          <div className={`p-3 rounded-2xl border space-y-2 ${
            isLight 
              ? 'bg-gradient-to-br from-blue-50/60 via-purple-50/40 to-pink-50/40 border-purple-200 shadow-xs' 
              : 'bg-gradient-to-br from-blue-950/30 via-purple-950/20 to-slate-900 border-purple-900/40'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-purple-600" />
                <span>AI Pro Access</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-600 border border-purple-500/20">
                KSh 200
              </span>
            </div>

            <p className={`text-[11px] leading-tight ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Get full Gemini Advanced 2.0 access via Google Family group for assignments & research.
            </p>

            <button
              onClick={() => {
                onOpenGeminiFamily();
                if (isOpenMobile) onCloseMobile();
              }}
              className="w-full py-2 px-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:opacity-95 text-white flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>Join Google Family</span>
            </button>
          </div>

          {/* Campus Switcher */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block px-1">
              Active University
            </span>
            <div className="grid grid-cols-2 gap-1">
              {campuses.map((c) => (
                <button
                  key={c}
                  onClick={() => store.setCampus(c)}
                  className={`text-[11px] font-bold py-1.5 px-2 rounded-xl border transition-colors cursor-pointer ${
                    store.user.campus === c
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info & Sign Out Button */}
        <div className={`pt-3 border-t text-[11px] space-y-2 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-500">
            <span>Logged in:</span>
            <span className="font-bold text-emerald-600 truncate max-w-[100px]">{store.user.fullName || 'Student'}</span>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full py-2 px-3 rounded-xl text-xs font-bold border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Account</span>
          </button>
        </div>
      </aside>
    </>
  );
};
