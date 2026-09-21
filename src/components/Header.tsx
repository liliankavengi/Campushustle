'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCampusStore } from '../lib/store';
import { CampusName, NetworkCondition } from '../types';
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
  BarChart3, 
  SlidersHorizontal,
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
  activeTab: 'GIGS' | 'RUNWAY' | 'MMF' | 'LEDGER' | 'GUIDES' | 'ADMIN';
  setActiveTab: (tab: 'GIGS' | 'RUNWAY' | 'MMF' | 'LEDGER' | 'GUIDES' | 'ADMIN') => void;
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

  const navItems = [
    { id: 'GIGS', label: 'Opportunities Board', icon: <Briefcase className="w-4 h-4 text-emerald-600" />, badge: `${store.gigs.length} Live` },
    { id: 'RUNWAY', label: 'HELB & Daily Runway', icon: <Flame className="w-4 h-4 text-emerald-600" />, badge: 'Burn Engine' },
    { id: 'MMF', label: 'MMF Yield Trackers', icon: <TrendingUp className="w-4 h-4 text-emerald-600" />, badge: '16.85% EAR' },
    { id: 'GUIDES', label: 'AI Guides & Hustles', icon: <BookOpen className="w-4 h-4 text-emerald-600" />, badge: 'Playbooks' },
    { id: 'LEDGER', label: 'M-Pesa Ledger', icon: <History className="w-4 h-4 text-slate-500" />, badge: `${store.transactions.length} Txs` },
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
              className={`p-1.5 rounded-xl border lg:hidden transition-colors ${
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
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold tracking-tight">
                Campus<span className="text-emerald-600">Hustle</span>
              </span>
              <span className={`text-[10px] font-medium hidden md:inline ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Kenya
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Signal Mode Selector (Desktop) */}
        <div className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Signal:</span>
          <select
            value={store.network}
            onChange={(e) => store.setNetwork(e.target.value as NetworkCondition)}
            className="bg-transparent font-semibold text-emerald-600 focus:outline-none cursor-pointer text-[11px]"
          >
            {networkOptions.map((opt) => (
              <option key={opt.key} value={opt.key} className={isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Center-Right: Quick Module Selector (Desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === item.id
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Actions and User Profile Dropdown */}
        <div className="flex items-center gap-2">
          {/* Post Task Button */}
          <button
            onClick={onOpenEscrowModal}
            className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Escrow Post</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => store.setTheme(isLight ? 'dark' : 'light')}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' 
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
            }`}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* User Account / Profile Badge */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all cursor-pointer ${
                isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300' 
                  : 'bg-slate-900 hover:bg-slate-850 border-slate-800'
              }`}
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-600/20 text-emerald-600 flex items-center justify-center font-bold text-xs">
                {store.user.fullName.charAt(0)}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-xs font-bold truncate max-w-[90px]">
                  {store.user.fullName.split(' ')[0]}
                </span>
                <span className="text-[10px] text-emerald-600 font-mono">
                  {store.user.campus}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-xl p-2 z-50 animate-in fade-in duration-100 ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
              }`}>
                <div className="p-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-xs truncate">{store.user.fullName}</div>
                  <div className={`text-[11px] font-mono mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    +{store.user.phoneNumber}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      hasPass 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                        : isLight ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-amber-950/40 text-amber-400 border-amber-800'
                    }`}>
                      {hasPass ? '✓ Unlimited Pass Active' : '🔒 Unpaid ($1 Pass)'}
                    </span>
                  </div>
                </div>

                <div className="p-1.5 space-y-1">
                  {!hasPass && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenPaywall();
                      }}
                      className="w-full py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock All Features ($1)</span>
                    </button>
                  )}

                  <div className="pt-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                      Change University
                    </span>
                    <div className="grid grid-cols-3 gap-1 mt-1">
                      {campuses.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            store.setCampus(c);
                          }}
                          className={`py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                            store.user.campus === c
                              ? 'bg-emerald-600 text-white'
                              : isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
