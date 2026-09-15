-- ============================================================
-- GARUDA // AWS INTELLIGENT WEATHER MONITOR
-- Production PostgreSQL Database Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & OPERATORS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    role VARCHAR(50) DEFAULT 'METEOROLOGIST_OPERATOR',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. MONITORING STATIONS & LOCATIONS
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    elevation NUMERIC(7, 2) DEFAULT 0.0,
    timezone VARCHAR(60) DEFAULT 'UTC',
    is_preset BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_location_coords UNIQUE (latitude, longitude)
);

-- 3. REAL-TIME WEATHER READINGS & TELEMETRY
CREATE TABLE IF NOT EXISTS weather_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    temperature NUMERIC(5, 2) NOT NULL,
    feels_like NUMERIC(5, 2) NOT NULL,
    min_temperature NUMERIC(5, 2),
    max_temperature NUMERIC(5, 2),
    dew_point NUMERIC(5, 2),
    wet_bulb NUMERIC(5, 2),
    apparent_temperature NUMERIC(5, 2),
    soil_temperature NUMERIC(5, 2),
    humidity NUMERIC(5, 2) NOT NULL,
    pressure NUMERIC(6, 2) NOT NULL,
    wind_speed NUMERIC(5, 2) NOT NULL,
    wind_direction NUMERIC(5, 2),
    wind_gust NUMERIC(5, 2),
    rainfall NUMERIC(6, 2) DEFAULT 0.0,
    precipitation_probability NUMERIC(5, 2) DEFAULT 0.0,
    uv_index NUMERIC(4, 2),
    visibility NUMERIC(5, 2),
    cloud_cover NUMERIC(5, 2),
    air_quality_pm25 NUMERIC(6, 2),
    air_quality_pm10 NUMERIC(6, 2),
    air_quality_co NUMERIC(7, 2),
    air_quality_no2 NUMERIC(6, 2),
    air_quality_so2 NUMERIC(6, 2),
    air_quality_o3 NUMERIC(6, 2),
    data_source VARCHAR(60) DEFAULT 'OPEN_METEO',
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_weather_location_time ON weather_readings(location_id, recorded_at DESC);

-- 4. HISTORICAL CLIMATE NORMALS & BASELINES
CREATE TABLE IF NOT EXISTS historical_weather (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    month SMALLINT NOT NULL CHECK (month BETWEEN 1 AND 12),
    day_of_month SMALLINT CHECK (day_of_month BETWEEN 1 AND 31),
    mean_temperature NUMERIC(5, 2) NOT NULL,
    std_temperature NUMERIC(5, 2) NOT NULL,
    historical_min_temp NUMERIC(5, 2),
    historical_max_temp NUMERIC(5, 2),
    mean_humidity NUMERIC(5, 2) NOT NULL,
    mean_pressure NUMERIC(6, 2) NOT NULL,
    mean_wind_speed NUMERIC(5, 2),
    baseline_source VARCHAR(100) DEFAULT 'KÖPPEN_CLIMATOLOGY_1991_2020',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. AI/ML ANOMALY DETECTION RESULTS
CREATE TABLE IF NOT EXISTS anomaly_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reading_id UUID REFERENCES weather_readings(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    detected_at TIMESTAMP WITH TIME ZONE NOT NULL,
    anomaly_score NUMERIC(5, 4) NOT NULL, -- 0.0000 to 1.0000
    anomaly_percentage SMALLINT NOT NULL CHECK (anomaly_percentage BETWEEN 0 AND 100),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('NORMAL', 'WATCH', 'WARNING', 'CRITICAL')),
    model_confidence NUMERIC(4, 3) NOT NULL, -- e.g. 0.940
    model_name VARCHAR(100) DEFAULT 'IsolationForest_v2',
    detection_mode VARCHAR(50) DEFAULT 'REAL-TIME MULTIVARIATE',
    features_analyzed_count SMALLINT DEFAULT 24,
    deviations JSONB NOT NULL,
    compound_signals JSONB,
    explanation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_anomaly_severity ON anomaly_results(severity);
CREATE INDEX IF NOT EXISTS idx_anomaly_location_time ON anomaly_results(location_id, detected_at DESC);

-- 6. INTELLIGENT WEATHER ALERTS
CREATE TABLE IF NOT EXISTS weather_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anomaly_id UUID REFERENCES anomaly_results(id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('NORMAL', 'WATCH', 'WARNING', 'CRITICAL')),
    parameter VARCHAR(60) NOT NULL,
    observed_value VARCHAR(50) NOT NULL,
    expected_value VARCHAR(50) NOT NULL,
    deviation VARCHAR(50) NOT NULL,
    confidence VARCHAR(20) NOT NULL,
    alert_message TEXT NOT NULL,
    is_acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. MODEL PREDICTIONS & FORECAST ANOMALY PROJECTIONS
CREATE TABLE IF NOT EXISTS model_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    forecast_date DATE NOT NULL,
    predicted_max_temp NUMERIC(5, 2),
    predicted_min_temp NUMERIC(5, 2),
    predicted_precip_prob NUMERIC(5, 2),
    projected_anomaly_probability NUMERIC(5, 2),
    model_version VARCHAR(50) DEFAULT 'GARUDA_TIMESERIES_V1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. SYSTEM AUDIT & TELEMETRY LOGS
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(60) NOT NULL,
    component VARCHAR(60) NOT NULL,
    status VARCHAR(30) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
