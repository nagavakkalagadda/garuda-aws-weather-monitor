import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Database, 
  Cpu, 
  Radio, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Layers, 
  Bot, 
  Zap,
  CheckCircle2,
  Clock,
  UserCheck,
  Lock,
  LogOut,
  ChevronDown,
  Gauge,
  Compass
} from 'lucide-react';

export default function Header({
  tempUnit,
  onToggleTempUnit,
  isDemoMode,
  onToggleDemoMode,
  onRefresh,
  isLoading,
  autoRefreshSec,
  onChangeAutoRefresh,
  soundAlertsEnabled,
  onToggleSoundAlerts,
  onOpenAssistant,
  onOpenArchitecture,
  onOpenLogin,
  currentOperator,
  onLogoutOperator,
  apiStatus = "CONNECTED",
  dataQuality = 99.2
}) {
  const [currentTime, setCurrentTime] = useState('');
  const [utcTime, setUtcTime] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setUtcTime(now.toUTCString().slice(17, 25) + ' ZULU');
    };
    updateClocks();
    const timer = setInterval(updateClocks, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-[1750px] mx-auto flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
        
        {/* Left: Branding & Synoptic Subhead */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-sky-500/10 border border-sky-400/30 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <ShieldCheck className="w-6 h-6 text-sky-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-wider text-slate-100 font-mono">
                SKYGUARD <span className="text-sky-400">AI</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest font-mono uppercase bg-slate-800 text-sky-300 border border-slate-700 rounded">
                SYNOPTIC v3.0
              </span>
            </div>
            <p className="text-xs text-slate-400 tracking-wide flex items-center flex-wrap gap-2 font-mono">
              <span className="text-slate-300">PLANETARY ATMOSPHERIC SENTINEL & SHIFT RADAR</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3" /> {currentTime} LOCAL
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-sky-300 font-bold text-[11px]">
                {utcTime}
              </span>
            </p>
          </div>
        </div>

        {/* Center: System Telemetry Status Bar */}
        <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span className="text-slate-500">SYNOPTIC STREAM:</span>
            <span className={isDemoMode ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
              ● {isDemoMode ? "OFFLINE DEMO" : "LIVE METEO"}
            </span>
          </div>

          <div className="w-px h-3.5 bg-slate-800" />

          <div className="flex items-center gap-1.5 text-slate-300">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-500">SHIFT RADAR:</span>
            <span className="text-emerald-400 font-bold">● ACTIVE (6 SECTORS)</span>
          </div>

          <div className="w-px h-3.5 bg-slate-800" />

          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-500">ML ENGINE:</span>
            <span className="text-emerald-400 font-bold">● ISOLATION FOREST</span>
          </div>

          <div className="w-px h-3.5 bg-slate-800" />

          <div className="flex items-center gap-1.5 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-500">ACCURACY:</span>
            <span className="text-sky-400 font-bold">{dataQuality}%</span>
          </div>
        </div>

        {/* Right: Operational Controls & Operator Authentication Badge */}
        <div className="flex items-center flex-wrap gap-2 w-full xl:w-auto justify-end">
          
          {/* Operator Authentication Profile / Terminal Button */}
          {currentOperator ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 font-mono text-xs text-slate-200 flex items-center gap-2 transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-sky-300">{currentOperator.name.split(' ')[0]}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 hidden sm:inline">
                  {currentOperator.clearanceLevel ? `LVL ${currentOperator.clearanceLevel}` : 'AUTH'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-3 space-y-2.5 z-50 font-mono text-xs">
                  <div className="border-b border-slate-800 pb-2 space-y-0.5">
                    <div className="font-bold text-slate-100">{currentOperator.name}</div>
                    <div className="text-[11px] text-slate-400">{currentOperator.title}</div>
                    <div className="text-[10px] text-sky-400">{currentOperator.station}</div>
                    <div className="text-[10px] text-emerald-400 font-bold mt-1">
                      {currentOperator.clearanceLabel || "LEVEL 4 OPERATOR CLEARANCE"}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenLogin();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 transition-colors flex items-center justify-between"
                  >
                    <span>Switch Operator Account</span>
                    <Lock className="w-3 h-3 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogoutOperator();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 transition-colors flex items-center justify-between"
                  >
                    <span>Terminate Session</span>
                    <LogOut className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              title="Authenticate Operator Session"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>TERMINAL ACCESS</span>
            </button>
          )}

          {/* Demo Mode Toggle */}
          <button
            onClick={onToggleDemoMode}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors flex items-center gap-1.5 ${
              isDemoMode 
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]" 
                : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
            }`}
            title="Toggle between Live Telemetry and Offline Realistic Demo data"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            {isDemoMode ? "DEMO DATA" : "LIVE METEO"}
          </button>

          {/* °C / °F Unit Toggle */}
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => onToggleTempUnit('C')}
              className={`px-2.5 py-1 rounded transition-all ${
                tempUnit === 'C' 
                  ? "bg-sky-500 text-slate-950 font-bold shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              °C
            </button>
            <button
              onClick={() => onToggleTempUnit('F')}
              className={`px-2.5 py-1 rounded transition-all ${
                tempUnit === 'F' 
                  ? "bg-sky-500 text-slate-950 font-bold shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              °F
            </button>
          </div>

          {/* Auto Refresh Select */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono text-slate-300">
            <span className="text-slate-500">SYNC:</span>
            <select
              value={autoRefreshSec}
              onChange={(e) => onChangeAutoRefresh(Number(e.target.value))}
              className="bg-transparent border-none text-sky-400 font-bold focus:outline-none cursor-pointer"
            >
              <option value={0} className="bg-slate-900 text-slate-200">OFF</option>
              <option value={30} className="bg-slate-900 text-slate-200">30s</option>
              <option value={60} className="bg-slate-900 text-slate-200">60s</option>
              <option value={300} className="bg-slate-900 text-slate-200">5m</option>
            </select>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-800 hover:border-sky-500/40 transition-all disabled:opacity-50"
            title="Trigger Manual Synchronous Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-sky-300" : ""}`} />
          </button>

          {/* Audio Alerts Toggle */}
          <button
            onClick={onToggleSoundAlerts}
            className={`p-1.5 rounded-lg border transition-all ${
              soundAlertsEnabled
                ? "bg-sky-500/20 text-sky-400 border-sky-500/50"
                : "bg-slate-900 text-slate-400 border-slate-800"
            }`}
            title={soundAlertsEnabled ? "Acoustic telemetry alarms enabled" : "Acoustic telemetry alarms muted"}
          >
            {soundAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* AI Meteorological Copilot Drawer Trigger */}
          <button
            onClick={onOpenAssistant}
            className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono text-xs flex items-center gap-1.5 transition-all shadow-sm"
            title="Open SKYGUARD AI Meteorological Copilot"
          >
            <Bot className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold">COPILOT</span>
          </button>

          {/* System Architecture Modal Trigger */}
          <button
            onClick={onOpenArchitecture}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-600 transition-all"
            title="View Pipeline Architecture & ML Diagnostics"
          >
            <Layers className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
}
