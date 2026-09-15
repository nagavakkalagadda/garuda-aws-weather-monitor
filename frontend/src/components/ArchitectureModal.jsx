import React from 'react';
import { 
  Layers, 
  X, 
  Cpu, 
  Database, 
  Globe, 
  GitBranch, 
  ShieldCheck, 
  CheckCircle2,
  Terminal,
  Activity
} from 'lucide-react';

export default function ArchitectureModal({
  isOpen,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      
      <div className="w-full max-w-4xl max-h-[90vh] bg-dark-900 border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-mono">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-dark-850">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                GARUDA SYSTEM ARCHITECTURE & ML SPECIFICATION
              </h3>
              <p className="text-xs text-slate-400">
                AI/ML Based Intelligent Meteorological Anomaly Detection System (v2.0)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-400 hover:text-slate-200 border border-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* 1. 9-Stage End-to-End Pipeline */}
          <div className="p-4 rounded-xl bg-dark-850 border border-slate-800">
            <h4 className="text-cyan-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" /> 1. End-to-End Anomaly Pipeline
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5 text-center text-[10px]">
              {[
                "1. RAW WEATHER",
                "2. VALIDATION",
                "3. CLEANING",
                "4. NORMALIZATION",
                "5. FEATURE EXTRACT",
                "6. CLIMATE BASELINE",
                "7. ISOLATION FOREST",
                "8. ANOMALY SCORE",
                "9. ALERT GENERATION"
              ].map((step, i) => (
                <div key={i} className="p-2 rounded bg-dark-900 border border-cyan-500/20 text-cyan-300 font-bold">
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* 2. ML Engine & Feature Engineering */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800">
              <h4 className="text-cyan-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> 2. ML Model & Algorithms
              </h4>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                <li><strong className="text-slate-100">Primary Model:</strong> Isolation Forest (scikit-learn) + Multivariate Mahalanobis Distance Ensemble</li>
                <li><strong className="text-slate-100">Contamination:</strong> 0.08 (dynamic calibration)</li>
                <li><strong className="text-slate-100">Location Adaptation:</strong> Köppen-Geiger 30-year climatological normals with elevation compensation</li>
                <li><strong className="text-slate-100">Compound Detection:</strong> Non-linear synergy rules for cyclonic fronts, urban heat stress, and thermal inversions</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800">
              <h4 className="text-cyan-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> 3. 24-Feature Vector
              </h4>
              <div className="text-[11px] text-slate-400 leading-relaxed">
                <code className="text-cyan-300">temperature, feels_like, humidity, pressure, wind_speed, wind_gust, precipitation, cloud_cover, visibility, uv_index, dew_point, wet_bulb, apparent_temp, soil_temp, pm25, pm10, hist_temp, hist_hum, hist_pres, sin(hour), cos(hour), sin(day), temp_deviation, pressure_gradient_rate</code>
              </div>
            </div>

          </div>

          {/* 3. Database Schema & Tables */}
          <div className="p-4 rounded-xl bg-dark-850 border border-slate-800">
            <h4 className="text-cyan-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Database className="w-4 h-4" /> 4. Production Database Architecture (PostgreSQL)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded bg-dark-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">users</span>
                <p className="text-slate-500 text-[10px]">Auth & operators</p>
              </div>
              <div className="p-2 rounded bg-dark-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">locations</span>
                <p className="text-slate-500 text-[10px]">Coordinates & stations</p>
              </div>
              <div className="p-2 rounded bg-dark-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">weather_readings</span>
                <p className="text-slate-500 text-[10px]">Telemetry stream</p>
              </div>
              <div className="p-2 rounded bg-dark-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">historical_weather</span>
                <p className="text-slate-500 text-[10px]">Climatological normals</p>
              </div>
              <div className="p-2 rounded bg-dark-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">anomaly_results</span>
                <p className="text-slate-500 text-[10px]">ML output & vectors</p>
              </div>
              <div className="p-2 rounded bg-dark-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">weather_alerts</span>
                <p className="text-slate-500 text-[10px]">Dispatched notices</p>
              </div>
              <div className="p-2 rounded bg-dark-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">model_predictions</span>
                <p className="text-slate-500 text-[10px]">7-day forecast ML</p>
              </div>
              <div className="p-2 rounded bg-dark-900 border border-slate-800">
                <span className="text-cyan-400 font-bold">system_logs</span>
                <p className="text-slate-500 text-[10px]">Audit & telemetry trail</p>
              </div>
            </div>
          </div>

          {/* 4. API Endpoints */}
          <div className="p-4 rounded-xl bg-dark-850 border border-slate-800">
            <h4 className="text-cyan-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" /> 5. REST API Layer
            </h4>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px]">GET</span>
                <code className="text-slate-300">/api/weather/all?city=...&lat=...&lon=...</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">POST</span>
                <code className="text-slate-300">/api/anomaly/detect</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px]">GET</span>
                <code className="text-slate-300">/api/location/search?query=...</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">POST</span>
                <code className="text-slate-300">/api/assistant/chat</code>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-dark-850 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Architecture Version: 2.0.0 (Production Ready)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all"
          >
            Close Architecture View
          </button>
        </div>

      </div>

    </div>
  );
}
