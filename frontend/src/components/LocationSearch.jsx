import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Crosshair, 
  Star, 
  History, 
  Navigation, 
  Globe, 
  Building2,
  Flag,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { searchLocations } from '../services/api';

// Curated global lists for instant exploration
const EXPLORE_COUNTRIES = [
  { city: "New Delhi", state: "Delhi NCR", country: "India", latitude: 28.6139, longitude: 77.2090, label: "India" },
  { city: "Washington, D.C.", state: "District of Columbia", country: "United States", latitude: 38.9072, longitude: -77.0369, label: "United States" },
  { city: "London", state: "Greater London", country: "United Kingdom", latitude: 51.5074, longitude: -0.1278, label: "United Kingdom" },
  { city: "Tokyo", state: "Kanto", country: "Japan", latitude: 35.6762, longitude: 139.6503, label: "Japan" },
  { city: "Berlin", state: "Berlin", country: "Germany", latitude: 52.5200, longitude: 13.4050, label: "Germany" },
  { city: "Paris", state: "Île-de-France", country: "France", latitude: 48.8566, longitude: 2.3522, label: "France" },
  { city: "Canberra", state: "ACT", country: "Australia", latitude: -35.2809, longitude: 149.1300, label: "Australia" },
  { city: "Ottawa", state: "Ontario", country: "Canada", latitude: 45.4215, longitude: -75.6972, label: "Canada" },
  { city: "Dubai", state: "Dubai", country: "United Arab Emirates", latitude: 25.2048, longitude: 55.2708, label: "UAE" },
  { city: "Singapore", state: "Singapore", country: "Singapore", latitude: 1.3521, longitude: 103.8198, label: "Singapore" },
  { city: "Brasília", state: "Federal District", country: "Brazil", latitude: -15.7975, longitude: -47.8919, label: "Brazil" },
  { city: "Rome", state: "Lazio", country: "Italy", latitude: 41.9028, longitude: 12.4964, label: "Italy" }
];

const EXPLORE_STATES = [
  { city: "Los Angeles", state: "California", country: "United States", latitude: 34.0522, longitude: -118.2437, label: "California (US)" },
  { city: "Houston", state: "Texas", country: "United States", latitude: 29.7604, longitude: -95.3698, label: "Texas (US)" },
  { city: "Miami", state: "Florida", country: "United States", latitude: 25.7617, longitude: -80.1918, label: "Florida (US)" },
  { city: "New York City", state: "New York", country: "United States", latitude: 40.7128, longitude: -74.0060, label: "New York (US)" },
  { city: "Bengaluru", state: "Karnataka", country: "India", latitude: 12.9716, longitude: 77.5946, label: "Karnataka (IN)" },
  { city: "Mumbai", state: "Maharashtra", country: "India", latitude: 19.0760, longitude: 72.8777, label: "Maharashtra (IN)" },
  { city: "Chennai", state: "Tamil Nadu", country: "India", latitude: 13.0827, longitude: 80.2707, label: "Tamil Nadu (IN)" },
  { city: "Hyderabad", state: "Telangana", country: "India", latitude: 17.3850, longitude: 78.4867, label: "Telangana (IN)" },
  { city: "Jaipur", state: "Rajasthan", country: "India", latitude: 26.9124, longitude: 75.7873, label: "Rajasthan (IN)" },
  { city: "Ahmedabad", state: "Gujarat", country: "India", latitude: 23.0225, longitude: 72.5714, label: "Gujarat (IN)" },
  { city: "Toronto", state: "Ontario", country: "Canada", latitude: 43.6532, longitude: -79.3832, label: "Ontario (CA)" },
  { city: "Sydney", state: "New South Wales", country: "Australia", latitude: -33.8688, longitude: 151.2093, label: "NSW (AU)" }
];

