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
  const [tempUnit, setTempUnit] = useState(() => localStorage.getItem('garuda_unit') || 'C');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefreshSec, setAutoRefreshSec] = useState(60);
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

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
    localStorage.setItem('garuda_unit', unit);
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
        apiStatus={weatherData?.apiStatus || (isDemoMode ? "DEMO_MODE" : "CONNECTED")}
        dataQuality={weatherData?.dataQuality || 98.7}
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
              
              {/* Left (8 Cols): Primary Weather Hero with 3D Visualizer */}
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
                />
              </div>

              {/* Right (4 Cols): Minimalist 3D Interactive Meteorological Globe */}
              <div className="lg:col-span-4 h-full flex flex-col">
                <TiltCard3D maxTilt={6} glowColor="rgba(0, 229, 255, 0.15)" className="h-full">
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

            {/* 3. AI / ML Anomaly Detection Engine Card (with 3D Gyroscope Hologram) */}
            <AnomalyEngineCard
              anomalyData={anomalyData}
              onSelectScenario={handleSelectScenario}
              currentScenario={currentScenario}
            />

            {/* 4. Anomaly Causal Explanation & Multi-Parameter Risk Panel */}
            <AnomalyExplanation
              anomalyData={anomalyData}
              tempUnit={tempUnit}
            />

            {/* 5. 8-Type Dedicated Temperature Monitoring Suite (with 3D Tactile Physics) */}
            <TemperatureGrid
              currentWeather={weatherData?.current}
              historicalComparison={weatherData?.historical_comparison}
              tempUnit={tempUnit}
            />

            {/* 6. Atmospheric Telemetry Parameters & Air Quality */}
            <WeatherParametersGrid
              currentWeather={weatherData?.current}
            />

            {/* 7. Current vs Historical Climate Horizons */}
            <HistoricalComparison
              historicalData={weatherData?.historical_comparison}
              currentTemp={weatherData?.current?.temperature ?? 28}
              tempUnit={tempUnit}
            />

            {/* 8. Interactive Meteorological Charts (8 Tabs) */}
            <WeatherCharts
              hourlyTrends={weatherData?.hourly_trends || []}
              anomalyScore={anomalyData?.percentage || 8}
              tempUnit={tempUnit}
            />

            {/* 9. 7-Day Forecast & Anomaly Projections */}
            <Forecast7Day
              forecast={weatherData?.forecast || []}
              tempUnit={tempUnit}
            />

            {/* 10. Intelligent Weather Alerts Feed */}
            <AlertsPanel
              alerts={anomalyData?.alerts || []}
              anomalyStatus={anomalyData?.severity || 'NORMAL'}
            />
          </>
        )}

      </main>

      {/* Footer & Telemetry Health */}
      <footer className="border-t border-slate-800/80 bg-dark-900/90 py-5 px-4 lg:px-8 mt-12 text-xs font-mono text-slate-500">
        <div className="max-w-[1750px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold tracking-wider">GARUDA // AWS</span>
            <span>•</span>
            <span>INTELLIGENT WEATHER ANOMALY DETECTION PLATFORM</span>
            <span>•</span>
            <span className="text-slate-400">MINIMALIST 3D EDITION</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Activity className="w-3.5 h-3.5" /> SYSTEM OPERATIONAL
            </span>
            <span>•</span>
            <span className="text-slate-400">
              STATION: {currentLocation.city}, {currentLocation.country}
            </span>
          </div>
        </div>
      </footer>

      {/* Interactive AI Meteorological Copilot Drawer */}
      <AIAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        weatherContext={{
          current: weatherData?.current,
          location: weatherData?.location || currentLocation,
          anomaly: anomalyData
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
