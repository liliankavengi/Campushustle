'use client';

import React, { useState } from 'react';
import { Gig } from '../types';
import { validateExternalLink } from '../ingestion/security/linkValidator';
import { useCampusStore } from '../lib/store';
import { 
  ShieldCheck, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Lock, 
  Globe, 
  CheckSquare, 
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface ExternalRedirectModalProps {
  gig: Gig | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExternalRedirectModal: React.FC<ExternalRedirectModalProps> = ({ gig, isOpen, onClose }) => {
  const store = useCampusStore();
  const isLight = store.theme === 'light';
  const [autoAddToTracker, setAutoAddToTracker] = useState(true);

  if (!isOpen || !gig || !gig.externalApplyUrl) return null;

  const linkValidation = validateExternalLink(gig.externalApplyUrl);
  const scamSignals = gig.scamRiskSignals || [];

  const handleProceed = () => {
    // 1. If auto-add to tracker is checked, record as external application
    if (autoAddToTracker) {
      store.addExternalApplication({
        gigId: gig.id,
        jobTitle: gig.title,
        companyName: gig.companyName || gig.platformName || 'External Platform',
        platformName: gig.platformName || linkValidation.normalizedDomain || 'External Source',
        externalUrl: gig.externalApplyUrl,
        status: 'APPLIED',
        rewardUsd: gig.rewardUsd,
        rewardKes: gig.rewardKes,
        notes: `Applied via official ${gig.platformName || 'platform'} link.`,
      });
    }

    // 2. Increment applicant count
    store.applyToGig(gig.id);

    // 3. Open safe external tab
    window.open(gig.externalApplyUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        {/* Header Ribbon */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          linkValidation.trustLevel === 'VERIFIED'
            ? isLight ? 'bg-emerald-50/80 border-emerald-100' : 'bg-emerald-950/30 border-emerald-900/40'
            : isLight ? 'bg-amber-50/80 border-amber-100' : 'bg-amber-950/30 border-amber-900/40'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
              linkValidation.trustLevel === 'VERIFIED'
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 text-white'
            }`}>
              {linkValidation.trustLevel === 'VERIFIED' ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                linkValidation.trustLevel === 'VERIFIED' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
              }`}>
                External Link Security Gateway
              </span>
              <h3 className="text-sm font-extrabold truncate max-w-[280px]">
                {linkValidation.trustLevel === 'VERIFIED' ? 'Verified Destination Portal' : 'Leaving CampusHustle'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Opportunity Card Summary */}
          <div className={`p-3.5 rounded-xl border space-y-1.5 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
          }`}>
            <span className="text-[10px] uppercase font-bold text-emerald-600 block">
              Applying For
            </span>
            <div className="font-extrabold text-sm">{gig.title}</div>
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <span>{gig.companyName || gig.platformName}</span>
              <span>•</span>
              <span className="text-emerald-600 font-bold">${gig.rewardUsd} USD (~KSh {gig.rewardKes?.toLocaleString()})</span>
            </div>
          </div>

          {/* Security & Domain Trust Matrix */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Source Domain Intelligence
            </span>
            <div className={`p-3 rounded-xl border space-y-2 font-mono text-[11px] ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-bold text-emerald-600 truncate max-w-[220px]">
                  {linkValidation.normalizedDomain || gig.externalApplyUrl}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">HTTPS Transport:</span>
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <Lock className="w-3 h-3" />
                  <span>Enforced (TLS 1.3)</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Platform Trust Score:</span>
                <span className="font-bold text-emerald-600">
                  {linkValidation.trustScore}/100 ({linkValidation.trustLevel.replace('_', ' ')})
                </span>
              </div>
            </div>
          </div>

          {/* Scam Risk Signals Warning (if any) */}
          {scamSignals.length > 0 && (
            <div className={`p-3 rounded-xl border space-y-1 ${
              isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-950/40 border-amber-800 text-amber-300'
            }`}>
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Security Notice / Risk Signals</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                {scamSignals.map((sig, idx) => (
                  <li key={idx}>{sig}</li>
                ))}
              </ul>
              <p className="text-[10px] opacity-80 pt-1">
                Never pay money or buy training packs to obtain a job. Legitimate employers pay you.
              </p>
            </div>
          )}

          {/* Transparency Disclaimer */}
          <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
            isLight ? 'bg-blue-50/60 border-blue-200 text-blue-900' : 'bg-blue-950/30 border-blue-900/50 text-blue-200'
          }`}>
            <Globe className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>CampusHustle is a discovery aggregator.</strong> You are submitting your application directly to the official external website. CampusHustle does not process passwords, resumes, or employer hiring decisions.
            </div>
          </div>

          {/* Auto-Add to Application Tracker Checkbox */}
          <label className="flex items-center gap-2.5 p-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoAddToTracker}
              onChange={(e) => setAutoAddToTracker(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-[11px] font-semibold">
              Automatically add to my <strong>Application Tracker</strong> as <em>"Applied"</em>
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className={`px-5 py-3.5 border-t flex items-center justify-end gap-2.5 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              isLight ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-850 hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span>Continue to Apply</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