export default function LocationSearch({
  currentLocation,
  onSelectLocation,
  presetLocations = [],
  isLoading
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('countries'); // 'countries', 'states', 'cities', 'favorites'

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('garuda_favorites');
      return saved ? JSON.parse(saved) : [
        { city: "Bengaluru", state: "Karnataka", country: "India", latitude: 12.9716, longitude: 77.5946 },
        { city: "Delhi", state: "NCR", country: "India", latitude: 28.6139, longitude: 77.2090 }
      ];
    } catch {
      return [];
    }
  });

  const [recentLocations, setRecentLocations] = useState(() => {
    try {
      const saved = localStorage.getItem('garuda_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const searchTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await searchLocations(query);
        setResults(res);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc) => {
    onSelectLocation(loc);
    setIsOpen(false);
    setQuery('');

    // Add to recents
    setRecentLocations((prev) => {
      const filtered = prev.filter(item => item.city.toLowerCase() !== loc.city.toLowerCase());
      const updated = [loc, ...filtered].slice(0, 8);
      localStorage.setItem('garuda_recent', JSON.stringify(updated));
      return updated;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0) {
        handleSelect(results[0]);
      } else if (query.trim()) {
        searchLocations(query).then(res => {
          if (res && res.length > 0) handleSelect(res[0]);
        });
      }
    }
  };

  const toggleFavorite = (loc) => {
    setFavorites((prev) => {
      const exists = prev.some(item => item.city.toLowerCase() === loc.city.toLowerCase());
      let updated;
      if (exists) {
        updated = prev.filter(item => item.city.toLowerCase() !== loc.city.toLowerCase());
      } else {
        updated = [...prev, loc];
      }
      localStorage.setItem('garuda_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        handleSelect({
          city: "Local Sensor Station",
          state: "Current GPS Location",
          country: "Live Position",
          latitude: parseFloat(latitude.toFixed(4)),
          longitude: parseFloat(longitude.toFixed(4)),
          elevation: 0
        });
      },
      (err) => {
        alert(`Geolocation failed: ${err.message}. Using default station.`);
      },
      { timeout: 8000 }
    );
  };

  const isCurrentFavorite = favorites.some(
    f => f.city.toLowerCase() === (currentLocation?.city || '').toLowerCase()
  );

  const latDisplay = currentLocation?.latitude !== undefined
    ? `${Math.abs(currentLocation.latitude).toFixed(4)}° ${currentLocation.latitude >= 0 ? 'N' : 'S'}`
    : '12.9716° N';

  const lonDisplay = currentLocation?.longitude !== undefined
    ? `${Math.abs(currentLocation.longitude).toFixed(4)}° ${currentLocation.longitude >= 0 ? 'E' : 'W'}`
    : '77.5946° E';

  return (
    <div className="card-3d rounded-2xl p-4 lg:p-6 border border-cyan-500/20 shadow-xl relative" ref={dropdownRef}>
      
      {/* Informative Worldwide Scope Banner */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <Globe className="w-4 h-4 animate-spin-slow" />
          <span>WORLDWIDE METEOROLOGICAL LOCATOR // ALL CITIES, STATES & COUNTRIES</span>
        </div>
        <span className="hidden sm:inline text-[11px] text-slate-400">
          Global Coverage (195+ Countries • 50,000+ Stations)
        </span>
      </div>

      {/* Top Search Input & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-4">
        
        {/* Search Bar Input */}
        <div className="relative flex-1">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search ANY City, State, or Country (e.g. California, India, Paris, Sydney, Tokyo, Texas)..."
              className="w-full glass-input pl-10 pr-24 py-2.5 rounded-lg text-sm font-mono placeholder:text-slate-500 transition-all"
            />
            
            {/* Quick Search Action Pill */}
            <div className="absolute right-2 flex items-center gap-1.5">
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-1" />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (results.length > 0) handleSelect(results[0]);
                  }}
                  className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 uppercase font-bold flex items-center gap-1 transition-all"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Autocomplete Search Dropdown */}
          {isOpen && (query.trim() || results.length > 0 || recentLocations.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-dark-850/95 backdrop-blur-xl border border-cyan-500/40 shadow-2xl z-50 overflow-hidden max-h-88 overflow-y-auto">
              
              {/* Search Results */}
              {results.length > 0 && (
                <div className="p-2">
                  <div className="text-[10px] font-mono text-cyan-400 px-3 py-1.5 uppercase tracking-wider font-bold border-b border-slate-800 flex items-center justify-between">
                    <span>Matching Global Locations ({results.length})</span>
                    <span className="text-slate-500 text-[9px]">Press Enter to select top</span>
                  </div>
                  {results.map((item, idx) => (
                    <button
                      key={`res-${idx}`}
                      onClick={() => handleSelect(item)}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-transparent transition-all flex items-center justify-between text-xs group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-md bg-dark-800 border border-slate-700/60 group-hover:border-cyan-500/40 text-cyan-400 shrink-0">
                          {item.matchedAs?.includes("Country") ? <Flag className="w-3.5 h-3.5" /> : (item.matchedAs?.includes("State") ? <Building2 className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                              {item.city}
                            </span>
                            {item.matchedAs && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
                                {item.matchedAs}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-normal">
                            {item.state ? `${item.state}, ` : ''}{item.country}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 group-hover:text-cyan-400">
                        {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* No results message */}
              {!isSearching && query.trim() && results.length === 0 && (
                <div className="p-5 text-center text-xs text-slate-400 font-mono">
                  No direct station match for "{query}". Searching global coordinate grids...
                </div>
              )}

              {/* Recent Locations */}
              {recentLocations.length > 0 && (
                <div className="p-2 border-t border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 px-3 py-1 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                    <History className="w-3 h-3 text-slate-400" /> Recent Stations
                  </div>
                  {recentLocations.map((item, idx) => (
                    <button
                      key={`rec-${idx}`}
                      onClick={() => handleSelect(item)}
                      className="w-full text-left px-3 py-1.5 rounded hover:bg-dark-750 text-xs text-slate-300 flex items-center justify-between"
                    >
                      <span className="font-semibold">{item.city}, {item.country}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.latitude?.toFixed(2)}°, {item.longitude?.toFixed(2)}°
                      </span>
                    </button>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>

        {/* GPS Current Location Button & Favorite Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleUseGeolocation}
            className="px-3.5 py-2.5 rounded-lg bg-dark-800 hover:bg-dark-750 border border-slate-700 hover:border-cyan-500/40 text-xs font-mono text-cyan-400 flex items-center gap-1.5 transition-all whitespace-nowrap btn-3d"
            title="Detect GPS coordinates from your device"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>GPS STATION</span>
          </button>

          <button
            onClick={() => currentLocation && toggleFavorite(currentLocation)}
            className={`p-2.5 rounded-lg border transition-all btn-3d ${
              isCurrentFavorite
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                : "bg-dark-800 text-slate-400 border-slate-700 hover:border-slate-500"
            }`}
            title={isCurrentFavorite ? "Remove from Favorite Stations" : "Add to Favorite Stations"}
          >
            <Star className={`w-4 h-4 ${isCurrentFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
          </button>
        </div>

      </div>

      {/* Primary Location HUD Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-dark-850/80 border border-slate-800 font-mono shadow-inner mb-4">
        
        {/* Location Name */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
            <MapPin className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              MONITORING LOCATION
            </div>
            <div className="text-base font-bold text-slate-100 tracking-wide truncate">
              {currentLocation?.city || 'Bengaluru'}
            </div>
            <div className="text-xs text-slate-400 truncate">
              {currentLocation?.state ? `${currentLocation.state}, ` : ''}{currentLocation?.country || 'India'}
            </div>
          </div>
        </div>

        {/* Latitude Readout */}
        <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4">
          <div className="p-2.5 rounded-lg bg-dark-800 border border-slate-700 text-slate-300 shrink-0">
            <Navigation className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              LATITUDE
            </div>
            <div className="text-sm font-bold text-slate-200">
              {latDisplay}
            </div>
            <div className="text-[11px] text-slate-400">
              Elevation: {currentLocation?.elevation || 920}m
            </div>
          </div>
        </div>

        {/* Longitude Readout */}
        <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4">
          <div className="p-2.5 rounded-lg bg-dark-800 border border-slate-700 text-slate-300 shrink-0">
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              LONGITUDE
            </div>
            <div className="text-sm font-bold text-slate-200">
              {lonDisplay}
            </div>
            <div className="text-[11px] text-slate-400">
              Zone: {currentLocation?.timezone || "Asia/Kolkata"}
            </div>
          </div>
        </div>

      </div>

      {/* Worldwide Geographic Explorer Tabs & Chips */}
      <div className="pt-2 border-t border-slate-800/80">
        
        {/* Explorer Category Selector */}
        <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">
              EXPLORE WORLD:
            </span>
            <button
              onClick={() => setActiveTab('countries')}
              className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1 ${
                activeTab === 'countries'
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "bg-dark-800 text-slate-300 hover:text-white border border-slate-700/60"
              }`}
            >
              <Flag className="w-3 h-3" /> Countries
            </button>
            <button
              onClick={() => setActiveTab('states')}
              className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1 ${
                activeTab === 'states'
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "bg-dark-800 text-slate-300 hover:text-white border border-slate-700/60"
              }`}
            >
              <Building2 className="w-3 h-3" /> States / Regions
            </button>
            <button
              onClick={() => setActiveTab('cities')}
              className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1 ${
                activeTab === 'cities'
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "bg-dark-800 text-slate-300 hover:text-white border border-slate-700/60"
              }`}
            >
              <MapPin className="w-3 h-3" /> Major Cities
            </button>
          </div>

          <span className="text-[10px] font-mono text-slate-500">
            Click any entry to load real-time telemetry
          </span>
        </div>

        {/* Dynamic Chips based on selected tab */}
        <div className="flex items-center gap-1.5 flex-wrap">
          
          {/* 1. Countries Tab */}
          {activeTab === 'countries' && EXPLORE_COUNTRIES.map((c, idx) => {
            const isActive = (currentLocation?.country || '').toLowerCase() === c.country.toLowerCase() && (currentLocation?.city || '').toLowerCase() === c.city.toLowerCase();
            return (
              <button
                key={`cntry-${idx}`}
                onClick={() => handleSelect(c)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all btn-3d ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.4)]"
                    : "bg-dark-850 hover:bg-dark-750 text-slate-300 border border-slate-700/60 hover:border-cyan-500/40"
                }`}
              >
                {c.label}
              </button>
            );
          })}

          {/* 2. States / Regions Tab */}
          {activeTab === 'states' && EXPLORE_STATES.map((s, idx) => {
            const isActive = (currentLocation?.state || '').toLowerCase() === s.state.toLowerCase();
            return (
              <button
                key={`st-${idx}`}
                onClick={() => handleSelect(s)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all btn-3d ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.4)]"
                    : "bg-dark-850 hover:bg-dark-750 text-slate-300 border border-slate-700/60 hover:border-cyan-500/40"
                }`}
              >
                {s.label}
              </button>
            );
          })}

          {/* 3. Major Cities Tab */}
          {activeTab === 'cities' && presetLocations.map((preset, idx) => {
            const isActive = (currentLocation?.city || '').toLowerCase() === preset.city.toLowerCase();
            return (
              <button
                key={`preset-${idx}`}
                onClick={() => handleSelect(preset)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all btn-3d ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.4)]"
                    : "bg-dark-850 hover:bg-dark-750 text-slate-300 border border-slate-700/60 hover:border-cyan-500/40"
                }`}
              >
                {preset.city}
              </button>
            );
          })}

        </div>

      </div>

    </div>
  );
}
