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
  X
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

  const campuses: CampusName[] = ['MMU', 'UoN', 'KU', 'JKUAT', 'Strathmore', 'Egerton', 'Moi'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      store.authenticateUser(fullName || 'Campus Hustler', emailOrPhone || 'student@campus.ke', campus, false);
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

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      store.authenticateUser('Google Scholar', 'scholar.student@gmail.com', 'MMU', true);
      setIsLoading(false);
      setAuthSuccessMsg('Authenticated with Google! Launching application...');
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/app');
        }
      }, 600);
    }, 500);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Main Minimalist 2-Color Card */}
      <div className={`relative rounded-2xl p-6 sm:p-7 border shadow-xl space-y-5 transition-colors ${
        isLight 
          ? 'bg-white border-slate-200 text-slate-900 shadow-slate-200/70' 
          : 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/50'
      }`}>
        {/* Close Button if Modal */}
        {isModal && onClose && (
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
              isLight ? 'bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Top Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
          </div>

          <div>
            <span className="text-base font-extrabold tracking-tight block">
              Campus<span className="text-emerald-600">Hustle</span>
            </span>
            <span className={`text-[10px] tracking-wider uppercase font-semibold font-mono block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Kenyan Higher-Ed Platform
            </span>
          </div>
        </div>

        {/* Sign In / Sign Up Mode Pill Toggle */}
        <div className={`p-1 rounded-xl border grid grid-cols-2 gap-1 text-xs ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <button
            type="button"
            onClick={() => setMode('SIGN_IN')}
            className={`py-2 rounded-lg font-bold transition-all duration-150 ${
              mode === 'SIGN_IN'
                ? 'bg-emerald-600 text-white shadow-sm'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('SIGN_UP')}
            className={`py-2 rounded-lg font-bold transition-all duration-150 ${
              mode === 'SIGN_UP'
                ? 'bg-emerald-600 text-white shadow-sm'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Heading */}
        <div className="text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
            {mode === 'SIGN_UP' ? 'Create student account' : 'Sign in to account'}
          </h2>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {mode === 'SIGN_UP'
              ? 'Join 240+ students earning and tracking runway'
              : 'Launch your gigs board, runway calculator and MMF funds'}
          </p>
        </div>

        {/* Continue with Google Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className={`w-full py-2.5 px-4 border rounded-xl text-xs font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.99] ${
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
              placeholder="you@example.com or 2547..."
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
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                  isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-500 hover:text-slate-200'
                }`}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Success Message Banner */}
          {authSuccessMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{authSuccessMsg}</span>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </span>
            ) : (
              <>
                <span>{mode === 'SIGN_UP' ? 'Create Account & Launch' : 'Sign In & Launch App'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Terms Footer */}
        <p className={`text-[10px] text-center leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
          By continuing you agree to CampusHustle student terms and Safaricom Daraja integration specs.
        </p>
      </div>
    </div>
  );
};
