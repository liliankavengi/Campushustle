'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCampusStore } from '../../lib/store';
import { AdminDashboard } from '../../components/AdminDashboard';
import { DarajaArchitectureInspector } from '../../components/DarajaArchitectureInspector';
import { 
  Zap, 
  ShieldCheck, 
  ArrowLeft, 
  Home, 
  Terminal, 
  Sun,
  Moon
} from 'lucide-react';

export default function AdminPage() {
  const store = useCampusStore();
  const isLight = store.theme === 'light';
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Top Admin Header Bar (Minimalist 2-Color: Slate + Emerald) */}
      <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl ${
        isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold tracking-tight">
                  Campus<span className="text-emerald-600">Hustle</span>
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                  ADMIN
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => store.setTheme(isLight ? 'dark' : 'light')}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
              }`}
              title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
            >
              {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-emerald-400" />}
              <span className="text-[11px] hidden sm:inline">{isLight ? 'Dark' : 'Light'}</span>
            </button>

            <button
              onClick={() => setIsArchitectureOpen(true)}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-600" />
              <span>API Spec</span>
            </button>

            <Link
              href="/"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Landing</span>
            </Link>

            <Link
              href="/app"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Student App</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
        <AdminDashboard />
      </main>

      {/* Admin Footer */}
      <footer className={`border-t py-3 text-xs transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-900 border-slate-800 text-slate-400'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold">CampusHustle Admin Command Center</span>
            <span>• Restricted to {store.ADMIN_EMAIL}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Safaricom Paybill 400200</span>
            <span>•</span>
            <button
              onClick={() => setIsArchitectureOpen(true)}
              className="text-emerald-600 hover:underline"
            >
              API Architecture
            </button>
          </div>
        </div>
      </footer>

      {/* Architecture Modal */}
      <DarajaArchitectureInspector
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
}
