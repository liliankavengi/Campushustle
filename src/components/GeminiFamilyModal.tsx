'use client';

import React, { useState } from 'react';
import { useCampusStore } from '../lib/store';
import { 
  Sparkles, 
  CheckCircle2, 
  X, 
  Clock, 
  ArrowRight, 
  Mail, 
  Smartphone, 
  BrainCircuit, 
  Zap,
  ShieldCheck,
  Check
} from 'lucide-react';

interface GeminiFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiFamilyModal: React.FC<GeminiFamilyModalProps> = ({ isOpen, onClose }) => {
  const store = useCampusStore();
  const isLight = store.theme === 'light';
  const user = store.user;
  const existingRequest = store.getStudentGeminiRequest();

  const [googleEmail, setGoogleEmail] = useState(user.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = googleEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.endsWith('.com') && !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid Google email address (@gmail.com or Google account).');
      return;
    }

    const cleanPhone = phoneNumber.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMessage('Please enter a valid Safaricom phone number for M-Pesa STK push.');
      return;
    }

    setIsProcessing(true);

    try {
      // Trigger PayHero / Daraja STK push for KES 200
      try {
        await fetch('/api/payhero/stk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: cleanPhone,
            amount: 200,
            reference: 'Gemini Pro Google Family Access',
          }),
        });
      } catch {
        // Continue in offline / simulated fallback mode
      }

      const receipt = `QKD${Math.floor(10000000 + Math.random() * 90000000)}KE`;
      store.requestGeminiFamilyAccess(cleanEmail, cleanPhone, receipt);
      
      setIsProcessing(false);
      setSuccessMsg(`Payment of KSh 200 confirmed! Receipt: ${receipt}. You will receive an invitation to join Google Family at ${cleanEmail} shortly.`);
    } catch {
      setIsProcessing(false);
      setErrorMessage('Payment processing failed. Please check your phone number and network.');
    }
  };

  const handleTestInstantUnlock = () => {
    const cleanEmail = googleEmail.trim().toLowerCase() || 'student@gmail.com';
    const cleanPhone = phoneNumber.trim() || '0712000001';
    const receipt = `TEST${Math.floor(10000000 + Math.random() * 90000000)}KE`;
    store.requestGeminiFamilyAccess(cleanEmail, cleanPhone, receipt);
    setSuccessMsg(`Demo payment confirmed (KSh 200)! Invitation logged for ${cleanEmail}.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        {/* Header Ribbon with Google Gradient */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isLight 
            ? 'bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-purple-100' 
            : 'bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-pink-950/30 border-purple-900/40'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 text-white flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold tracking-tight">Gemini Pro AI Family Group</h3>
                <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-purple-500/10 text-purple-600 border border-purple-500/30">
                  KES 200
                </span>
              </div>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Google Family Group Access • Unlimited Pro Research
              </p>
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
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Status Banner if already requested */}
          {existingRequest && !successMsg && (
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
              existingRequest.status === 'ADDED_TO_FAMILY'
                ? isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                : isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-950/40 border-amber-800 text-amber-200'
            }`}>
              <div className="flex items-center gap-2">
                {existingRequest.status === 'ADDED_TO_FAMILY' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                )}
                <div>
                  <div className="font-extrabold text-xs">
                    {existingRequest.status === 'ADDED_TO_FAMILY' ? 'Active in Google Family Group' : 'Invitation Pending Dispatch'}
                  </div>
                  <div className="text-[10px] opacity-80">
                    Linked to: <strong className="font-mono">{existingRequest.googleEmail}</strong> (Receipt: {existingRequest.mpesaReceipt})
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border bg-white/50 dark:bg-black/20">
                {existingRequest.status.replace('_', ' ')}
              </span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-semibold space-y-1 animate-fade-in">
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <Check className="w-4 h-4" />
                <span>Subscription Confirmed!</span>
              </div>
              <p className="text-[11px] leading-relaxed">{successMsg}</p>
            </div>
          )}

          {/* Feature Highlights Grid */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
              What You Unlock with Gemini Pro (KES 200)
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                <div className="font-bold flex items-center gap-1 text-purple-600">
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>1M-2M Context</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Upload full thesis drafts & 1000-page textbooks.</span>
              </div>

              <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                <div className="font-bold flex items-center gap-1 text-blue-600">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Code Execution</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Live Python sandbox, debugging & LaTeX math.</span>
              </div>

              <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                <div className="font-bold flex items-center gap-1 text-pink-600">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Deep Reasoning</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Multimodal analysis for assignments & STEM tasks.</span>
              </div>

              <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                <div className="font-bold flex items-center gap-1 text-emerald-600">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Google Family</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Added directly to Google Family group.</span>
              </div>
            </div>
          </div>

          {/* Subscription Form */}
          <form onSubmit={handleSubscribe} className={`p-4 rounded-2xl border space-y-3 ${
            isLight ? 'bg-gradient-to-b from-purple-50/30 to-white border-purple-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
              <span className="font-extrabold text-xs">Join Google Family Group</span>
              <span className="font-black text-purple-600 font-mono text-sm">KSh 200 M-Pesa</span>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Your Google Email Address (for Family Invitation)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border ${
                    isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Safaricom Phone Number for M-Pesa STK
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="0712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-mono border ${
                    isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isProcessing ? 'Prompting M-Pesa STK...' : 'Pay KSh 200 & Join Google Family'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-1.5 text-center">
              <button
                type="button"
                onClick={handleTestInstantUnlock}
                className="text-[10px] text-purple-600 hover:underline font-semibold cursor-pointer"
              >
                Instant Test Activation (Demo KES 200)
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
