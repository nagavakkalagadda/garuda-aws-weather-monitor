import React from 'react';
import { 
  Droplets, 
  Gauge, 
  Wind, 
  Compass, 
  CloudRain, 
  Umbrella, 
  SunMedium, 
  Eye, 
  Cloud, 
  Sparkles,
  Activity,
  AlertCircle
} from 'lucide-react';

export default function WeatherParametersGrid({
  currentWeather
}) {
  const current = currentWeather || {};
  const aq = current.air_quality || {};

  const humidity = current.humidity ?? 62;
  const pressure = current.pressure ?? 1012;
  const windSpeed = current.wind_speed ?? 14.5;
  const windDir = current.wind_direction ?? 245;
  const windGust = current.wind_gust ?? 20.0;
  const rainfall = current.rainfall ?? 0.0;
  const precipProb = current.precipitation_probability ?? 20;
  const uvIndex = current.uv_index ?? 5.5;
  const visibility = current.visibility ?? 10.0;
  const cloudCover = current.cloud_cover ?? 45;

  const getUvLevel = (uv) => {
    if (uv >= 11) return { label: "EXTREME", color: "text-purple-400" };
    if (uv >= 8) return { label: "VERY HIGH", color: "text-red-400" };
    if (uv >= 6) return { label: "HIGH", color: "text-orange-400" };
    if (uv >= 3) return { label: "MODERATE", color: "text-amber-400" };
    return { label: "LOW", color: "text-emerald-400" };
  };

  const getAqiColor = (status) => {
    if (status === "Good") return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
    if (status === "Moderate") return "text-amber-400 border-amber-500/40 bg-amber-500/10";
    return "text-red-400 border-red-500/40 bg-red-500/10";
  };

  const uvObj = getUvLevel(uvIndex);

  return (
    <div className="mt-6">
      
      <div className="mb-4">
        <h2 className="text-sm font-mono font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          ATMOSPHERIC TELEMETRY PARAMETERS
        </h2>
        <p className="text-xs text-slate-400">
          Continuous multi-sensor meteorological & aerosol environmental monitoring
        </p>
      </div>

      {/* Primary Parameters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        
        {/* Humidity */}
        <div className="glass-panel rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>HUMIDITY</span>
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold font-mono text-slate-100">
              {humidity}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {humidity > 70 ? "Humid / Saturated" : (humidity < 35 ? "Dry Atmosphere" : "Comfortable")}
            </div>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${humidity}%` }} />
          </div>
        </div>

        {/* Pressure */}
        <div className="glass-panel rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>BAROMETRIC</span>
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold font-mono text-slate-100">
              {pressure} <span className="text-xs font-normal text-slate-400">hPa</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {pressure < 1000 ? "Low Pressure Trough" : "Stable Boundary"}
            </div>
          </div>
          <div className="text-[10px] font-mono text-cyan-400">
            MSLP Standard: 1013 hPa
          </div>
        </div>

        {/* Wind Speed & Direction */}
        <div className="glass-panel rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>WIND VELOCITY</span>
            <Wind className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold font-mono text-slate-100">
              {windSpeed} <span className="text-xs font-normal text-slate-400">km/h</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-mono">
              <Compass className="w-3 h-3 text-cyan-400" />
              <span>Bearing {windDir}° • Gusts {windGust} km/h</span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-emerald-400">
            Beaufort: {windSpeed < 19 ? "Gentle Breeze" : "Moderate Gale"}
          </div>
        </div>

        {/* Rainfall / Precipitation */}
        <div className="glass-panel rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>PRECIPITATION</span>
            <CloudRain className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold font-mono text-slate-100">
              {rainfall} <span className="text-xs font-normal text-slate-400">mm</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
              Prob: <span className="text-sky-300 font-semibold">{precipProb}%</span>
            </div>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-sky-400 h-full rounded-full" style={{ width: `${Math.min(100, precipProb)}%` }} />
          </div>
        </div>

        {/* UV Index */}
        <div className="glass-panel rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>UV INDEX</span>
            <SunMedium className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold font-mono text-slate-100">
              {uvIndex}
            </div>
            <div className={`text-[10px] font-mono font-bold mt-0.5 ${uvObj.color}`}>
              {uvObj.label} RISK
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Peak: 11:00 - 15:00
          </div>
        </div>

        {/* Visibility */}
        <div className="glass-panel rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>VISIBILITY</span>
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold font-mono text-slate-100">
              {visibility} <span className="text-xs font-normal text-slate-400">km</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {visibility >= 10 ? "Clear Horizon" : "Atmospheric Haze"}
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Optical Sensor
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="glass-panel rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>CLOUD COVER</span>
            <Cloud className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold font-mono text-slate-100">
              {cloudCover}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {cloudCover > 80 ? "Overcast" : (cloudCover > 40 ? "Partly Cloudy" : "Clear Sky")}
            </div>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-slate-400 h-full rounded-full" style={{ width: `${cloudCover}%` }} />
          </div>
        </div>

      </div>

      {/* Air Quality Sub-Panel */}
      <div className="glass-panel rounded-xl p-4 border border-slate-800 mt-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              AEROSOL & AIR QUALITY PROFILE (AQI)
            </h3>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold uppercase tracking-wider ${getAqiColor(aq.aqi_status)}`}>
            Status: {aq.aqi_status || "Good"} (European AQI: {aq.aqi_european || 35})
          </span>
        </div>

        {/* 6 Air Pollutants */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono text-xs">
          
          <div className="p-2.5 rounded-lg bg-dark-850/80 border border-slate-800/80">
            <span className="text-[10px] text-slate-400">PM2.5</span>
            <div className="text-base font-bold text-slate-100 mt-0.5">
              {aq.pm2_5 || 28.5} <span className="text-[10px] font-normal text-slate-500">µg/m³</span>
            </div>
            <span className="text-[9px] text-emerald-400">Fine Particulate</span>
          </div>

          <div className="p-2.5 rounded-lg bg-dark-850/80 border border-slate-800/80">
            <span className="text-[10px] text-slate-400">PM10</span>
            <div className="text-base font-bold text-slate-100 mt-0.5">
              {aq.pm10 || 48.0} <span className="text-[10px] font-normal text-slate-500">µg/m³</span>
            </div>
            <span className="text-[9px] text-cyan-400">Coarse Dust</span>
          </div>

          <div className="p-2.5 rounded-lg bg-dark-850/80 border border-slate-800/80">
            <span className="text-[10px] text-slate-400">CO (Carbon Monoxide)</span>
            <div className="text-base font-bold text-slate-100 mt-0.5">
              {aq.co || 420.0} <span className="text-[10px] font-normal text-slate-500">µg/m³</span>
            </div>
            <span className="text-[9px] text-slate-400">Combustion</span>
          </div>

          <div className="p-2.5 rounded-lg bg-dark-850/80 border border-slate-800/80">
            <span className="text-[10px] text-slate-400">NO2 (Nitrogen Dioxide)</span>
            <div className="text-base font-bold text-slate-100 mt-0.5">
              {aq.no2 || 18.2} <span className="text-[10px] font-normal text-slate-500">µg/m³</span>
            </div>
            <span className="text-[9px] text-slate-400">Vehicle Emission</span>
          </div>

          <div className="p-2.5 rounded-lg bg-dark-850/80 border border-slate-800/80">
            <span className="text-[10px] text-slate-400">SO2 (Sulphur Dioxide)</span>
            <div className="text-base font-bold text-slate-100 mt-0.5">
              {aq.so2 || 6.4} <span className="text-[10px] font-normal text-slate-500">µg/m³</span>
            </div>
            <span className="text-[9px] text-slate-400">Industrial</span>
          </div>

          <div className="p-2.5 rounded-lg bg-dark-850/80 border border-slate-800/80">
            <span className="text-[10px] text-slate-400">O3 (Ozone)</span>
            <div className="text-base font-bold text-slate-100 mt-0.5">
              {aq.ozone || 55.0} <span className="text-[10px] font-normal text-slate-500">µg/m³</span>
            </div>
            <span className="text-[9px] text-cyan-400">Photochemical</span>
          </div>

        </div>

      </div>

    </div>
  );
}
