/**
 * weatherUtils.js — Helper functions for the Environmental Intelligence Platform.
 *
 * Professional calculations, color tokens, and Lucide icon mappings.
 */

// WMO Weather Code Metadata
export const WMO_MAP = {
  0:  { label: 'Clear Sky',          icon: 'Sun',           severity: 'good' },
  1:  { label: 'Mainly Clear',       icon: 'Sun',           severity: 'good' },
  2:  { label: 'Partly Cloudy',      icon: 'CloudSun',      severity: 'good' },
  3:  { label: 'Overcast',           icon: 'Cloud',         severity: 'moderate' },
  45: { label: 'Foggy',              icon: 'CloudFog',      severity: 'warning' },
  48: { label: 'Icy Fog',            icon: 'CloudFog',      severity: 'warning' },
  51: { label: 'Light Drizzle',      icon: 'CloudDrizzle',  severity: 'moderate' },
  53: { label: 'Moderate Drizzle',   icon: 'CloudDrizzle',  severity: 'moderate' },
  55: { label: 'Dense Drizzle',      icon: 'CloudRain',     severity: 'warning' },
  61: { label: 'Slight Rain',        icon: 'CloudRain',     severity: 'moderate' },
  63: { label: 'Moderate Rain',      icon: 'CloudRain',     severity: 'warning' },
  65: { label: 'Heavy Rain',         icon: 'CloudRain',     severity: 'danger' },
  71: { label: 'Slight Snow',        icon: 'CloudSnow',     severity: 'warning' },
  73: { label: 'Moderate Snow',      icon: 'CloudSnow',     severity: 'warning' },
  75: { label: 'Heavy Snow',         icon: 'CloudSnow',     severity: 'danger' },
  77: { label: 'Snow Grains',        icon: 'CloudSnow',     severity: 'warning' },
  80: { label: 'Slight Showers',     icon: 'CloudDrizzle',  severity: 'moderate' },
  81: { label: 'Moderate Showers',   icon: 'CloudRain',     severity: 'warning' },
  82: { label: 'Violent Showers',    icon: 'CloudLightning',severity: 'danger' },
  85: { label: 'Snow Showers',       icon: 'CloudSnow',     severity: 'warning' },
  86: { label: 'Heavy Snow Showers', icon: 'CloudSnow',     severity: 'danger' },
  95: { label: 'Thunderstorm',       icon: 'CloudLightning',severity: 'danger' },
  96: { label: 'Thunderstorm + Hail',icon: 'CloudLightning',severity: 'danger' },
  99: { label: 'Severe Thunderstorm',icon: 'CloudLightning',severity: 'danger' },
};

export function getWeatherLabel(code) {
  return WMO_MAP[code]?.label || 'Clear';
}

export function getWeatherIconName(code) {
  return WMO_MAP[code]?.icon || 'Sun';
}

// ─────────────────────────────────────────────
// AQI European Standard Classifications
// ─────────────────────────────────────────────
export function getAQILabel(aqi) {
  if (aqi == null) return 'Not Available';
  if (aqi <= 20) return 'Good';
  if (aqi <= 40) return 'Fair';
  if (aqi <= 60) return 'Moderate';
  if (aqi <= 80) return 'Poor';
  if (aqi <= 100) return 'Very Poor';
  return 'Hazardous';
}

export function getAQIColor(aqi) {
  if (aqi == null) return '#64748b';
  if (aqi <= 20) return '#16a34a'; // Good (Green)
  if (aqi <= 40) return '#0d9488'; // Fair (Teal)
  if (aqi <= 60) return '#d97706'; // Moderate (Amber)
  if (aqi <= 80) return '#ea580c'; // Poor (Orange)
  if (aqi <= 100) return '#dc2626'; // Very Poor (Red)
  return '#9333ea'; // Hazardous (Purple)
}

