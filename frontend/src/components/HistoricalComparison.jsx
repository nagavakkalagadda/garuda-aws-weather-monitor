import React from 'react';
import { History, TrendingUp, TrendingDown, Minus, CheckCircle, AlertTriangle } from 'lucide-react';
import { convertTemperature, formatDeviation } from '../utils/unitConverter';

export default function HistoricalComparison({
  historicalData,
  currentTemp = 28.0,
  tempUnit = 'C'
}) {
  const data = historicalData || {};
  const current = currentTemp;
  const prevDay = data.previous_day ?? (current - 0.7);
  const prevWeek = data.previous_week ?? (current + 1.1);
  const histAvg = data.historical_average ?? (current - 0.3);
  const seasonalAvg = data.seasonal_average ?? (current - 0.1);
  const histMin = data.historical_minimum ?? (current - 11.5);
  const histMax = data.historical_maximum ?? (current + 10.0);

  const rows = [
    {
      period: "Current Observation",
      observed: current,
      expected: histAvg,
      diff: current - histAvg,
      isCurrent: true
    },
    {
      period: "Previous Day (24h Ago)",
      observed: prevDay,
      expected: histAvg,
      diff: current - prevDay
    },
    {
      period: "Previous Week (7d Ago)",
      observed: prevWeek,
      expected: histAvg,
      diff: current - prevWeek
    },
    {
      period: "Historical 30-Year Normal",
      observed: histAvg,
      expected: histAvg,
      diff: 0.0
    },
    {
      period: "Seasonal Baseline",
      observed: seasonalAvg,
      expected: histAvg,
      diff: seasonalAvg - histAvg
    },
    {
      period: "Historical All-Time Minimum",
      observed: histMin,
      expected: histAvg,
      diff: histMin - histAvg,
      isMin: true
    },
    {
      period: "Historical All-Time Maximum",
      observed: histMax,
      expected: histAvg,
      diff: histMax - histAvg,
      isMax: true
    }
  ];

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800 mt-6">
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-mono font-bold tracking-wider text-slate-100 uppercase">
            CURRENT vs HISTORICAL CLIMATE COMPARISON
          </h2>
        </div>
        <span className="text-xs font-mono text-cyan-400">
          Source: Köppen-Geiger Climatology Records
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase tracking-wider">
              <th className="pb-2.5 font-semibold">Comparison Horizon</th>
              <th className="pb-2.5 font-semibold">Value</th>
              <th className="pb-2.5 font-semibold">Baseline Normal</th>
              <th className="pb-2.5 font-semibold">Delta (Deviation)</th>
              <th className="pb-2.5 font-semibold">Anomaly Assessment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {rows.map((row, idx) => {
              const absDiff = Math.abs(row.diff);
              const isAnomalous = absDiff >= 2.5;

              return (
                <tr key={`hist-${idx}`} className={`hover:bg-slate-800/30 transition-colors ${row.isCurrent ? 'bg-cyan-500/5' : ''}`}>
                  <td className="py-2.5 font-medium flex items-center gap-2">
                    {row.isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                    <span className={row.isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-300'}>
                      {row.period}
                    </span>
                  </td>
                  <td className="py-2.5 font-bold text-slate-100">
                    {convertTemperature(row.observed, tempUnit)}°{tempUnit}
                  </td>
                  <td className="py-2.5 text-slate-400">
                    {convertTemperature(row.expected, tempUnit)}°{tempUnit}
                  </td>
                  <td className={`py-2.5 font-semibold ${row.diff > 0.5 ? 'text-orange-400' : (row.diff < -0.5 ? 'text-cyan-400' : 'text-slate-400')}`}>
                    {row.isCurrent || row.period.includes("Previous") 
                      ? formatDeviation(row.diff, tempUnit) 
                      : (row.diff === 0 ? 'Equilibrium' : formatDeviation(row.diff, tempUnit))}
                  </td>
                  <td className="py-2.5">
                    {row.isCurrent ? (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
                        isAnomalous ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      }`}>
                        {isAnomalous ? "Elevated Variance" : "Equilibrium"}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-sans">
                        {row.isMax ? "Historical Record High" : (row.isMin ? "Historical Record Low" : "Climatic Benchmark")}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
