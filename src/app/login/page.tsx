'use client';

import React from 'react';
import Link from 'next/link';
import { AuthCard } from '../../components/AuthCard';
import { ArrowLeft, Zap } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-between relative overflow-hidden selection:bg-safari-500 selection:text-white">
      {/* Ambient Background Gradient Circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-safari-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-daraja-cyan/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Link */}
      <header className="relative z-10 w-full p-4 sm:p-6 flex items-center justify-between max-w-7xl mx-auto">
        <Link 
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-dark-900/60 px-3 py-1.5 rounded-xl border border-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing</span>
        </Link>

        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-safari-600 flex items-center justify-center text-white shadow-md glow-safaricom">
            <Zap className="w-4 h-4 fill-white text-white" />
          </div>
          <span className="text-sm font-black text-white">
            Campus<span className="text-safari-400">Hustle</span>
          </span>
        </Link>
      </header>

      {/* Centered Auth Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <AuthCard initialMode="SIGN_IN" />
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 text-center text-xs text-slate-500">
        <span>CampusHustle Kenya • Safaricom Daraja 2.0 Micro-Paywall & HELB Runway Engine</span>
      </footer>
    </div>
  );
}
