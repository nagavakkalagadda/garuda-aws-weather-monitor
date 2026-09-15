/**
 * GARUDA // AWS INTELLIGENT WEATHER MONITOR
 * Production Server Entry Point
 * Hosts both Backend REST API and Compiled Minimalist 3D Frontend UI
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./middleware/errorHandler");

const weatherRoutes = require("./routes/weather");
const anomalyRoutes = require("./routes/anomaly");
const locationRoutes = require("./routes/location");
const assistantRoutes = require("./routes/assistant");
const telemetryRoutes = require("./routes/telemetry");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Route Mounts
app.use("/api/weather", weatherRoutes);
app.use("/api/anomaly", anomalyRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/telemetry", telemetryRoutes);

// API Status Info Endpoint
app.get("/api", (req, res) => {
  res.json({
    title: "GARUDA // AWS INTELLIGENT WEATHER MONITOR",
    subtitle: "AI/ML BASED WEATHER ANOMALY DETECTION SYSTEM (MINIMALIST 3D)",
    version: "2.0.0",
    status: "OPERATIONAL",
    endpoints: [
      "/api/weather/all",
      "/api/weather/current",
      "/api/weather/forecast",
      "/api/weather/historical",
      "/api/anomaly/detect",
      "/api/location/search",
      "/api/location/presets",
      "/api/assistant/chat",
      "/api/telemetry/status"
    ]
  });
});

// Production Static Frontend Hosting (Serves frontend/dist)
const distPath = path.resolve(__dirname, "../../frontend/dist");
app.use(express.static(distPath));

// Fallback to React index.html for SPA client-side routing
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) {
      next();
    }
  });
});

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("================================================================");
  console.log("  GARUDA // AWS INTELLIGENT WEATHER MONITOR (v2.0)");
  console.log(`  PRODUCTION SERVER RUNNING ON PORT: http://localhost:${PORT}`);
  console.log("  STATUS: ONLINE & FULLY DEPLOYED");
  console.log("================================================================");
});
