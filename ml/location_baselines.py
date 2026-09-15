"""
GARUDA // AWS INTELLIGENT WEATHER MONITOR
Location-Aware Climate Baselines & Normals Generator
Provides location-calibrated climate distributions based on coordinates, elevation,
month, season, and diurnal (hourly) variations.
"""

import math
from datetime import datetime

CITY_CLIMATE_PROFILES = {
    "bengaluru": {
        "zone": "Tropical Savanna (Aw)",
        "elevation": 920,
        "monthly_temps": [21.5, 23.8, 26.5, 28.0, 27.2, 24.5, 23.8, 23.5, 23.8, 23.5, 22.2, 20.8],
        "monthly_humidity": [55, 48, 44, 52, 65, 75, 78, 79, 77, 76, 68, 62],
        "base_pressure": 915.0,  # hPa (adjusted for 920m elevation)
        "annual_rainfall_pattern": [2, 5, 12, 45, 110, 80, 115, 145, 195, 180, 60, 15]
    },
    "delhi": {
        "zone": "Humid Subtropical (Cwa) / Semi-Arid",
        "elevation": 216,
        "monthly_temps": [14.2, 17.5, 23.4, 30.1, 34.0, 33.8, 31.0, 30.0, 29.2, 26.0, 20.2, 15.3],
        "monthly_humidity": [68, 58, 48, 35, 38, 55, 75, 78, 72, 55, 58, 66],
        "base_pressure": 1010.0,
        "annual_rainfall_pattern": [15, 18, 15, 12, 25, 75, 230, 245, 120, 15, 5, 8]
    },
    "mumbai": {
        "zone": "Tropical Wet and Dry (Aw)",
        "elevation": 14,
        "monthly_temps": [24.2, 24.8, 27.0, 29.0, 30.5, 29.5, 28.0, 27.5, 28.0, 28.8, 27.5, 25.5],
        "monthly_humidity": [65, 66, 68, 71, 74, 82, 88, 87, 83, 76, 68, 64],
        "base_pressure": 1012.0,
        "annual_rainfall_pattern": [0, 0, 1, 2, 12, 520, 840, 580, 340, 90, 10, 2]
    },
    "hyderabad": {
        "zone": "Tropical Wet and Dry / Semi-Arid",
        "elevation": 542,
        "monthly_temps": [22.5, 25.5, 29.2, 32.8, 34.5, 30.2, 27.5, 26.8, 27.0, 26.2, 23.8, 21.8],
        "monthly_humidity": [56, 49, 42, 40, 42, 65, 74, 76, 75, 68, 62, 58],
        "base_pressure": 955.0,
        "annual_rainfall_pattern": [3, 5, 10, 20, 35, 110, 170, 175, 160, 95, 25, 5]
    },
    "chennai": {
        "zone": "Tropical Wet and Dry",
        "elevation": 7,
        "monthly_temps": [25.0, 26.2, 28.5, 31.0, 33.2, 32.5, 30.5, 30.0, 29.8, 28.5, 26.8, 25.2],
        "monthly_humidity": [73, 72, 70, 71, 68, 62, 67, 70, 74, 79, 81, 77],
        "base_pressure": 1012.0,
        "annual_rainfall_pattern": [25, 10, 5, 15, 45, 55, 100, 140, 140, 300, 350, 140]
    },
    "kolkata": {
        "zone": "Tropical Wet and Dry",
        "elevation": 9,
        "monthly_temps": [20.0, 23.5, 28.2, 31.0, 31.5, 30.2, 29.2, 29.0, 29.0, 27.8, 24.0, 20.5],
        "monthly_humidity": [66, 60, 58, 65, 73, 81, 84, 85, 83, 76, 68, 67],
        "base_pressure": 1012.0,
        "annual_rainfall_pattern": [12, 22, 35, 60, 135, 300, 395, 345, 315, 180, 25, 5]
    },
    "london": {
        "zone": "Oceanic (Cfb)",
        "elevation": 25,
        "monthly_temps": [5.2, 5.5, 7.8, 10.2, 13.5, 16.5, 18.8, 18.5, 15.8, 12.0, 8.2, 5.8],
        "monthly_humidity": [81, 76, 70, 65, 63, 62, 63, 66, 71, 78, 82, 82],
        "base_pressure": 1014.0,
        "annual_rainfall_pattern": [55, 40, 42, 45, 50, 48, 45, 52, 53, 68, 62, 58]
    },
    "new york": {
        "zone": "Humid Subtropical (Cfa)",
        "elevation": 10,
        "monthly_temps": [0.5, 2.0, 6.2, 12.0, 17.5, 22.8, 25.5, 24.8, 20.8, 14.5, 9.0, 3.5],
        "monthly_humidity": [64, 62, 61, 60, 66, 69, 69, 71, 73, 70, 67, 65],
        "base_pressure": 1015.0,
        "annual_rainfall_pattern": [85, 75, 95, 98, 100, 105, 110, 105, 100, 95, 88, 92]
    },
    "tokyo": {
        "zone": "Humid Subtropical (Cfa)",
        "elevation": 40,
        "monthly_temps": [5.5, 6.2, 9.5, 14.8, 19.2, 22.5, 26.2, 27.5, 24.0, 18.2, 13.0, 8.0],
        "monthly_humidity": [52, 53, 58, 63, 68, 75, 77, 74, 75, 71, 65, 56],
        "base_pressure": 1013.0,
        "annual_rainfall_pattern": [50, 55, 115, 130, 140, 170, 155, 170, 210, 200, 95, 55]
    }
}

