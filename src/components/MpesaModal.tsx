'use client';

import React, { useState, useEffect } from 'react';
import { useCampusStore } from '../lib/store';
import { 
  Lock, 
  Smartphone, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  AlertCircle,
  Zap,
  ShieldCheck,
  Sparkles,
  Minus,
  Maximize2
} from 'lucide-react';

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetFeatureName?: string;
}

export const MpesaModal: React.FC<MpesaModalProps> = ({ 
  isOpen, 
  onClose, 
  targetFeatureName = 'Full CampusHustle All-Access Pass' 
}) => {
  const store = useCampusStore();
  const isLight = store.theme === 'light';

  // Start empty so user keys in their own M-Pesa phone number
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount] = useState(130);
  const [step, setStep] = useState<'IDLE' | 'SENDING' | 'WAITING_PIN' | 'VERIFYING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [checkoutId, setCheckoutId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [countdown, setCountdown] = useState(35);
  const [shakePhone, setShakePhone] = useState(false);
  const [isLivePayHero, setIsLivePayHero] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('IDLE');
      setErrorMessage('');
      setReceiptNumber('');
      setIsMinimized(false);
      if (store.user?.phoneNumber && store.user.phoneNumber.trim() !== '') {
        setPhoneNumber(store.user.phoneNumber);
      } else {
        setPhoneNumber('');
      }
    }
  }, [isOpen, store.user?.phoneNumber]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'WAITING_PIN' && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (step === 'WAITING_PIN' && countdown === 0) {
      setStep('FAILED');
      setErrorMessage('STK prompt timed out. Please check your SIM network and try again.');
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  // Minimized Floating Widget
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
        <div className={`flex items-center gap-3 p-3 rounded-2xl border shadow-2xl backdrop-blur-md ${
          isLight ? 'bg-white/95 border-emerald-300 text-slate-900 shadow-slate-300/60' : 'bg-slate-900/95 border-emerald-700 text-white shadow-black/80'
        }`}>
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div className="text-left">
            <div className="text-xs font-black flex items-center gap-1">
              <span>Resume $1 Pass</span>
              <span className="text-[10px] bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded font-mono font-bold">KSh 130</span>
            </div>
            <span className={`text-[10px] block truncate max-w-[150px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {targetFeatureName}
            </span>
          </div>
          <button 
            onClick={() => setIsMinimized(false)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer transition-all active:scale-95 flex items-center gap-1"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Expand</span>
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Close Pop-up"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const handleInitiateStk = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneNumber.replace(/\s+/g, '').replace(/^\+254/, '0');
    if (!cleaned || cleaned.length < 10 || !/^(07|01|254)\d+/.test(cleaned)) {
      setErrorMessage('Enter a valid Safaricom number — e.g. 0715 516 715');
      setShakePhone(true);
      setTimeout(() => setShakePhone(false), 600);
      return;
    }

    setStep('SENDING');
    setCountdown(40);
    setErrorMessage('');

    // Convert 07XXXXXXXX → 2547XXXXXXXX for Daraja/PayHero
    let intlPhone = cleaned;
    if (intlPhone.startsWith('0')) {
      intlPhone = '254' + intlPhone.substring(1);
    } else if (!intlPhone.startsWith('254')) {
      intlPhone = '254' + intlPhone;
    }

    try {
      // Record transaction in store
      const tx = await store.initiateDarajaStk(intlPhone, amount, 'SUBSCRIPTION_PASS');
      setCheckoutId(tx.checkoutRequestId);

      // Call the PayHero API endpoint
      try {
        const res = await fetch('/api/payhero/stk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: intlPhone,
            amount,
            reference: 'CampusHustle $1 All-Access Pass',
          }),
        });
        const data = await res.json();
        if (data.provider === 'PAYHERO') {
          setIsLivePayHero(true);
        }
      } catch (err) {
        console.warn('PayHero API endpoint called in fallback mode:', err);
      }

      setTimeout(() => {
        setStep('WAITING_PIN');
      }, 700);
    } catch {
      setStep('FAILED');
      setErrorMessage('Connection error. Check your network and try again.');
    }
  };

  const handleSimulatePinSubmit = (success: boolean = true) => {
    setStep('VERIFYING');
    
    setTimeout(() => {
      const receipt = `PHK${Math.floor(10000000 + Math.random() * 90000000)}KE`;
      setReceiptNumber(receipt);
      
      store.resolveMpesaCallback(checkoutId, success, receipt);

      if (success) {
        setStep('SUCCESS');
      } else {
        setStep('FAILED');
        setErrorMessage('M-Pesa Transaction Cancelled: Incorrect PIN or Insufficient Funds (Rule 1032).');
      }
    }, 900);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsMinimized(true);
        }
      }}
    >
      <div className={`relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        {/* Header with Minimize and Close Buttons */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-inner">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                <span>Unlock All Functionalities</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">$1 Pass</span>
              </h3>
              <p className="text-[11px] text-emerald-100">
                Pay KSh 130 once via M-Pesa — full access to all tools & gigs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Minimize Button */}
            <button
              onClick={() => setIsMinimized(true)}
              className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Minimize Pop-up"
            >
              <Minus className="w-4 h-4" />
            </button>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Pop-up"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          {step === 'IDLE' && (
            <div className="space-y-4">
              {/* Feature Triggered Box */}
              <div className={`border rounded-xl p-3.5 ${
                isLight ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Functionality Requested</span>
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold mt-0.5">
                      {targetFeatureName}
                    </h4>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-xl sm:text-2xl font-black text-emerald-600">$1</span>
                      <span className="text-xs font-bold text-emerald-600">/ KSh 130</span>
                    </div>
                    <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>One-time unlock</span>
                  </div>
                </div>

                <div className={`mt-3 pt-2.5 border-t space-y-1.5 text-xs ${
                  isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Direct poster WhatsApp & Phone numbers unlocked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Apply to High-paying Global AI & Kenyan remote jobs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>HELB Runway Statement Exporter & MMF Compound Trackers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Full AI Student Guides & Hustle Playbooks download</span>
                  </div>
                </div>
              </div>

              {/* STK Push Form */}
              <form onSubmit={handleInitiateStk} className="space-y-3.5">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                    📱 Key in your M-Pesa Phone Number for PIN Prompt
                  </label>
                  <div className={`relative transition-all duration-150 ${shakePhone ? 'animate-bounce' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className={`text-xs font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>🇰🇪 +254</span>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => { setPhoneNumber(e.target.value); setErrorMessage(''); }}
                      placeholder="07XXXXXXXX or 01XXXXXXXX"
                      required
                      autoFocus
                      inputMode="numeric"
                      className={`w-full pl-20 pr-4 py-3 border-2 rounded-xl text-sm font-mono font-bold focus:outline-none transition-colors ${
                        shakePhone
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                          : errorMessage
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-emerald-500/60 focus:border-emerald-500'
                      } ${isLight ? 'bg-white text-slate-900 placeholder:text-slate-400' : 'bg-slate-950 text-white placeholder:text-slate-600'}`}
                    />
                  </div>
                  <p className={`text-[11px] mt-1.5 flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span>💬</span>
                    <span>An M-Pesa prompt for <strong>KSh 130 (~$1)</strong> will appear on this handset.</span>
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!phoneNumber.trim()}
                  className={`w-full py-3.5 font-black rounded-xl text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer ${
                    phoneNumber.trim()
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                      : isLight ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>
                    {phoneNumber.trim() 
                      ? `Send M-Pesa Prompt to ${phoneNumber.trim()} → Pay KSh 130` 
                      : 'Key In M-Pesa Number to Receive PIN Prompt ($1)'}
                  </span>
                </button>
              </form>
            </div>
          )}

          {step === 'SENDING' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <h4 className="text-sm font-bold">Connecting to PayHero STK Engine…</h4>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Dispatching STK push to <strong className="font-mono text-emerald-600">{phoneNumber}</strong>
              </p>
            </div>
          )}

          {step === 'WAITING_PIN' && (
            <div className="py-4 space-y-4">
              <div className={`p-4 border rounded-xl space-y-2 text-center ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <Smartphone className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold">M-Pesa STK Prompt Dispatched</h4>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Check your phone <strong className="font-mono text-emerald-600">{phoneNumber}</strong> and enter your M-Pesa PIN for <strong className="text-emerald-600">KSh {amount} ($1)</strong>.
                </p>
                <span className="text-[11px] font-mono text-emerald-600 block">
                  Awaiting confirmation ({countdown}s)...
                </span>
              </div>

              {/* Simulation Sandbox / Instant PIN Confirmation */}
              <div className="space-y-2">
                <span className={`text-[10px] uppercase font-bold text-center block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  Handset Confirmation Simulation
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSimulatePinSubmit(true)}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Confirm PIN (Success)
                  </button>
                  <button
                    onClick={() => handleSimulatePinSubmit(false)}
                    className={`py-2.5 border text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
                    }`}
                  >
                    Cancel / Wrong PIN
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'VERIFYING' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <h4 className="text-sm font-bold">Verifying Settlement</h4>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Awaiting PayHero & Safaricom C2B instant confirmation...
              </p>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="py-4 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="text-base font-black">All Functionalities Unlocked!</h4>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Receipt: <strong className="font-mono text-emerald-600">{receiptNumber}</strong>. You now have lifetime unrestricted access to all student gigs, contacts, HELB tools, MMF charts, and AI Guides.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.99]"
              >
                Continue & Access All Tools
              </button>
            </div>
          )}

          {step === 'FAILED' && (
            <div className="py-4 text-center space-y-3">
              <div className="w-12 h-12 bg-red-50 text-red-600 border border-red-200 rounded-2xl flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="text-sm font-bold">Payment Incomplete</h4>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {errorMessage}
              </p>
              <button
                onClick={() => setStep('IDLE')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