export function getAQIBadgeStyle(aqi) {
  if (aqi == null) return { bg: '#f1f5f9', text: '#64748b', border: '#cbd5e1' };
  if (aqi <= 20) return { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' };
  if (aqi <= 40) return { bg: '#f0fdfa', text: '#0f766e', border: '#99f6e4' };
  if (aqi <= 60) return { bg: '#fffbeb', text: '#b45309', border: '#fde68a' };
  if (aqi <= 80) return { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' };
  if (aqi <= 100) return { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' };
  return { bg: '#faf5ff', text: '#7e22ce', border: '#e9d5ff' };
}

// ─────────────────────────────────────────────
// UV Index Classifications
// ─────────────────────────────────────────────
export function getUVLabel(uv) {
  if (uv == null) return 'N/A';
  if (uv < 3) return 'Low';
  if (uv < 6) return 'Moderate';
  if (uv < 8) return 'High';
  if (uv < 11) return 'Very High';
  return 'Extreme';
}

export function getUVColor(uv) {
  if (uv == null) return '#64748b';
  if (uv < 3) return '#16a34a';
  if (uv < 6) return '#d97706';
  if (uv < 8) return '#ea580c';
  if (uv < 11) return '#dc2626';
  return '#9333ea';
}

// ─────────────────────────────────────────────
// Wind & Atmospheric Metrics
// ─────────────────────────────────────────────
export function getWindLabel(speed) {
  if (speed == null) return 'Calm';
  if (speed < 5) return 'Calm';
  if (speed < 20) return 'Light Breeze';
  if (speed < 38) return 'Moderate Breeze';
  if (speed < 62) return 'Strong Wind';
  return 'Gale Force';
}

export function getHumidityLabel(h) {
  if (h == null) return 'Normal';
  if (h < 30) return 'Dry';
  if (h <= 60) return 'Optimal';
  if (h <= 75) return 'Humid';
  return 'Very Humid';
}

export function formatVisibility(meters) {
  if (meters == null) return 'N/A';
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

export function getVisibilityLabel(meters) {
  if (meters == null) return 'Clear';
  if (meters >= 10000) return 'Excellent';
  if (meters >= 5000) return 'Good';
  if (meters >= 2000) return 'Moderate';
  return 'Poor (Fog/Haze)';
}

export function formatHour(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
}

export function getTempColor(t) {
  if (t == null) return '#0f766e';
  if (t <= 5) return '#0284c7';
  if (t <= 18) return '#0d9488';
  if (t <= 28) return '#16a34a';
  if (t <= 36) return '#d97706';
  return '#dc2626';
}

export function getSeverityStyle(sev) {
  switch (sev) {
    case 'danger':
      return { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c', badge: '#fee2e2' };
    case 'warning':
      return { bg: '#fffbeb', border: '#fde68a', text: '#b45309', badge: '#fef3c7' };
    case 'moderate':
      return { bg: '#f0fdfa', border: '#99f6e4', text: '#0f766e', badge: '#ccfbf1' };
    case 'good':
    default:
      return { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', badge: '#dcfce7' };
  }
}

// ─────────────────────────────────────────────
// SIH Environmental Safety & Decision Index
// ─────────────────────────────────────────────
export function calculateEnvironmentalSafety(weather, airQuality) {
  if (!weather?.current) {
    return { score: 85, level: 'LOW', statusText: 'Environmental conditions are favorable.' };
  }

  const current = weather.current;
  const aqi = airQuality?.aqi ?? 35;
  const uv = airQuality?.uv_index ?? 3;
  const rainProb = weather.daily?.[0]?.rain_probability ?? 10;
  const temp = current.temperature;

  let score = 100;

  // AQI Impact (up to -40 points)
  score -= Math.min((aqi / 150) * 40, 40);

  // UV Impact (up to -20 points)
  if (uv > 5) {
    score -= Math.min((uv - 5) * 4, 20);
  }

  // Rain & Severe Weather Impact (up to -20 points)
  score -= Math.min((rainProb / 100) * 20, 20);

  // Thermal Discomfort Impact
  if (temp > 36) score -= Math.min((temp - 36) * 3, 15);
  if (temp < 8) score -= Math.min((8 - temp) * 2, 15);

  const finalScore = Math.max(15, Math.min(100, Math.round(score)));

  let level = 'LOW';
  let statusText = 'Environmental conditions are optimal for general outdoor operations.';
  let badgeColor = '#16a34a';

  if (finalScore < 50) {
    level = 'HIGH';
    statusText = 'Adverse environmental conditions. Exercise precaution for prolonged outdoor exposure.';
    badgeColor = '#dc2626';
  } else if (finalScore < 75) {
    level = 'MODERATE';
    statusText = 'Moderate environmental parameters. Sensitive individuals should monitor conditions.';
    badgeColor = '#d97706';
  }

  return {
    score: finalScore,
    level,
    statusText,
    badgeColor,
  };
}
