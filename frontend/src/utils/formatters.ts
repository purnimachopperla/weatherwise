import type { TemperatureUnit } from '../types/weather';

export const formatTemperature = (
  celsius: number | undefined,
  unit: TemperatureUnit = 'celsius',
  decimals = 0
): string => {
  if (celsius === undefined || isNaN(celsius)) return '--';
  if (unit === 'fahrenheit') {
    const f = (celsius * 9) / 5 + 32;
    return `${f.toFixed(decimals)}°F`;
  }
  return `${celsius.toFixed(decimals)}°C`;
};

export const formatSpeed = (kmh: number | undefined, unit: 'kmh' | 'mph' = 'kmh'): string => {
  if (kmh === undefined || isNaN(kmh)) return '--';
  if (unit === 'mph') {
    return `${(kmh * 0.621371).toFixed(1)} mph`;
  }
  return `${kmh.toFixed(1)} km/h`;
};

export const formatVisibility = (meters: number | undefined): string => {
  if (meters === undefined || isNaN(meters)) return '--';
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${meters} m`;
};

export const formatHour = (timeStr?: string, fallbackHour?: string): string => {
  if (fallbackHour) return fallbackHour;
  if (!timeStr) return '--';
  try {
    const date = new Date(timeStr);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    }
    // If string like "2026-08-26T21:00"
    if (timeStr.includes('T')) {
      const parts = timeStr.split('T')[1].split(':');
      const hour = parseInt(parts[0], 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const h12 = hour % 12 || 12;
      return `${h12} ${ampm}`;
    }
    return timeStr;
  } catch {
    return timeStr;
  }
};

export const getAQIColor = (aqi: number): { text: string; bg: string; border: string; glow: string } => {
  if (aqi <= 20) {
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      glow: 'rgba(16, 185, 129, 0.35)',
    };
  }
  if (aqi <= 40) {
    return {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      glow: 'rgba(6, 182, 212, 0.35)',
    };
  }
  if (aqi <= 60) {
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      glow: 'rgba(245, 158, 11, 0.35)',
    };
  }
  if (aqi <= 80) {
    return {
      text: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      glow: 'rgba(249, 115, 22, 0.35)',
    };
  }
  return {
    text: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    glow: 'rgba(244, 63, 94, 0.35)',
  };
};

export const getUVLabel = (uv: number): { label: string; color: string } => {
  if (uv < 3) return { label: 'Low', color: 'text-emerald-400' };
  if (uv < 6) return { label: 'Moderate', color: 'text-amber-400' };
  if (uv < 8) return { label: 'High', color: 'text-orange-400' };
  if (uv < 11) return { label: 'Very High', color: 'text-rose-400' };
  return { label: 'Extreme', color: 'text-purple-400' };
};

export const getWindDirectionName = (deg?: number): string => {
  if (deg === undefined) return 'N';
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;
  return directions[index];
};
