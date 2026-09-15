import React from 'react';
import { 
  Bell, 
  ShieldAlert, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Wind, 
  Droplets 
} from 'lucide-react';

export default function AlertsPanel({
  alerts = [],
  anomalyStatus = "NORMAL"
}) {
  const getSeverityStyle = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return {
          badge: "bg-red-500/20 text-red-300 border-red-500/50 animate-pulse",
          card: "border-red-500/40 bg-red-500/5",
          icon: AlertOctagon,
          iconColor: "text-red-400"
        };
      case 'WARNING':
        return {
          badge: "bg-orange-500/20 text-orange-300 border-orange-500/50",
          card: "border-orange-500/40 bg-orange-500/5",
          icon: AlertTriangle,
          iconColor: "text-orange-400"
        };
      case 'WATCH':
        return {
          badge: "bg-amber-500/20 text-amber-300 border-amber-500/50",
          card: "border-amber-500/40 bg-amber-500/5",
          icon: ShieldAlert,
          iconColor: "text-amber-400"
        };
      default:
        return {
          badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
          card: "border-emerald-500/30 bg-emerald-500/5",
          icon: CheckCircle2,
          iconColor: "text-emerald-400"
        };
    }
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800 mt-6">
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h2 className="text-sm font-mono font-bold tracking-wider text-slate-100 uppercase">
            INTELLIGENT WEATHER ALERTS & TELEMETRY STREAM
          </h2>
        </div>
        <span className="text-xs font-mono text-cyan-400">
          {alerts.length} Active Notice{alerts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="p-6 rounded-xl bg-dark-850 border border-slate-800 text-center font-mono">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            ALL SYSTEMS NORMAL // NO ACTIVE ADVISORIES
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Atmospheric indicators and microclimate readings are in standard equilibrium.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, idx) => {
            const style = getSeverityStyle(alert.severity);
            const Icon = style.icon;

            return (
              <div
                key={alert.id || `alert-${idx}`}
                className={`p-4 rounded-xl border ${style.card} transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs`}
              >
                
                {/* Left: Severity & Alert message */}
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="p-2 rounded-lg bg-dark-900 border border-slate-700/60 shrink-0 mt-0.5">
                    <Icon className={`w-5 h-5 ${style.iconColor}`} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${style.badge}`}>
                        {alert.severity}
                      </span>
                      <span className="text-slate-100 font-bold tracking-wide">
                        {alert.parameter} ANOMALY DETECTED
                      </span>
                    </div>

                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      {alert.message}
                    </p>
                  </div>
                </div>

                {/* Right: Telemetry Matrix (Observed vs Expected, Deviation, Confidence, Timestamp) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-dark-900/80 p-2.5 rounded-lg border border-slate-800 shrink-0 w-full md:w-auto text-[11px]">
                  
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">Observed:</span>
                    <span className="font-bold text-slate-100">{alert.observed_value}</span>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">Expected:</span>
                    <span className="text-slate-400">{alert.expected_value}</span>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">Deviation:</span>
                    <span className="font-semibold text-orange-400">{alert.deviation}</span>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">Confidence:</span>
                    <span className="text-cyan-400 font-semibold">{alert.confidence}</span>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
