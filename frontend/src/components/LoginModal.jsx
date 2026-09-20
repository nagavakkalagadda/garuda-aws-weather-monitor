import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Terminal, 
  Radio, 
  X,
  BadgeCheck,
  ChevronRight
} from 'lucide-react';
import { loginOperator } from '../services/api';

const PRESET_ACCOUNTS = [
  {
    id: "OP-4329-CHIEF",
    name: "Dr. Aris Thorne",
    title: "Chief Synoptic Meteorologist",
    email: "commander@skyguard.ai",
    password: "skyguard2026",
    clearanceLevel: 4,
    roleTag: "LEVEL 4 // FULL OVERRIDE",
    accent: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    description: "Planetary synoptic override, delta thresholds, emergency broadcast"
  },
  {
    id: "OP-8821-SCIENTIST",
    name: "Elena Rostova, Ph.D.",
    title: "Senior Atmospheric Physicist",
    email: "scientist@skyguard.ai",
    password: "synoptic2026",
    clearanceLevel: 3,
    roleTag: "LEVEL 3 // SYNOPTIC RESEARCH",
    accent: "border-sky-500/40 bg-sky-500/10 text-sky-400",
    description: "Barallobaric analysis, anomaly model training, isolation forest stream"
  },
  {
    id: "OP-1094-DISPATCH",
    name: "Capt. Marcus Vance",
    title: "Civil Emergency Ops Coordinator",
    email: "dispatch@skyguard.ai",
    password: "sentinel2026",
    clearanceLevel: 3,
    roleTag: "LEVEL 3 // REGIONAL DISPATCH",
    accent: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    description: "Regional shift alert vectoring, population hazard advisories"
  }
];

export default function LoginModal({ isOpen, onClose, onLoginSuccess, currentOperator }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('quick'); // 'quick' or 'manual'

  if (!isOpen) return null;

  const handleQuickLogin = async (account) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await loginOperator({ operatorId: account.id });
      onLoginSuccess(res.user);
      onClose();
    } catch (err) {
      // Fallback local login if backend is unreachable
      const fallbackUser = {
        id: account.id,
        email: account.email,
        name: account.name,
        title: account.title,
        station: "WMO-43295 / Atmospheric Surveillance Ops",
        clearanceLevel: account.clearanceLevel,
        clearanceLabel: account.roleTag,
        sessionToken: `SKYG-${Date.now()}`,
        loginTime: new Date().toISOString()
      };
      onLoginSuccess(fallbackUser);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Both operator callsign/email and station password are required.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await loginOperator({ email, password });
      onLoginSuccess(res.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication rejected. Check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setActiveTab('manual');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Terminal Header Strip */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-wider text-slate-100 font-mono">
                  SKYGUARD AI // TERMINAL AUTHENTICATION
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700 rounded">
                  SEC-LEVEL 4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                WMO Synoptic Station Security • Authorized Personnel Only
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-400 hover:text-slate-200 transition-all border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Operator Banner (if already logged in) */}
        {currentOperator && (
          <div className="px-6 py-2.5 bg-sky-950/40 border-b border-sky-800/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-sky-300">
              <UserCheck className="w-4 h-4 text-sky-400" />
              <span>Current Session: <strong>{currentOperator.name}</strong> ({currentOperator.title})</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded font-bold">
              {currentOperator.clearanceLabel || "LEVEL 4 ACTIVE"}
            </span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="px-6 pt-4 border-b border-slate-800 flex gap-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab('quick')}
            className={`pb-3 border-b-2 font-bold tracking-wide flex items-center gap-2 transition-all ${
              activeTab === 'quick'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BadgeCheck className="w-3.5 h-3.5" />
            1-CLICK DEMO OPERATORS (INSTANT ACCESS)
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-3 border-b-2 font-bold tracking-wide flex items-center gap-2 transition-all ${
              activeTab === 'manual'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            MANUAL CREDENTIAL ENTRY
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-300 font-mono">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'quick' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-mono">
                Select an authorized station operator role below to sign in immediately:
              </p>

              <div className="space-y-2.5">
                {PRESET_ACCOUNTS.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-100 font-mono">{acc.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${acc.accent}`}>
                          {acc.roleTag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{acc.title}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                        <span>Email: <code className="text-sky-300 font-bold">{acc.email}</code></span>
                        <span>•</span>
                        <span>Pass: <code className="text-slate-200 font-bold">{acc.password}</code></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => fillCredentials(acc)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-all border border-slate-700"
                        title="Fill into manual login form"
                      >
                        Copy to Form
                      </button>
                      <button
                        onClick={() => handleQuickLogin(acc)}
                        disabled={isLoading}
                        className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <span>Access Terminal</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-slate-300">OPERATOR CALLSIGN / EMAIL</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. commander@skyguard.ai"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-sky-500 text-sm text-slate-100 placeholder-slate-600 font-mono focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-slate-300">STATION ACCESS KEY / PASSWORD</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter station access key"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-sky-500 text-sm text-slate-100 placeholder-slate-600 font-mono focus:outline-none transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-400">
                <span className="text-slate-300 font-bold">Testing note:</span> Use <code className="text-sky-300 font-bold">commander@skyguard.ai</code> with password <code className="text-slate-200 font-bold">skyguard2026</code>.
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Verifying Terminal Security...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize Station Session</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

        {/* Terminal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>ENCRYPTED STATION LINK ACTIVE</span>
          </div>
          <span>PROTOCOL: SKYGUARD-SEC-v3</span>
        </div>

      </div>
    </div>
  );
}
