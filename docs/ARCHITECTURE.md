# GARUDA // System Architecture

**AWS // INTELLIGENT WEATHER MONITOR** (GARUDA v2.0)  
*AI/ML Based Meteorological Anomaly Detection & Intelligence Platform*

---

## 1. High-Level Architecture Overview

GARUDA is built as an enterprise-grade, full-stack meteorological intelligence and anomaly detection platform. It decouples data ingestion, machine learning inference, and UI rendering into specialized, resilient services.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (React 18 + Vite)                       │
│  - Minimalist Futuristic Meteorological Command HUD                     │
│  - Dynamic Atmospheric Background (Clear, Cloud, Rain, Storm, Heat)     │
│  - 8-Temperature Thermodynamic Grid (°C / °F)                           │
│  - Anomaly Score Circular Gauge & Scenario Simulator                    │
│  - 8 Time-Series Meteorological Recharts (Temp, Baro, Wind, etc.)       │
│  - GARUDA AI Meteorological Copilot / Assistant Modal                   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ REST API (JSON)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   BACKEND GATEWAY LAYER (Node.js)                       │
│  - Express REST Router (/api/weather, /api/anomaly, /api/location, etc) │
│  - WeatherProvider Abstraction (Open-Meteo Worldwide HD + Demo Mode)    │
│  - Resilient Anomaly Orchestrator (Python Bridge + Builtin Fallback)   │
│  - Geocoding and Reverse Coordinate Resolver                            │
│  - Telemetry & Health Stream Manager                                    │
└──────────────────┬─────────────────────────────────┬────────────────────┘
                   │                                 │
     ML HTTP Calls │                                 │ Worldwide Data Feeds
                   ▼                                 ▼
┌──────────────────────────────────────┐   ┌──────────────────────────────┐
│       ML MICROSERVICE (Python)       │   │    METEOROLOGICAL PROVIDER   │
│  - Scikit-Learn IsolationForest      │   │ - Open-Meteo Worldwide HD    │
│  - Köppen Climate Baselines          │   │ - Open-Meteo Air Quality     │
│  - 24-Feature Vector Extraction      │   │ - Realistic Demo Provider    │
│  - Compound Synergy Anomaly Detector │   │   (15+ Global Cities)        │
│  - Causal Meteorological Explainer   │   └──────────────────────────────┘
└──────────────────┬───────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   PERSISTENCE LAYER (PostgreSQL Ready)                  │
│  - users, locations, weather_readings, historical_weather               │
│  - anomaly_results, weather_alerts, model_predictions, system_logs      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Subsystems

### 2.1 Frontend Interface Layer (`/frontend`)
- **Technology**: React 18, Vite 5, Tailwind CSS, Lucide Icons, Recharts.
- **Visual Design**: Sleek dark scientific terminal theme with glassmorphism, subtle cyan/emerald glow accents, radar scanning animation, and adaptive atmospheric gradients that react to live weather conditions (clear sky, overcast, rain, thunderstorms, fog, snowfall, extreme heat).
- **Responsiveness**: Fluid layout catering to 4K/Desktop widescreen, two-column Tablet layout, and single-column Mobile view with safe-area padding.

### 2.2 API Gateway & Provider Layer (`/backend`)
- **WeatherProvider Abstraction**: Decouples third-party meteorological vendors from business logic.
  - `OpenMeteoProvider`: Zero-credential, high-resolution worldwide live weather and air quality telemetry.
  - `RealisticDemoProvider`: Offline simulation for 15+ major global met stations with simulated diurnal curves and seasonal normals.
- **Resilient AI/ML Bridge**: Sends requests to the Python FastAPI microservice (`http://127.0.0.1:8000/detect`). If the Python process is offline, it executes the identical multivariate algorithm internally so the system never fails.

### 2.3 Machine Learning Microservice (`/ml`)
- **Technology**: Python 3.10+, FastAPI, Scikit-Learn, NumPy, Pandas.
- **Engine**: Hybrid ensemble combining an `IsolationForest` unsupervised tree estimator with location-aware multivariate Mahalanobis distance metrics.
- **Location Baselines**: Calibrated against latitude bands, elevation, month, and solar diurnal radiation curves.

### 2.4 Database Architecture (`/database`)
- Fully normalized relational schema ready for PostgreSQL or TimescaleDB time-series optimization.
- Stores historical readings, anomaly classifications, model feature vectors, user acknowledgments, and audit logs.

---

## 3. Security & Fault Tolerance
1. **Zero Secret Leaks**: All credentials and endpoints are managed through server-side `.env` files; client bundles never contain private API keys.
2. **Graceful Fallbacks**: If external APIs fail or timeout, the system automatically transitions into Realistic Demo Mode and tags the UI with `DEMO DATA` to ensure absolute transparency.
3. **Resilient ML Engine**: Python unavailability is handled silently by the embedded JavaScript multivariate baseline engine without disrupting dashboard telemetry.
