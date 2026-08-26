import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Droplets } from 'lucide-react';
import type { DailyForecastItem, TemperatureUnit } from '../types/weather';
import { formatTemperature } from '../utils/formatters';
import { getWeatherIconComponent } from '../utils/weatherIcons';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  tempUnit: TemperatureUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
  daily,
  tempUnit,
}) => {
  const days = daily || [];

  // Calculate overall min/max to normalize the temperature gradient range bar
  const allMins = days.map((d) => d.temp_min);
  const allMaxs = days.map((d) => d.temp_max);
  const overallMin = Math.min(...allMins, 0);
  const overallMax = Math.max(...allMaxs, 35);
  const totalRange = overallMax - overallMin || 1;

  return (
    <div className="p-6 rounded-2xl glass-card border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-white">
              7-Day Extended Outlook
            </h3>
            <p className="text-xs text-slate-400">Long range trends with thermal spectrum bands</p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {days.map((day, idx) => {
          const leftPercent = ((day.temp_min - overallMin) / totalRange) * 100;
          const widthPercent = ((day.temp_max - day.temp_min) / totalRange) * 100;

          return (
            <motion.div
              key={day.date || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className="p-3 rounded-xl bg-dark-900/40 hover:bg-dark-900/80 border border-white/5 transition-all duration-200 flex items-center justify-between gap-3 text-xs"
            >
              {/* Day Name */}
              <div className="w-16 font-semibold text-slate-200">
                {idx === 0 ? 'Today' : day.day_name}
              </div>

              {/* Weather Icon & Rain */}
              <div className="flex items-center gap-2 w-20">
                {getWeatherIconComponent(day.weather_code, 1, 'w-5 h-5')}
                {day.rain_probability > 0 ? (
                  <span className="flex items-center text-[10px] text-cyan-400 font-mono">
                    <Droplets className="w-2.5 h-2.5 mr-0.5" />
                    {day.rain_probability}%
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-600 font-mono">0%</span>
                )}
              </div>

              {/* Min Temp */}
              <div className="w-10 text-right font-mono text-slate-400">
                {formatTemperature(day.temp_min, tempUnit, 0)}
              </div>

              {/* Gradient Temperature Bar */}
              <div className="flex-1 h-2 bg-white/5 rounded-full relative overflow-hidden hidden sm:block">
                <div
                  className="absolute h-full rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-400"
                  style={{
                    left: `${Math.max(0, leftPercent)}%`,
                    width: `${Math.max(12, widthPercent)}%`,
                  }}
                />
              </div>

              {/* Max Temp */}
              <div className="w-10 text-left font-mono font-bold text-white">
                {formatTemperature(day.temp_max, tempUnit, 0)}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
