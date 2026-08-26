/**
 * weatherUtils.js — Helper functions for the frontend.
 *
 * These convert raw data into display-ready values
 * (icons, colors, formatted strings, etc.)
 */

// ─────────────────────────────────────────────
// WMO Weather Code → Emoji + Description
// ─────────────────────────────────────────────
const WMO_MAP = {
  0:  { label: 'Clear Sky',         emoji: '☀️' },
  1:  { label: 'Mainly Clear',      emoji: '🌤️' },
  2:  { label: 'Partly Cloudy',     emoji: '⛅' },
  3:  { label: 'Overcast',          emoji: '☁️' },
  45: { label: 'Foggy',             emoji: '🌫️' },
  48: { label: 'Icy Fog',           emoji: '🌫️' },
  51: { label: 'Light Drizzle',     emoji: '🌦️' },
  53: { label: 'Moderate Drizzle',  emoji: '🌦️' },
  55: { label: 'Dense Drizzle',     emoji: '🌧️' },
  61: { label: 'Slight Rain',       emoji: '🌧️' },
  63: { label: 'Moderate Rain',     emoji: '🌧️' },
  65: { label: 'Heavy Rain',        emoji: '🌧️' },
  71: { label: 'Slight Snow',       emoji: '🌨️' },
  73: { label: 'Moderate Snow',     emoji: '❄️' },
  75: { label: 'Heavy Snow',        emoji: '❄️' },
  77: { label: 'Snow Grains',       emoji: '🌨️' },
  80: { label: 'Slight Showers',    emoji: '🌦️' },
  81: { label: 'Moderate Showers',  emoji: '🌧️' },
  82: { label: 'Violent Showers',   emoji: '⛈️' },
  85: { label: 'Snow Showers',      emoji: '🌨️' },
  86: { label: 'Heavy Snow Showers',emoji: '❄️' },
  95: { label: 'Thunderstorm',      emoji: '⛈️' },
  96: { label: 'Thunderstorm+Hail', emoji: '⛈️' },
  99: { label: 'Thunderstorm+Hail', emoji: '⛈️' },
};

export function getWeatherEmoji(code) {
  return WMO_MAP[code]?.emoji || '🌡️';
}

export function getWeatherLabel(code) {
  return WMO_MAP[code]?.label || 'Unknown';
}

// ─────────────────────────────────────────────
// AQI Colors
// ─────────────────────────────────────────────
export function getAQIColor(aqi) {
  if (aqi == null) return '#6b7280';
  if (aqi <= 20) return '#22c55e';
  if (aqi <= 40) return '#84cc16';
  if (aqi <= 60) return '#eab308';
  if (aqi <= 80) return '#f97316';
  if (aqi <= 100) return '#ef4444';
  return '#7c3aed';
}

export function getAQILabel(aqi) {
  if (aqi == null) return 'Unknown';
  if (aqi <= 20) return 'Good';
  if (aqi <= 40) return 'Fair';
  if (aqi <= 60) return 'Moderate';
  if (aqi <= 80) return 'Poor';
  if (aqi <= 100) return 'Very Poor';
  return 'Extremely Poor';
}

// ─────────────────────────────────────────────
// UV Index Labels
// ─────────────────────────────────────────────
export function getUVLabel(uv) {
  if (uv == null) return 'Unknown';
  if (uv < 3) return 'Low';
  if (uv < 6) return 'Moderate';
  if (uv < 8) return 'High';
  if (uv < 11) return 'Very High';
  return 'Extreme';
}

export function getUVColor(uv) {
  if (uv == null) return '#6b7280';
  if (uv < 3) return '#22c55e';
  if (uv < 6) return '#eab308';
  if (uv < 8) return '#f97316';
  if (uv < 11) return '#ef4444';
  return '#7c3aed';
}

// ─────────────────────────────────────────────
// Temperature Color (cold → hot)
// ─────────────────────────────────────────────
export function getTempColor(temp) {
  if (temp <= 0) return '#06b6d4';
  if (temp <= 10) return '#3b82f6';
  if (temp <= 20) return '#10b981';
  if (temp <= 30) return '#f59e0b';
  if (temp <= 38) return '#f97316';
  return '#ef4444';
}

// ─────────────────────────────────────────────
// Wind Speed Labels (km/h)
// ─────────────────────────────────────────────
export function getWindLabel(speed) {
  if (speed < 1) return 'Calm';
  if (speed < 6) return 'Light Air';
  if (speed < 12) return 'Light Breeze';
  if (speed < 20) return 'Gentle Breeze';
  if (speed < 29) return 'Moderate Breeze';
  if (speed < 39) return 'Fresh Breeze';
  if (speed < 50) return 'Strong Breeze';
  if (speed < 62) return 'Near Gale';
  return 'Gale';
}

// ─────────────────────────────────────────────
// Visibility Labels (metres)
// ─────────────────────────────────────────────
export function getVisibilityLabel(metres) {
  if (metres == null) return 'Unknown';
  const km = metres / 1000;
  if (km >= 10) return 'Excellent';
  if (km >= 5) return 'Good';
  if (km >= 2) return 'Moderate';
  if (km >= 1) return 'Poor';
  return 'Very Poor';
}

export function formatVisibility(metres) {
  if (metres == null) return 'N/A';
  const km = metres / 1000;
  if (km >= 1) return `${km.toFixed(1)} km`;
  return `${metres} m`;
}

// ─────────────────────────────────────────────
// Time Formatting
// ─────────────────────────────────────────────
export function formatHour(isoString) {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  } catch {
    return isoString;
  }
}

export function formatDate(dateString) {
  try {
    const d = new Date(dateString + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

// ─────────────────────────────────────────────
// Severity Colors for Recommendation Cards
// ─────────────────────────────────────────────
export function getSeverityStyle(severity) {
  const map = {
    good:     { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)',  text: '#10b981' },
    moderate: { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  text: '#f59e0b' },
    warning:  { bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.3)',  text: '#f97316' },
    danger:   { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   text: '#ef4444' },
  };
  return map[severity] || map.moderate;
}

// ─────────────────────────────────────────────
// Generate a stable session ID for the browser
// ─────────────────────────────────────────────
export function getOrCreateSessionId() {
  const key = 'ww_session_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

// ─────────────────────────────────────────────
// Humidity Comfort Label
// ─────────────────────────────────────────────
export function getHumidityLabel(humidity) {
  if (humidity < 30) return 'Very Dry';
  if (humidity < 50) return 'Comfortable';
  if (humidity < 70) return 'Moderate';
  if (humidity < 85) return 'Humid';
  return 'Very Humid';
}