def get_location_normals(lat: float, lon: float, month: int = None, hour: int = None, city_name: str = ""):
    """
    Computes rigorous climate baselines (mean and standard deviation) for the given
    location and temporal parameters.
    """
    if month is None:
        month = datetime.now().month
    if hour is None:
        hour = datetime.now().hour

    month_idx = max(0, min(11, month - 1))
    city_key = city_name.lower().strip() if city_name else ""
    
    matched_profile = None
    for k, profile in CITY_CLIMATE_PROFILES.items():
        if k in city_key or city_key in k:
            matched_profile = profile
            break

    if matched_profile:
        mean_monthly_temp = matched_profile["monthly_temps"][month_idx]
        mean_humidity = matched_profile["monthly_humidity"][month_idx]
        base_pressure = matched_profile["base_pressure"]
    else:
        abs_lat = abs(lat)
        is_northern = lat >= 0
        effective_month = month if is_northern else ((month + 6 - 1) % 12 + 1)
        seasonal_phase = math.cos((effective_month - 7) / 12.0 * 2 * math.pi)
        
        equatorial_temp = 28.0
        lat_temp_drop = (abs_lat / 90.0) * 38.0
        seasonal_amplitude = (abs_lat / 90.0) * 16.0
        mean_monthly_temp = equatorial_temp - lat_temp_drop + (seasonal_amplitude * seasonal_phase)
        mean_humidity = 65.0 - (15.0 * seasonal_phase if abs_lat > 25 else 5.0)
        base_pressure = 1013.25 * math.exp(-100.0 / 8400.0)

    # Diurnal variation
    diurnal_phase = math.sin((hour - 9) / 24.0 * 2 * math.pi)
    diurnal_temp_swing = 4.5
    expected_temp = mean_monthly_temp + (diurnal_phase * diurnal_temp_swing)
    expected_humidity = max(20.0, min(98.0, mean_humidity - (diurnal_phase * 12.0)))
    semi_diurnal_tide = 1.2 * math.cos((hour - 10) / 12.0 * 2 * math.pi)
    expected_pressure = base_pressure + semi_diurnal_tide
    expected_wind = 12.0 + (diurnal_phase * 4.0 if diurnal_phase > 0 else 1.0)

    # Dew point estimation (Arden Buck approximation)
    a = 17.27
    b = 237.7
    alpha = ((a * expected_temp) / (b + expected_temp)) + math.log(max(expected_humidity, 1.0) / 100.0)
    expected_dew_point = (b * alpha) / (a - alpha)

    # Wet bulb estimation (Stull formula)
    tw = (expected_temp * math.atan(0.151977 * math.sqrt(expected_humidity + 8.313659)) +
          math.atan(expected_temp + expected_humidity) -
          math.atan(expected_humidity - 1.676331) +
          0.00391838 * (expected_humidity ** 1.5) * math.atan(0.023101 * expected_humidity) -
          4.686035)
    expected_wet_bulb = tw

    # Apparent Temperature (Australian / Steadman BOM formula)
    e = (expected_humidity / 100.0) * 6.105 * math.exp((17.27 * expected_temp) / (237.7 + expected_temp))
    expected_apparent = expected_temp + 0.33 * e - 0.70 * (expected_wind / 3.6) - 4.00

    return {
        "temperature": {
            "mean": round(expected_temp, 1),
            "std": 2.8,
            "min_normal": round(expected_temp - 5.5, 1),
            "max_normal": round(expected_temp + 5.5, 1),
            "unit": "°C"
        },
        "feels_like": {
            "mean": round(expected_apparent, 1),
            "std": 3.2,
            "min_normal": round(expected_apparent - 6.0, 1),
            "max_normal": round(expected_apparent + 6.0, 1),
            "unit": "°C"
        },
        "humidity": {
            "mean": round(expected_humidity, 1),
            "std": 12.0,
            "min_normal": round(max(15.0, expected_humidity - 22.0), 1),
            "max_normal": round(min(100.0, expected_humidity + 22.0), 1),
            "unit": "%"
        },
        "pressure": {
            "mean": round(expected_pressure, 1),
            "std": 4.5,
            "min_normal": round(expected_pressure - 8.0, 1),
            "max_normal": round(expected_pressure + 8.0, 1),
            "unit": "hPa"
        },
        "wind_speed": {
            "mean": round(expected_wind, 1),
            "std": 5.0,
            "min_normal": 2.0,
            "max_normal": round(expected_wind + 14.0, 1),
            "unit": "km/h"
        },
        "dew_point": {
            "mean": round(expected_dew_point, 1),
            "std": 2.5,
            "min_normal": round(expected_dew_point - 5.0, 1),
            "max_normal": round(expected_dew_point + 5.0, 1),
            "unit": "°C"
        },
        "wet_bulb": {
            "mean": round(expected_wet_bulb, 1),
            "std": 2.5,
            "min_normal": round(expected_wet_bulb - 5.0, 1),
            "max_normal": round(expected_wet_bulb + 5.0, 1),
            "unit": "°C"
        },
        "apparent_temperature": {
            "mean": round(expected_apparent, 1),
            "std": 3.2,
            "min_normal": round(expected_apparent - 6.0, 1),
            "max_normal": round(expected_apparent + 6.0, 1),
            "unit": "°C"
        },
        "precipitation": {
            "mean": 0.5,
            "std": 2.0,
            "min_normal": 0.0,
            "max_normal": 10.0,
            "unit": "mm"
        },
        "uv_index": {
            "mean": 6.0 if 10 <= hour <= 16 else 1.0,
            "std": 2.0,
            "min_normal": 0.0,
            "max_normal": 9.0,
            "unit": "UV"
        },
        "air_quality_pm25": {
            "mean": 35.0,
            "std": 20.0,
            "min_normal": 5.0,
            "max_normal": 60.0,
            "unit": "µg/m³"
        }
    }
