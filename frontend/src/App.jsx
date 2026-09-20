import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import LocationSearch from './components/LocationSearch';
import PrimaryWeatherHero from './components/PrimaryWeatherHero';
import Minimal3DGlobe from './components/Minimal3DGlobe';
import TemperatureGrid from './components/TemperatureGrid';
import AnomalyEngineCard from './components/AnomalyEngineCard';
import AnomalyExplanation from './components/AnomalyExplanation';
import WeatherParametersGrid from './components/WeatherParametersGrid';
import HistoricalComparison from './components/HistoricalComparison';
import WeatherCharts from './components/WeatherCharts';
import Forecast7Day from './components/Forecast7Day';
import AlertsPanel from './components/AlertsPanel';
import AIAssistantModal from './components/AIAssistantModal';
import ArchitectureModal from './components/ArchitectureModal';
import LoginModal from './components/LoginModal';
import RapidAtmosphericTicker from './components/RapidAtmosphericTicker';
import RegionalShiftRadar from './components/RegionalShiftRadar';
import TiltCard3D from './components/TiltCard3D';
import { fetchAllWeatherData, getPresetLocations } from './services/api';
import { ShieldAlert, AlertTriangle, RefreshCw, Cpu, Database, Radio, Activity, Globe } from 'lucide-react';

const DEFAULT_LOCATION = {
  city: "Bengaluru",
  state: "Karnataka",
  country: "India",
  latitude: 12.9716,
  longitude: 77.5946,
  elevation: 920
};

const DEFAULT_OPERATOR = {
  id: "OP-4329-CHIEF",
  name: "Dr. Aris Thorne",
  title: "Chief Synoptic Meteorologist",
  email: "commander@skyguard.ai",
  station: "WMO-43295 / Atmospheric Surveillance Ops",
  clearanceLevel: 4,
  clearanceLabel: "LEVEL 4 // FULL OVERRIDE",
  role: "CHIEF_FORECASTER"
};

// Web Audio synthesizer chime for critical alerts
function playTelemetryAlertTone() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // AudioContext policy
  }
}

