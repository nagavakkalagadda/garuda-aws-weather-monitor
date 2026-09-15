import React from 'react';
import { 
  Thermometer, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Droplets, 
  Wind, 
  Gauge, 
  Layers, 
  Sun,
  Activity
} from 'lucide-react';
import { convertTemperature, formatDeviation } from '../utils/unitConverter';
import TiltCard3D from './TiltCard3D';

export default function TemperatureGrid({
  currentWeather,
  historicalComparison,
  tempUnit = 'C'
}) {
  const current = currentWeather || {};
  const hist = historicalComparison || {};

  const temp = current.temperature ?? 28.0;
  const feelsLike = current.feels_like ?? 30.0;
  const minTemp = current.min_temperature ?? (temp - 5);
  const maxTemp = current.max_temperature ?? (temp + 5);
  const dewPoint = current.dew_point ?? (temp - 6);
  const wetBulb = current.wet_bulb ?? (temp - 3);
  const apparent = current.apparent_temperature ?? feelsLike;
  const soilTemp = current.soil_temperature ?? (temp - 1);
  const histAvg = hist.historical_average ?? (temp - 0.5);
  const deviation = hist.deviation ?? (temp - histAvg);

  const getTrendIcon = (dev) => {
    if (dev > 0.5) return <TrendingUp className="w-3.5 h-3.5 text-orange-400" />;
    if (dev < -0.5) return <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  const getStatusBadge = (dev) => {
    if (dev > 3.0) return { label: "ANOMALOUS HIGH", color: "bg-red-500/20 text-red-300 border-red-500/40" };
    if (dev > 1.2) return { label: "ELEVATED", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
    if (dev < -3.0) return { label: "ANOMALOUS LOW", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" };
    if (dev < -1.2) return { label: "SUB-NORMAL", color: "bg-blue-500/20 text-blue-300 border-blue-500/40" };
    return { label: "OPTIMAL", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" };
  };

  const cards = [
    {
      id: "curr_temp",
      title: "CURRENT TEMPERATURE",
      rawVal: temp,
      icon: Thermometer,
      normalRange: [temp - 3.5, temp + 3.5],
      dev: deviation,
      desc: "Dry-bulb ambient sensor reading"
    },
    {
      id: "feels_like",
      title: "FEELS-LIKE TEMPERATURE",
      rawVal: feelsLike,
      icon: Activity,
      normalRange: [feelsLike - 4.0, feelsLike + 4.0],
      dev: feelsLike - temp,
      desc: "Perceived bioclimatic thermal index"
    },
    {
      id: "min_temp",
      title: "MINIMUM TEMPERATURE",
      rawVal: minTemp,
      icon: TrendingDown,
      normalRange: [minTemp - 2.5, minTemp + 2.5],
      dev: minTemp - (histAvg - 4),
      desc: "Diurnal minimum (dawn trough)"
    },
    {
      id: "max_temp",
      title: "MAXIMUM TEMPERATURE",
      rawVal: maxTemp,
      icon: TrendingUp,
      normalRange: [maxTemp - 2.5, maxTemp + 2.5],
      dev: maxTemp - (histAvg + 4),
      desc: "Diurnal maximum (midday solar peak)"
    },
    {
      id: "dew_point",
      title: "DEW-POINT TEMPERATURE",
      rawVal: dewPoint,
      icon: Droplets,
      normalRange: [dewPoint - 3.0, dewPoint + 3.0],
      dev: dewPoint - (temp - 6.0),
      desc: "Atmospheric saturation point"
    },
    {
      id: "wet_bulb",
      title: "WET-BULB TEMPERATURE",
      rawVal: wetBulb,
      icon: Gauge,
      normalRange: [wetBulb - 3.0, wetBulb + 3.0],
      dev: wetBulb - (temp - 4.0),
      desc: "Evaporative thermodynamic limit"
    },
    {
      id: "apparent",
      title: "APPARENT TEMPERATURE",
      rawVal: apparent,
      icon: Wind,
      normalRange: [apparent - 4.0, apparent + 4.0],
      dev: apparent - temp,
      desc: "Steadman physiological wind/moisture model"
    },
    {
      id: "soil_temp",
      title: "SOIL TEMPERATURE",
      rawVal: soilTemp,
      icon: Layers,
      normalRange: [soilTemp - 2.5, soilTemp + 2.5],
      dev: soilTemp - temp,
      desc: "Surface boundary layer (0cm depth)"
    }
  ];

  return (
    <div className="mt-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-sm font-mono font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-cyan-400" />
            3D TACTILE TEMPERATURE SUITE
          </h2>
          <p className="text-xs text-slate-400">
            Real-time observation across 8 thermodynamic temperature classifications with 3D tactile elevation
          </p>
        </div>

        {/* Global Historical Baseline & Deviation Summary Badge */}
        <div className="flex items-center gap-2 bg-dark-850/90 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-xs shadow-sm">
          <span className="text-slate-400">HISTORICAL BASELINE:</span>
          <span className="text-slate-200 font-bold">
            {convertTemperature(histAvg, tempUnit)}°{tempUnit}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">DEVIATION:</span>
          <span className={`font-bold ${deviation > 0 ? "text-orange-400" : "text-cyan-400"}`}>
            {formatDeviation(deviation, tempUnit)}
          </span>
        </div>
      </div>

      {/* 8-Card 3D Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {cards.map((card) => {
          const Icon = card.icon;
          const status = getStatusBadge(card.dev);
          const convertedVal = convertTemperature(card.rawVal, tempUnit);
          const minNormal = convertTemperature(card.normalRange[0], tempUnit);
          const maxNormal = convertTemperature(card.normalRange[1], tempUnit);

          return (
            <TiltCard3D key={card.id} maxTilt={9} glowColor="rgba(0, 229, 255, 0.12)">
              <div className="card-3d rounded-xl p-4 border border-slate-800/80 hover:border-cyan-500/40 flex flex-col justify-between h-full">
                
                {/* Card Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider group-hover:text-cyan-400 transition-colors uppercase">
                    {card.title}
                  </span>
                  <div className="p-1.5 rounded-md bg-dark-900 border border-slate-700/60 text-slate-300 shadow-sm">
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                </div>

                {/* Value & Unit */}
                <div className="my-2">
                  <div className="flex items-baseline gap-1.5 font-mono">
                    <span className="text-3xl font-extrabold text-slate-100 tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                      {convertedVal}
                    </span>
                    <span className="text-lg font-bold text-cyan-400">
                      °{tempUnit}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5 font-sans">
                    {card.desc}
                  </div>
                </div>

                {/* Metadata: Normal Range, Deviation, Status */}
                <div className="pt-2 border-t border-slate-800/80 mt-2 space-y-1.5 font-mono text-[11px]">
                  
                  {/* Normal Range */}
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Normal:</span>
                    <span className="text-slate-300 font-medium">
                      {minNormal}–{maxNormal}°{tempUnit}
                    </span>
                  </div>

                  {/* Deviation & Trend */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      Trend {getTrendIcon(card.dev)}:
                    </span>
                    <span className={`font-semibold ${card.dev > 0 ? "text-orange-400" : "text-cyan-400"}`}>
                      {formatDeviation(card.dev, tempUnit)}
                    </span>
                  </div>

                  {/* Status Tag */}
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                </div>

              </div>
            </TiltCard3D>
          );
        })}
      </div>

    </div>
  );
}
