/**
 * GARUDA // Location Management Routes
 * Supports ALL global cities, states/provinces, and countries.
 */
const express = require("express");
const router = express.Router();
const { OpenMeteoProvider, RealisticDemoProvider } = require("../services/weatherProvider");
const { WORLD_COUNTRIES, WORLD_STATES, findWorldMatches } = require("../services/worldLocations");

const liveProvider = new OpenMeteoProvider();
const demoProvider = new RealisticDemoProvider();

const PRESET_LOCATIONS = [
  { city: "Bengaluru", state: "Karnataka", country: "India", latitude: 12.9716, longitude: 77.5946, elevation: 920 },
  { city: "Hyderabad", state: "Telangana", country: "India", latitude: 17.3850, longitude: 78.4867, elevation: 542 },
  { city: "Mumbai", state: "Maharashtra", country: "India", latitude: 19.0760, longitude: 72.8777, elevation: 14 },
  { city: "Delhi", state: "National Capital Region", country: "India", latitude: 28.6139, longitude: 77.2090, elevation: 216 },
  { city: "Chennai", state: "Tamil Nadu", country: "India", latitude: 13.0827, longitude: 80.2707, elevation: 7 },
  { city: "Kolkata", state: "West Bengal", country: "India", latitude: 22.5726, longitude: 88.3639, elevation: 9 },
  { city: "London", state: "Greater London", country: "United Kingdom", latitude: 51.5074, longitude: -0.1278, elevation: 25 },
  { city: "New York", state: "New York", country: "United States", latitude: 40.7128, longitude: -74.0060, elevation: 10 },
  { city: "Tokyo", state: "Kanto", country: "Japan", latitude: 35.6762, longitude: 139.6503, elevation: 40 }
];

// GET /api/location/presets
router.get("/presets", (req, res) => {
  res.json({
    success: true,
    presets: PRESET_LOCATIONS
  });
});

// GET /api/location/countries - All major countries
router.get("/countries", (req, res) => {
  res.json({
    success: true,
    countries: WORLD_COUNTRIES.map(c => ({
      name: c.name,
      capital: c.capital,
      country: c.country,
      latitude: c.latitude,
      longitude: c.longitude
    }))
  });
});

// GET /api/location/states - All major states
router.get("/states", (req, res) => {
  res.json({
    success: true,
    states: WORLD_STATES.map(s => ({
      state: s.state,
      city: s.city,
      country: s.country,
      latitude: s.latitude,
      longitude: s.longitude
    }))
  });
});

// GET /api/location/search?query=...
router.get("/search", async (req, res, next) => {
  try {
    const { query = "" } = req.query;
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      return res.json({ success: true, results: PRESET_LOCATIONS });
    }

    const combinedResults = [];
    const seen = new Set();

    // 1. High-priority resolution from Worldwide Geographic Database (countries & states)
    const worldMatches = findWorldMatches(cleanQuery);
    for (const match of worldMatches) {
      const key = `${match.city.toLowerCase()}-${match.country.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        combinedResults.push(match);
      }
    }

    // 2. Open-Meteo worldwide geocoding (covers all cities, towns, and regions globally)
    try {
      const geoResults = await liveProvider.searchLocation(cleanQuery);
      if (geoResults && Array.isArray(geoResults)) {
        for (const item of geoResults) {
          const key = `${(item.city || "").toLowerCase()}-${(item.country || "").toLowerCase()}`;
          if (!seen.has(key)) {
            seen.add(key);
            combinedResults.push(item);
          }
        }
      }
    } catch (err) {
      console.warn("Live geocoding error:", err.message);
    }

    // 3. Fallback to demo provider if still empty
    if (combinedResults.length === 0) {
      const demoResults = await demoProvider.searchLocation(cleanQuery);
      for (const item of demoResults) {
        combinedResults.push(item);
      }
    }

    res.json({
      success: true,
      query: cleanQuery,
      count: combinedResults.length,
      results: combinedResults
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/location/reverse?lat=...&lon=...
router.get("/reverse", async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: "Missing lat and lon coordinates" });
    }

    res.json({
      success: true,
      location: {
        city: `Station (${parseFloat(lat).toFixed(2)}°, ${parseFloat(lon).toFixed(2)}°)`,
        state: "Global Geolocation",
        country: "Earth",
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        elevation: 0
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