export default function App() {
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);
  const [presetLocations, setPresetLocations] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [anomalyData, setAnomalyData] = useState(null);
  const [regionalShifts, setRegionalShifts] = useState(null);
  const [localDelta, setLocalDelta] = useState(null);
  const [tempUnit, setTempUnit] = useState(() => localStorage.getItem('skyguard_unit') || 'C');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefreshSec, setAutoRefreshSec] = useState(60);
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Authenticated operator state with localStorage persistence
  const [currentOperator, setCurrentOperator] = useState(() => {
    try {
      const saved = localStorage.getItem('skyguard_operator_session');
      return saved ? JSON.parse(saved) : DEFAULT_OPERATOR;
    } catch {
      return DEFAULT_OPERATOR;
    }
  });

  const prevSeverityRef = useRef('NORMAL');

  // Load presets on mount
  useEffect(() => {
    getPresetLocations()
      .then(presets => setPresetLocations(presets))
      .catch(() => {});
  }, []);

  // Primary data fetcher
  const loadData = useCallback(async (loc = currentLocation, demo = isDemoMode, scenario = currentScenario) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllWeatherData({
        city: loc.city,
        state: loc.state,
        country: loc.country,
        latitude: loc.latitude,
        longitude: loc.longitude,
        mode: demo ? 'demo' : 'auto',
        anomaly_scenario: scenario
      });

      setWeatherData(data.weather);
      setAnomalyData(data.anomaly);
      if (data.regional_shifts) {
        setRegionalShifts(data.regional_shifts);
      }
      if (data.local_delta) {
        setLocalDelta(data.local_delta);
      }

      // Play alert tone if severity jumped to WARNING or CRITICAL
      if (data.anomaly?.severity === 'CRITICAL' || data.anomaly?.severity === 'WARNING') {
        if (prevSeverityRef.current === 'NORMAL' || prevSeverityRef.current === 'WATCH') {
          if (soundAlertsEnabled) {
            playTelemetryAlertTone();
          }
        }
      }
      prevSeverityRef.current = data.anomaly?.severity || 'NORMAL';

    } catch (err) {
      console.error("Telemetry fetch failed:", err);
      setError(err.message || "Failed to load meteorological telemetry.");
    } finally {
      setIsLoading(false);
    }
  }, [currentLocation, isDemoMode, currentScenario, soundAlertsEnabled]);

  // Initial load and reload when location, demo mode, or scenario changes
  useEffect(() => {
    loadData(currentLocation, isDemoMode, currentScenario);
  }, [currentLocation, isDemoMode, currentScenario, loadData]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefreshSec || autoRefreshSec <= 0) return;
    const interval = setInterval(() => {
      loadData(currentLocation, isDemoMode, currentScenario);
    }, autoRefreshSec * 1000);
    return () => clearInterval(interval);
  }, [autoRefreshSec, currentLocation, isDemoMode, currentScenario, loadData]);

  const handleToggleTempUnit = (unit) => {
    setTempUnit(unit);
    localStorage.setItem('skyguard_unit', unit);
  };

  const handleToggleDemoMode = () => {
    setIsDemoMode(prev => !prev);
  };

  const handleSelectScenario = (scenario) => {
    setCurrentScenario(scenario);
  };

  const handleSelectLocation = (loc) => {
    setCurrentLocation(loc);
    setCurrentScenario(null);
  };

  const handleLoginSuccess = (user) => {
    setCurrentOperator(user);
    try {
      localStorage.setItem('skyguard_operator_session', JSON.stringify(user));
    } catch {}
  };

  const handleLogoutOperator = () => {
    setCurrentOperator(null);
    try {
      localStorage.removeItem('skyguard_operator_session');
    } catch {}
  };

  const handleFocusRadar = () => {
    const radarElem = document.getElementById('regional-shift-radar');
    if (radarElem) {
      radarElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const bgTheme = weatherData?.current?.theme || 'cloudy';
  const themeClass = `bg-theme-${bgTheme}`;

  return (
    <div className={`min-h-screen ${themeClass} text-slate-100 transition-colors duration-1000 flex flex-col justify-between`}>
      
      {/* Top Telemetry Header */}
      <Header
        tempUnit={tempUnit}
        onToggleTempUnit={handleToggleTempUnit}
        isDemoMode={isDemoMode || weatherData?.isDemo}
        onToggleDemoMode={handleToggleDemoMode}
        onRefresh={() => loadData(currentLocation, isDemoMode, currentScenario)}
        isLoading={isLoading}
        autoRefreshSec={autoRefreshSec}
        onChangeAutoRefresh={setAutoRefreshSec}
        soundAlertsEnabled={soundAlertsEnabled}
        onToggleSoundAlerts={() => setSoundAlertsEnabled(prev => !prev)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        currentOperator={currentOperator}
        onLogoutOperator={handleLogoutOperator}
        apiStatus={weatherData?.apiStatus || (isDemoMode ? "DEMO_MODE" : "CONNECTED")}
        dataQuality={weatherData?.dataQuality || 99.2}
      />

      {/* Emergency Rapid Atmospheric Ticker Banner */}
      <RapidAtmosphericTicker
        regionalShifts={regionalShifts}
        localDelta={localDelta}
        onFocusRadar={handleFocusRadar}
      />

      {/* Main Container */}
      <main className="max-w-[1750px] w-full mx-auto px-4 lg:px-8 py-6 flex-1">
        
        {/* Error Notification Banner if any */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 font-mono text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadData(currentLocation, isDemoMode, currentScenario)}
              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded border border-red-500/40 font-bold btn-3d"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* 1. Location Selection & Geocoding HUD */}
        <LocationSearch
          currentLocation={weatherData?.location || currentLocation}
          onSelectLocation={handleSelectLocation}
          presetLocations={presetLocations}
          isLoading={isLoading}
        />

        {/* Loading Skeleton State */}
        {isLoading && !weatherData ? (
          <div className="mt-6 space-y-6">
            <div className="h-64 rounded-xl glass-panel skeleton-shimmer" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-32 rounded-xl glass-panel skeleton-shimmer" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* 2. 3D Meteorological Command Section: Primary Weather Hero + 3D Earth Globe */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6 items-stretch">
              
              {/* Left (8 Cols): Primary Weather Hero with 3D Visualizer & Local Delta */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                <PrimaryWeatherHero
                  currentWeather={weatherData?.current}
                  location={weatherData?.location || currentLocation}
                  tempUnit={tempUnit}
                  anomalyStatus={anomalyData?.severity || 'NORMAL'}
                  anomalyPercentage={anomalyData?.percentage || 8}
                  lastUpdated={weatherData?.lastUpdated}
                  isDemo={weatherData?.isDemo || isDemoMode}
                  dataSourceLabel={weatherData?.dataSourceLabel}
                  localDelta={localDelta}
                />
              </div>

              {/* Right (4 Cols): Minimalist 3D Interactive Meteorological Globe */}
              <div className="lg:col-span-4 h-full flex flex-col">
                <TiltCard3D maxTilt={6} glowColor="rgba(56, 189, 248, 0.15)" className="h-full">
                  <div className="card-3d rounded-2xl p-3 border border-slate-800 h-full flex flex-col justify-between">
                    <Minimal3DGlobe
                      currentLocation={weatherData?.location || currentLocation}
                      onSelectLocation={handleSelectLocation}
                      presetLocations={presetLocations}
                    />
                  </div>
                </TiltCard3D>
              </div>

            </div>

            {/* 3. Dedicated Planetary Atmospheric Delta & Regional Shift Radar */}
            <RegionalShiftRadar
              regionalShifts={regionalShifts}
              localDelta={localDelta}
              onSelectRegionCoordinates={(coords) => {
                handleSelectLocation(coords);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 4. AI / ML Anomaly Detection Engine Card (with 3D Gyroscope Hologram) */}
            <AnomalyEngineCard
              anomalyData={anomalyData}
              onSelectScenario={handleSelectScenario}
              currentScenario={currentScenario}
            />

            {/* 5. Anomaly Causal Explanation & Multi-Parameter Risk Panel */}
            <AnomalyExplanation
              anomalyData={anomalyData}
              tempUnit={tempUnit}
            />

            {/* 6. 8-Type Dedicated Temperature Monitoring Suite */}
            <TemperatureGrid
              currentWeather={weatherData?.current}
              historicalComparison={weatherData?.historical_comparison}
              tempUnit={tempUnit}
            />

            {/* 7. Atmospheric Telemetry Parameters & Air Quality */}
            <WeatherParametersGrid
              currentWeather={weatherData?.current}
            />

            {/* 8. Current vs Historical Climate Horizons */}
            <HistoricalComparison
              historicalData={weatherData?.historical_comparison}
              currentTemp={weatherData?.current?.temperature ?? 28}
              tempUnit={tempUnit}
            />

            {/* 9. Interactive Meteorological Charts (8 Tabs) */}
            <WeatherCharts
              hourlyTrends={weatherData?.hourly_trends || []}
              anomalyScore={anomalyData?.percentage || 8}
              tempUnit={tempUnit}
            />

            {/* 10. 7-Day Forecast & Anomaly Projections */}
            <Forecast7Day
              forecast={weatherData?.forecast || []}
              tempUnit={tempUnit}
            />

            {/* 11. Intelligent Weather Alerts Feed */}
            <AlertsPanel
              alerts={anomalyData?.alerts || []}
              anomalyStatus={anomalyData?.severity || 'NORMAL'}
            />
          </>
        )}

      </main>

      {/* Footer & Telemetry Health */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-5 px-4 lg:px-8 mt-12 text-xs font-mono text-slate-500">
        <div className="max-w-[1750px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sky-400 font-bold tracking-wider">SKYGUARD AI</span>
            <span>•</span>
            <span>SYNOPTIC ATMOSPHERIC SURVEILLANCE & SHIFT RADAR</span>
            <span>•</span>
            <span className="text-slate-400">OPERATIONAL EDITION v3.0</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Activity className="w-3.5 h-3.5" /> SURVEILLANCE ACTIVE
            </span>
            <span>•</span>
            <span className="text-slate-400">
              STATION: {currentLocation.city}, {currentLocation.country}
            </span>
          </div>
        </div>
      </footer>

      {/* Operator Authentication Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentOperator={currentOperator}
      />

      {/* Interactive AI Meteorological Copilot Drawer */}
      <AIAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        weatherContext={{
          current: weatherData?.current,
          location: weatherData?.location || currentLocation,
          anomaly: anomalyData,
          regionalShifts: regionalShifts,
          localDelta: localDelta
        }}
      />

      {/* System Architecture Specification Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

    </div>
  );
}
