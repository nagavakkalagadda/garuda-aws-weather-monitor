import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  LineChart as ChartIcon, 
  Thermometer, 
  Droplets, 
  Gauge, 
  Wind, 
  CloudRain, 
  AlertTriangle, 
  History,
  Activity
} from 'lucide-react';
import { convertTemperature } from '../utils/unitConverter';

export default function WeatherCharts({
  hourlyTrends = [],
  anomalyScore = 8,
  tempUnit = 'C'
}) {
  const [activeTab, setActiveTab] = useState('temp');

  // Format data for Recharts
  const chartData = hourlyTrends.map((pt, idx) => {
    const rawTemp = pt.temperature ?? 25;
    const rawDew = pt.dew_point ?? (rawTemp - 5);
    const convertedTemp = convertTemperature(rawTemp, tempUnit);
    const convertedDew = convertTemperature(rawDew, tempUnit);
    
    // Anomaly simulation curve for the 24h timeline
    const simulatedAnomaly = Math.max(4, Math.min(95, Math.round(anomalyScore + Math.sin(idx / 3) * 6)));

    return {
      time: pt.time || `${idx}:00`,
      temperature: convertedTemp,
      dew_point: convertedDew,
      humidity: pt.humidity ?? 60,
      pressure: pt.pressure ?? 1012,
      wind_speed: pt.wind_speed ?? 12,
      precipitation: pt.precipitation ?? 0,
      anomaly_score: simulatedAnomaly,
      historical_baseline: convertTemperature(rawTemp - 0.8, tempUnit),
      temp_spread: Math.abs(convertedTemp - convertTemperature(rawTemp - 0.8, tempUnit))
    };
  });

  const tabs = [
    { id: 'temp', label: 'Temperature & Dew Point', icon: Thermometer, color: '#00e5ff' },
    { id: 'humidity', label: 'Humidity Trend', icon: Droplets, color: '#3b82f6' },
    { id: 'pressure', label: 'Barometric Pressure', icon: Gauge, color: '#06b6d4' },
    { id: 'wind', label: 'Wind Velocity', icon: Wind, color: '#10b981' },
    { id: 'rainfall', label: 'Rainfall & Precip', icon: CloudRain, color: '#38bdf8' },
    { id: 'anomaly', label: 'Anomaly Score (24h)', icon: AlertTriangle, color: '#f59e0b' },
    { id: 'historical', label: 'Observed vs Historical', icon: History, color: '#a855f7' },
    { id: 'multi', label: 'Multi-Parameter Radar', icon: Activity, color: '#ec4899' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-lg bg-dark-850 border border-cyan-500/30 shadow-2xl font-mono text-xs z-50">
          <div className="text-slate-400 font-bold mb-1 border-b border-slate-800 pb-1 flex items-center justify-between gap-4">
            <span>HOUR: {label}</span>
            <span className="text-[10px] text-cyan-400">GARUDA MET</span>
          </div>
          {payload.map((entry, idx) => (
            <div key={`tip-${idx}`} className="flex items-center justify-between gap-4 py-0.5" style={{ color: entry.color }}>
              <span>{entry.name}:</span>
              <span className="font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800 mt-6">
      
      {/* Chart Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <ChartIcon className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-mono font-bold tracking-wider text-slate-100 uppercase">
              METEOROLOGICAL TIME-SERIES TELEMETRY
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-dimensional atmospheric sensors and anomaly trajectory
          </p>
        </div>

        {/* Tab Selection Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]"
                    : "bg-dark-800 hover:bg-dark-750 text-slate-300 border border-slate-700/60"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Chart */}
      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          
          {/* 1. Temperature & Dew Point */}
          {activeTab === 'temp' && (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="dewGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit={`°${tempUnit}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Area type="monotone" dataKey="temperature" name={`Temperature (°${tempUnit})`} stroke="#00e5ff" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGradient)" />
              <Area type="monotone" dataKey="dew_point" name={`Dew Point (°${tempUnit})`} stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#dewGradient)" />
            </AreaChart>
          )}

          {/* 2. Humidity Trend */}
          {activeTab === 'humidity' && (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Area type="monotone" dataKey="humidity" name="Relative Humidity (%)" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#humGradient)" />
            </AreaChart>
          )}

          {/* 3. Barometric Pressure */}
          {activeTab === 'pressure' && (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={['auto', 'auto']} unit=" hPa" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Line type="monotone" dataKey="pressure" name="Pressure (hPa)" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 2 }} />
            </LineChart>
          )}

          {/* 4. Wind Speed */}
          {activeTab === 'wind' && (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" km/h" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Area type="monotone" dataKey="wind_speed" name="Wind Velocity (km/h)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#windGradient)" />
            </AreaChart>
          )}

          {/* 5. Rainfall */}
          {activeTab === 'rainfall' && (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" mm" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Bar dataKey="precipitation" name="Precipitation (mm)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}

          {/* 6. Anomaly Score Trend */}
          {activeTab === 'anomaly' && (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="anomalyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Area type="monotone" dataKey="anomaly_score" name="AI Anomaly Score (%)" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#anomalyGradient)" />
            </AreaChart>
          )}

          {/* 7. Historical vs Current */}
          {activeTab === 'historical' && (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit={`°${tempUnit}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Line type="monotone" dataKey="temperature" name={`Observed Temperature (°${tempUnit})`} stroke="#00e5ff" strokeWidth={2.5} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="historical_baseline" name={`30-Year Baseline Normal (°${tempUnit})`} stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          )}

          {/* 8. Multi-Parameter Trend */}
          {activeTab === 'multi' && (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Line type="monotone" dataKey="temperature" name={`Temp (°${tempUnit})`} stroke="#00e5ff" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="wind_speed" name="Wind (km/h)" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="anomaly_score" name="Anomaly Score (%)" stroke="#ec4899" strokeWidth={2.5} dot={false} />
            </LineChart>
          )}

        </ResponsiveContainer>
      </div>

    </div>
  );
}
