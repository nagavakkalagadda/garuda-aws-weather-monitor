/**
 * GARUDA // Temperature and Metric Unit Converter
 */

export function convertTemperature(celsiusVal, unit = 'C') {
  if (celsiusVal === undefined || celsiusVal === null || isNaN(celsiusVal)) {
    return '--';
  }
  const c = Number(celsiusVal);
  if (unit === 'F') {
    const f = (c * 9) / 5 + 32;
    return Math.round(f * 10) / 10;
  }
  return Math.round(c * 10) / 10;
}

export function formatTempWithUnit(celsiusVal, unit = 'C') {
  const val = convertTemperature(celsiusVal, unit);
  return `${val}°${unit}`;
}

export function formatDeviation(devVal, unit = 'C') {
  if (devVal === undefined || devVal === null || isNaN(devVal)) return '0.0';
  let val = Number(devVal);
  if (unit === 'F') {
    val = (val * 9) / 5;
  }
  const formatted = Math.round(val * 10) / 10;
  return `${formatted > 0 ? '+' : ''}${formatted}°${unit}`;
}
