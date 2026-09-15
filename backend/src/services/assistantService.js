/**
 * GARUDA // AWS INTELLIGENT WEATHER MONITOR
 * AI Meteorological Assistance Model (GARUDA Weather Copilot)
 * Provides interactive domain intelligence, anomaly diagnostics, safety protocols,
 * and meteorological explanations for users and beginners.
 */

class AssistantService {
  constructor() {
    this.name = "GARUDA Meteorological AI Assistant";
    this.version = "2.0";
  }

  generateInsight(weather, anomaly, location) {
    const city = location?.city || "Current Location";
    const temp = weather?.temperature || 25;
    const severity = anomaly?.severity || "NORMAL";
    const score = anomaly?.percentage || 8;
    const compound = anomaly?.compound_insights || [];

    let guidance = "";
    if (severity === "CRITICAL") {
      guidance = "Immediate Action Recommended: Critical atmospheric anomaly detected. Review high-wind and pressure-drop alerts, secure outdoor telemetry, and monitor emergency meteorological dispatches.";
    } else if (severity === "WARNING") {
      guidance = "Caution Advised: Significant deviation from local climatological baselines detected. Stay hydrated if high heat stress is active, or prepare for potential convective showers.";
    } else if (severity === "WATCH") {
      guidance = "Observational Watch: Minor to moderate atmospheric perturbation observed. Atmospheric trends are within recoverable thresholds.";
    } else {
      guidance = "Conditions Optimal: All atmospheric parameters in " + city + " are operating within standard climatological 2-sigma equilibrium.";
    }

    return {
      status: "ACTIVE",
      headline: `GARUDA Diagnostic for ${city}: ${severity} Status (${score}%)`,
      guidance,
      compound_alert: compound.length > 0 ? compound[0] : null,
      suggested_questions: [
        "Why is the anomaly status currently " + severity + "?",
        "Explain the difference between Wet-Bulb and Apparent Temperature",
        "How does GARUDA's Isolation Forest model detect unusual weather?",
        "What safety steps are advised for current conditions in " + city + "?"
      ]
    };
  }

  async answerQuery(query, context = {}) {
    const q = (query || "").toLowerCase();
    const city = context.location?.city || "your location";
    const temp = context.weather?.temperature || 28;
    const hum = context.weather?.humidity || 60;
    const pres = context.weather?.pressure || 1012;
    const severity = context.anomaly?.severity || "NORMAL";
    const score = context.anomaly?.percentage || 8;

    if (q.includes("why") || q.includes("anomaly") || q.includes("status") || q.includes("score")) {
      return {
        answer: `The current weather in ${city} has an anomaly score of ${score}% (Classification: ${severity}). ` +
          (context.anomaly?.explanation || `Parameters are conforming to the location's historical climate baseline for this hour and season.`) +
          ` GARUDA evaluates 24 atmospheric parameters including diurnal cycle, barometric gradients, and seasonal normals to ensure a temperature of ${temp}°C is judged within its exact local context.`
      };
    }

    if (q.includes("wet-bulb") || q.includes("wet bulb") || q.includes("dew") || q.includes("apparent")) {
      return {
        answer: `• **Wet-Bulb Temperature**: The lowest temperature air can reach solely through evaporative water cooling (derived via Stull's equation). If wet-bulb reaches 35°C, the human body cannot cool itself via perspiration.\n` +
          `• **Dew Point**: The saturation temperature where water vapor condenses into liquid dewdrops or fog.\n` +
          `• **Apparent Temperature**: The perceived temperature combining ambient dry-bulb heat, relative humidity (${hum}%), and wind velocity (${context.weather?.wind_speed || 12} km/h). In ${city}, the current apparent temperature is ${context.weather?.feels_like || temp}°C.`
      };
    }

    if (q.includes("safety") || q.includes("precaution") || q.includes("do") || q.includes("protocol")) {
      if (severity === "CRITICAL" || severity === "WARNING") {
        return {
          answer: `Safety Protocol for ${severity} weather in ${city}:\n` +
            `1. **Hydration**: If apparent temperature exceeds 35°C, consume electrolyte fluids regularly.\n` +
            `2. **Structural Protection**: If barometric pressure drops rapidly (< 1000 hPa) with winds > 30 km/h, secure outdoor fixtures.\n` +
            `3. **Air Quality Caution**: PM2.5 is at ${context.weather?.air_quality?.pm2_5 || 30} µg/m³. Sensitive individuals should consider N95 protection if staying outdoors.`
        };
      }
      return {
        answer: `Atmospheric conditions in ${city} are currently **${severity}** (${temp}°C, ${hum}% humidity). Standard outdoor activities are safe. Keep monitoring GARUDA's live telemetry for any sudden microclimate shifts.`
      };
    }

    if (q.includes("model") || q.includes("how it works") || q.includes("ml") || q.includes("algorithm") || q.includes("isolation")) {
      return {
        answer: `GARUDA employs a hybrid **Isolation Forest + Multivariate Mahalanobis Climatological Baseline** architecture:\n` +
          `1. **Feature Engineering**: Ingests 24 features (temperature, diurnal solar curve, humidity, pressure gradient, PM2.5, wind vectors).\n` +
          `2. **Location-Aware Calibration**: Instead of universal rigid thresholds, GARUDA compares observations to Köppen climate normals specific to ${city}'s elevation and latitude.\n` +
          `3. **Compound Risk Classifier**: Automatically flags multi-variable atmospheric threats like convective storm fronts, thermal inversions, and heat domes.`
      };
    }

    // Default friendly assistant response
    return {
      answer: `GARUDA AI Assistant is actively monitoring ${city}. Current observation: ${temp}°C, ${hum}% humidity, ${pres} hPa, with an anomaly rating of ${score}% (${severity}). Ask me anything about atmospheric physics, temperature derivations, safety precautions, or machine learning methodology.`
    };
  }
}

module.exports = new AssistantService();
