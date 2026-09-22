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
  Lock, 
  Mail, 
  User as UserIcon,
  CheckCircle2,
  X,
  AlertCircle,
  Smartphone,
  Building2,
  Sparkles
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

  const campuses: CampusName[] = ['MMU', 'UoN', 'KU', 'JKUAT', 'Strathmore', 'Egerton', 'Moi'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const cleanInput = emailOrPhone.trim();
    if (!cleanInput || cleanInput.length < 5) {
      setValidationError('Please enter your Safaricom phone number (e.g. 0712345678) or email.');
      return;
    }

    if (mode === 'SIGN_UP') {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setValidationError('Please enter your full student name.');
        return;
      }
    }

    if (!password || password.length < 4) {
      setValidationError('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const name = mode === 'SIGN_UP' ? fullName.trim() : (cleanInput.includes('@') ? cleanInput.split('@')[0] : 'Student');
      store.authenticateUser(name, cleanInput, campus, false);
      setIsLoading(false);
      setAuthSuccessMsg(mode === 'SIGN_UP' ? 'Account created! Redirecting...' : 'Welcome back! Redirecting...');
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/app');
        }
      }, 500);
    }, 400);
  };

  const handleQuickGoogleSignIn = () => {
    setIsLoading(true);
    setValidationError(null);

    setTimeout(() => {
      // Clean instant Google authentication
      const demoEmail = 'student.google@gmail.com';
      store.authenticateUser('Student User', demoEmail, campus, true);
      setIsLoading(false);
      setAuthSuccessMsg('Authenticated via Google! Launching app...');

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/app');
        }
      }, 500);
    }, 400);
  };

  return (
    <div className="relative w-full max-w-md mx-auto animate-fade-in">
      {/* Sleek Minimalist Card */}
      <div className={`relative rounded-3xl p-6 sm:p-7 border shadow-2xl space-y-5 transition-all ${
        isLight 
          ? 'bg-white border-slate-200 text-slate-900 shadow-slate-200/60' 
          : 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-black/70 backdrop-blur-md'
      }`}>
        {/* Close Button if Modal */}
        {isModal && onClose && (
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-1.5 rounded-xl transition-colors cursor-pointer ${
              isLight ? 'bg-slate-100 text-slate-500 hover:text-slate-800' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight block">
                Campus<span className="text-emerald-600">Hustle</span>
              </span>
              <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Kenyan Student Earning & Runway Hub
              </span>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            v2.0
          </span>
        </div>

        {/* Mode Toggle Pills: Sign In / Sign Up */}
        <div className={`grid grid-cols-2 gap-1 p-1 rounded-2xl border text-xs font-bold ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <button
            type="button"
            onClick={() => {
              setMode('SIGN_IN');
              setValidationError(null);
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'SIGN_IN'
                ? 'bg-emerald-600 text-white shadow-sm'
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
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'SIGN_UP'
                ? 'bg-emerald-600 text-white shadow-sm'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Success Alert */}
        {authSuccessMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{authSuccessMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {validationError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* 1-Click Google Button */}
        <button
          type="button"
          onClick={handleQuickGoogleSignIn}
          disabled={isLoading}
          className={`w-full py-2.5 px-4 border rounded-2xl text-xs font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.99] cursor-pointer ${
            isLight
              ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-800 shadow-xs'
              : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-200'
          }`}
        >
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
            Or phone & password
          </span>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name for Sign Up */}
          {mode === 'SIGN_UP' && (
            <div>
              <label className={`block text-[11px] font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Full Student Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Frank Mokua"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border transition-colors ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white' : 'bg-slate-950 border-slate-700 text-white'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Phone or Email */}
          <div>
            <label className={`block text-[11px] font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Safaricom Phone Number or Email
            </label>
            <div className="relative">
              <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="0712345678 or student@mmu.ac.ke"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border transition-colors ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>
          </div>

          {/* Campus Selector for Sign Up */}
          {mode === 'SIGN_UP' && (
            <div>
              <label className={`block text-[11px] font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Your University
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={campus}
                  onChange={(e) => setCampus(e.target.value as CampusName)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border cursor-pointer ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                  }`}
                >
                  {campuses.map((c) => (
                    <option key={c} value={c}>
                      {c} Campus
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className={`block text-[11px] font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-9 pr-9 py-2 rounded-xl text-xs border transition-colors ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            <span>{isLoading ? 'Authenticating...' : mode === 'SIGN_UP' ? 'Create Free Account' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer switch prompt */}
        <div className="text-center text-[11px] pt-1">
          {mode === 'SIGN_UP' ? (
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('SIGN_IN');
                  setValidationError(null);
                }}
                className="text-emerald-600 font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
              New to CampusHustle?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('SIGN_UP');
                  setValidationError(null);
                }}
                className="text-emerald-600 font-bold hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
