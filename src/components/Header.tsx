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
  X
} from 'lucide-react';

interface HeaderProps {
  onOpenPaywall: () => void;
  onOpenEscrowModal: () => void;
  onOpenArchitecture: () => void;
  onToggleSidebar?: () => void;
  activeTab: 'GIGS' | 'RUNWAY' | 'MMF' | 'LEDGER' | 'ADMIN';
  setActiveTab: (tab: 'GIGS' | 'RUNWAY' | 'MMF' | 'LEDGER' | 'ADMIN') => void;
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
    { id: 'LEDGER', label: 'Daraja M-Pesa Ledger', icon: <History className="w-4 h-4 text-slate-500" />, badge: `${store.transactions.length} Txs` },

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

        {/* Right Controls: Theme Toggle, Modules Dropdown, Campus, Pass Status, Sign Out */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => store.setTheme(isLight ? 'dark' : 'light')}
            className={`p-2 rounded-xl border transition-colors ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' 
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>



          {/* Modules Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' 
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Modules</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className={`absolute right-0 mt-2 w-64 sm:w-72 rounded-2xl border shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1 ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
              }`}>
                <div className={`px-3 py-1.5 border-b text-[10px] uppercase tracking-wider font-bold flex items-center justify-between ${
                  isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-400'
                }`}>
                  <span>Modules</span>
                  <span className="text-emerald-600 font-mono">CampusHustle</span>
                </div>

                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      activeTab === item.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <span className={`text-[10px] font-mono ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`}>
                      {item.badge}
                    </span>
                  </button>
                ))}

                <div className={`pt-2 border-t grid grid-cols-2 gap-1 ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
  
                  <Link
                    href="/"
                    onClick={() => setDropdownOpen(false)}
                    className={`py-1.5 text-[11px] font-bold rounded-lg text-center transition-colors ${
                      isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                    }`}
                  >
                    Landing Overview
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Campus Selector (Hidden on smallest mobile screens to save space) */}
          <div className={`hidden md:flex items-center gap-1.5 border rounded-xl px-2.5 py-1.5 ${
            isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-900 border-slate-800'
          }`}>
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <select
              value={store.user.campus}
              onChange={(e) => store.setCampus(e.target.value as CampusName)}
              className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {campuses.map((c) => (
                <option key={c} value={c} className={isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}>
                  {c} Campus
                </option>
              ))}
            </select>
          </div>

          {/* Pass Status / STK Paywall Trigger */}
          {hasPass ? (
            <div className={`hidden sm:flex items-center gap-1.5 border px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
              isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pass Active</span>
            </div>
          ) : (
            <button
              onClick={onOpenPaywall}
              className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 whitespace-nowrap"
            >
              <Lock className="w-3.5 h-3.5 text-white" />
              <span>Unlock Pass (KSh 130)</span>
            </button>
          )}

          {/* Sign Out Button */}
          <button
            onClick={() => store.logout()}
            className={`p-2 rounded-xl border transition-colors ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' 
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
