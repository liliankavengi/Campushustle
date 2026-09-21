'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCampusStore } from '../lib/store';
import { CampusName } from '../types';
import { 
  Zap, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User as UserIcon,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';

interface AuthCardProps {
  initialMode?: 'SIGN_UP' | 'SIGN_IN';
  onSuccess?: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  initialMode = 'SIGN_UP',
  onSuccess,
  isModal = false,
  onClose
}) => {
  const router = useRouter();
  const store = useCampusStore();
  const isLight = store.theme === 'light';

  const [mode, setMode] = useState<'SIGN_IN' | 'SIGN_UP'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [campus, setCampus] = useState<CampusName>('MMU');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Google Account Chooser State
  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleCampus, setGoogleCampus] = useState<CampusName>('MMU');
  const [googleError, setGoogleError] = useState<string | null>(null);

  const campuses: CampusName[] = ['MMU', 'UoN', 'KU', 'JKUAT', 'Strathmore', 'Egerton', 'Moi'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (mode === 'SIGN_UP' && (!fullName.trim() || fullName.trim().length < 2)) {
      setValidationError('Please enter your full student name.');
      return;
    }

    const cleanInput = emailOrPhone.trim();
    if (!cleanInput || cleanInput.length < 5) {
      setValidationError('Please enter a valid campus email or Safaricom phone number.');
      return;
    }

    if (!password || password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      store.authenticateUser(fullName.trim(), cleanInput, campus, false);
      setIsLoading(false);
      setAuthSuccessMsg(mode === 'SIGN_UP' ? 'Account created! Launching application...' : 'Signed in! Launching application...');
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/app');
        }
      }, 600);
    }, 500);
  };

  const handleOpenGoogleChooser = () => {
    setGoogleError(null);
    setIsGoogleChooserOpen(true);
  };

  const handleConfirmGoogleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = googleEmail.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || cleanEmail.length < 5) {
      setGoogleError('Please enter a valid Google email address.');
      return;
    }

    setIsLoading(true);
    setIsGoogleChooserOpen(false);

    setTimeout(() => {
      store.authenticateUser(
        googleName.trim() || cleanEmail.split('@')[0],
        cleanEmail,
        googleCampus,
        true
      );
      setIsLoading(false);
      setAuthSuccessMsg(`Authenticated as ${cleanEmail}! Launching application...`);
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/app');
        }
      }, 600);
    }, 600);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Main Minimalist Card */}
      <div className={`relative rounded-2xl p-6 sm:p-7 border shadow-xl space-y-5 transition-colors ${
        isLight 
          ? 'bg-white border-slate-200 text-slate-900 shadow-slate-200/70' 
          : 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/50'
      }`}>
        {/* Close Button if Modal */}
        {isModal && onClose && (
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Brand Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight block">
              Campus<span className="text-emerald-600">Hustle</span>
            </span>
            <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Kenyan Student Higher-Ed Platform
            </span>
          </div>
        </div>

        {/* Mode Toggle: Sign In / Sign Up */}
        <div className={`grid grid-cols-2 gap-1 p-1 rounded-xl border text-xs font-semibold ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <button
            type="button"
            onClick={() => {
              setMode('SIGN_IN');
              setValidationError(null);
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'SIGN_IN'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('SIGN_UP');
              setValidationError(null);
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'SIGN_UP'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Success Alert */}
        {authSuccessMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{authSuccessMsg}</span>
          </div>
        )}

        {/* Heading */}
        <div className="text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
            {mode === 'SIGN_UP' ? 'Create student account' : 'Sign in to account'}
          </h2>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {mode === 'SIGN_UP'
              ? 'Join students earning and tracking runway across Kenyan campuses'
              : 'Launch your gigs board, runway calculator and MMF funds'}
          </p>
        </div>

        {/* Continue with Google Button (Prompts Chooser) */}
        <button
          type="button"
          onClick={handleOpenGoogleChooser}
          disabled={isLoading}
          className={`w-full py-2.5 px-4 border rounded-xl text-xs font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.99] cursor-pointer ${
            isLight
              ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-800 shadow-sm'
              : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-200'
          }`}
        >
          {/* Official Google Vector SVG */}
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className={`border-t w-full ${isLight ? 'border-slate-200' : 'border-slate-800'}`} />
          <span className={`px-2 text-[10px] uppercase tracking-widest font-mono ${
            isLight ? 'bg-white text-slate-400' : 'bg-slate-900 text-slate-500'
          }`}>
            Or campus credentials
          </span>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {validationError && (
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-1.5">
              <span>⚠️</span>
              <span>{validationError}</span>
            </div>
          )}

          {/* Full Name Field (Sign Up Only) */}
          {mode === 'SIGN_UP' && (
            <div>
              <label className={`block text-[10px] uppercase font-bold tracking-wider mb-1 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border focus:outline-none focus:border-emerald-500 transition-colors ${
                  isLight 
                    ? 'bg-slate-50 border-slate-200 text-slate-900' 
                    : 'bg-slate-950 border-slate-800 text-white'
                }`}
              />
            </div>
          )}

          {/* Campus Selector (Sign Up Only) */}
          {mode === 'SIGN_UP' && (
            <div>
              <label className={`block text-[10px] uppercase font-bold tracking-wider mb-1 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                University Campus
              </label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value as CampusName)}
                className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border focus:outline-none focus:border-emerald-500 cursor-pointer ${
                  isLight 
                    ? 'bg-slate-50 border-slate-200 text-slate-900' 
                    : 'bg-slate-950 border-slate-800 text-white'
                }`}
              >
                {campuses.map((c) => (
                  <option key={c} value={c} className={isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}>
                    {c} Campus
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Email / Safaricom Phone */}
          <div>
            <label className={`block text-[10px] uppercase font-bold tracking-wider mb-1 ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Email or Safaricom Phone
            </label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="you@example.com or 0715 516 715"
              required
              className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border focus:outline-none focus:border-emerald-500 transition-colors ${
                isLight 
                  ? 'bg-slate-50 border-slate-200 text-slate-900' 
                  : 'bg-slate-950 border-slate-800 text-white'
              }`}
            />
          </div>

          {/* Password */}
          <div>
            <label className={`block text-[10px] uppercase font-bold tracking-wider mb-1 ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border focus:outline-none focus:border-emerald-500 transition-colors pr-10 ${
                  isLight 
                    ? 'bg-slate-50 border-slate-200 text-slate-900' 
                    : 'bg-slate-950 border-slate-800 text-white'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer ${
                  isLight ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'SIGN_UP' ? 'Create Student Account' : 'Sign In to CampusHustle'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Google Account Chooser Modal */}
      {isGoogleChooserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className={`relative w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            {/* Google Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="font-bold text-xs">Sign in with Google</span>
              </div>
              <button
                onClick={() => setIsGoogleChooserOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chooser Body */}
            <form onSubmit={handleConfirmGoogleAuth} className="p-5 space-y-3.5">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold">Choose Google Account</h3>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Enter or select the Google account to connect to CampusHustle
                </p>
              </div>

              {googleError && (
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold">
                  {googleError}
                </div>
              )}

              <div>
                <label className={`block text-[10px] uppercase font-bold tracking-wider mb-1 ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  Google Email Address
                </label>
                <input
                  type="email"
                  value={googleEmail}
                  onChange={(e) => {
                    setGoogleEmail(e.target.value);
                    setGoogleError(null);
                  }}
                  placeholder="e.g. yourname@gmail.com"
                  required
                  autoFocus
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-emerald-500 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[10px] uppercase font-bold tracking-wider mb-1 ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-emerald-500 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[10px] uppercase font-bold tracking-wider mb-1 ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  University Campus
                </label>
                <select
                  value={googleCampus}
                  onChange={(e) => setGoogleCampus(e.target.value as CampusName)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-emerald-500 cursor-pointer ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                >
                  {campuses.map((c) => (
                    <option key={c} value={c} className={isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}>
                      {c} Campus
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={!googleEmail}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
                    googleEmail ? 'bg-emerald-600 hover:bg-emerald-700 shadow-sm' : 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed'
                  }`}
                >
                  Continue with this Account
                </button>
                <button
                  type="button"
                  onClick={() => setIsGoogleChooserOpen(false)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    isLight ? 'border-slate-200 hover:bg-slate-100 text-slate-600' : 'border-slate-800 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
