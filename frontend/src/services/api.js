/**
 * SKYGUARD AI // Synoptic Atmospheric API Client
 */

const API_BASE = '/api';

export async function fetchAllWeatherData({ city, state, country, latitude, longitude, mode = 'auto', anomaly_scenario = null }) {
  const params = new URLSearchParams();
  if (city) params.append('city', city);
  if (state) params.append('state', state);
  if (country) params.append('country', country);
  if (latitude !== undefined) params.append('latitude', latitude);
  if (longitude !== undefined) params.append('longitude', longitude);
  if (mode) params.append('mode', mode);
  if (anomaly_scenario) params.append('anomaly_scenario', anomaly_scenario);

  const res = await fetch(`${API_BASE}/weather/all?${params.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Atmospheric telemetry stream failed: HTTP ${res.status}`);
  }
  return await res.json();
}

export async function fetchRegionalShifts() {
  const res = await fetch(`${API_BASE}/weather/regional-shifts`);
  if (!res.ok) throw new Error('Failed to fetch planetary regional shifts');
  return await res.json();
}

export async function searchLocations(query) {
  const res = await fetch(`${API_BASE}/location/search?query=${encodeURIComponent(query || '')}`);
  if (!res.ok) throw new Error('Location lookup failed');
  const data = await res.json();
  return data.results || [];
}

export async function getPresetLocations() {
  const res = await fetch(`${API_BASE}/location/presets`);
  if (!res.ok) throw new Error('Failed to fetch station presets');
  const data = await res.json();
  return data.presets || [];
}

export async function loginOperator(credentials) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Operator authentication failed');
  }
  return data;
}

export async function getDemoOperators() {
  const res = await fetch(`${API_BASE}/auth/operators`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.operators || [];
}

export async function askAiAssistant(query, context) {
  const res = await fetch(`${API_BASE}/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, context })
  });
  if (!res.ok) throw new Error('SKYGUARD Synoptic Copilot offline');
  return await res.json();
}

export async function getTelemetryStatus() {
  const res = await fetch(`${API_BASE}/telemetry/status`);
  if (!res.ok) throw new Error('Telemetry request failed');
  return await res.json();
}
