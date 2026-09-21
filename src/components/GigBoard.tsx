'use client';

import React, { useState } from 'react';
import { useCampusStore, formatLaunchTime } from '../lib/store';
import { Gig, RemoteType, EmploymentType, ExperienceLevel } from '../types';
import { ExternalRedirectModal } from './ExternalRedirectModal';
import { JobReportModal } from './JobReportModal';
import { matchStudentProfile } from '../lib/aiEngine';
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
  RefreshCw,
  X,
  Bookmark,
  BookmarkCheck,
  ShieldAlert,
  Flag,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  Building2,
  Calendar,
  CheckCircle2,
  Zap
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

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<'ALL' | 'KENYA' | 'GLOBAL'>('ALL');
  const [remoteTypeFilter, setRemoteTypeFilter] = useState<'ALL' | RemoteType>('ALL');
  const [employmentFilter, setEmploymentFilter] = useState<'ALL' | EmploymentType>('ALL');
  const [expFilter, setExpFilter] = useState<'ALL' | ExperienceLevel>('ALL');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Modals State
  const [activeGigModal, setActiveGigModal] = useState<Gig | null>(null);
  const [redirectModalGig, setRedirectModalGig] = useState<Gig | null>(null);
  const [reportingGig, setReportingGig] = useState<Gig | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleSyncSources = async () => {
    try {
      const result = await store.runLiveIngestionSync();
      setSyncFeedback(`Ingestion sync complete! Synced ${result.sourcesSynced.length} sources, added ${result.newGigsAdded} new opportunities.`);
      setTimeout(() => setSyncFeedback(null), 5000);
    } catch {
      setSyncFeedback('Source sync encountered a temporary network delay.');
      setTimeout(() => setSyncFeedback(null), 4000);
    }
  };

  const categories: { label: string; value: string; count: number }[] = [
    { label: 'All Opportunities', value: 'ALL', count: store.gigs.length },
    { label: 'AI Annotation & RLHF', value: 'AI Annotation', count: store.gigs.filter(g => g.category === 'AI Annotation').length },
    { label: 'Global Remote', value: 'Global Remote', count: store.gigs.filter(g => g.category === 'Global Remote').length },
    { label: 'Kenyan Remote', value: 'Kenyan Remote', count: store.gigs.filter(g => g.category === 'Kenyan Remote').length },
    { label: 'Tech & Design', value: 'Tech & Design', count: store.gigs.filter(g => g.category === 'Tech & Design').length },
    { label: 'Attachments & Internships', value: 'Attachment & Internship', count: store.gigs.filter(g => g.category === 'Attachment & Internship').length },
    { label: 'Campus Escrow Bounties', value: 'INTERNAL_ESCROW', count: store.gigs.filter(g => g.originType === 'INTERNAL_ESCROW').length },
  ];

  const filteredGigs = store.gigs
    .filter((gig) => {
      // 1. Text Search
      const matchesSearch = 
        gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (gig.platformName && gig.platformName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (gig.companyName && gig.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        gig.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. Category
      let matchesCategory = true;
      if (selectedCategory === 'INTERNAL_ESCROW') {
        matchesCategory = gig.originType === 'INTERNAL_ESCROW';
      } else if (selectedCategory !== 'ALL') {
        matchesCategory = gig.category === selectedCategory;
      }

      // 3. Device
      const matchesDevice = deviceFilter === 'ALL' || gig.deviceRequirement === deviceFilter;

      // 4. Location Filter
      let matchesLocation = true;
      if (locationFilter === 'KENYA') {
        matchesLocation = gig.category === 'Kenyan Remote' || gig.isKenyaEligible === true || Boolean(gig.location?.toLowerCase().includes('kenya'));
      } else if (locationFilter === 'GLOBAL') {
        matchesLocation = gig.category === 'Global Remote' || gig.category === 'AI Annotation';
      }

      // 5. Remote Type
      const matchesRemote = remoteTypeFilter === 'ALL' || gig.remoteType === remoteTypeFilter;

      // 6. Employment Type
      const matchesEmployment = employmentFilter === 'ALL' || gig.employmentType === employmentFilter;

      // 7. Experience Level
      const matchesExp = expFilter === 'ALL' || gig.experienceLevel === expFilter;

      return matchesSearch && matchesCategory && matchesDevice && matchesLocation && matchesRemote && matchesEmployment && matchesExp;
    })
    .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));

  const handleApplyClick = (e: React.MouseEvent, gig: Gig) => {
    e.stopPropagation();
    if (gig.externalApplyUrl) {
      setRedirectModalGig(gig);
    } else {
      setActiveGigModal(gig);
    }
  };

  return (
    <div className="space-y-3.5 animate-fade-in">
      {/* Top Banner: Ingestion Engine Status & Sync */}
      <div className={`rounded-2xl p-3.5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
        isLight 
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-emerald-200' 
          : 'bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border-emerald-800/40'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold">Aggregated Opportunity Stream</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
                5 Sources Connected
              </span>
            </div>
            <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Indexed from Fuzu, BrighterMonday, RemoteOK, WeWorkRemotely, and global AI evaluation labs.
            </p>
          </div>
        </div>

        <button
          onClick={handleSyncSources}
          disabled={store.isSyncingIngestion}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${store.isSyncingIngestion ? 'animate-spin' : ''}`} />
          <span>{store.isSyncingIngestion ? 'Ingesting Feeds...' : 'Sync Live Sources'}</span>
        </button>
      </div>

      {syncFeedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Search and Category Pill Bar */}
      <div className={`p-3 rounded-2xl border space-y-2.5 ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
      }`}>
        {/* Search row with filter toggle */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role, company, skill (e.g. Python, Sheng, Data)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border transition-colors ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-slate-100'
              }`}
            />
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              showAdvancedFilters || locationFilter !== 'ALL' || remoteTypeFilter !== 'ALL' || employmentFilter !== 'ALL' || expFilter !== 'ALL'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.value
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat.value ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {showAdvancedFilters && (
          <div className={`p-3 rounded-xl border grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs pt-2.5 animate-fade-in ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Geographic Region</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value as any)}
                className={`w-full p-1.5 rounded-lg border text-xs ${
                  isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
                }`}
              >
                <option value="ALL">All Regions (Worldwide & Kenya)</option>
                <option value="KENYA">🇰🇪 Kenya Eligible</option>
                <option value="GLOBAL">🌍 Global Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Work Arrangement</label>
              <select
                value={remoteTypeFilter}
                onChange={(e) => setRemoteTypeFilter(e.target.value as any)}
                className={`w-full p-1.5 rounded-lg border text-xs ${
                  isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
                }`}
              >
                <option value="ALL">All Arrangements</option>
                <option value="REMOTE">Fully Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ON_SITE">On-Site</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Employment Type</label>
              <select
                value={employmentFilter}
                onChange={(e) => setEmploymentFilter(e.target.value as any)}
                className={`w-full p-1.5 rounded-lg border text-xs ${
                  isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
                }`}
              >
                <option value="ALL">All Job Types</option>
                <option value="MICROTASK">AI Microtask & Annotation</option>
                <option value="FREELANCE">Freelance Project</option>
                <option value="INTERNSHIP">Internship / Attachment</option>
                <option value="PART_TIME">Part-Time Student Role</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Experience Level</label>
              <select
                value={expFilter}
                onChange={(e) => setExpFilter(e.target.value as any)}
                className={`w-full p-1.5 rounded-lg border text-xs ${
                  isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
                }`}
              >
                <option value="ALL">All Experience Levels</option>
                <option value="BEGINNER">Beginner / Student Friendly</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count & Match Status */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
        <span>Showing {filteredGigs.length} aggregated opportunities</span>
        <span className="text-[11px] text-emerald-600 font-bold">
          {store.user.profile?.skills?.length || 0} skills active in your matching profile
        </span>
      </div>

      {/* Gigs Feed Grid */}
      {filteredGigs.length === 0 ? (
        <div className={`p-10 rounded-2xl border text-center space-y-2 ${
          isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-900 border-slate-800 text-slate-400'
        }`}>
          <Briefcase className="w-8 h-8 mx-auto text-slate-400 opacity-60" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">No opportunities match the current criteria</h3>
          <p className="text-xs max-w-sm mx-auto">
            Try resetting filters or search terms, or click "Sync Live Sources" to ingest new postings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredGigs.map((gig) => {
            const isSaved = store.isGigSaved(gig.id);
            const matchScore = matchStudentProfile(store.user.profile, gig);
            const scamSignals = gig.scamRiskSignals || [];

            return (
              <div
                key={gig.id}
                onClick={() => setActiveGigModal(gig)}
                className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all cursor-pointer ${
                  isLight 
                    ? 'bg-white border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md' 
                    : 'bg-slate-900 border-slate-800 hover:border-emerald-600/70 hover:shadow-lg hover:shadow-emerald-950/20'
                }`}
              >
                {/* Header: Badges and Source */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {gig.verificationStatus === 'VERIFIED_BY_CAMPUSHUSTLE' ? (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified Portal</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                          Found on CampusHustle
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-purple-500/10 text-purple-600 font-bold border border-purple-500/20">
                        {matchScore.matchPercentage}% Match
                      </span>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => store.toggleSaveGig(gig.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSaved ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                        title={isSaved ? 'Remove bookmark' : 'Bookmark job'}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => setReportingGig(gig)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                        title="Report listing"
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title and Company */}
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base leading-snug line-clamp-2">
                      {gig.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{gig.companyName || gig.platformName}</span>
                      <span>•</span>
                      <span>{gig.location || 'Remote'}</span>
                      <span>•</span>
                      <span className="text-[10px]">{formatLaunchTime(gig.publishedAt || gig.createdAt)}</span>
                    </div>
                  </div>

                  {/* Scam Risk Alert if flagged */}
                  {scamSignals.length > 0 && (
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 text-[11px] flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">Risk Warning: {scamSignals[0]}</span>
                    </div>
                  )}

                  {/* Brief description */}
                  <p className={`text-xs line-clamp-2 leading-relaxed ${
                    isLight ? 'text-slate-600' : 'text-slate-300'
                  }`}>
                    {gig.description}
                  </p>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {gig.skills.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className={`text-[10px] px-2 py-0.5 rounded-lg font-mono ${
                          store.user.profile?.skills?.includes(s)
                            ? 'bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/30'
                            : isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: Compensation & Apply Button */}
                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-base font-extrabold text-emerald-600 font-mono">
                      ${gig.rewardUsd} USD
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      ~KSh {(gig.rewardKes || gig.rewardUsd * 130).toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleApplyClick(e, gig)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <span>Apply via Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Details Modal (Rich 4-Bullet Summaries & In-Depth Verification) */}
      {activeGigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <div className={`px-5 py-4 border-b flex items-center justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider block">
                  {activeGigModal.category}
                </span>
                <h3 className="text-base font-extrabold truncate max-w-md">{activeGigModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveGigModal(null)}
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Compensation Header */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Offering Compensation</span>
                  <div className="text-xl font-extrabold text-emerald-600 font-mono">
                    ${activeGigModal.rewardUsd} USD <span className="text-xs text-slate-500 font-normal">(~KSh {(activeGigModal.rewardKes || activeGigModal.rewardUsd * 130).toLocaleString()})</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-emerald-600/10 text-emerald-600 font-bold border border-emerald-600/20">
                  {activeGigModal.platformName || 'Direct Portal'}
                </span>
              </div>

              {/* 4-Point AI Summary */}
              {activeGigModal.summaryBullets && activeGigModal.summaryBullets.length > 0 && (
                <div className={`p-3.5 rounded-xl border space-y-2 ${
                  isLight ? 'bg-purple-50/50 border-purple-200 text-purple-950' : 'bg-purple-950/20 border-purple-800 text-purple-200'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-purple-600 dark:text-purple-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Executive 4-Point Brief</span>
                  </div>
                  <ul className="space-y-1 pl-2 text-[11px] list-disc list-inside">
                    {activeGigModal.summaryBullets.map((b, idx) => (
                      <li key={idx} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                  Full Opportunity Description
                </span>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  {activeGigModal.description}
                </p>
              </div>

              {/* Qualification Guidelines */}
              {activeGigModal.qualificationGuide && (
                <div className={`p-3 rounded-xl border space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block">
                    Screening & Benchmark Guidelines
                  </span>
                  <p className="text-xs">{activeGigModal.qualificationGuide}</p>
                </div>
              )}

              {/* Skills */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                  Required Competencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeGigModal.skills.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`px-5 py-3.5 border-t flex items-center justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                onClick={() => {
                  store.toggleSaveGig(activeGigModal.id);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer ${
                  store.isGigSaved(activeGigModal.id) ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' : 'border-slate-300'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{store.isGigSaved(activeGigModal.id) ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={() => {
                  const target = activeGigModal;
                  setActiveGigModal(null);
                  if (target.externalApplyUrl) {
                    setRedirectModalGig(target);
                  }
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Proceed to Apply Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <ExternalRedirectModal
        isOpen={Boolean(redirectModalGig)}
        gig={redirectModalGig}
        onClose={() => setRedirectModalGig(null)}
      />

      <JobReportModal
        isOpen={Boolean(reportingGig)}
        gig={reportingGig}
        onClose={() => setReportingGig(null)}
      />
    </div>
  );
};
