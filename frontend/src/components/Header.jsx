import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
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
  Clock
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
  apiStatus = "CONNECTED",
  dataQuality = 98.7
}) {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-cyan-500/20 bg-dark-900/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-[1750px] mx-auto flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
        
        {/* Left: Branding & Tagline */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-cyan-500/10 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,229,255,0.25)]">
            <ShieldAlert className="w-6 h-6 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-wider text-slate-100 font-mono">
                AWS // <span className="text-cyan-400">INTELLIGENT WEATHER MONITOR</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded">
                GARUDA v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 tracking-wide flex items-center gap-2">
              <span>AUTOMATIC WEATHER STATUS // AI/ML ANOMALY DETECTION PLATFORM</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-mono flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3" /> {currentTime} IST
              </span>
            </p>
          </div>
        </div>

        {/* Center: System Telemetry Status Bar */}
        <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-dark-850/90 border border-slate-800 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-slate-400">WEATHER API:</span>
            <span className={isDemoMode ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
              ● {isDemoMode ? "DEMO MODE" : "CONNECTED"}
            </span>
          </div>

          <div className="w-px h-3.5 bg-slate-800" />

          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">ML ENGINE:</span>
            <span className="text-emerald-400 font-bold">● ACTIVE</span>
          </div>

          <div className="w-px h-3.5 bg-slate-800" />

          <div className="flex items-center gap-1.5 text-slate-300">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">DATABASE:</span>
            <span className="text-emerald-400 font-bold">● CONNECTED</span>
          </div>

          <div className="w-px h-3.5 bg-slate-800" />

          <div className="flex items-center gap-1.5 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">DATA QUALITY:</span>
            <span className="text-cyan-400 font-bold">{dataQuality}%</span>
          </div>
        </div>

        {/* Right: Operational Controls */}
        <div className="flex items-center flex-wrap gap-2 w-full xl:w-auto justify-end">
          
          {/* Demo Mode Toggle */}
          <button
            onClick={onToggleDemoMode}
            className={`px-2.5 py-1.5 rounded border text-xs font-mono font-medium transition-colors flex items-center gap-1.5 ${
              isDemoMode 
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]" 
                : "bg-dark-800 text-slate-300 border-slate-700 hover:border-slate-500"
            }`}
            title="Toggle between Live Telemetry and Offline Realistic Demo data"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            {isDemoMode ? "DEMO DATA ACTIVE" : "LIVE TELEMETRY"}
          </button>

          {/* °C / °F Unit Toggle */}
          <div className="flex items-center bg-dark-800 rounded-lg p-0.5 border border-slate-700 text-xs font-mono">
            <button
              onClick={() => onToggleTempUnit('C')}
              className={`px-2.5 py-1 rounded transition-all ${
                tempUnit === 'C' 
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              °C
            </button>
            <button
              onClick={() => onToggleTempUnit('F')}
              className={`px-2.5 py-1 rounded transition-all ${
                tempUnit === 'F' 
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              °F
            </button>
          </div>

          {/* Auto Refresh Select */}
          <div className="flex items-center gap-1.5 bg-dark-800 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-slate-300">
            <span className="text-slate-400">REFRESH:</span>
            <select
              value={autoRefreshSec}
              onChange={(e) => onChangeAutoRefresh(Number(e.target.value))}
              className="bg-transparent border-none text-cyan-400 font-bold focus:outline-none cursor-pointer"
            >
              <option value={0} className="bg-dark-900 text-slate-200">OFF</option>
              <option value={30} className="bg-dark-900 text-slate-200">30s</option>
              <option value={60} className="bg-dark-900 text-slate-200">60s</option>
              <option value={300} className="bg-dark-900 text-slate-200">5m</option>
            </select>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-cyan-400 border border-slate-700 hover:border-cyan-500/40 transition-all disabled:opacity-50"
            title="Trigger Manual Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-cyan-300" : ""}`} />
          </button>

          {/* Audio Alerts Toggle */}
          <button
            onClick={onToggleSoundAlerts}
            className={`p-1.5 rounded-lg border transition-all ${
              soundAlertsEnabled
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                : "bg-dark-800 text-slate-400 border-slate-700"
            }`}
            title={soundAlertsEnabled ? "Audio telemetry alerts active" : "Audio telemetry alerts muted"}
          >
            {soundAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* AI Meteorological Copilot Drawer Trigger */}
          <button
            onClick={onOpenAssistant}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(0,229,255,0.15)]"
            title="Open GARUDA AI Weather Assistant Copilot"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">AI COPILOT</span>
          </button>

          {/* System Architecture Modal Trigger */}
          <button
            onClick={onOpenArchitecture}
            className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-300 border border-slate-700 hover:border-slate-500 transition-all"
            title="View Pipeline Architecture & ML Diagnostics"
          >
            <Layers className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
}
