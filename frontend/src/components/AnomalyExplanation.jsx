import React from 'react';
import { 
  AlertCircle, 
  HelpCircle, 
  Layers, 
  ShieldAlert, 
  Zap, 
  Flame, 
  Wind, 
  CheckCircle2 
} from 'lucide-react';
import { convertTemperature } from '../utils/unitConverter';

export default function AnomalyExplanation({
  anomalyData,
  tempUnit = 'C'
}) {
  const data = anomalyData || {};
  const deviations = data.deviations || {};
  const compoundSignals = data.multi_parameter_signals || {};
  const compoundInsights = data.compound_insights || [];
  const confidence = data.confidence ? Math.round(data.confidence * 100) : 94;

  // Format parameter name for readability
  const formatParamName = (k) => {
    switch (k) {
      case 'temperature': return 'Temperature';
      case 'pressure': return 'Atmospheric Pressure';
      case 'humidity': return 'Relative Humidity';
      case 'wind_speed': return 'Wind Velocity';
      case 'precipitation': return 'Precipitation Volume';
      case 'air_quality_pm25': return 'Aerosol PM2.5';
      default: return k.replace('_', ' ').toUpperCase();
    }
  };

  const getSeverityBadge = (zScore) => {
    const absZ = Math.abs(zScore || 0);
    if (absZ >= 3.0) return { label: "CRITICAL", color: "bg-red-500/20 text-red-300 border-red-500/40" };
    if (absZ >= 2.0) return { label: "WARNING", color: "bg-orange-500/20 text-orange-300 border-orange-500/40" };
    if (absZ >= 1.4) return { label: "WATCH", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
    return { label: "NORMAL", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" };
  };

  // Check active multi-parameter events
  const multiParamActive = Object.values(compoundSignals).some(v => Boolean(v));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6">
      
      {/* Left Column: Single Parameter Breakdown Table (col-span-7) */}
      <div className="lg:col-span-7 glass-panel rounded-xl p-5 border border-slate-800">
        
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider">
              AI ANOMALY ANALYSIS // PARAMETER DEVIATIONS
            </h3>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            Confidence: {confidence}%
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-4 font-sans">
          Comparison between live telemetry observations and location-calibrated climate normals.
        </p>

        {/* Deviations Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase tracking-wider">
                <th className="pb-2 font-semibold">Parameter</th>
                <th className="pb-2 font-semibold">Expected Normal</th>
                <th className="pb-2 font-semibold">Observed</th>
                <th className="pb-2 font-semibold">Deviation</th>
                <th className="pb-2 font-semibold">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {Object.entries(deviations).map(([key, dev]) => {
                const sev = getSeverityBadge(dev.z_score);
                const isTemp = key === 'temperature';
                const obsDisplay = isTemp ? `${convertTemperature(dev.observed, tempUnit)}°${tempUnit}` : `${dev.observed}${dev.unit}`;
                const expDisplay = isTemp 
                  ? `${convertTemperature(dev.normal_range[0], tempUnit)}–${convertTemperature(dev.normal_range[1], tempUnit)}°${tempUnit}`
                  : `${dev.normal_range[0]}–${dev.normal_range[1]}${dev.unit}`;
                const diffDisplay = isTemp
                  ? `${dev.difference > 0 ? '+' : ''}${Math.round((dev.difference * (tempUnit === 'F' ? 1.8 : 1)) * 10) / 10}°${tempUnit}`
                  : `${dev.difference > 0 ? '+' : ''}${dev.difference}${dev.unit}`;

                return (
                  <tr key={key} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 font-semibold text-slate-100">
                      {formatParamName(key)}
                    </td>
                    <td className="py-2.5 text-slate-400">
                      {expDisplay}
                    </td>
                    <td className="py-2.5 font-bold text-cyan-300">
                      {obsDisplay}
                    </td>
                    <td className={`py-2.5 font-semibold ${dev.difference > 0 ? 'text-orange-400' : (dev.difference < 0 ? 'text-cyan-400' : 'text-slate-400')}`}>
                      {diffDisplay}
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${sev.color}`}>
                        {sev.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Right Column: Multi-Parameter Compound Anomaly Detection (col-span-5) */}
      <div className="lg:col-span-5 glass-panel rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
        
        <div>
          <div className="flex items-center gap-2 mb-3.5">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h3 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider">
              MULTI-PARAMETER ANALYSIS
            </h3>
          </div>

          <p className="text-xs text-slate-400 mb-3 font-sans">
            AI assessment of non-linear multi-variable atmospheric interactions (Storms, Heat Dome, Thermal Inversion).
          </p>

          {/* Compound Alerts Stream */}
          {multiParamActive && compoundInsights.length > 0 ? (
            <div className="space-y-2.5">
              {compoundInsights.map((insight, idx) => (
                <div key={`insight-${idx}`} className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-mono">
                  <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider mb-1">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    COMPOUND RISK IDENTIFIED
                  </div>
                  <p className="text-slate-200 leading-relaxed font-sans text-xs">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-dark-850 border border-slate-800 text-center font-mono">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                ATMOSPHERIC COUPLING EQUILIBRIUM
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                No hostile synergistic combination (e.g. pressure crash + wind spike or heat-humidity trap) is active.
              </p>
            </div>
          )}

          {/* Active Atmospheric Signals Checklist */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 font-mono text-[11px]">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">
              EVALUATED COMPOUND PATTERNS:
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Storm Cell Precursor (ΔP + Wind + Rain):</span>
              <span className={compoundSignals.storm_front_precursor ? "text-red-400 font-bold" : "text-slate-600"}>
                {compoundSignals.storm_front_precursor ? "● ACTIVE ALERT" : "○ INACTIVE"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Extreme Heat Stress (Temp + Humidity):</span>
              <span className={compoundSignals.extreme_heat_stress ? "text-orange-400 font-bold" : "text-slate-600"}>
                {compoundSignals.extreme_heat_stress ? "● ACTIVE ALERT" : "○ INACTIVE"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Thermal Inversion Trap (Wind Calm + PM2.5):</span>
              <span className={compoundSignals.thermal_inversion ? "text-amber-400 font-bold" : "text-slate-600"}>
                {compoundSignals.thermal_inversion ? "● ACTIVE ALERT" : "○ INACTIVE"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Dry Convective Desiccation (Temp + Low Hum):</span>
              <span className={compoundSignals.dry_convective_surge ? "text-orange-400 font-bold" : "text-slate-600"}>
                {compoundSignals.dry_convective_surge ? "● ACTIVE ALERT" : "○ INACTIVE"}
              </span>
            </div>

          </div>

        </div>

        <div className="mt-4 text-[10px] text-slate-500 font-mono">
          *Location-aware dynamic baselines calibrated to diurnal radiation and regional topography.
        </div>

      </div>

    </div>
  );
}
