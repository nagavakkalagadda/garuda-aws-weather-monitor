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
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Route Mounts
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/anomaly", anomalyRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/telemetry", telemetryRoutes);

// API Status Info Endpoint
app.get("/api", (req, res) => {
  res.json({
    title: "SKYGUARD AI // SYNOPTIC ATMOSPHERIC SURVEILLANCE",
    subtitle: "PLANETARY ATMOSPHERIC DELTA & REGIONAL SHIFT RADAR",
    version: "3.0.0",
    status: "OPERATIONAL",
    endpoints: [
      "/api/auth/login",
      "/api/auth/operators",
      "/api/weather/all",
      "/api/weather/regional-shifts",
      "/api/weather/current",
      "/api/weather/forecast",
      "/api/weather/historical",
      "/api/anomaly/detect",
      "/api/location/search",
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
  console.log("  SKYGUARD AI // SYNOPTIC ATMOSPHERIC SURVEILLANCE v3.0");
  console.log("  PLANETARY ATMOSPHERIC DELTA & REGIONAL SHIFT RADAR");
  console.log(`  OPERATIONAL SERVER RUNNING: http://localhost:${PORT}`);
  console.log("  STATUS: ACTIVE & SECURED (CLEARANCE LEVEL ENFORCED)");
  console.log("================================================================");
});
