'use client';

import React, { useState } from 'react';
import { Gig, JobReport } from '../types';
import { useCampusStore } from '../lib/store';
import { ShieldAlert, Check, X } from 'lucide-react';

interface JobReportModalProps {
  gig: Gig | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobReportModal: React.FC<JobReportModalProps> = ({ gig, isOpen, onClose }) => {
  const store = useCampusStore();
  const isLight = store.theme === 'light';

  const [reason, setReason] = useState<JobReport['reason']>('SCAM_OR_FEE_REQUEST');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !gig) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addJobReport({
      gigId: gig.id,
      jobTitle: gig.title,
      reporterId: store.user.id,
      reason,
      details,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isLight ? 'bg-rose-50 border-rose-100' : 'bg-rose-950/30 border-rose-900/40'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-rose-700 dark:text-rose-400">Report Listing</h3>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Help protect student job seekers by reporting policy violations.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-2 text-emerald-600">
            <Check className="w-8 h-8 mx-auto" />
            <h4 className="font-extrabold text-sm">Report Submitted</h4>
            <p className="text-xs text-slate-500">Thank you. Our automated trust filters and moderators will review this listing.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
            <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Listing</span>
              <span className="font-bold block truncate">{gig.title}</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1">Reason for report</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as JobReport['reason'])}
                className={`w-full p-2 rounded-xl border text-xs ${
                  isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-700'
                }`}
              >
                <option value="SCAM_OR_FEE_REQUEST">Asks for money / registration fee (Scam)</option>
                <option value="EXPIRED_LINK">Link is dead or job is closed</option>
                <option value="MISLEADING_INFO">Misleading or false compensation claims</option>
                <option value="WRONG_CATEGORY">Incorrect categorization</option>
                <option value="OTHER">Other security violation</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1">Additional details (optional)</label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what went wrong when you visited this opportunity..."
                className={`w-full p-2 rounded-xl border text-xs ${
                  isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-700'
                }`}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold border cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
