import React from 'react';
import { Calendar, CloudRain, Droplets, Wind, AlertTriangle } from 'lucide-react';
import { getWeatherIcon } from './PrimaryWeatherHero';
import { convertTemperature } from '../utils/unitConverter';

export default function Forecast7Day({
  forecast = [],
  tempUnit = 'C'
}) {
  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800 mt-6">
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-mono font-bold tracking-wider text-slate-100 uppercase">
            7-DAY METEOROLOGICAL FORECAST & ANOMALY PROJECTION
          </h2>
        </div>
        <span className="text-xs font-mono text-cyan-400 hidden sm:inline">
          Ensemble Anomaly Probability Integration
        </span>
      </div>

      {/* Horizontally scrollable container on mobile, flex/grid on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {forecast.map((day, idx) => {
          const maxT = convertTemperature(day.max_temp, tempUnit);
          const minT = convertTemperature(day.min_temp, tempUnit);
          const feelsMax = convertTemperature(day.feels_like_max, tempUnit);
          const anomalyProb = day.anomaly_probability ?? 8;
          const isHighAnomaly = anomalyProb > 25;

          return (
            <div
              key={`day-${idx}`}
              className={`rounded-xl p-3.5 border flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-0.5 ${
                idx === 0 
                  ? "bg-dark-800/90 border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.12)]" 
                  : "bg-dark-850/80 border-slate-800"
              }`}
            >
              
              {/* Day Name & Date */}
              <div className="text-center pb-2 border-b border-slate-800">
                <div className="text-xs font-mono font-bold text-slate-100 uppercase">
                  {idx === 0 ? "TODAY" : day.day}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  {day.date ? day.date.slice(5) : `Day ${idx + 1}`}
                </div>
              </div>

              {/* Weather Icon & Condition */}
              <div className="my-2.5 flex flex-col items-center text-center">
                <div className="p-2 rounded-xl bg-dark-900/60 mb-1.5">
                  {getWeatherIcon(day.icon, "w-8 h-8")}
                </div>
                <span className="text-[11px] font-medium text-slate-300 truncate max-w-[110px]">
                  {day.condition}
                </span>
              </div>

              {/* Temperatures */}
              <div className="text-center font-mono my-1">
                <div className="text-sm font-extrabold text-slate-100">
                  {maxT}° / <span className="text-slate-400 font-normal">{minT}°{tempUnit}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Feels: {feelsMax}°{tempUnit}
                </div>
              </div>

              {/* Rain & Environmental Details */}
              <div className="pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <CloudRain className="w-3 h-3 text-sky-400" /> Rain:
                  </span>
                  <span className="text-sky-300 font-semibold">{day.rain_probability}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Wind className="w-3 h-3 text-emerald-400" /> Wind:
                  </span>
                  <span className="text-slate-300">{day.wind_speed}k</span>
                </div>

                {/* AI Anomaly Probability Tag */}
                <div className="pt-1 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[9px] uppercase">
                    <AlertTriangle className="w-3 h-3 text-amber-400" /> Anomaly:
                  </span>
                  <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                    isHighAnomaly 
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" 
                      : "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {String(anomalyProb).padStart(2, '0')}%
                  </span>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
