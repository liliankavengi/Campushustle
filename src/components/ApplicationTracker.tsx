'use client';

import React, { useState } from 'react';
import { useCampusStore } from '../lib/store';
import { ExternalApplication, ApplicationStatus } from '../types';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Sparkles, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Save, 
  Calendar,
  AlertCircle,
  FileText,
  DollarSign
} from 'lucide-react';

export const ApplicationTracker: React.FC = () => {
  const store = useCampusStore();
  const isLight = store.theme === 'light';
  const applications = store.applications;

  const [activeFilter, setActiveFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState('');

  // New Custom Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newRewardUsd, setNewRewardUsd] = useState(150);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('APPLIED');
  const [newNotes, setNewNotes] = useState('');

  const statusConfigs: Record<ApplicationStatus, { label: string; color: string; badge: string; icon: any }> = {
    PREPARING: { label: 'Preparing', color: 'text-amber-500', badge: 'bg-amber-500/10 text-amber-600 border-amber-500/30', icon: Clock },
    APPLIED: { label: 'Applied', color: 'text-blue-500', badge: 'bg-blue-500/10 text-blue-600 border-blue-500/30', icon: FileText },
    INTERVIEWING: { label: 'Interviewing / Assessment', color: 'text-purple-500', badge: 'bg-purple-500/10 text-purple-600 border-purple-500/30', icon: Sparkles },
    ACCEPTED: { label: 'Offer / Active Batch', color: 'text-emerald-500', badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30', icon: CheckCircle2 },
    REJECTED: { label: 'Closed / Rejected', color: 'text-slate-400', badge: 'bg-slate-500/10 text-slate-400 border-slate-500/30', icon: XCircle },
  };

  const filteredApps = applications.filter((app) => activeFilter === 'ALL' || app.status === activeFilter);

  // Metrics
  const totalApplied = applications.length;
  const inProgress = applications.filter((a) => a.status === 'APPLIED' || a.status === 'INTERVIEWING').length;
  const acceptedOffers = applications.filter((a) => a.status === 'ACCEPTED').length;
  const totalPipelineUsd = applications
    .filter((a) => a.status !== 'REJECTED')
    .reduce((acc, a) => acc + (a.rewardUsd || 0), 0);

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    store.addExternalApplication({
      jobTitle: newTitle,
      companyName: newCompany || 'Direct Employer',
      platformName: newPlatform || 'External Portal',
      externalUrl: newUrl,
      status: newStatus,
      rewardUsd: Number(newRewardUsd),
      rewardKes: Number(newRewardUsd) * 130,
      notes: newNotes,
    });

    setNewTitle('');
    setNewCompany('');
    setNewPlatform('');
    setNewUrl('');
    setNewNotes('');
    setIsAddingCustom(false);
  };

  const handleStartEdit = (app: ExternalApplication) => {
    setEditingAppId(app.id);
    setEditingNotes(app.notes || '');
  };

  const handleSaveNotes = (appId: string) => {
    store.updateExternalApplication(appId, { notes: editingNotes });
    setEditingAppId(null);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Banner & Stats */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-600/10 text-emerald-600">
              <Briefcase className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold">External Application Tracker</h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Track your submissions, interview milestones, and follow-ups across multiple portals.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAddingCustom(!isAddingCustom)}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Application</span>
        </button>
      </div>

      {/* 4-Card Funnel Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Logged</span>
          <div className="text-lg sm:text-xl font-extrabold mt-0.5">{totalApplied}</div>
          <span className="text-[10px] text-slate-400">All submissions</span>
        </div>

        <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <span className="text-[10px] uppercase font-bold text-blue-500 block">In Review / Test</span>
          <div className="text-lg sm:text-xl font-extrabold text-blue-600 mt-0.5">{inProgress}</div>
          <span className="text-[10px] text-slate-400">Active pipelines</span>
        </div>

        <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <span className="text-[10px] uppercase font-bold text-emerald-500 block">Accepted Offers</span>
          <div className="text-lg sm:text-xl font-extrabold text-emerald-600 mt-0.5">{acceptedOffers}</div>
          <span className="text-[10px] text-slate-400">Ready to earn</span>
        </div>

        <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <span className="text-[10px] uppercase font-bold text-purple-500 block">Pipeline Potential</span>
          <div className="text-lg sm:text-xl font-extrabold text-purple-600 mt-0.5">${totalPipelineUsd} USD</div>
          <span className="text-[10px] text-slate-400">~KSh {(totalPipelineUsd * 130).toLocaleString()}</span>
        </div>
      </div>

      {/* New Application Form (Collapsible) */}
      {isAddingCustom && (
        <form onSubmit={handleCreateCustom} className={`p-4 rounded-2xl border space-y-3 transition-colors ${
          isLight ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-900/90 border-emerald-900/50'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-emerald-600 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Record Manual External Submission</span>
            </span>
            <button
              type="button"
              onClick={() => setIsAddingCustom(false)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div>
              <label className="block text-[11px] font-semibold mb-1">Job Title</label>
              <input
                type="text"
                required
                placeholder="e.g. AI Prompt Evaluator"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className={`w-full p-2 rounded-xl border text-xs ${
                  isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-700'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1">Company / Platform</label>
              <input
                type="text"
                placeholder="e.g. Alignerr, Outlier, Fuzu"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className={`w-full p-2 rounded-xl border text-xs ${
                  isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-700'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                className={`w-full p-2 rounded-xl border text-xs ${
                  isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-700'
                }`}
              >
                <option value="PREPARING">Preparing</option>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEWING">Interviewing / Test</option>
                <option value="ACCEPTED">Accepted / Working</option>
                <option value="REJECTED">Closed / Rejected</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold mb-1">Application URL (optional)</label>
              <input
                type="url"
                placeholder="https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className={`w-full p-2 rounded-xl border text-xs ${
                  isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-700'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1">Estimated Payout (USD $)</label>
              <input
                type="number"
                value={newRewardUsd}
                onChange={(e) => setNewRewardUsd(Number(e.target.value))}
                className={`w-full p-2 rounded-xl border text-xs ${
                  isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-700'
                }`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
            >
              Save to Tracker
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b pb-2 border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
            activeFilter === 'ALL'
              ? 'bg-emerald-600 text-white'
              : isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          All ({applications.length})
        </button>

        {(Object.keys(statusConfigs) as ApplicationStatus[]).map((st) => {
          const count = applications.filter((a) => a.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setActiveFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                activeFilter === st
                  ? 'bg-emerald-600 text-white'
                  : isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {statusConfigs[st].label} ({count})
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className={`p-8 rounded-2xl border text-center space-y-2 ${
          isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-900 border-slate-800 text-slate-400'
        }`}>
          <Briefcase className="w-8 h-8 mx-auto text-slate-400 opacity-60" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">No applications recorded in this stage</h3>
          <p className="text-xs max-w-sm mx-auto">
            Click "Apply" on any feed gig to automatically add it here, or use "Log New Application".
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredApps.map((app) => {
            const config = statusConfigs[app.status] || statusConfigs.APPLIED;
            const IconComponent = config.icon;
            const isEditing = editingAppId === app.id;

            return (
              <div
                key={app.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                  isLight ? 'bg-white border-slate-200 shadow-xs hover:border-slate-300' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border flex items-center gap-1 ${config.badge}`}>
                        <IconComponent className="w-3 h-3" />
                        <span>{config.label}</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Logged on {new Date(app.appliedDate).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm sm:text-base">{app.jobTitle}</h3>

                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span>{app.companyName || app.platformName}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-bold font-mono">
                        ${app.rewardUsd || 0} USD (~KSh {((app.rewardUsd || 0) * 130).toLocaleString()})
                      </span>
                    </div>
                  </div>

                  {/* Status Change Selector & Actions */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <select
                      value={app.status}
                      onChange={(e) => store.updateExternalApplication(app.id, { status: e.target.value as ApplicationStatus })}
                      className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                        isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-slate-800 border-slate-700 text-white'
                      }`}
                    >
                      <option value="PREPARING">Status: Preparing</option>
                      <option value="APPLIED">Status: Applied</option>
                      <option value="INTERVIEWING">Status: Interviewing</option>
                      <option value="ACCEPTED">Status: Accepted</option>
                      <option value="REJECTED">Status: Rejected</option>
                    </select>

                    {app.externalUrl && (
                      <a
                        href={app.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                          isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 border-slate-700'
                        }`}
                        title="Open external portal"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                      </a>
                    )}

                    <button
                      onClick={() => store.deleteExternalApplication(app.id)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Remove from tracker"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Notes & Follow-up row */}
                <div className={`mt-3 pt-2.5 border-t text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  isLight ? 'border-slate-100 text-slate-600' : 'border-slate-800 text-slate-400'
                }`}>
                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                        placeholder="Add preparation notes or interview date..."
                        className={`flex-1 p-1.5 rounded-lg border text-xs ${
                          isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-700'
                        }`}
                      />
                      <button
                        onClick={() => handleSaveNotes(app.id)}
                        className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="italic">{app.notes || 'No notes added yet.'}</span>
                      <button
                        onClick={() => handleStartEdit(app)}
                        className="text-[10px] text-emerald-600 font-bold hover:underline cursor-pointer"
                      >
                        Edit Notes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
