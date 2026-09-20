/**
 * SKYGUARD AI // Operator Authentication & Terminal Security
 */
const express = require("express");
const router = express.Router();

// Preconfigured Official Institutional Operator Accounts
const DEMO_OPERATORS = [
  {
    id: "OP-4329-CHIEF",
    email: "commander@skyguard.ai",
    password: "skyguard2026",
    name: "Dr. Aris Thorne",
    title: "Chief Synoptic Meteorologist",
    station: "WMO-43295 / Atmospheric Surveillance Ops",
    clearanceLevel: 4,
    clearanceLabel: "LEVEL 4 // FULL PLANETARY & DELTA OVERRIDE",
    role: "CHIEF_FORECASTER",
    badgeColor: "emerald",
    permissions: ["ALL_REGIONS_SURVEILLANCE", "MANUAL_RADAR_OVERRIDE", "EMERGENCY_DISPATCH_BROADCAST", "AI_DIAGNOSTICS_UNRESTRICTED"]
  },
  {
    id: "OP-8821-SCIENTIST",
    email: "scientist@skyguard.ai",
    password: "synoptic2026",
    name: "Elena Rostova, Ph.D.",
    title: "Senior Atmospheric Physicist",
    station: "Global Convective Dynamics Unit",
    clearanceLevel: 3,
    clearanceLabel: "LEVEL 3 // SYNOPTIC MODELING & RESEARCH",
    role: "ATMOSPHERIC_SCIENTIST",
    badgeColor: "cyan",
    permissions: ["PLANETARY_RESEARCH_STREAM", "ISOLATION_FOREST_DIAGNOSTICS", "HISTORICAL_DELTA_AUDIT"]
  },
  {
    id: "OP-1094-DISPATCH",
    email: "dispatch@skyguard.ai",
    password: "sentinel2026",
    name: "Capt. Marcus Vance",
    title: "Civil Emergency Ops Coordinator",
    station: "Rapid Response Dispatch Network",
    clearanceLevel: 3,
    clearanceLabel: "LEVEL 3 // REGIONAL ALERT DISPATCH",
    role: "EMERGENCY_COORDINATOR",
    badgeColor: "amber",
    permissions: ["REGIONAL_ALERT_BROADCAST", "POPULATION_RISK_VECTORING", "CRITICAL_WEATHER_ALERTS"]
  }
];

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password, operatorId } = req.body;

  let operator = null;

  // Direct operator ID login (1-click credential chip)
  if (operatorId) {
    operator = DEMO_OPERATORS.find(op => op.id === operatorId);
  } else if (email) {
    operator = DEMO_OPERATORS.find(
      op => op.email.toLowerCase() === email.trim().toLowerCase() && op.password === password
    );
  }

  if (!operator) {
    return res.status(401).json({
      success: false,
      message: "Invalid operator credentials. Access denied by SKYGUARD AI Security."
    });
  }

  // Create session payload
  const sessionToken = `SKYG-SEC-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const authenticatedUser = {
    id: operator.id,
    email: operator.email,
    name: operator.name,
    title: operator.title,
    station: operator.station,
    clearanceLevel: operator.clearanceLevel,
    clearanceLabel: operator.clearanceLabel,
    role: operator.role,
    badgeColor: operator.badgeColor,
    permissions: operator.permissions,
    sessionToken,
    loginTime: new Date().toISOString()
  };

  return res.json({
    success: true,
    message: `Terminal access authorized for ${operator.name}`,
    user: authenticatedUser
  });
});

// GET /api/auth/operators - list available demo operator profiles
router.get("/operators", (req, res) => {
  const sanitized = DEMO_OPERATORS.map(op => ({
    id: op.id,
    email: op.email,
    name: op.name,
    title: op.title,
    station: op.station,
    clearanceLevel: op.clearanceLevel,
    clearanceLabel: op.clearanceLabel,
    role: op.role,
    badgeColor: op.badgeColor,
    passwordHint: op.password
  }));

  res.json({
    success: true,
    operators: sanitized
  });
});

// GET /api/auth/verify
router.get("/verify", (req, res) => {
  const token = req.headers["x-skyguard-token"];
  if (!token) {
    return res.status(401).json({ success: false, message: "No active session token provided." });
  }

  // Default demo fallback operator
  const defaultOp = DEMO_OPERATORS[0];
  res.json({
    success: true,
    valid: true,
    user: {
      id: defaultOp.id,
      name: defaultOp.name,
      title: defaultOp.title,
      station: defaultOp.station,
      clearanceLevel: defaultOp.clearanceLevel,
      clearanceLabel: defaultOp.clearanceLabel,
      role: defaultOp.role
    }
  });
});

module.exports = router;
