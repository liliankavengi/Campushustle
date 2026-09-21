'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCampusStore, formatLaunchTime } from '../lib/store';
import { AuthCard } from './AuthCard';
import { MpesaModal } from './MpesaModal';
import { EscrowModal } from './EscrowModal';
import { DarajaArchitectureInspector } from './DarajaArchitectureInspector';
import { 
  Zap, 
  Briefcase, 
  Flame, 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Laptop, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Layers, 
  Building2, 
  BarChart3, 
  Globe, 
  Clock, 
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  Radio
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const router = useRouter();
  const store = useCampusStore();
  const isLoggedIn = store.isLoggedIn;
  const isLight = store.theme === 'light';

  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallFeatureName, setPaywallFeatureName] = useState('1-Semester All-Access Hustle Pass');
  const [isEscrowOpen, setIsEscrowOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'SIGN_IN' | 'SIGN_UP'>('SIGN_UP');

  const openAuth = (mode: 'SIGN_IN' | 'SIGN_UP') => {
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLaunchClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      const element = document.getElementById('signup-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        openAuth('SIGN_UP');
      }
    } else {
      router.push('/app');
    }
  };

  const campuses = [
    { name: 'MMU', full: 'Multimedia University of Kenya', gigs: 18 },
    { name: 'UoN', full: 'University of Nairobi', gigs: 34 },
    { name: 'KU', full: 'Kenyatta University', gigs: 29 },
    { name: 'JKUAT', full: 'Jomo Kenyatta University', gigs: 27 },
    { name: 'Strathmore', full: 'Strathmore University', gigs: 19 },
    { name: 'Egerton', full: 'Egerton University', gigs: 15 },
    { name: 'Moi', full: 'Moi University', gigs: 14 }
  ];

  const totalEscrowHeld = store.gigs
    .filter((g) => g.escrowStatus === 'HELD')
    .reduce((acc, g) => acc + g.rewardKes, 0);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 selection:bg-emerald-600 selection:text-white ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Minimalist Top Navigation */}
      <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${
        isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-950/90 border-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight block">
                Campus<span className="text-emerald-600">Hustle</span>
              </span>
              <span className={`text-[10px] font-mono -mt-0.5 block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Kenyan Student Platform
              </span>
            </div>
          </div>

          {/* Center Links */}
          <nav className={`hidden md:flex items-center gap-6 text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            <a href="#about" className="hover:text-emerald-600 transition-colors">What is CampusHustle?</a>
            <a href="#live-feed" className="hover:text-emerald-600 transition-colors">Live Task Feed</a>
            <a href="#features" className="hover:text-emerald-600 transition-colors">Core Modules</a>
            <a href="#campuses" className="hover:text-emerald-600 transition-colors">Universities</a>
            <a href="#pricing" className="hover:text-emerald-600 transition-colors">Pass Pricing</a>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2">
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

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold hidden sm:inline text-emerald-600`}>
                  {store.user.fullName}
                </span>
                <Link
                  href="/app"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95"
                >
                  <span>Launch Application</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => store.logout()}
                  className={`p-2 rounded-xl border transition-colors ${
                    isLight ? 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-300' : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                  }`}
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuth('SIGN_IN')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    isLight ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  Sign In
                </button>

                <button
                  onClick={handleLaunchClick}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95"
                >
                  <span>Launch App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero & Integrated Sign-Up Section */}
      <section id="about" className={`relative pt-8 pb-14 sm:pt-12 sm:pb-16 border-b transition-colors ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Brief Info of What CampusHustle Is */}
            <div className="lg:col-span-7 space-y-5">
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                isLight 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-slate-900 border-slate-800 text-emerald-400'
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>What is CampusHustle?</span>
                <span className="opacity-50">•</span>
                <span>Kenyan Student Financial Engine</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                Empowering Kenyan University Students to <span className="text-emerald-600">Earn, Budget & Grow Wealth</span>
              </h1>

              {/* Brief Info Summary */}
              <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                CampusHustle is a specialized, low-bandwidth financial platform engineered for Kenyan tertiary students. It bridges campus talent with escrow-protected gigs, tracks HELB survival burn rates, and compounds spare cash into CMA-regulated Money Market Funds.
              </p>

              {/* 4 Core Pillars Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className={`p-3.5 rounded-xl border space-y-1 transition-colors ${
                  isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                    <Briefcase className="w-4 h-4" />
                    <span>Campus Gig Aggregator</span>
                  </div>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Escrow-secured campus tasks and remote AI evaluation workflows ($14–$20/hr).
                  </p>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1 transition-colors ${
                  isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                    <Flame className="w-4 h-4" />
                    <span>HELB Runway Calculator</span>
                  </div>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Calculates exact survival days left based on daily Kibanda and bundles burn rate.
                  </p>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1 transition-colors ${
                  isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                    <TrendingUp className="w-4 h-4" />
                    <span>CMA MMF Compounder</span>
                  </div>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Live 16.85% EAR yield sparklines to compound gig savings in licensed Kenyan MMFs.
                  </p>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1 transition-colors ${
                  isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Daraja 2.0 Micro-Paywall</span>
                  </div>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Instant KSh 130 Safaricom STK push to unlock client contacts with zero card friction.
                  </p>
                </div>
              </div>

              {/* Stats Bar */}
              <div className={`grid grid-cols-3 gap-2 pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/50 border-slate-800'}`}>
                  <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Escrow Held</span>
                  <span className="text-xs sm:text-sm font-extrabold text-emerald-600">
                    KSh {totalEscrowHeld.toLocaleString()}
                  </span>
                </div>
                <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/50 border-slate-800'}`}>
                  <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Top MMF Yield</span>
                  <span className="text-xs sm:text-sm font-extrabold">16.85% p.a.</span>
                </div>
                <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/50 border-slate-800'}`}>
                  <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Auto-Update Feed</span>
                  <span className="text-xs sm:text-sm font-extrabold text-emerald-600">{store.gigs.length} Live Tasks</span>
                </div>
              </div>
            </div>

            {/* Right Column: Sign Up or Continue with Google to Launch the App */}
            <div id="signup-section" className="lg:col-span-5">
              <div className="space-y-3">
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
                    <span>Step 1: Sign Up or Continue with Google</span>
                  </div>
                  <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Create your student account or sign in with Google to immediately launch the application.
                  </p>
                </div>

                {/* Embedded Minimalist Auth Card */}
                <AuthCard
                  initialMode="SIGN_UP"
                  onSuccess={() => {
                    router.push('/app');
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Live Auto-Updating Tasks Section */}
      <section id="live-feed" className={`py-12 border-b transition-colors ${
        isLight ? 'bg-slate-100/60 border-slate-200' : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Live Automatic Task Stream
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold mt-1">
                Tasks Automatically Updating with Exact Launch Timestamps
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className={`px-2.5 py-1 rounded-lg border ${
                isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}>
                Auto-updates in <strong className="text-emerald-600">{store.nextAutoUpdateSeconds}s</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {store.gigs.slice(0, 3).map((gig) => {
              const launchInfo = formatLaunchTime(gig.createdAt);

              return (
                <div
                  key={gig.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-800 text-emerald-400'
                      }`}>
                        {gig.category}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <Clock className="w-3 h-3" />
                        <span>Launched {launchInfo.relative}</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold line-clamp-2">
                      {gig.title}
                    </h3>

                    <p className={`text-xs line-clamp-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {gig.description}
                    </p>
                  </div>

                  <div className={`mt-3 pt-2.5 border-t flex items-center justify-between ${
                    isLight ? 'border-slate-100' : 'border-slate-800'
                  }`}>
                    <span className="text-sm font-extrabold text-emerald-600">
                      KSh {gig.rewardKes.toLocaleString()}
                    </span>
                    <button
                      onClick={handleLaunchClick}
                      className="text-xs text-emerald-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Features Breakdown */}
      <section id="features" className={`py-12 border-b transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900/40 border-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
              isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-900 text-emerald-400 border-slate-800'
            }`}>
              Platform Modules
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold mt-2">
              Everything Needed for Student Financial Autonomy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-3">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold">Escrow-Secured Gigs</h3>
                <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Post and complete tasks with guaranteed M-Pesa escrow lock. Client funds are locked before you start.
                </p>
              </div>
              <button 
                onClick={handleLaunchClick}
                className="mt-4 pt-3 border-t border-slate-200/50 text-xs text-emerald-600 font-semibold flex items-center justify-between"
              >
                <span>Explore Tasks</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-3">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold">HELB Runway Engine</h3>
                <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Log your daily kibanda, smokie, and bundles expenses to calculate exact runway days until semester end.
                </p>
              </div>
              <button 
                onClick={handleLaunchClick}
                className="mt-4 pt-3 border-t border-slate-200/50 text-xs text-emerald-600 font-semibold flex items-center justify-between"
              >
                <span>Calculate Runway</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-3">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold">Kenyan MMF Trackers</h3>
                <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Compare daily effective annual rates across CMA-regulated funds (14%–16.85% EAR) with daily compound calculators.
                </p>
              </div>
              <button 
                onClick={handleLaunchClick}
                className="mt-4 pt-3 border-t border-slate-200/50 text-xs text-emerald-600 font-semibold flex items-center justify-between"
              >
                <span>Compare Yields</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold">Daraja 2.0 Micro-Paywall</h3>
                <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  One-time KSh 130 semester pass unlocked via seamless Safaricom STK Push on any mobile handset.
                </p>
              </div>
              <button 
                onClick={handleLaunchClick}
                className="mt-4 pt-3 border-t border-slate-200/50 text-xs text-emerald-600 font-semibold flex items-center justify-between"
              >
                <span>Unlock Pass</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* University Campuses */}
      <section id="campuses" className={`py-12 border-b transition-colors ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Campus Coverage
            </span>
            <h2 className="text-xl font-extrabold mt-1">
              Active Across 7 Major Universities
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {campuses.map((c) => (
              <div
                key={c.name}
                className={`p-3 rounded-xl border text-center space-y-1 transition-colors ${
                  isLight 
                    ? 'bg-white border-slate-200 hover:border-emerald-500 shadow-sm' 
                    : 'bg-slate-900 border-slate-800 hover:border-emerald-500'
                }`}
              >
                <span className="text-sm font-bold block">{c.name}</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">{c.gigs} Live Gigs</span>
                <span className={`text-[9px] block truncate ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{c.full}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pass Pricing Section */}
      <section id="pricing" className={`py-12 border-b transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900/40 border-slate-800'
      }`}>
        <div className="max-w-md mx-auto px-4 text-center space-y-3">
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
            isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-900 text-emerald-400 border-slate-800'
          }`}>
            Semester Access
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold">
            1-Semester All-Access Pass: KSh 130
          </h2>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            One-time payment via Safaricom Daraja STK Push unlocks all client phone numbers, remote AI task queues, and automated expense parsing.
          </p>

          <button
            onClick={handleLaunchClick}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sign Up & Launch Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-6 text-xs transition-colors ${
        isLight ? 'bg-slate-100 border-t border-slate-200 text-slate-500' : 'bg-slate-950 border-t border-slate-800 text-slate-400'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold">CampusHustle Kenya</span>
            <span>• Higher-Ed Financial Operating System</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsArchitectureOpen(true)} className="hover:text-emerald-600 transition-colors">
              Daraja 2.0 Spec
            </button>
          </div>
        </div>
      </footer>

      {/* Auth Modal if triggered via Top Nav */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <AuthCard
            initialMode={authInitialMode}
            isModal={true}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={() => {
              setIsAuthModalOpen(false);
              router.push('/app');
            }}
          />
        </div>
      )}

      {/* Global Modals */}
      <MpesaModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        targetFeatureName={paywallFeatureName}
      />

      <EscrowModal
        isOpen={isEscrowOpen}
        onClose={() => setIsEscrowOpen(false)}
      />

      <DarajaArchitectureInspector
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
};
