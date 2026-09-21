'use client';

import React from 'react';
import { useCampusStore } from '../lib/store';
import { Gig } from '../types';
import { Bookmark, BookmarkX, ExternalLink, ArrowRight, Briefcase, MapPin, Zap } from 'lucide-react';

interface SavedGigsViewProps {
  onOpenGigModal: (gig: Gig) => void;
  onApplyExternal: (gig: Gig) => void;
}

export const SavedGigsView: React.FC<SavedGigsViewProps> = ({ onOpenGigModal, onApplyExternal }) => {
  const store = useCampusStore();
  const isLight = store.theme === 'light';
  const savedGigs = store.getSavedGigsList();

  return (
    <div className="space-y-4 animate-fade-in">
      <div className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <Bookmark className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold">Saved Opportunities</h2>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Review bookmarked jobs and apply before deadlines expire.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-600/10 text-emerald-600 border border-emerald-600/20">
          {savedGigs.length} Bookmarked
        </span>
      </div>

      {savedGigs.length === 0 ? (
        <div className={`p-10 rounded-2xl border text-center space-y-2 ${
          isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-900 border-slate-800 text-slate-400'
        }`}>
          <Bookmark className="w-8 h-8 mx-auto text-slate-400 opacity-50" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">No saved opportunities yet</h3>
          <p className="text-xs max-w-sm mx-auto">
            Click the bookmark icon on any job card in the feed to save it for later review.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {savedGigs.map((gig) => (
            <div
              key={gig.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                isLight ? 'bg-white border-slate-200 shadow-xs hover:border-slate-300' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                      {gig.category}
                    </span>
                    <h3 className="font-extrabold text-sm line-clamp-1">{gig.title}</h3>
                    <div className="text-xs text-slate-500">{gig.companyName || gig.platformName}</div>
                  </div>

                  <button
                    onClick={() => store.toggleSaveGig(gig.id)}
                    className="p-1.5 text-amber-500 hover:text-rose-500 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    title="Remove bookmark"
                  >
                    <BookmarkX className="w-4 h-4" />
                  </button>
                </div>

                <p className={`text-xs line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {gig.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {gig.skills.slice(0, 3).map((s) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-extrabold text-emerald-600">
                    ${gig.rewardUsd} USD
                  </div>
                  <div className="text-[10px] text-slate-400">
                    ~KSh {(gig.rewardKes || gig.rewardUsd * 130).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenGigModal(gig)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300' : 'bg-slate-800 hover:bg-slate-750 border-slate-700'
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onApplyExternal(gig)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                  >
                    <span>Apply</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
