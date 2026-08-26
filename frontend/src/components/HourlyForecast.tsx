import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Droplets } from 'lucide-react';
import type { HourlyForecastItem, TemperatureUnit } from '../types/weather';
import { formatTemperature, formatHour } from '../utils/formatters';
import { getWeatherIconComponent } from '../utils/weatherIcons';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  tempUnit: TemperatureUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  tempUnit,
}) => {
  const hours = hourly?.slice(0, 24) || [];

  return (
    <div className="p-4 sm:p-6 rounded-2xl glass-card border border-white/10">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-white">
              Hourly Trajectory
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400">Next 24 hours live telemetry with rain probabilities</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {hours.map((item, idx) => {
          const isNow = idx === 0;
          const displayHour = isNow ? 'Now' : formatHour(item.time, item.hour);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: idx * 0.02 }}
              className={`flex-shrink-0 flex flex-col items-center justify-between p-3 sm:p-3.5 rounded-xl min-w-[76px] sm:min-w-[85px] border transition-all duration-200 ${
                isNow
                  ? 'bg-gradient-to-b from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-white shadow-glow-cyan'
                  : 'bg-dark-900/40 hover:bg-dark-900/80 border-white/5 text-slate-300'
              }`}
            >
              <span className="text-[11px] sm:text-xs font-semibold">
                {displayHour}
              </span>

              <div className="my-2">
                {getWeatherIconComponent(item.weather_code, 1, 'w-5 h-5 sm:w-6 sm:h-6')}
              </div>

              <span className="font-display text-xs sm:text-sm font-bold text-white">
                {formatTemperature(item.temperature, tempUnit, 0)}
              </span>

              <div className="flex items-center gap-0.5 mt-1.5 text-[9px] sm:text-[10px] text-cyan-400 font-medium font-mono">
                <Droplets className="w-2.5 h-2.5" />
                <span>{item.rain_probability ?? 0}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
