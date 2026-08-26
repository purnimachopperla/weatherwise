import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Snowflake,
  Wind,
  Moon,
  CloudMoon,
} from 'lucide-react';

export const getWeatherIconComponent = (
  weatherCode: number,
  isDay = 1,
  className = "w-6 h-6"
): React.ReactElement => {
  // Clear sky
  if (weatherCode === 0) {
    return isDay ? (
      <Sun className={`${className} text-amber-400 animate-spin-slow`} />
    ) : (
      <Moon className={`${className} text-indigo-300`} />
    );
  }

  // Mainly clear, partly cloudy
  if (weatherCode === 1 || weatherCode === 2) {
    return isDay ? (
      <CloudSun className={`${className} text-amber-300`} />
    ) : (
      <CloudMoon className={`${className} text-indigo-300`} />
    );
  }

  // Overcast
  if (weatherCode === 3) {
    return <Cloud className={`${className} text-slate-400`} />;
  }

  // Fog, mist
  if (weatherCode === 45 || weatherCode === 48) {
    return <CloudFog className={`${className} text-slate-400`} />;
  }

  // Drizzle
  if (weatherCode >= 51 && weatherCode <= 57) {
    return <CloudDrizzle className={`${className} text-cyan-400`} />;
  }

  // Rain
  if ((weatherCode >= 61 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
    return <CloudRain className={`${className} text-blue-400`} />;
  }

  // Snow
  if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) {
    return <Snowflake className={`${className} text-sky-200 animate-pulse`} />;
  }

  // Thunderstorm
  if (weatherCode >= 95 && weatherCode <= 99) {
    return <CloudLightning className={`${className} text-amber-400`} />;
  }

  return <Wind className={`${className} text-slate-400`} />;
};

export const getWeatherConditionName = (weatherCode: number): string => {
  switch (weatherCode) {
    case 0: return "Clear Sky";
    case 1: return "Mainly Clear";
    case 2: return "Partly Cloudy";
    case 3: return "Overcast";
    case 45: return "Fog";
    case 48: return "Depositing Rime Fog";
    case 51: return "Light Drizzle";
    case 53: return "Moderate Drizzle";
    case 55: return "Dense Drizzle";
    case 61: return "Slight Rain";
    case 63: return "Moderate Rain";
    case 65: return "Heavy Rain";
    case 71: return "Slight Snow Fall";
    case 73: return "Moderate Snow Fall";
    case 75: return "Heavy Snow Fall";
    case 80: return "Slight Rain Showers";
    case 81: return "Moderate Rain Showers";
    case 82: return "Violent Rain Showers";
    case 95: return "Thunderstorm";
    case 96: return "Thunderstorm with Slight Hail";
    case 99: return "Thunderstorm with Heavy Hail";
    default: return "Partly Cloudy";
  }
};
