'use client';

import React, { useState, useEffect } from 'react';
import { useCampusStore } from '../../lib/store';
import { AdminDashboard } from '../../components/AdminDashboard';
import { DarajaArchitectureInspector } from '../../components/DarajaArchitectureInspector';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Home, 
  Terminal, 
  Sun,
  Moon,
  Lock,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';

// Secret passphrase known only to the admin — NOT the email itself
// This provides a second layer beyond just knowing the email
const ADMIN_SECRET_PASSPHRASE = 'campushustle-admin-lilian-2026';
const AUTHORIZED_EMAIL = 'liliankavengi502@gmail.com';
const SESSION_KEY = 'ch_admin_verified_session';

export default function AdminPage() {
  const store = useCampusStore();
  const isLight = store.theme === 'light';
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  // Admin gate state
  const [isVerified, setIsVerified] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passphraseInput, setPassphraseInput] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [authError, setAuthError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Check for existing verified session
  useEffect(() => {
    try {
      const session = sessionStorage.getItem(SESSION_KEY);
      if (session === ADMIN_SECRET_PASSPHRASE) {
        setIsVerified(true);
        store.loginAsAdmin();
      }
    } catch {
      // sessionStorage may not be available
    }
  }, []);

  // Lock after 5 failed attempts
  useEffect(() => {
    if (attempts >= 5) {
      setIsLocked(true);
    }
  }, [attempts]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    const emailOk = emailInput.trim().toLowerCase() === AUTHORIZED_EMAIL.toLowerCase();
    const passphraseOk = passphraseInput.trim() === ADMIN_SECRET_PASSPHRASE;

    if (emailOk && passphraseOk) {
      try {
        sessionStorage.setItem(SESSION_KEY, ADMIN_SECRET_PASSPHRASE);
      } catch {}
      store.loginAsAdmin();
      setIsVerified(true);
      setAuthError('');
    } else {
      setAttempts((a) => a + 1);
      setAuthError(
        !emailOk
          ? 'Access Denied. Unauthorized email address.'
          : 'Access Denied. Invalid passphrase.'
      );
      setPassphraseInput('');
    }
  };

  const handleSignOut = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
    setIsVerified(false);
    setEmailInput('');
    setPassphraseInput('');
    setAuthError('');
    setAttempts(0);
    setIsLocked(false);
  };

  // ─── GATE SCREEN (not authenticated) ───────────────────────────────────────
  if (!isVerified) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}>
        <div className={`w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          {/* Header */}
          <div className="p-5 bg-slate-900 dark:bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center">
                <Lock className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white">Restricted Access</h1>
                <p className="text-[10px] text-slate-400 font-mono">Authorized personnel only</p>
              </div>
            </div>
            <Link href="/" className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-5 space-y-4">
            {isLocked ? (
              // Locked state
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <h2 className="text-sm font-bold">Too Many Attempts</h2>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  This session has been locked after {attempts} failed attempts. Close this tab and try again.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </Link>
              </div>
            ) : (
              // Login form
              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Administrator Email
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => { setEmailInput(e.target.value); setAuthError(''); }}
                    placeholder="your-email@gmail.com"
                    required
                    autoComplete="off"
                    className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Access Passphrase
                  </label>
                  <div className="relative">
                    <input
                      type={showPassphrase ? 'text' : 'password'}
                      value={passphraseInput}
                      onChange={(e) => { setPassphraseInput(e.target.value); setAuthError(''); }}
                      placeholder="Enter admin passphrase"
                      required
                      autoComplete="off"
                      className={`w-full px-3 py-2 pr-10 border rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassphrase(!showPassphrase)}
                      className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}
                    >
                      {showPassphrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-500">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{authError}</span>
                    {attempts > 0 && (
                      <span className="ml-auto font-mono text-[10px] opacity-70">{attempts}/5</span>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authenticate</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── ADMIN DASHBOARD (authenticated) ───────────────────────────────────────
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Admin Header */}
      <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl ${
        isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold tracking-tight">
                  Campus<span className="text-emerald-600">Hustle</span>
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                  ADMIN
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => store.setTheme(isLight ? 'dark' : 'light')}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
              }`}
            >
              {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <button
              onClick={() => setIsArchitectureOpen(true)}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-600" />
              <span>API Spec</span>
            </button>

            <Link
              href="/app"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Student App</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-500 transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
        <AdminDashboard />
      </main>

      {/* Admin Footer */}
      <footer className={`border-t py-3 text-xs transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-900 border-slate-800 text-slate-400'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold">CampusHustle Admin Command Center</span>
            <span>• Restricted to {AUTHORIZED_EMAIL}</span>
          </div>
          <button
            onClick={() => setIsArchitectureOpen(true)}
            className="text-emerald-600 hover:underline"
          >
            API Architecture
          </button>
        </div>
      </footer>

      <DarajaArchitectureInspector
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
}
