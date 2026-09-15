"""
GARUDA // AWS INTELLIGENT WEATHER MONITOR
Meteorological Causal Anomaly Explanation Engine
Generates human-readable, domain-specific causal explanations for single and
multi-parameter atmospheric anomalies detected by the ML engine.
"""

def generate_anomaly_explanation(deviations, multi_param_signals, severity, score_pct, location_name="the selected region"):
    """
    Synthesizes meteorological explanations based on feature-level deviations and
    compound multi-parameter patterns.
    """
    explanations = []
    compound_insights = []

    # Check for compound atmospheric patterns first
    if multi_param_signals.get("storm_front_precursor"):
        compound_insights.append(
            f"CRITICAL COMPOUND ANOMALY: Rapid barometric pressure drop paired with elevated wind gusts "
            f"and surging humidity indicates an imminent cyclonic front or convective storm cell approaching {location_name}."
        )

    if multi_param_signals.get("extreme_heat_stress"):
        compound_insights.append(
            f"HIGH-RISK THERMAL STRESS: Concurrently high ambient temperature and high relative humidity "
            f"are suppressing evaporative cooling, driving apparent temperature into dangerous heat-stress thresholds."
        )

    if multi_param_signals.get("thermal_inversion"):
        compound_insights.append(
            f"ATMOSPHERIC STAGNATION: Near-zero boundary-layer wind velocity combined with lower-than-normal "
            f"surface temperatures has produced a thermal inversion, trapping particulate matter (PM2.5/PM10) near the ground."
        )

    if multi_param_signals.get("dry_convective_surge"):
        compound_insights.append(
            f"DESICCATION ANOMALY: High temperatures combined with drastically depressed relative humidity "
            f"and gusty winds create high evapotranspiration and wildland fire vulnerability."
        )

    # Individual parameter deviations
    for param, dev in deviations.items():
        if abs(dev.get("z_score", 0)) >= 1.8:
            diff = dev.get("difference", 0)
            obs = dev.get("observed", 0)
            exp = dev.get("expected", 0)
            unit = dev.get("unit", "")
            param_label = param.replace("_", " ").title()

            if param == "temperature":
                if diff > 0:
                    explanations.append(
                        f"Current temperature ({obs}{unit}) is +{diff:.1f}{unit} above the seasonal expected baseline ({exp}{unit}) for this hour, indicating anomalous warm-air advection or intense solar radiative heating."
                    )
                else:
                    explanations.append(
                        f"Current temperature ({obs}{unit}) is {diff:.1f}{unit} below the normal expected baseline ({exp}{unit}), reflecting a sharp unseasonal cold-front or dense persistent cloud deck."
                    )
            elif param == "pressure":
                if diff < -4:
                    explanations.append(
                        f"Barometric pressure is {abs(diff):.1f} hPa lower than standard baseline ({exp} hPa), signaling a deepening meso-scale low pressure trough."
                    )
                elif diff > 4:
                    explanations.append(
                        f"Barometric pressure is +{diff:.1f} hPa above normal ({exp} hPa), indicating a strong subsiding anticyclonic high-pressure ridge."
                    )
            elif param == "humidity":
                if diff > 20:
                    explanations.append(
                        f"Relative humidity ({obs}%) is +{diff:.0f}% higher than expected ({exp}%), signaling dense moisture flux advection."
                    )
                elif diff < -20:
                    explanations.append(
                        f"Relative humidity ({obs}%) is {abs(diff):.0f}% lower than expected ({exp}%), signaling dry continental air mass penetration."
                    )
            elif param == "wind_speed":
                explanations.append(
                    f"Wind speed ({obs} {unit}) is substantially higher than standard diurnal calm ({exp} {unit}), indicating localized pressure gradient acceleration."
                )
            elif param == "air_quality_pm25":
                explanations.append(
                    f"Particulate PM2.5 levels ({obs} {unit}) deviate +{diff:.1f} {unit} above baseline ({exp} {unit}), showing acute aerosol accumulation."
                )

    # Primary conclusion synthesis
    if severity == "NORMAL":
        summary = f"No significant weather anomaly detected. All atmospheric metrics remain within standard 2-sigma climatological bounds for {location_name}."
    elif compound_insights:
        summary = " ".join(compound_insights)
    elif explanations:
        summary = " ".join(explanations[:2])
    else:
        summary = f"Minor statistical variance ({score_pct}% anomaly score) detected across atmospheric telemetry, but conditions remain manageable."

    return {
        "summary": summary,
        "compound_insights": compound_insights,
        "parameter_explanations": explanations
    }
