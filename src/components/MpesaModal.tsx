'use client';

import React, { useState, useEffect } from 'react';
import { useCampusStore } from '../lib/store';
import { 
  Lock, 
  Smartphone, 
  CheckCircle2, 
  X, 
  ShieldAlert, 
  RefreshCw, 
  AlertCircle
} from 'lucide-react';

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetFeatureName?: string;
}

export const MpesaModal: React.FC<MpesaModalProps> = ({ 
  isOpen, 
  onClose, 
  targetFeatureName = 'Verified Campus Opportunities & HELB Exporter' 
}) => {
  const store = useCampusStore();
  const isLight = store.theme === 'light';

  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount] = useState(130);
  const [step, setStep] = useState<'IDLE' | 'SENDING' | 'WAITING_PIN' | 'VERIFYING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [checkoutId, setCheckoutId] = useState<string>('');
  const [pinCode, setPinCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [shakePhone, setShakePhone] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('IDLE');
      setPinCode('');
      setErrorMessage('');
      setReceiptNumber('');
    }
  }, [isOpen]);

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

  const handleInitiateStk = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneNumber.replace(/\s+/g, '').replace(/^\+254/, '0');
    if (!cleaned || cleaned.length < 10 || !/^(07|01)\d{8}$/.test(cleaned)) {
      setErrorMessage('Enter a valid Safaricom number — e.g. 0712 345 678');
      setShakePhone(true);
      setTimeout(() => setShakePhone(false), 600);
      return;
    }

    setStep('SENDING');
    setCountdown(35);
    setErrorMessage('');

    // Convert 07XXXXXXXX → 2547XXXXXXXX for Daraja/PayHero
    const intlPhone = '254' + cleaned.substring(1);

    try {
      const tx = await store.initiateDarajaStk(intlPhone, amount, 'SUBSCRIPTION_PASS');
      setCheckoutId(tx.checkoutRequestId);

      setTimeout(() => {
        setStep('WAITING_PIN');
      }, 800);
    } catch {
      setStep('FAILED');
      setErrorMessage('Connection error. Check your network and try again.');
    }
  };


  const handleSimulatePinSubmit = (success: boolean = true) => {
    setStep('VERIFYING');
    
    setTimeout(() => {
      const receipt = `SLK${Math.floor(10000000 + Math.random() * 90000000)}KE`;
      setReceiptNumber(receipt);
      
      store.resolveMpesaCallback(checkoutId, success, receipt);

      if (success) {
        setStep('SUCCESS');
      } else {
        setStep('FAILED');
        setErrorMessage('M-Pesa Transaction Cancelled: Incorrect PIN or Insufficient Funds (Rule 1032).');
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className={`relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        {/* Header */}
        <div className="p-4 sm:p-5 bg-emerald-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                PayHero M-Pesa Semester Pass
              </h3>
              <p className="text-[11px] text-emerald-100">
                KSh 130 • 1 Semester (~120 Days) Unlimited Hustle Pass
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          {step === 'IDLE' && (
            <div>
              {/* Value Proposition Box */}
              <div className={`border rounded-xl p-4 mb-4 ${
                isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      Unlocking
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold mt-0.5">
                      {targetFeatureName}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-black text-emerald-600">
                      KSh {amount}
                    </span>
                    <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>1-Semester</span>
                  </div>
                </div>

                <ul className={`mt-3 space-y-1.5 text-xs border-t pt-2.5 ${
                  isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-300'
                }`}>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Instant phone and contact unlock for internal campus gigs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Access screened high-rate AI qualification prompts ($14–$20/hr)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Automated HELB runway calculator & statement exports</span>
                  </li>
                </ul>
              </div>

              {/* STK Push Form */}
              <form onSubmit={handleInitiateStk} className="space-y-3.5">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                    📱 Enter Your M-Pesa Phone Number
                  </label>
                  <div className={`relative transition-all duration-150 ${shakePhone ? 'animate-bounce' : ''}`}>
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className={`text-xs font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>🇰🇪 +254</span>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => { setPhoneNumber(e.target.value); setErrorMessage(''); }}
                      placeholder="0712 345 678"
                      required
                      autoFocus
                      inputMode="numeric"
                      className={`w-full pl-20 pr-4 py-3 border-2 rounded-xl text-sm font-semibold focus:outline-none transition-colors ${
                        shakePhone
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                          : errorMessage
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-emerald-500/50 focus:border-emerald-500'
                      } ${isLight ? 'bg-white text-slate-900' : 'bg-slate-950 text-white'}`}
                    />
                  </div>
                  <p className={`text-[11px] mt-1.5 flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span>💬</span>
                    <span>You will receive an M-Pesa PIN prompt on this number.</span>
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!phoneNumber}
                  className={`w-full py-3 font-bold rounded-xl text-sm shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer ${
                    phoneNumber
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : isLight ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Send M-Pesa Prompt to {phoneNumber || 'your number'} → KSh 130</span>
                </button>
              </form>
            </div>
          )}

          {step === 'SENDING' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <h4 className="text-sm font-bold">Sending M-Pesa Prompt…</h4>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                STK push dispatched to <strong className="font-mono text-emerald-600">{phoneNumber}</strong> — check your phone.
              </p>
            </div>
          )}

          {step === 'WAITING_PIN' && (
            <div className="py-4 space-y-4">
              <div className={`p-4 border rounded-xl space-y-2 text-center ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <Smartphone className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold">M-Pesa STK Prompt Sent</h4>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Check <strong className="font-mono text-emerald-600">{phoneNumber}</strong> for the M-Pesa PIN prompt and enter your PIN to pay <strong className="text-emerald-600">KSh {amount}</strong>.
                </p>
                <span className="text-[11px] font-mono text-emerald-600 block">
                  Awaiting confirmation ({countdown}s)...
                </span>
              </div>

              {/* Simulation Sandbox Buttons */}
              <div className="space-y-2">
                <span className={`text-[10px] uppercase font-bold text-center block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  Simulate Handset Response
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSimulatePinSubmit(true)}
                    className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Confirm PIN (Success)
                  </button>
                  <button
                    onClick={() => handleSimulatePinSubmit(false)}
                    className={`py-2 border text-xs font-bold rounded-xl transition-all ${
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
              <h4 className="text-sm font-bold">Verifying Daraja Settlement</h4>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Awaiting Safaricom C2B instant webhook callback...
              </p>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="py-4 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black">All-Access Pass Activated</h4>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Receipt: <strong className="font-mono text-emerald-600">{receiptNumber}</strong>. You now have full unlocked access to all campus contacts and AI pipelines.
              </p>
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
              >
                Continue to Dashboard
              </button>
            </div>
          )}

          {step === 'FAILED' && (
            <div className="py-4 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-700 border border-slate-300 rounded-2xl flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="text-sm font-bold">Transaction Incomplete</h4>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {errorMessage}
              </p>
              <button
                onClick={() => setStep('IDLE')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
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
