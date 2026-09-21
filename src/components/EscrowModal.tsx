'use client';

import React, { useState } from 'react';
import { useCampusStore } from '../lib/store';
import { GigCategory, DeviceRequirement, CampusName } from '../types';
import { 
  ShieldCheck, 
  X, 
  Sparkles, 
  Smartphone, 
  Laptop, 
  Lock,
  CheckCircle2,
  AlertCircle,
  Zap,
  Info
} from 'lucide-react';

interface EscrowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EscrowModal: React.FC<EscrowModalProps> = ({ isOpen, onClose }) => {
  const store = useCampusStore();
  const isLight = store.theme === 'light';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GigCategory>('Campus Task');
  const [rewardKes, setRewardKes] = useState('1500');
  const [deviceRequirement, setDeviceRequirement] = useState<DeviceRequirement>('SMARTPHONE_OK');
  const [skillsText, setSkillsText] = useState('Research, Proofreading');
  const [deadline, setDeadline] = useState('Within 48 hours');
  const [isFeatured, setIsFeatured] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'FORM' | 'ESCROW_LOCKING' | 'SUCCESS'>('FORM');
  const [mpesaReceipt, setMpesaReceipt] = useState('');

  if (!isOpen) return null;

  // Escrow Calculations
  const rawKes = Math.max(100, Number(rewardKes) || 0);
  const platformFeeKes = Math.round(rawKes * 0.05); // 5% platform commission
  const featuredFeeKes = isFeatured ? 250 : 0; // KSh 250 featured boost
  const totalPayableKes = rawKes + platformFeeKes + featuredFeeKes;
  const usdAmount = Math.max(1, Math.round(rawKes / 130));

  const handlePostEscrowGig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !rewardKes) return;

    setIsProcessing(true);
    setStep('ESCROW_LOCKING');

    setTimeout(() => {
      const receipt = `ESC${Math.floor(10000000 + Math.random() * 90000000)}KE`;
      setMpesaReceipt(receipt);

      const parsedSkills = skillsText.split(',').map((s) => s.trim()).filter(Boolean);

      store.addGig({
        posterId: store.user.id,
        posterName: `${store.user.fullName} (${store.user.campus})`,
        posterPhone: store.user.phoneNumber || '254715516715',
        title,
        description,
        category,
        rewardUsd: usdAmount,
        rewardKes: rawKes,
        escrowStatus: 'HELD',
        originType: 'INTERNAL_ESCROW',
        campus: store.user.campus,
        deviceRequirement,
        skills: parsedSkills.length > 0 ? parsedSkills : ['General Campus Skill'],
        deadline,
        isFeatured,
      });

      setIsProcessing(false);
      setStep('SUCCESS');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className={`relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Post Task with M-Pesa Escrow Protection
              </h3>
              <p className="text-[11px] text-emerald-100">
                Safe campus escrow — funds released only when work is approved
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          {step === 'FORM' && (
            <form onSubmit={handlePostEscrowGig} className="space-y-3.5">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Task Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Physics Lab KaTeX Transcription & Graphs"
                  required
                  className={`w-full px-3 py-2 border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Task Description & Requirements
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the deliverables, formatting rules, and deadline..."
                  rows={2}
                  required
                  className={`w-full px-3 py-2 border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GigCategory)}
                    className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-emerald-500 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  >
                    <option value="Campus Task">Campus Task</option>
                    <option value="Tech & Design">Tech & Design</option>
                    <option value="Tutoring">Tutoring</option>
                    <option value="AI Annotation">AI Annotation</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Worker Bounty (KSh)
                  </label>
                  <input
                    type="number"
                    value={rewardKes}
                    onChange={(e) => setRewardKes(e.target.value)}
                    placeholder="1500"
                    required
                    min="100"
                    className={`w-full px-3 py-2 border rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Required Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="e.g. Python, KaTeX, Proofreading"
                  className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-emerald-500 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>

              {/* Feature Boost Option (Revenue Stream 2) */}
              <div 
                onClick={() => setIsFeatured(!isFeatured)}
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  isFeatured
                    ? isLight ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400' : 'bg-amber-950/20 border-amber-600 ring-1 ring-amber-500/50'
                    : isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-slate-950 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>⚡ Boost to Featured Listing (+KSh 250)</span>
                    </span>
                    <span className="font-bold text-amber-600 font-mono">+$1.90</span>
                  </div>
                  <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Pins your task to the top with a distinct badge. Gets 5x faster applications from top students.
                  </p>
                </div>
              </div>

              {/* Escrow 5% Fee Breakdown Box (Revenue Stream 1) */}
              <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Student Bounty to Worker:</span>
                  <span className="font-bold">KSh {rawKes.toLocaleString()} (~${usdAmount})</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className={`flex items-center gap-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    <span>CampusHustle Escrow Protection (5%):</span>
                    <Info className="w-3 h-3 text-emerald-600" />
                  </span>
                  <span className="font-bold text-emerald-600">KSh {platformFeeKes.toLocaleString()}</span>
                </div>
                {isFeatured && (
                  <div className="flex items-center justify-between text-[11px] text-amber-600 font-bold">
                    <span>⚡ Featured Listing Boost:</span>
                    <span>KSh 250</span>
                  </div>
                )}
                <div className="flex items-center justify-between font-bold pt-1.5 border-t border-slate-200 dark:border-slate-800 text-sm">
                  <span>Total Payable via M-Pesa:</span>
                  <span className="text-emerald-600 font-extrabold text-base">
                    KSh {totalPayableKes.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Lock KSh {totalPayableKes.toLocaleString()} in Escrow & Post Live</span>
              </button>
            </form>
          )}

          {step === 'ESCROW_LOCKING' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <h4 className="text-sm font-bold">Locking Bounty in Daraja Escrow Till</h4>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Holding KSh {totalPayableKes.toLocaleString()} securely. Funds will only be released when you approve completed deliverables.
              </p>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="py-4 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="text-base font-black">Task Live & Escrow Secured</h4>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Escrow Receipt: <strong className="font-mono text-emerald-600">{mpesaReceipt}</strong>. Your gig is now live on the student opportunities board{isFeatured ? ' and featured at the top' : ''}!
              </p>
              <button
                onClick={() => {
                  setStep('FORM');
                  onClose();
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                View Live on Opportunities Feed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
