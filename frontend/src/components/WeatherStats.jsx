/**
 * WeatherStats.jsx — Compact, modern weather metric tiles.
 *
 * Displays: AQI, UV Index, Humidity, Wind Speed, Visibility, Pressure
 * Responsive: 2 cols on mobile, 3 cols on tablet, 6 cols on desktop.
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
      label: 'Air Quality',
      value: aqi != null ? Math.round(aqi) : 'N/A',
      unit: 'AQI',
      sub: getAQILabel(aqi),
      icon: <Activity size={16} />,
      color: aqiColor,
    },
    {
      id: 'uv',
      label: 'UV Index',
      value: uv != null ? uv.toFixed(1) : 'N/A',
      unit: '',
      sub: getUVLabel(uv),
      icon: <Sun size={16} />,
      color: uvColor,
    },
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${Math.round(current.humidity)}`,
      unit: '%',
      sub: getHumidityLabel(current.humidity),
      icon: <Droplets size={16} />,
      color: '#06b6d4',
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: `${Math.round(current.wind_speed)}`,
      unit: 'km/h',
      sub: getWindLabel(current.wind_speed),
      icon: <Wind size={16} />,
      color: '#818cf8',
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: formatVisibility(current.visibility),
      unit: '',
      sub: getVisibilityLabel(current.visibility),
      icon: <Eye size={16} />,
      color: '#10b981',
    },
    {
      id: 'pressure',
      label: 'Pressure',
      value: current.pressure != null ? `${Math.round(current.pressure)}` : 'N/A',
      unit: 'hPa',
      sub: current.pressure > 1013 ? 'High' : 'Normal',
      icon: <Gauge size={16} />,
      color: '#f59e0b',
    },
  ];

  return (
    <section aria-label="Key Weather Metrics" className="fade-in w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
          >
            {/* Header: Icon + Label */}
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${stat.color}18`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <span className="text-[11px] font-semibold text-slate-400 truncate">
                {stat.label}
              </span>
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-1 my-0.5">
              <span
                className="text-lg sm:text-xl font-bold tracking-tight leading-none"
                style={{ color: stat.color }}
              >
                {stat.value}
              </span>
              {stat.unit && (
                <span className="text-[11px] font-medium text-slate-500">
                  {stat.unit}
                </span>
              )}
            </div>

            {/* Sub-label */}
            <p className="text-[11px] text-slate-400 font-medium break-words leading-tight mt-1">
              {stat.sub}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
