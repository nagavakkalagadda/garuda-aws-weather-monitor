# GARUDA // REST API Reference Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Weather Telemetry Endpoints

### `GET /weather/all`
Fetches synchronized weather observations, 7-day forecast, air quality, 24-hour trends, historical comparison, and AI anomaly detection in one coordinated payload.

**Query Parameters:**
- `city` (string, optional): City name (e.g., `Bengaluru`)
- `state` (string, optional): State/Region
- `country` (string, optional): Country
- `latitude` (float, required if no city): Latitude coordinate
- `longitude` (float, required if no city): Longitude coordinate
- `mode` (string, optional): `auto` (default, live feeds) or `demo` (offline realistic simulation)
- `anomaly_scenario` (string, optional): Test scenarios: `heatwave`, `storm`, or `cold_snap`

**Example Request:**
```bash
curl "http://localhost:5000/api/weather/all?city=Bengaluru&latitude=12.9716&longitude=77.5946"
```

**Example Response:**
```json
{
  "success": true,
  "weather": {
    "isDemo": false,
    "dataSourceLabel": "LIVE TELEMETRY (OPEN-METEO)",
    "apiStatus": "CONNECTED",
    "dataQuality": 98.8,
    "lastUpdated": "19:55:12",
    "location": {
      "city": "Bengaluru",
      "state": "Karnataka",
      "country": "India",
      "latitude": 12.9716,
      "longitude": 77.5946
    },
    "current": {
      "temperature": 28.0,
      "feels_like": 29.5,
      "condition": "Partly Cloudy",
      "icon": "cloud-sun",
      "dew_point": 20.4,
      "wet_bulb": 22.5,
      "apparent_temperature": 29.5,
      "soil_temperature": 27.2,
      "humidity": 62,
      "pressure": 916,
      "wind_speed": 14.5,
      "wind_direction": 245,
      "air_quality": {
        "pm2_5": 28.5,
        "pm10": 48.0,
        "aqi_status": "Good"
      }
    },
    "forecast": [ ... ],
    "hourly_trends": [ ... ]
  },
  "anomaly": {
    "score": 0.08,
    "percentage": 8,
    "severity": "NORMAL",
    "confidence": 0.94,
    "model_status": "ACTIVE",
    "pattern": "STABLE CLIMATOLOGICAL EQUILIBRIUM",
    "features_analyzed": 24,
    "explanation": "No significant weather anomaly detected. All atmospheric metrics remain within standard 2-sigma climatological bounds for Bengaluru."
  }
}
```

---

## 2. Anomaly Detection Endpoint

### `POST /anomaly/detect`
Evaluates weather telemetry features against location climate baselines and returns anomaly score, severity classification, and causal explanation.

**Request Body:**
```json
{
  "location": {
    "city": "Bengaluru",
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "weather": {
    "temperature": 36.5,
    "humidity": 75,
    "pressure": 998,
    "wind_speed": 28
  }
}
```

**Response:**
```json
{
  "success": true,
  "score": 0.99,
  "percentage": 99,
  "severity": "CRITICAL",
  "confidence": 0.94,
  "pattern": "EXTREME METEOROLOGICAL DISRUPTION",
  "explanation": "CRITICAL COMPOUND ANOMALY: Rapid barometric pressure drop paired with elevated wind gusts...",
  "alerts": [ ... ]
}
```

---

## 3. Location Management Endpoints

### `GET /location/search`
Search for any city, state, or country worldwide.
```bash
curl "http://localhost:5000/api/location/search?query=London"
```

### `GET /location/presets`
Returns major default meteorological stations (Bengaluru, Hyderabad, Mumbai, Delhi, Chennai, Kolkata, London, New York, Tokyo).

---

## 4. AI Meteorological Assistant Endpoint

### `POST /assistant/chat`
Answers questions regarding anomalies, thermodynamic formulas, and safety protocols with full awareness of current telemetry.

**Request Body:**
```json
{
  "query": "Why is the anomaly status currently Normal?",
  "context": {
    "location": { "city": "Bengaluru" },
    "weather": { "temperature": 28, "humidity": 62 },
    "anomaly": { "severity": "NORMAL", "percentage": 8 }
  }
}
```

---

## 5. Telemetry & Health Endpoint

### `GET /telemetry/status`
Returns live subsystem connectivity for weather API, ML engine, database, and system uptime.
