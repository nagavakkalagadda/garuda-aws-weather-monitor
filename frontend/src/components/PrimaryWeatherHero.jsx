import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudSun, 
  CloudRain, 
  CloudLightning, 
  CloudFog, 
  Snowflake, 
  Flame, 
  Clock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Box
} from 'lucide-react';
import { formatTempWithUnit } from '../utils/unitConverter';
import Minimal3DWeatherVisualizer from './Minimal3DWeatherVisualizer';
import TiltCard3D from './TiltCard3D';

export function getWeatherIcon(iconName, className = "w-16 h-16") {
  switch (iconName) {
    case 'sun':
      return <Sun className={`${className} text-amber-400 animate-spin-slow`} />;
    case 'cloud-sun':
      return <CloudSun className={`${className} text-cyan-300`} />;
    case 'cloud':
      return <Cloud className={`${className} text-slate-300`} />;
    case 'cloud-rain':
    case 'cloud-rain-heavy':
    case 'cloud-drizzle':
      return <CloudRain className={`${className} text-blue-400`} />;
    case 'cloud-lightning':
      return <CloudLightning className={`${className} text-purple-400 animate-pulse`} />;
    case 'cloud-fog':
      return <CloudFog className={`${className} text-slate-400`} />;
    case 'snowflake':
      return <Snowflake className={`${className} text-sky-200`} />;
    case 'extreme-heat':
      return <Flame className={`${className} text-orange-500 animate-bounce`} />;
    default:
      return <CloudSun className={`${className} text-cyan-300`} />;
  }
}

export default function PrimaryWeatherHero({
  currentWeather,
  location,
  tempUnit = 'C',
  anomalyStatus = 'NORMAL',
  anomalyPercentage = 8,
  lastUpdated,
  isDemo = false,
  dataSourceLabel = "LIVE TELEMETRY"
}) {
  const temp = currentWeather?.temperature ?? 28.0;
  const feelsLike = currentWeather?.feels_like ?? 30.0;
  const condition = currentWeather?.condition ?? "Partly Cloudy";
  const icon = currentWeather?.icon ?? "cloud-sun";
  const theme = currentWeather?.theme ?? "cloudy";

  // Status color configuration
  const statusConfig = {
    NORMAL: {
      color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
      icon: ShieldCheck,
      desc: "Climatological Equilibrium Active"
    },
    WATCH: {
      color: "bg-amber-500/20 text-amber-300 border-amber-500/50",
      icon: ShieldAlert,
      desc: "Moderate Variance Detected"
    },
    WARNING: {
      color: "bg-orange-500/20 text-orange-300 border-orange-500/50",
      icon: AlertTriangle,
      desc: "Significant Atmospheric Anomaly"
    },
    CRITICAL: {
      color: "bg-red-500/20 text-red-300 border-red-500/50 animate-pulse",
      icon: AlertTriangle,
      desc: "Extreme Meteorological Alert"
    }
  }[anomalyStatus] || {
    color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
    icon: ShieldCheck,
    desc: "Climatological Equilibrium Active"
  };

  const StatusIcon = statusConfig.icon;

  return (
    <TiltCard3D maxTilt={5} glowColor="rgba(0, 229, 255, 0.15)">
      <div className="card-3d rounded-2xl p-6 lg:p-8 relative overflow-hidden transition-all duration-700">
        
        {/* Subtle Background Glow Line */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Banner: Status & Source Label */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
          
          {/* Anomaly Classification Badge */}
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full border text-xs font-mono font-bold flex items-center gap-1.5 uppercase tracking-wider ${statusConfig.color} shadow-sm`}>
              <StatusIcon className="w-3.5 h-3.5" />
              <span>WEATHER STATUS: {anomalyStatus} ({anomalyPercentage}%)</span>
            </div>
            <span className="hidden sm:inline text-xs text-slate-400 font-mono">
              {statusConfig.desc}
            </span>
          </div>

          {/* Data Source Tag & Last Updated */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className={`px-2.5 py-0.5 rounded font-bold uppercase tracking-wider text-[11px] border ${
              isDemo 
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40" 
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
            }`}>
              {isDemo ? "● DEMO DATA" : "● LIVE DATA"}
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Updated: {lastUpdated || '19:55 IST'}</span>
            </span>
          </div>

        </div>

        {/* Main Hero Metrics with 3D Spatial Depth */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          {/* Left: Huge Temperature Readout */}
          <div>
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <span>CURRENT WEATHER OBSERVATION</span>
              <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-1.5 py-0.2 rounded">3D VOLUMETRIC</span>
            </div>
            
            <div className="flex items-baseline gap-4">
              <span className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight font-mono text-slate-50 drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
                {formatTempWithUnit(temp, tempUnit)}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-2 font-mono">
              <div className="text-sm sm:text-base text-slate-300 flex items-center gap-1.5">
                <span className="text-slate-500">Feels like:</span>
                <span className="text-cyan-300 font-bold text-lg">
                  {formatTempWithUnit(feelsLike, tempUnit)}
                </span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-600" />
              <div className="text-sm text-slate-300">
                <span className="text-slate-500">Apparent:</span>{' '}
                <span className="font-semibold text-slate-200">
                  {formatTempWithUnit(currentWeather?.apparent_temperature ?? feelsLike, tempUnit)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Minimalist 3D Volumetric Weather Visualizer & Condition */}
          <div className="flex items-center gap-5 lg:pr-4">
            
            {/* 3D WebGL Atmosphere Visualizer Core */}
            <div className="relative p-2 rounded-2xl bg-dark-900/90 border border-cyan-500/30 shadow-[0_12px_24px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] flex items-center justify-center overflow-hidden">
              <Minimal3DWeatherVisualizer theme={theme} condition={condition} className="w-24 h-24 sm:w-28 sm:h-28" />
              <div className="absolute bottom-1 right-2 pointer-events-none font-mono text-[8px] text-cyan-400/80 uppercase">
                3D MESH
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-wide font-sans">
                {condition}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
                Station: {location?.city || 'Bengaluru'}, {location?.country || 'India'}
              </div>
              <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                Lat: {location?.latitude?.toFixed(4)}° • Lon: {location?.longitude?.toFixed(4)}°
              </div>
            </div>

          </div>

        </div>

      </div>
    </TiltCard3D>
  );
}
