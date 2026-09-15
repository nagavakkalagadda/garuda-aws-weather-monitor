/**
 * GARUDA // Anomaly Detection Endpoints
 */
const express = require("express");
const router = express.Router();
const anomalyService = require("../services/anomalyService");

// In-memory telemetry anomaly event history
const anomalyHistory = [];

// POST /api/anomaly/detect
router.post("/detect", async (req, res, next) => {
  try {
    const { location, weather, temporal } = req.body;
    if (!weather || !location) {
      return res.status(400).json({
        error: "Missing required parameters: 'weather' and 'location' objects are mandatory."
      });
    }

    const result = await anomalyService.detect({ location, weather, temporal });
    
    // Store in historical log
    anomalyHistory.unshift({
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      location: location.city || "Unknown",
      score: result.score,
      percentage: result.percentage,
      severity: result.severity,
      explanation: result.explanation
    });

    if (anomalyHistory.length > 50) anomalyHistory.pop();

    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/anomaly/history
router.get("/history", (req, res) => {
  res.json({
    success: true,
    count: anomalyHistory.length,
    history: anomalyHistory
  });
});

module.exports = router;
