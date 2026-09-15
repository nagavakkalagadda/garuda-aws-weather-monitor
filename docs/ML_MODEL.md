# GARUDA // Machine Learning & Anomaly Detection Specification

**AI/ML INTELLIGENT WEATHER ANOMALY DETECTION ENGINE**  
*Model Version: IsolationForest + Multivariate Ensemble v2.0*

---

## 1. Machine Learning Pipeline Architecture

The anomaly detection engine follows a strict 9-stage data processing pipeline:

```
[WEATHER TELEMETRY]
        ↓
1. DATA VALIDATION (Schema check, range verification, missing value imputation)
        ↓
2. DATA CLEANING (Sensor outlier clipping, unit standardizations)
        ↓
3. NORMALIZATION (Z-score scaling relative to location climate baseline)
        ↓
4. FEATURE EXTRACTION (Temporal cycle encoding, barometric gradient derivation)
        ↓
5. HISTORICAL BASELINE INGESTION (Köppen-Geiger 30-year climate normals)
        ↓
6. ML MODEL INFERENCE (Isolation Forest Tree Isolation + Mahalanobis Distance)
        ↓
7. ANOMALY SCORE COMPUTATION (Non-linear sigmoid composite scaling: 0–100%)
        ↓
8. SEVERITY CLASSIFICATION (NORMAL / WATCH / WARNING / CRITICAL)
        ↓
9. CAUSAL EXPLANATION & ALERT DISPATCH (Domain-specific meteorological synthesis)
```

---

## 2. Feature Engineering (24 Features)

The ML model extracts a 24-dimensional feature vector for every telemetry reading:

| # | Feature Key | Dimension / Unit | Meteorological Significance |
|---|-------------|------------------|-----------------------------|
| 1 | `temperature` | °C | Dry-bulb ambient air temperature |
| 2 | `feels_like` | °C | Biometeorological thermal index |
| 3 | `humidity` | % | Relative moisture content |
| 4 | `pressure` | hPa | Surface barometric pressure |
| 5 | `wind_speed` | km/h | 10-meter boundary layer wind speed |
| 6 | `wind_gust` | km/h | Peak wind burst velocity |
| 7 | `precipitation` | mm | Accumulated surface rainfall |
| 8 | `cloud_cover` | % | Total sky cloud obstruction |
| 9 | `visibility` | km | Atmospheric optical transparency |
| 10 | `uv_index` | UV Index | Solar ultraviolet radiation index |
| 11 | `dew_point` | °C | Temperature of moisture saturation |
| 12 | `wet_bulb` | °C | Evaporative cooling thermodynamic threshold (Stull) |
| 13 | `apparent_temperature` | °C | Australian BOM / Steadman bioclimatic model |
| 14 | `soil_temperature` | °C | Ground boundary layer (0cm depth) |
| 15 | `air_quality_pm25` | µg/m³ | Respirable fine particulate matter |
| 16 | `air_quality_pm10` | µg/m³ | Inhalable coarse dust particles |
| 17 | `historical_temperature` | °C | 30-year baseline mean for location & hour |
| 18 | `historical_humidity` | % | 30-year baseline relative humidity |
| 19 | `historical_pressure` | hPa | Elevation-adjusted baseline pressure |
| 20 | `sin(time_of_day)` | Cyclical [-1, 1] | Diurnal solar phase (hour of day) |
| 21 | `cos(time_of_day)` | Cyclical [-1, 1] | Diurnal solar quadrature |
| 22 | `sin(day_of_year)` | Cyclical [-1, 1] | Annual seasonal solar phase |
| 23 | `temperature_deviation` | °C | Observed minus expected temperature delta |
| 24 | `pressure_gradient_rate` | hPa | Deviation from expected barometric tide |

---

## 3. Location-Aware Climate Baselines

A temperature of 35°C is routine in Delhi in May, but highly anomalous in London or Bengaluru. To prevent false positives, GARUDA calculates expected values dynamically using:

1. **Latitude Band & Solar Zenith Phase**:
   $$\mu_{\text{seasonal}} = T_{\text{equator}} - \left(\frac{|\text{lat}|}{90} \times 38\right) + A_{\text{seasonal}} \cos\left(\frac{m - 7}{12} \times 2\pi\right)$$
2. **Barometric Altitude Correction**:
   $$P_{\text{baseline}} = 1013.25 \times \exp\left(-\frac{\text{elevation}}{8400}\right)$$
3. **Diurnal Solar Swing Model**:
   $$T_{\text{expected}}(h) = \mu_{\text{monthly}} + 4.5 \sin\left(\frac{h - 9}{24} \times 2\pi\right)$$

---

## 4. Anomaly Scoring & Classification

The raw weighted Z-variance is converted into an anomaly score $S \in [0, 1]$ via non-linear sigmoid calibration:

$$S_{\text{base}} = \frac{1}{1 + \exp\left(-1.4 \times (\sigma_{\text{weighted}} - 2.2)\right)}$$

### Compound Synergy Boosts:
- **Severe Cyclonic Storm Precursor**: $\Delta P \le -1.8\sigma$ AND $\text{Wind} \ge +1.5\sigma$ AND $\text{Rain} > 5\text{mm} \implies +0.28$
- **High-Risk Thermal Stress**: $\Delta T \ge +1.8\sigma$ AND $\text{Humidity} \ge 60\% \implies +0.20$
- **Thermal Inversion Trap**: $\Delta T \le -1.2\sigma$ AND $\text{Wind} < 6\text{km/h}$ AND $\text{PM2.5} \ge +2.0\sigma \implies +0.18$

### Classification Thresholds:
- **0–20% (NORMAL)**: Atmospheric metrics within standard climatological 2-sigma bounds.
- **21–40% (WATCH)**: Moderate variance or diurnal drift detected.
- **41–70% (WARNING)**: Significant single or compound deviation.
- **71–100% (CRITICAL)**: Extreme meteorological perturbation requiring immediate safety alerts.

---

## 5. Replacing the Baseline with a Production Trained Model

To train and connect your own custom deep learning or Random Forest model:

1. Collect hourly historical CSV dataset for your target regions.
2. Train an Isolation Forest or Autoencoder in Python:
   ```python
   from sklearn.ensemble import IsolationForest
   import joblib

   # X_train is a (N, 24) array matching GARUDA's 24 features
   model = IsolationForest(n_estimators=200, contamination=0.05, random_state=42)
   model.fit(X_train)
   joblib.dump(model, "ml/models/production_isolation_forest.joblib")
   ```
3. Load the saved model in `ml/anomaly_detector.py`:
   ```python
   self.model = joblib.load("ml/models/production_isolation_forest.joblib")
   ```
4. Restart the FastAPI server: `python ml/app.py`.
The backend will automatically utilize your production model output!
