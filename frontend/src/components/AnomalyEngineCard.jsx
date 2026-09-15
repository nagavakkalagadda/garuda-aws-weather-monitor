import React from 'react';
import { 
  Cpu, 
  Activity, 
  Radio, 
  Sliders, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Zap,
  Target,
  Orbit
} from 'lucide-react';
import TiltCard3D from './TiltCard3D';

export default function AnomalyEngineCard({
  anomalyData,
  onSelectScenario,
  currentScenario = null
}) {
  const data = anomalyData || {};
  const scorePct = data.percentage ?? 8;
  const scoreDec = data.score ?? 0.08;
  const confidence = data.confidence ? Math.round(data.confidence * 100) : 94;
  const modelStatus = data.model_status || "ACTIVE";
  const detectionMode = data.detection_mode || "REAL-TIME MULTIVARIATE";
  const pattern = data.pattern || "STABLE CLIMATOLOGICAL EQUILIBRIUM";
  const featuresAnalyzed = data.features_analyzed || 24;
  const severity = data.severity || "NORMAL";
  const explanation = data.explanation || "No significant weather anomaly detected.";
  const mlEngine = data.mlEngine || "BUILTIN_ENSEMBLE_ENGINE";

  // Color mappings
  const severityTheme = {
    NORMAL: {
      color: "text-emerald-400",
      border: "border-emerald-500/40",
      bg: "bg-emerald-500/10",
      stroke: "#00e676",
      glow: "shadow-[0_0_30px_rgba(0,230,118,0.2)]",
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
    },
    WATCH: {
      color: "text-amber-400",
      border: "border-amber-500/40",
      bg: "bg-amber-500/10",
      stroke: "#ffd600",
      glow: "shadow-[0_0_30px_rgba(255,214,0,0.2)]",
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/50"
    },
    WARNING: {
      color: "text-orange-400",
      border: "border-orange-500/40",
      bg: "bg-orange-500/10",
      stroke: "#ff9100",
      glow: "shadow-[0_0_35px_rgba(255,145,0,0.25)]",
      badge: "bg-orange-500/20 text-orange-300 border-orange-500/50"
    },
    CRITICAL: {
      color: "text-red-400",
      border: "border-red-500/40",
      bg: "bg-red-500/10",
      stroke: "#ff1744",
      glow: "shadow-[0_0_40px_rgba(255,23,68,0.35)]",
      badge: "bg-red-500/20 text-red-300 border-red-500/50"
    }
  }[severity] || {
    color: "text-emerald-400",
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    stroke: "#00e676",
    glow: "shadow-[0_0_30px_rgba(0,230,118,0.2)]",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
  };

  // SVG Gauge calculations
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scorePct / 100) * circumference;

  return (
    <TiltCard3D maxTilt={4} glowColor="rgba(0, 229, 255, 0.12)">
      <div className={`card-3d rounded-2xl p-5 lg:p-6 border transition-all duration-500 ${severityTheme.border} ${severityTheme.glow} relative overflow-hidden mt-6`}>
        
        {/* Background Radar Scanner Animation */}
        <div className="absolute top-0 right-0 w-72 h-72 opacity-10 pointer-events-none">
          <div className="w-full h-full rounded-full border border-cyan-400 animate-radar-scan relative">
            <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent to-cyan-400" />
          </div>
        </div>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-sm">
                <Cpu className="w-4 h-4 animate-pulse" />
              </span>
              <h2 className="text-base font-mono font-bold tracking-wider text-slate-100 uppercase flex items-center gap-2">
                <span>AI // ANOMALY DETECTION ENGINE</span>
                <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-1.5 py-0.2 rounded font-normal">3D VOLUMETRIC</span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Continuous 24-feature Isolation Forest & Mahalanobis Climatological Verification
            </p>
          </div>

          {/* Anomaly Scenario Simulator */}
          <div className="flex items-center gap-1.5 bg-dark-850/90 border border-slate-700/80 rounded-lg p-1 text-xs font-mono shadow-sm">
            <span className="text-slate-400 px-2 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-cyan-400" />
              SIMULATE:
            </span>
            <button
              onClick={() => onSelectScenario(null)}
              className={`px-2 py-0.5 rounded transition-all btn-3d ${
                !currentScenario ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400" : "text-slate-300 hover:text-white"
              }`}
            >
              Equilibrium
            </button>
            <button
              onClick={() => onSelectScenario('heatwave')}
              className={`px-2 py-0.5 rounded transition-all btn-3d ${
                currentScenario === 'heatwave' ? "bg-orange-500 text-slate-950 font-bold border-orange-400" : "text-slate-300 hover:text-white"
              }`}
            >
              Heatwave
            </button>
            <button
              onClick={() => onSelectScenario('storm')}
              className={`px-2 py-0.5 rounded transition-all btn-3d ${
                currentScenario === 'storm' ? "bg-red-500 text-slate-950 font-bold border-red-400" : "text-slate-300 hover:text-white"
              }`}
            >
              Storm Front
            </button>
          </div>
        </div>

        {/* Main Anomaly Core Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* Left: 3D Holographic Orbital Anomaly Score Gauge (col-span-4) */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-dark-900/80 border border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] relative overflow-hidden">
            
            {/* Outer 3D Gyroscope Orbital Ring */}
            <div className="absolute inset-2 border border-cyan-500/15 rounded-full animate-spin-slow pointer-events-none" />
            <div className="absolute inset-5 border border-cyan-500/10 rounded-full animate-reverse-spin pointer-events-none" />

            <div className="relative w-40 h-40 flex items-center justify-center">
              
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
                {/* Gauge Background Track */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  className="stroke-slate-800"
                  strokeWidth="9"
                  fill="transparent"
                />
                {/* Dynamic Anomaly Progress Arc */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke={severityTheme.stroke}
                  strokeWidth="9"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Gauge Numeric Readout in Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-mono">
                <span className={`text-4xl font-extrabold tracking-tight ${severityTheme.color} drop-shadow-[0_0_15px_currentColor]`}>
                  {String(scorePct).padStart(2, '0')}%
                </span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
                  ANOMALY SCORE
                </span>
              </div>

            </div>

            {/* Classification Banner */}
            <div className="mt-2 text-center">
              <div className={`px-4 py-1 rounded-full border text-xs font-mono font-bold uppercase tracking-wider ${severityTheme.badge} shadow-sm`}>
                WEATHER STATUS: {severity}
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1.5">
                Score: {scoreDec.toFixed(3)} | Threshold: {severity === 'NORMAL' ? '0–20%' : (severity === 'WATCH' ? '21–40%' : (severity === 'WARNING' ? '41–70%' : '71–100%'))}
              </div>
            </div>
          </div>

          {/* Center/Right: Detailed Model Telemetry Matrix (col-span-8) */}
          <div className="md:col-span-8 flex flex-col justify-between h-full space-y-3.5">
            
            {/* Telemetry Metrics Grid with 3D Depth */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
              
              <div className="p-3 rounded-lg bg-dark-900/80 border border-slate-800 shadow-sm">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">MODEL CONFIDENCE</div>
                <div className="text-lg font-bold text-cyan-300 mt-0.5">{confidence}%</div>
                <div className="text-[10px] text-slate-500">Bayesian Evidence</div>
              </div>

              <div className="p-3 rounded-lg bg-dark-900/80 border border-slate-800 shadow-sm">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">MODEL STATUS</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">● {modelStatus}</div>
                <div className="text-[10px] text-slate-500">Pipeline Operational</div>
              </div>

              <div className="p-3 rounded-lg bg-dark-900/80 border border-slate-800 shadow-sm">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">DETECTION MODE</div>
                <div className="text-sm font-bold text-slate-200 mt-1 truncate">REAL-TIME</div>
                <div className="text-[10px] text-slate-500">Multivariate Stream</div>
              </div>

              <div className="p-3 rounded-lg bg-dark-900/80 border border-slate-800 shadow-sm">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">FEATURES ANALYZED</div>
                <div className="text-lg font-bold text-cyan-400 mt-0.5">{featuresAnalyzed} Features</div>
                <div className="text-[10px] text-slate-500">Location + Diurnal</div>
              </div>

            </div>

            {/* Active Atmospheric Pattern Tag */}
            <div className="p-3 rounded-lg bg-dark-900/80 border border-slate-800 font-mono flex items-center justify-between text-xs shadow-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-400">ATMOSPHERIC PATTERN:</span>
                <span className={`font-bold ${severityTheme.color}`}>{pattern}</span>
              </div>
              <span className="text-[10px] text-slate-500 hidden sm:inline">
                Engine: {mlEngine === "PYTHON_FASTAPI_MICROSERVICE" ? "Python Scikit-Learn" : "GARUDA Built-in"}
              </span>
            </div>

            {/* Primary AI Explanation Banner */}
            <div className="p-3.5 rounded-lg bg-dark-850/90 border border-slate-700/80 shadow-md">
              <div className="text-[11px] font-mono text-cyan-400 uppercase font-semibold tracking-wider mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                AI ANOMALY ASSESSMENT & DIAGNOSTIC:
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                "{explanation}"
              </p>
            </div>

          </div>

        </div>

      </div>
    </TiltCard3D>
  );
}
