"""
GARUDA // AWS INTELLIGENT WEATHER MONITOR
Machine Learning Microservice Server (FastAPI / Standard HTTP)
Exposes REST endpoints for real-time anomaly detection, causal explanation,
and location baseline queries.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uvicorn
from anomaly_detector import WeatherAnomalyDetector
from location_baselines import get_location_normals

app = FastAPI(
    title="GARUDA AI/ML Weather Anomaly Detection Engine",
    description="Intelligent Meteorological Anomaly Detection & Reasoning Microservice",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

detector = WeatherAnomalyDetector()


class AnomalyRequest(BaseModel):
    location: Dict[str, Any]
    weather: Dict[str, Any]
    temporal: Optional[Dict[str, Any]] = None


@app.get("/")
def root():
    return {
        "service": "GARUDA // ML Anomaly Detection Engine",
        "status": "ONLINE",
        "model": detector.model_name,
        "features_analyzed": detector.features_analyzed_count,
        "version": "2.0.0"
    }


@app.get("/health")
def health():
    return {
        "status": "HEALTHY",
        "engine": "GARUDA-ML-v2",
        "model_status": detector.model_status,
        "features_count": detector.features_analyzed_count
    }


@app.post("/detect")
def detect_anomaly(payload: AnomalyRequest):
    try:
        result = detector.detect_anomalies(
            weather_data=payload.weather,
            location_data=payload.location,
            temporal_data=payload.temporal
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/baselines")
def get_baselines(lat: float, lon: float, month: Optional[int] = None, hour: Optional[int] = None, city: Optional[str] = ""):
    normals = get_location_normals(lat=lat, lon=lon, month=month, hour=hour, city_name=city)
    return normals


if __name__ == "__main__":
    print("==================================================================")
    print("GARUDA // AWS INTELLIGENT WEATHER MONITOR ML ENGINE")
    print("PORT: 8000")
    print("==================================================================")
    uvicorn.run(app, host="0.0.0.0", port=8000)
