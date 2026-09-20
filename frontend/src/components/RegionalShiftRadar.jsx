import React, { useState } from 'react';
import { 
  Compass, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  AlertOctagon, 
  Wind, 
  Thermometer, 
  Gauge, 
  Layers, 
  ShieldAlert, 
  Activity, 
  Plane, 
  Anchor, 
  Zap, 
  CheckCircle2, 
  Info,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import TiltCard3D from './TiltCard3D';

export default function RegionalShiftRadar({ regionalShifts, localDelta, onSelectRegionCoordinates }) {
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'DROPS', 'SURGES', 'CRITICAL'
  const [expandedSectorId, setExpandedSectorId] = useState(null);

  const sectors = regionalShifts?.sectors || [];

  // Filter sectors according to user selection
  const filteredSectors = sectors.filter(sec => {
    if (filter === 'CRITICAL') return sec.status === 'CRITICAL';
    if (filter === 'DROPS') return sec.liveDeltaP < 0 || sec.liveDeltaT < -3;
    if (filter === 'SURGES') return sec.liveDeltaP > 0 || sec.liveDeltaT > 3;
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CRITICAL':
        return 'bg-red-500/15 text-red-400 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      case 'WARNING':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
      case 'WATCH':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/40';
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <section id="regional-shift-radar" className="mt-8">
      <div className="card-3d rounded-2xl p-5 md:p-6 border border-slate-800 bg-slate-900/90 shadow-2xl space-y-6">
        
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <Compass className="w-5 h-5 text-amber-400 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg md:text-xl font-bold font-mono text-slate-100 tracking-wider">
                    PLANETARY ATMOSPHERIC DELTA & REGIONAL SHIFT RADAR
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
                    REAL-TIME DELTA
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono tracking-wide">
                  Autonomous detection of sudden barometric drops/surges (ΔP/3h) and thermal shocks (ΔT/1h) across global synoptic sectors
                </p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
            <span className="text-slate-500 flex items-center gap-1 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> SECTOR FILTER:
            </span>

            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filter === 'ALL'
                  ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              All 6 Sectors ({sectors.length})
            </button>

            <button
              onClick={() => setFilter('DROPS')}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                filter === 'DROPS'
                  ? 'bg-red-500 text-slate-950 font-bold border-red-400 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5 text-red-400" />
              <span>Sudden Drops (↓)</span>
            </button>

            <button
              onClick={() => setFilter('SURGES')}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                filter === 'SURGES'
                  ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sudden Surges (↑)</span>
            </button>

            <button
              onClick={() => setFilter('CRITICAL')}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                filter === 'CRITICAL'
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
              <span>Critical Only ({sectors.filter(s => s.status === 'CRITICAL').length})</span>
            </button>
          </div>
        </div>

        {/* Local Rate-of-Change Summary Bar (if available) */}
        {localDelta && (
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="text-slate-400">ACTIVE STATION ATMOSPHERIC TENDENCY:</span>{' '}
                <span className="font-bold text-slate-200">
                  {localDelta.barometricTendency.replace('_', ' ')}
                </span>
                {localDelta.alertMessage && (
                  <span className="ml-2 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px]">
                    {localDelta.alertMessage}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-300">
              <div>
                <span className="text-slate-500">ΔP (3h): </span>
                <span className={`font-bold ${localDelta.deltaP_3h < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {localDelta.deltaP_3h > 0 ? `+${localDelta.deltaP_3h}` : localDelta.deltaP_3h} hPa
                </span>
              </div>
              <div>
                <span className="text-slate-500">ΔT (1h): </span>
                <span className={`font-bold ${localDelta.deltaT_1h < 0 ? 'text-blue-300' : 'text-amber-300'}`}>
                  {localDelta.deltaT_1h > 0 ? `+${localDelta.deltaT_1h}` : localDelta.deltaT_1h}°C
                </span>
              </div>
              <div>
                <span className="text-slate-500">GUST SHEAR: </span>
                <span className="font-bold text-sky-300">+{localDelta.windGustDelta} km/h</span>
              </div>
            </div>
          </div>
        )}

        {/* Planetary Synoptic Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSectors.map((sector) => {
            const isExpanded = expandedSectorId === sector.id;
            const isPressureDrop = sector.liveDeltaP < 0;
            const isTempPlunge = sector.liveDeltaT < 0;

            return (
              <div
                key={sector.id}
                className="rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-all p-4 space-y-4 flex flex-col justify-between"
              >
                
                {/* Sector Top Strip */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider">
                        {sector.id} • {sector.region.toUpperCase()}
                      </span>
                      <h3 className="text-sm font-bold font-mono text-slate-100 leading-snug">
                        {sector.name}
                      </h3>
                    </div>

                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border tracking-wider shrink-0 ${getStatusBadge(sector.status)}`}>
                      {sector.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-mono">
                    {sector.subregions.join(' • ')}
                  </p>
                </div>

                {/* Quantitative Rate-of-Change Gauges */}
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono">
                  
                  {/* Delta P (Pressure Tendency) */}
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[10px] flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-slate-400" />
                      3-HR BAROMETRIC ΔP
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isPressureDrop ? (
                        <TrendingDown className="w-4 h-4 text-red-400 shrink-0" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <span className={`text-base font-bold tracking-tight ${isPressureDrop ? 'text-red-400' : 'text-emerald-400'}`}>
                        {sector.liveDeltaP > 0 ? `+${sector.liveDeltaP}` : sector.liveDeltaP} hPa
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {isPressureDrop ? 'RAPID PLUNGE' : 'HIGH SURGE'} ({sector.currentPressure} hPa)
                    </span>
                  </div>

                  {/* Delta T (Thermal Shock) */}
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[10px] flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-slate-400" />
                      HOURLY THERMAL ΔT
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isTempPlunge ? (
                        <TrendingDown className="w-4 h-4 text-sky-400 shrink-0" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span className={`text-base font-bold tracking-tight ${isTempPlunge ? 'text-sky-300' : 'text-amber-300'}`}>
                        {sector.liveDeltaT > 0 ? `+${sector.liveDeltaT}` : sector.liveDeltaT}°C
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {isTempPlunge ? 'COLD INFLUX' : 'THERMAL BURST'} ({sector.currentTemp}°C)
                    </span>
                  </div>

                </div>

                {/* Classification & Mechanism */}
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{sector.warningType.replace(/_/g, ' ')}</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      {sector.phenomenon}
                    </p>
                  </div>

                  {/* Expandable Impact Bulletin */}
                  {isExpanded ? (
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] font-mono space-y-2">
                      <div className="text-slate-300 leading-relaxed">
                        <strong className="text-sky-400">Impact Advisory:</strong> {sector.impactAdvisory}
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        <strong>Affected Territories:</strong> {sector.affectedCountries.join(', ')}
                      </div>
                      <div className="text-slate-400 text-[10px] flex items-center justify-between">
                        <span>Gust Shear: +{sector.windGustDelta} km/h</span>
                        <span className="text-emerald-400">● Live Synoptic Stream</span>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Bottom Action Strip */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono">
                  <button
                    onClick={() => setExpandedSectorId(isExpanded ? null : sector.id)}
                    className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 text-[11px]"
                  >
                    <span>{isExpanded ? 'Collapse Advisory' : 'Expand Advisory'}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {onSelectRegionCoordinates && (
                    <button
                      onClick={() => onSelectRegionCoordinates({
                        city: sector.subregions[0],
                        country: sector.affectedCountries[0],
                        latitude: sector.referenceCoords.lat,
                        longitude: sector.referenceCoords.lon
                      })}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 text-[11px] transition-all font-bold"
                    >
                      Target Sector
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
