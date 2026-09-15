# GARUDA // AWS INTELLIGENT WEATHER MONITOR
> **AI/ML BASED WEATHER ANOMALY DETECTION SYSTEM**  
> *AWS = Automatic Weather Status*

GARUDA is an advanced, production-grade meteorological intelligence center and machine learning anomaly detection platform. It continuously tracks 24 environmental and biometeorological parameters, cross-references observations against 30-year location-calibrated climate baselines, generates composite anomaly scores using an Isolation Forest ensemble, and provides an interactive AI Meteorological Copilot.

---

## Key Features

1. **Location Intelligence**: Global geocoding search for any city, state, or country, GPS geolocation, station presets, coordinates & elevation telemetry.
2. **8-Temperature Suite**: Real-time observation of Ambient Dry-Bulb, Feels-Like, Daily Min/Max, Dew-Point, Wet-Bulb (Stull formula), Apparent Temperature (Steadman formula), and Soil Temperature (0cm) with °C/°F unit toggles.
3. **AI/ML Anomaly Engine**: 24-feature Isolation Forest & Mahalanobis model, location-aware Köppen climate normals, real-time anomaly score (0–100%), and 4-tier classification:
   - `NORMAL` (0–20%)
   - `WATCH` (21–40%)
   - `WARNING` (41–70%)
   - `CRITICAL` (71–100%)
4. **Causal Anomaly Analysis**: Dynamic explanations for heatwaves, cold snaps, barometric troughs, and multi-variable compound events (e.g. pressure crash + wind surge + humidity surge = storm front precursor).
5. **Atmospheric Parameters & AQI**: Atmospheric pressure, wind speed/bearing/gusts, precipitation probability, UV index, optical visibility, cloud cover, and 6-gas air quality breakdown (PM2.5, PM10, CO, NO2, SO2, O3).
6. **Time-Series Visualizations**: 8 interactive Recharts panels covering 24h temperature, humidity, barometric pressure, wind, rainfall, and anomaly trends.
7. **7-Day Forecast**: Day-by-day temperature ranges, condition icons, rain probabilities, and AI anomaly projections.
8. **Intelligent Weather Alerts**: Live stream of alerts with severity, observed vs expected values, deviation, and confidence rating.
9. **GARUDA AI Meteorological Copilot**: Interactive assistant for anomaly interpretation, microclimate analysis, formula explanations, and safety precautions.
10. **Dual Mode Architecture**: Operates with Live Open-Meteo worldwide feeds (no API key required) and Realistic Demo Mode for offline resilience.

---

## Quick Start

### Option 1: One-Click Launch (Windows)
Double-click:
```cmd
start.bat
```

### Option 2: Manual Terminal Startup
```bash
# Terminal 1: Backend
cd backend
npm install
npm start

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

Visit the dashboard in your browser:
**`http://localhost:3000`**

---

## Documentation
- [System Architecture](docs/ARCHITECTURE.md)
- [Machine Learning Specification](docs/ML_MODEL.md)
- [API Reference](docs/API.md)
- [Setup & Deployment Guide](docs/SETUP.md)
