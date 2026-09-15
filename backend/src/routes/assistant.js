/**
 * GARUDA // AI Meteorological Assistant Routes
 */
const express = require("express");
const router = express.Router();
const assistantService = require("../services/assistantService");

// POST /api/assistant/chat
router.post("/chat", async (req, res, next) => {
  try {
    const { query, context } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Missing query parameter." });
    }

    const response = await assistantService.answerQuery(query, context);
    res.json({
      success: true,
      query,
      ...response
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/assistant/diagnostic
router.post("/diagnostic", (req, res, next) => {
  try {
    const { weather, anomaly, location } = req.body;
    const insight = assistantService.generateInsight(weather, anomaly, location);
    res.json({
      success: true,
      diagnostic: insight
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
