'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCampusStore } from '../lib/store';
import { CampusName, NetworkCondition } from '../types';
import { AppTabType } from './Sidebar';
import { 
  Zap, 
  ShieldCheck, 
  Lock, 
  GraduationCap, 
  Menu, 
  ChevronDown, 
  Briefcase, 
  Flame, 
  TrendingUp, 
  History, 
  CheckSquare, 
  Bookmark, 
  BrainCircuit, 
  Sun, 
  Moon, 
  LogOut, 
  X, 
  BookOpen 
} from 'lucide-react';

interface HeaderProps {
  onOpenPaywall: () => void;
  onOpenEscrowModal: () => void;
  onOpenArchitecture: () => void;
  onToggleSidebar?: () => void;
  activeTab: AppTabType;
  setActiveTab: (tab: AppTabType) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenPaywall, 
  onOpenEscrowModal, 
  onOpenArchitecture,
  onToggleSidebar,
  activeTab,
  setActiveTab
}) => {
  const store = useCampusStore();
  const isLight = store.theme === 'light';
  const hasPass = store.hasActivePass();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const campuses: CampusName[] = ['MMU', 'UoN', 'KU', 'JKUAT', 'Strathmore', 'Egerton', 'Moi'];
  const networkOptions: { key: NetworkCondition; label: string }[] = [
    { key: 'FAST_4G', label: '4G LTE' },
    { key: 'FLAKY_CAMPUS', label: 'Campus Wi-Fi' },
    { key: '2G_EDGE', label: '2G Edge' },
    { key: 'OFFLINE', label: 'Offline' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: AppTabType; label: string; icon: any; badge: string }[] = [
    { id: 'GIGS', label: 'Aggregator', icon: <Briefcase className="w-3.5 h-3.5" />, badge: `${store.gigs.length}` },
    { id: 'TRACKER', label: 'Tracker', icon: <CheckSquare className="w-3.5 h-3.5" />, badge: `${store.applications.length}` },
    { id: 'SAVED', label: 'Saved', icon: <Bookmark className="w-3.5 h-3.5" />, badge: `${store.savedGigs.length}` },
    { id: 'SKILLS', label: 'AI Skills', icon: <BrainCircuit className="w-3.5 h-3.5" />, badge: 'AI' },
    { id: 'RUNWAY', label: 'HELB Runway', icon: <Flame className="w-3.5 h-3.5" />, badge: 'Burn' },
    { id: 'MMF', label: 'MMF Yields', icon: <TrendingUp className="w-3.5 h-3.5" />, badge: '16.8%' },
  ];

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${
      isLight ? 'bg-white/95 border-slate-200 text-slate-900' : 'bg-slate-950/95 border-slate-800 text-slate-100'
    }`}>
      <div className="w-full px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className={`p-1.5 rounded-xl border lg:hidden transition-colors cursor-pointer ${
                isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' 
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <Link href="/" className="flex items-center gap-2 group cursor-pointer" title="Back to Overview">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 fill-white text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold tracking-tight leading-none">
                Campus<span className="text-emerald-600">Hustle</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-bold hidden sm:inline">
                Gig Discovery 2.0
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Quick Tab Switcher (Desktop) */}
        <div className="hidden xl:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === item.id
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              <span className="text-[10px] px-1 rounded-sm bg-black/5 dark:bg-white/10 opacity-70">
                {item.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Right: Controls & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => store.toggleTheme()}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' 
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {/* User Account / Profile Chip */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-xl border transition-colors cursor-pointer ${
                isLight 
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-800' 
                  : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-200'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-[10px]">
                {store.user.fullName ? store.user.fullName[0].toUpperCase() : 'S'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold leading-none truncate max-w-[90px]">
                  {store.user.fullName || 'Student'}
                </span>
                <span className="text-[9px] text-emerald-600 font-semibold leading-tight">
                  {store.user.campus || 'MMU'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className={`absolute right-0 mt-2 w-56 rounded-2xl border shadow-xl p-2 space-y-2 z-50 animate-fade-in ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
              }`}>
                <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="font-extrabold text-xs">{store.user.fullName || 'Student Account'}</div>
                  <div className="text-[11px] text-slate-400">{store.user.phoneNumber || 'No phone set'}</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-1">
                    {store.user.subscribedService || 'Campus Pass Holder'}
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('SKILLS');
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <BrainCircuit className="w-3.5 h-3.5 text-purple-600" />
                    <span>Skill Matrix & AI Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('TRACKER');
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Application Tracker</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      store.logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
