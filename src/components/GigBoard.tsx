'use client';

import React, { useState } from 'react';
import { useCampusStore, formatLaunchTime } from '../lib/store';
import { Gig } from '../types';
import { 
  Briefcase, 
  Smartphone, 
  Laptop, 
  ShieldCheck, 
  Lock, 
  ExternalLink, 
  Clock, 
  Users, 
  Search, 
  CheckCircle, 
  Sparkles, 
  Bot, 
  MapPin,
  Radio,
  RefreshCw,
  Plus,
  Play,
  Pause,
  X,
  ArrowRight,
  Phone,
  MessageSquare,
  Globe,
  Share2
} from 'lucide-react';

interface GigBoardProps {
  onOpenPaywall: (featureName: string) => void;
  onOpenEscrowModal: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  deviceFilter: 'ALL' | 'SMARTPHONE_OK' | 'LAPTOP_REQUIRED';
  setDeviceFilter: (dev: 'ALL' | 'SMARTPHONE_OK' | 'LAPTOP_REQUIRED') => void;
}

export const GigBoard: React.FC<GigBoardProps> = ({ 
  onOpenPaywall, 
  onOpenEscrowModal,
  selectedCategory,
  setSelectedCategory,
  deviceFilter,
  setDeviceFilter
}) => {
  const store = useCampusStore();
  const hasPass = store.hasActivePass();
  const isLight = store.theme === 'light';

  const [searchQuery, setSearchQuery] = useState('');
  const [appliedGigs, setAppliedGigs] = useState<Set<string>>(new Set());
  const [activeGigModal, setActiveGigModal] = useState<Gig | null>(null);

  const categories: { label: string; value: string; count: number }[] = [
    { label: 'All Opportunities', value: 'ALL', count: store.gigs.length },
    { label: 'Global Remote (Worldwide)', value: 'Global Remote', count: store.gigs.filter(g => g.category === 'Global Remote').length },
    { label: 'Kenyan Remote Jobs', value: 'Kenyan Remote', count: store.gigs.filter(g => g.category === 'Kenyan Remote').length },
    { label: 'Campus Escrow Gigs', value: 'INTERNAL_ESCROW', count: store.gigs.filter(g => g.originType === 'INTERNAL_ESCROW').length },
    { label: 'AI Annotation', value: 'AI Annotation', count: store.gigs.filter(g => g.category === 'AI Annotation').length },
    { label: 'Tutoring & Code', value: 'Tutoring', count: store.gigs.filter(g => g.category === 'Tutoring' || g.category === 'Tech & Design').length },
    { label: 'Attachments & Internships', value: 'Attachment & Internship', count: store.gigs.filter(g => g.category === 'Attachment & Internship').length },
  ];

  const filteredGigs = store.gigs.filter((gig) => {
    const matchesSearch = 
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (gig.platformName && gig.platformName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      gig.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesCategory = true;
    if (selectedCategory === 'INTERNAL_ESCROW') {
      matchesCategory = gig.originType === 'INTERNAL_ESCROW';
    } else if (selectedCategory === 'Tutoring') {
      matchesCategory = gig.category === 'Tutoring' || gig.category === 'Tech & Design';
    } else if (selectedCategory !== 'ALL') {
      matchesCategory = gig.category === selectedCategory;
    }

    const matchesDevice = deviceFilter === 'ALL' || gig.deviceRequirement === deviceFilter;

    const matchesCampus = 
      gig.campus === 'ALL' || 
      gig.campus === store.user.campus || 
      gig.originType === 'EXTERNAL_PARTNER' ||
      gig.originType === 'SCRAPED';

    return matchesSearch && matchesCategory && matchesDevice && matchesCampus;
  });

  const handleOpenGig = (gig: Gig) => {
    // If it's an internal gig and student does not have an active pass, prompt micro-paywall to unlock client contact
    if (gig.originType === 'INTERNAL_ESCROW' && !hasPass) {
      onOpenPaywall(`Unlock Contact for "${gig.title}"`);
      return;
    }

    // Set modal to view job details & direct link
    store.applyToGig(gig.id);
    setAppliedGigs((prev) => new Set(prev).add(gig.id));
    setActiveGigModal(gig);
  };

  const handleDirectExternalOpen = (e: React.MouseEvent, gig: Gig) => {
    e.stopPropagation();
    if (gig.externalApplyUrl) {
      window.open(gig.externalApplyUrl, '_blank', 'noopener,noreferrer');
      store.applyToGig(gig.id);
      setAppliedGigs((prev) => new Set(prev).add(gig.id));
    } else {
      handleOpenGig(gig);
    }
  };

  return (
    <div className="space-y-3">
      {/* Live Auto-Updating Status Ribbon */}
      <div className={`rounded-xl p-3 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 transition-colors ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        {/* Left: Real-time update heartbeat */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 relative" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold tracking-tight">
                Live Campus Tasks Feed
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-800 text-emerald-400 border-slate-700'
              }`}>
                {store.gigs.length} Total Tasks
              </span>
            </div>
            <div className={`flex items-center gap-2 text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-emerald-600" />
                <span>Next auto-update in {store.nextAutoUpdateSeconds}s</span>
              </span>
              <span>•</span>
              <span>Pulse: {store.isAutoUpdating ? 'Active (Auto-refresh on)' : 'Paused'}</span>
            </div>
          </div>
        </div>

        {/* Right: Controls to manually launch task pulse or toggle live auto-update */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => store.toggleAutoUpdate()}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              store.isAutoUpdating
                ? isLight ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                : 'bg-emerald-600 text-white border-emerald-500'
            }`}
            title={store.isAutoUpdating ? 'Pause Auto-Updating' : 'Resume Auto-Updating'}
          >
            {store.isAutoUpdating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{store.isAutoUpdating ? 'Pause Feed' : 'Resume Feed'}</span>
          </button>

          <button
            onClick={() => store.triggerManualTaskLaunch()}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            title="Launch an immediate live task from Kenyan campuses"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Launch Task Pulse</span>
          </button>

          <button
            onClick={onOpenEscrowModal}
            className={`hidden md:flex px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors items-center gap-1 ${
              isLight 
                ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300' 
                : 'bg-slate-800 hover:bg-slate-750 text-white border-slate-700'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Post Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`rounded-xl px-3.5 py-2.5 border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 transition-colors ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.value
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : isLight ? 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200' : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === cat.value ? 'bg-white/20 text-white' : isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Hardware Toggle */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-52">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Fuzu, skills, tasks..."
              className={`w-full pl-8 pr-3 py-1 border rounded-lg text-xs focus:outline-none focus:border-emerald-500 transition-colors ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
              }`}
            />
          </div>

          <div className={`flex items-center gap-0.5 p-0.5 rounded-lg border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <button
              onClick={() => setDeviceFilter('ALL')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                deviceFilter === 'ALL' 
                  ? isLight ? 'bg-white text-slate-900 font-bold shadow-xs' : 'bg-slate-800 text-white font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDeviceFilter('SMARTPHONE_OK')}
              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
                deviceFilter === 'SMARTPHONE_OK' 
                  ? 'bg-emerald-600 text-white font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>Phone</span>
            </button>
            <button
              onClick={() => setDeviceFilter('LAPTOP_REQUIRED')}
              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
                deviceFilter === 'LAPTOP_REQUIRED' 
                  ? 'bg-emerald-600 text-white font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Laptop className="w-3 h-3" />
              <span>PC</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gigs List with Platform Source Badge and Direct External Listing Opener */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredGigs.map((gig) => {
          const isApplied = appliedGigs.has(gig.id);
          const launchTimeInfo = formatLaunchTime(gig.createdAt);
          const platformLabel = gig.platformName || (gig.originType === 'INTERNAL_ESCROW' ? 'Campus Escrow' : 'Direct Partner');

          return (
            <div
              key={gig.id}
              onClick={() => handleOpenGig(gig)}
              className={`rounded-xl p-4 border flex flex-col justify-between transition-all cursor-pointer hover:border-emerald-500/60 ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="space-y-2.5">
                {/* Top Row: Platform Source Badge + Launch Timestamp */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                      gig.originType === 'INTERNAL_ESCROW'
                        ? isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-950/50 text-emerald-400 border-emerald-800'
                        : isLight ? 'bg-slate-100 text-slate-800 border-slate-300 font-bold' : 'bg-slate-800 text-white border-slate-700 font-bold'
                    }`}>
                      {platformLabel}
                    </span>

                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-950 text-slate-400'
                    }`}>
                      {gig.category}
                    </span>
                  </div>

                  {/* Exact Launch Timestamp */}
                  <div className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md border flex-shrink-0 ${
                    launchTimeInfo.relative === 'Just now'
                      ? 'bg-emerald-600 text-white border-emerald-500 font-bold animate-pulse'
                      : isLight ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`} title={`Launched: ${launchTimeInfo.exact}`}>
                    <Clock className="w-3 h-3 text-emerald-500" />
                    <span>{launchTimeInfo.relative}</span>
                  </div>
                </div>

                {/* Gig Title */}
                <h3 className="text-sm font-bold leading-snug line-clamp-2">
                  {gig.title}
                </h3>

                {/* Poster / Employer */}
                <div className={`flex items-center gap-1.5 text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  <span>{gig.posterName || 'Verified Poster'}</span>
                  {gig.campus && gig.campus !== 'ALL' && (
                    <>
                      <span>•</span>
                      <span className="font-semibold text-emerald-600">{gig.campus} Campus</span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className={`text-xs line-clamp-2 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {gig.description}
                </p>

                {/* Skills Badges */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {gig.skills.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                  {gig.deviceRequirement === 'SMARTPHONE_OK' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1 font-semibold">
                      <Smartphone className="w-2.5 h-2.5" />
                      <span>Phone OK</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Row: Bounty Reward in USD + Action Button Opening Job Listing */}
              <div className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}>
                <div>
                  <span className={`text-[10px] uppercase font-bold block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    Compensation (USD)
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base sm:text-lg font-extrabold text-emerald-600">
                      ${(gig.rewardUsd || Math.round((gig.rewardKes || 2600) / 130)).toLocaleString()}
                    </span>
                    <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      (~KSh {(gig.rewardKes || gig.rewardUsd * 130).toLocaleString()})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {gig.externalApplyUrl ? (
                    <button
                      onClick={(e) => handleDirectExternalOpen(e, gig)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                      title={`Open directly on ${gig.platformName || 'job site'}`}
                    >
                      <span>Open on {gig.platformName ? gig.platformName.split(' ')[0] : 'Listing'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenGig(gig);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isApplied
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Contact Open</span>
                        </>
                      ) : (
                        <>
                          <span>Take Bounty</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Exact Launch Date Footer */}
              <div className={`mt-2 pt-1.5 text-[9px] font-mono flex items-center justify-between border-t ${
                isLight ? 'border-slate-100 text-slate-400' : 'border-slate-900 text-slate-500'
              }`}>
                <span>Launched: {launchTimeInfo.exact}</span>
                <span>{gig.applicantCount} applicants</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Job Listing Modal */}
      {activeGigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className={`relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            {/* Header */}
            <div className="p-4 sm:p-5 bg-emerald-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                    {activeGigModal.title}
                  </h3>
                  <p className="text-[11px] text-emerald-100">
                    Source: {activeGigModal.platformName || 'Campus Hustle Verified'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveGigModal(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Reward in USD and Platform Card */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Offering Compensation (USD)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <div className="text-xl sm:text-2xl font-black text-emerald-600">
                      ${(activeGigModal.rewardUsd || Math.round((activeGigModal.rewardKes || 2600) / 130)).toLocaleString()} USD
                    </div>
                    <span className={`text-xs font-mono font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      (~KSh {(activeGigModal.rewardKes || activeGigModal.rewardUsd * 130).toLocaleString()})
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                    isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-700 text-white'
                  }`}>
                    {activeGigModal.originType}
                  </span>
                  <span className={`text-[10px] block mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {activeGigModal.applicantCount} active applicants
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Task Details & Requirements
                </h4>
                <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {activeGigModal.description}
                </p>
              </div>

              {/* Qualification Guide if present */}
              {activeGigModal.qualificationGuide && (
                <div className={`p-3 rounded-xl border space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Screening & Benchmark Rubric</span>
                  </span>
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {activeGigModal.qualificationGuide}
                  </p>
                </div>
              )}

              {/* Required Skills */}
              <div className="space-y-1.5">
                <span className={`text-xs font-bold uppercase tracking-wider block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Required Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeGigModal.skills.map((s) => (
                    <span
                      key={s}
                      className={`text-xs px-2.5 py-1 rounded-lg font-mono ${
                        isLight ? 'bg-slate-100 text-slate-800 border border-slate-200' : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* External Direct Opener OR Internal Direct Phone Contact */}
              {activeGigModal.externalApplyUrl ? (
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <span className="font-mono text-[11px] truncate text-emerald-600">
                      {activeGigModal.externalApplyUrl}
                    </span>
                    <Globe className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  </div>

                  <a
                    href={activeGigModal.externalApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Open Listing on {activeGigModal.platformName || 'Job Portal'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Direct Poster Contact:</span>
                    <span className="text-emerald-600 font-mono font-bold">
                      +{activeGigModal.posterPhone || store.user.phoneNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`https://wa.me/${activeGigModal.posterPhone || store.user.phoneNumber}?text=Hi%20I%20am%20applying%20for%20your%20CampusHustle%20task:%20${encodeURIComponent(activeGigModal.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all text-center"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>

                    <a
                      href={`tel:+${activeGigModal.posterPhone || store.user.phoneNumber}`}
                      className={`py-2.5 border text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all text-center ${
                        isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-white'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Direct Phone Call</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
