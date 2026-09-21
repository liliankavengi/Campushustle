'use client';

import React, { useState } from 'react';
import { useCampusStore } from '../lib/store';
import { 
  Zap, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Smartphone, 
  Briefcase, 
  BrainCircuit, 
  FileText, 
  Flame, 
  TrendingUp, 
  LogOut, 
  Sparkles,
  DollarSign
} from 'lucide-react';

interface SubscriptionPaywallGateProps {
  onOpenMpesaModal: (phone?: string) => void;
}

export const SubscriptionPaywallGate: React.FC<SubscriptionPaywallGateProps> = ({ onOpenMpesaModal }) => {
  const store = useCampusStore();
  const isLight = store.theme === 'light';
  const user = store.user;

  const [inputPhone, setInputPhone] = useState(user.phoneNumber || '');
  const [isActivatingDemo, setIsActivatingDemo] = useState(false);

  const handlePayMpesa = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenMpesaModal(inputPhone);
  };

  const handleInstantDemoUnlock = () => {
    setIsActivatingDemo(true);
    setTimeout(() => {
      store.activateStandardPass();
      setIsActivatingDemo(false);
    }, 600);
  };

  const features = [
    {
      title: 'Global Remote & Kenyan Gig Streams',
      desc: 'Real-time ingested opportunities from Fuzu, BrighterMonday, RemoteOK, and AI Labs ($15–$40/hr).',
      icon: <Briefcase className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: 'External Application Tracker',
      desc: 'Organize submissions across stages (Preparing, Applied, Interviewing, Accepted) with pipeline analytics.',
      icon: <CheckCircle2 className="w-5 h-5 text-blue-500" />,
    },
    {
      title: 'AI Skill-Gap & Career Matcher',
      desc: 'Personalized fit scores matching your university skills against active high-yield roles.',
      icon: <BrainCircuit className="w-5 h-5 text-purple-500" />,
    },
    {
      title: 'Student Remote CV & Application Kit',
      desc: 'Fast 1-click Markdown resume generator optimized for remote AI and data tasks.',
      icon: <FileText className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: 'HELB Semester Runway Calculator',
      desc: 'Daily burn rate analysis and HELB survival calculator built for Kenyan campus life.',
      icon: <Flame className="w-5 h-5 text-rose-500" />,
    },
    {
      title: 'Top MMF Daily Compounding Trackers',
      desc: 'Live effective annual rate sparklines and daily interest growth projections.',
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
    },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Top Header */}
      <header className={`border-b px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight leading-none">
              Campus<span className="text-emerald-600">Hustle</span>
            </span>
            <span className="text-[10px] text-emerald-600 font-bold">
              Subscription Gate
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-bold">{user.fullName || 'Student Account'}</span>
            <span className="text-[10px] text-slate-400">{user.campus} • {user.phoneNumber || 'No phone'}</span>
          </div>
          <button
            onClick={() => store.logout()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border text-rose-500 hover:bg-rose-500/10 border-rose-500/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Centerpiece Paywall Card */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in">
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl text-center space-y-5 transition-all ${
          isLight 
            ? 'bg-gradient-to-b from-emerald-50/50 via-white to-white border-emerald-200 shadow-slate-200/50' 
            : 'bg-gradient-to-b from-emerald-950/30 via-slate-900 to-slate-900 border-emerald-900/40 shadow-black/80'
        }`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Standard Platform Subscription Required</span>
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Unlock CampusHustle for Only <span className="text-emerald-600 font-mono">$1</span> (KSh 130)
            </h1>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              To access the platform, discover vetted global remote gigs, track applications, and use the AI career suite, subscribe with a one-time <strong>$1 (KSh 130)</strong> pass for the full semester.
            </p>
          </div>

          {/* Pricing Box & M-Pesa STK Form */}
          <div className={`p-5 rounded-2xl border max-w-md mx-auto space-y-4 ${
            isLight ? 'bg-white border-emerald-200 shadow-sm' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-baseline justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">1-Semester All-Access</span>
                <span className="font-extrabold text-sm">Full Student Access Pass</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-emerald-600 font-mono">$1.00 USD</div>
                <div className="text-[11px] font-bold text-slate-500">~KSh 130 M-Pesa</div>
              </div>
            </div>

            <form onSubmit={handlePayMpesa} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-left text-slate-500 mb-1">
                  M-Pesa Phone Number for STK Push
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0712345678 or 254712345678"
                    value={inputPhone}
                    onChange={(e) => setInputPhone(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-mono border ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Pay KSh 130 via M-Pesa to Unlock</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Sandbox / Testing Mode:</span>
              <button
                onClick={handleInstantDemoUnlock}
                disabled={isActivatingDemo}
                className="text-emerald-600 font-bold hover:underline cursor-pointer disabled:opacity-50"
              >
                {isActivatingDemo ? 'Activating Pass...' : 'Instant Test Activation ($1)'}
              </button>
            </div>
          </div>
        </div>

        {/* Feature Matrix Included in the $1 Subscription */}
        <div className="space-y-3">
          <div className="text-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Everything Included in Your $1 Semester Pass
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border space-y-2 transition-all ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {feat.icon}
                </div>
                <h4 className="text-xs font-extrabold">{feat.title}</h4>
                <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
