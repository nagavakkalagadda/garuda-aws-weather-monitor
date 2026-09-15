/**
 * GARUDA // Weather Endpoints Route
 */
const express = require("express");
const router = express.Router();
const { createWeatherProvider } = require("../services/weatherProvider");
const anomalyService = require("../services/anomalyService");

// GET /api/weather/all - Main composite endpoint
router.get("/all", async (req, res, next) => {
  try {
    const {
      city = "Bengaluru",
      state = "Karnataka",
      country = "India",
      latitude = 12.9716,
      longitude = 77.5946,
      mode = "auto", // "auto" or "demo"
      anomaly_scenario // optional test scenario: "heatwave", "storm", "cold_snap"
    } = req.query;

    const locationObj = {
      city,
      state,
      country,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    };

    const provider = createWeatherProvider(mode);
    const weatherData = await provider.getComprehensiveWeatherData(locationObj);

    // Apply anomaly scenario if requested (useful for testing and evaluation)
    if (anomaly_scenario === "heatwave") {
      weatherData.current.temperature += 8.5;
      weatherData.current.feels_like += 10.0;
      weatherData.current.apparent_temperature += 10.0;
      weatherData.current.humidity = 72;
    } else if (anomaly_scenario === "storm") {
      weatherData.current.pressure -= 22.0;
      weatherData.current.wind_speed += 28.0;
      weatherData.current.wind_gust += 42.0;
      weatherData.current.rainfall = 38.0;
      weatherData.current.condition = "Severe Thunderstorm Front";
      weatherData.current.icon = "cloud-lightning";
      weatherData.current.theme = "thunderstorm";
    } else if (anomaly_scenario === "cold_snap") {
      weatherData.current.temperature -= 9.5;
      weatherData.current.feels_like -= 12.0;
    }

    // Run AI/ML Anomaly Detection on current weather
    const anomalyResult = await anomalyService.detect({
      weather: weatherData.current,
      location: weatherData.location
    });

    res.json({
      success: true,
      weather: weatherData,
      anomaly: anomalyResult
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/weather/current
router.get("/current", async (req, res, next) => {
  try {
    const { city = "Bengaluru", latitude = 12.9716, longitude = 77.5946, mode = "auto" } = req.query;
    const provider = createWeatherProvider(mode);
    const data = await provider.getComprehensiveWeatherData({ city, latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
    res.json({ success: true, current: data.current, location: data.location, isDemo: data.isDemo, lastUpdated: data.lastUpdated });
  } catch (err) {
    next(err);
  }
});

// GET /api/weather/forecast
router.get("/forecast", async (req, res, next) => {
  try {
    const { city = "Bengaluru", latitude = 12.9716, longitude = 77.5946, mode = "auto" } = req.query;
    const provider = createWeatherProvider(mode);
    const data = await provider.getComprehensiveWeatherData({ city, latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
    res.json({ success: true, forecast: data.forecast, isDemo: data.isDemo });
  } catch (err) {
    next(err);
  }
});

// GET /api/weather/historical
router.get("/historical", async (req, res, next) => {
  try {
    const { city = "Bengaluru", latitude = 12.9716, longitude = 77.5946, mode = "auto" } = req.query;
    const provider = createWeatherProvider(mode);
    const data = await provider.getComprehensiveWeatherData({ city, latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
    res.json({ success: true, historical: data.historical_comparison, isDemo: data.isDemo });
  } catch (err) {
    next(err);
  }
});

// GET /api/weather/air-quality
router.get("/air-quality", async (req, res, next) => {
  try {
    const { city = "Bengaluru", latitude = 12.9716, longitude = 77.5946, mode = "auto" } = req.query;
    const provider = createWeatherProvider(mode);
    const data = await provider.getComprehensiveWeatherData({ city, latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
    res.json({ success: true, air_quality: data.current.air_quality, isDemo: data.isDemo });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
