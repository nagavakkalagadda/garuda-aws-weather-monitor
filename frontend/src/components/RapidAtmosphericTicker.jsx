import React, { useState } from 'react';
import { 
  AlertOctagon, 
  TrendingDown, 
  TrendingUp, 
  ArrowDownRight, 
  ArrowUpRight, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  X,
  Compass,
  Zap,
  Radio
} from 'lucide-react';

export default function RapidAtmosphericTicker({ regionalShifts, localDelta, onFocusRadar }) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (isDismissed) return null;

  const sectors = regionalShifts?.sectors || [];
  const activeAlerts = sectors.filter(s => s.status === 'CRITICAL' || s.status === 'WARNING');

  if (activeAlerts.length === 0 && !localDelta?.alertMessage) {
    return null;
  }

  const currentAlert = activeAlerts[activeIndex % activeAlerts.length] || activeAlerts[0];

  return (
    <div className="w-full bg-slate-950 border-b border-amber-500/40 px-4 lg:px-8 py-2.5 transition-all duration-300">
      <div className="max-w-[1750px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono">
        
        {/* Left: Urgent Delta Classification Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold tracking-wider animate-pulse">
            <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
            <span>ATMOSPHERIC SHIFT ADVISORY</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Radio className="w-3 h-3 text-red-400 animate-ping" />
            <span>{activeAlerts.length} REGIONS RECORDING SUDDEN DELTAS</span>
          </div>
        </div>

        {/* Center: Live Rotating Regional Bulletin */}
        {currentAlert && (
          <div className="flex-1 flex items-center gap-2.5 text-slate-200 overflow-hidden">
            <span className="font-bold text-sky-400 shrink-0 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              [{currentAlert.region.toUpperCase()} // {currentAlert.name.split('&')[0].trim()}]:
            </span>

            <div className="flex items-center gap-2 truncate">
              {currentAlert.liveDeltaP < 0 ? (
                <span className="inline-flex items-center gap-1 font-bold text-red-400 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/30">
                  <TrendingDown className="w-3 h-3" />
                  ΔP: {currentAlert.liveDeltaP} hPa/3h (RAPID PLUNGE)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  <TrendingUp className="w-3 h-3" />
                  ΔP: +{currentAlert.liveDeltaP} hPa/3h (SURGE)
                </span>
              )}

              {currentAlert.liveDeltaT !== 0 && (
                <span className={`inline-flex items-center gap-0.5 font-bold ${
                  currentAlert.liveDeltaT < 0 ? 'text-blue-300' : 'text-amber-300'
                }`}>
                  • ΔT: {currentAlert.liveDeltaT > 0 ? `+${currentAlert.liveDeltaT}` : currentAlert.liveDeltaT}°C/1h
                </span>
              )}

              <span className="text-slate-300 text-[11px] truncate hidden xl:inline">
                — {currentAlert.impactAdvisory}
              </span>
            </div>
          </div>
        )}

        {/* Right: Controls (Cycle Alert, Focus Radar, Dismiss) */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          {activeAlerts.length > 1 && (
            <button
              onClick={() => setActiveIndex(prev => (prev + 1) % activeAlerts.length)}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] transition-all"
              title="Next regional shift alert"
            >
              Next Alert ({((activeIndex % activeAlerts.length) + 1)}/{activeAlerts.length})
            </button>
          )}

          <button
            onClick={onFocusRadar}
            className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-all flex items-center gap-1 shadow-sm"
          >
            <span>Inspect Radar</span>
            <ChevronRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 transition-colors"
            title="Acknowledge and dismiss ticker"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
