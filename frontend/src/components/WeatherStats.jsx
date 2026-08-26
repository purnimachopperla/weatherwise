/**
 * WeatherStats.jsx — Responsive grid of environment stat cards.
 *
 * Shows: AQI, UV Index, Humidity, Wind Speed, Visibility, Pressure
 * Responsive: 2 cols on mobile, 3 cols on tablet/desktop.
 */

import { Wind, Droplets, Eye, Gauge, Sun, Activity } from 'lucide-react';
import {
  getAQIColor, getAQILabel,
  getUVLabel, getUVColor,
  getWindLabel,
  getVisibilityLabel, formatVisibility,
  getHumidityLabel,
} from '../utils/weatherUtils';

export default function WeatherStats({ weather, airQuality }) {
  if (!weather) return null;

  const { current } = weather;
  const uv = airQuality?.uv_index;
  const aqi = airQuality?.aqi;
  const aqiColor = getAQIColor(aqi);
  const uvColor = getUVColor(uv);

  const stats = [
    {
      id: 'aqi',
      label: 'AQI',
      value: aqi != null ? Math.round(aqi) : 'N/A',
      sub: getAQILabel(aqi),
      icon: <Activity size={18} />,
      color: aqiColor,
    },
    {
      id: 'uv',
      label: 'UV Index',
      value: uv != null ? uv.toFixed(1) : 'N/A',
      sub: getUVLabel(uv),
      icon: <Sun size={18} />,
      color: uvColor,
    },
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${Math.round(current.humidity)}%`,
      sub: getHumidityLabel(current.humidity),
      icon: <Droplets size={18} />,
      color: '#06b6d4',
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: `${Math.round(current.wind_speed)}`,
      unit: 'km/h',
      sub: getWindLabel(current.wind_speed),
      icon: <Wind size={18} />,
      color: '#8b5cf6',
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: formatVisibility(current.visibility),
      sub: getVisibilityLabel(current.visibility),
      icon: <Eye size={18} />,
      color: '#10b981',
    },
    {
      id: 'pressure',
      label: 'Pressure',
      value: current.pressure != null ? `${Math.round(current.pressure)}` : 'N/A',
      unit: 'hPa',
      sub: current.pressure > 1013 ? 'High' : 'Low',
      icon: <Gauge size={18} />,
      color: '#f59e0b',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5 fade-in">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}

function StatCard({ stat }) {
  return (
    <div className="glass-card p-3 sm:p-4 rounded-2xl flex flex-col justify-between min-h-[96px] sm:min-h-[104px]">
      {/* Icon + Label row */}
      <div className="flex items-center gap-2 mb-1.5">
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${stat.color}20`, color: stat.color }}
        >
          {stat.icon}
        </div>
        <p className="text-[11px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
          {stat.label}
        </p>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1 mb-0.5">
        <span
          className="text-lg sm:text-xl md:text-2xl font-black tracking-tight leading-tight"
          style={{ color: stat.color }}
        >
          {stat.value}
        </span>
        {stat.unit && (
          <span className="text-[11px] text-slate-400 font-medium">{stat.unit}</span>
        )}
      </div>

      {/* Sub-label */}
      <p className="text-[11px] sm:text-xs text-slate-400 font-medium break-words leading-tight">
        {stat.sub}
      </p>
    </div>
  );
}

