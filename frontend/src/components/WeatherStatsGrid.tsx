import React from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  Sun,
  Compass,
} from 'lucide-react';
import type { CurrentWeather } from '../types/weather';
import { formatSpeed, formatVisibility, getUVLabel, getWindDirectionName } from '../utils/formatters';

interface WeatherStatsGridProps {
  current: CurrentWeather;
  uvIndex?: number;
}

export const WeatherStatsGrid: React.FC<WeatherStatsGridProps> = ({
  current,
  uvIndex = 5.0,
}) => {
  const uvInfo = getUVLabel(uvIndex);
  const windDirName = getWindDirectionName(current.wind_direction);
  const rawPressure = current.pressure ?? current.surface_pressure ?? 1013;

  const stats = [
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${current.humidity}%`,
      subtext: current.humidity > 70 ? 'High moisture' : current.humidity < 30 ? 'Dry air' : 'Comfortable',
      icon: Droplets,
      color: 'text-blue-400',
      borderGlow: 'hover:border-blue-500/30',
    },
    {
      id: 'wind',
      label: 'Wind Telemetry',
      value: formatSpeed(current.wind_speed),
      subtext: `${windDirName} (${current.wind_direction ?? 0}°)`,
      icon: Wind,
      color: 'text-cyan-400',
      borderGlow: 'hover:border-cyan-500/30',
      extra: (
        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 font-mono">
          <Compass
            className="w-3 h-3 text-cyan-400 transition-transform duration-500"
            style={{ transform: `rotate(${current.wind_direction ?? 0}deg)` }}
          />
          <span>{windDirName} Breeze</span>
        </div>
      ),
    },
    {
      id: 'uv',
      label: 'UV Index',
      value: uvIndex.toFixed(1),
      subtext: uvInfo.label,
      icon: Sun,
      color: uvInfo.color,
      borderGlow: 'hover:border-amber-500/30',
    },
    {
      id: 'pressure',
      label: 'Pressure',
      value: `${Math.round(rawPressure)} hPa`,
      subtext: rawPressure > 1013 ? 'High pressure system' : 'Low pressure',
      icon: Gauge,
      color: 'text-purple-400',
      borderGlow: 'hover:border-purple-500/30',
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: formatVisibility(current.visibility),
      subtext: (current.visibility ?? 10000) >= 9000 ? 'Clear horizon' : 'Reduced sight',
      icon: Eye,
      color: 'text-emerald-400',
      borderGlow: 'hover:border-emerald-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            className={`p-4 rounded-2xl glass-card border border-white/5 ${stat.borderGlow} transition-all duration-300 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium tracking-wide uppercase text-slate-400">
                {stat.label}
              </span>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </div>

            <div>
              <div className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
                {stat.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                {stat.subtext}
              </div>
              {stat.extra}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
