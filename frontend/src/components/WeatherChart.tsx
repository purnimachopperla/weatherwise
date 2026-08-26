import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Droplets, Thermometer } from 'lucide-react';
import type { HourlyForecastItem, TemperatureUnit } from '../types/weather';
import { formatHour } from '../utils/formatters';

interface WeatherChartProps {
  hourly: HourlyForecastItem[];
  tempUnit: TemperatureUnit;
}

export const WeatherChart: React.FC<WeatherChartProps> = ({
  hourly,
  tempUnit,
}) => {
  const [activeMetric, setActiveMetric] = useState<'temp' | 'rain'>('temp');

  const chartData = (hourly?.slice(0, 16) || []).map((item) => {
    const rawTemp = item.temperature;
    const displayTemp =
      tempUnit === 'fahrenheit' ? Math.round((rawTemp * 9) / 5 + 32) : Math.round(rawTemp);

    return {
      time: formatHour(item.time, item.hour),
      rawTime: item.time,
      temp: displayTemp,
      rain: item.rain_probability ?? 0,
      humidity: item.humidity,
    };
  });

  return (
    <div className="p-6 rounded-2xl glass-card border border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-white">
              Dynamic Telemetry Curves
            </h3>
            <p className="text-xs text-slate-400">Continuous 16-hour sensor curves</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-dark-900 border border-white/5">
          <button
            onClick={() => setActiveMetric('temp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMetric === 'temp'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temperature</span>
          </button>
          <button
            onClick={() => setActiveMetric('rain')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMetric === 'rain'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Precipitation %</span>
          </button>
        </div>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              unit={activeMetric === 'temp' ? '°' : '%'}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl bg-dark-900/95 border border-white/10 shadow-xl backdrop-blur-xl text-xs space-y-1">
                      <div className="font-semibold text-slate-200">{data.time}</div>
                      <div className="text-cyan-400 font-mono">
                        Temperature: {data.temp}°{tempUnit === 'celsius' ? 'C' : 'F'}
                      </div>
                      <div className="text-blue-400 font-mono">
                        Rain Chance: {data.rain}%
                      </div>
                      <div className="text-slate-400 font-mono">
                        Humidity: {data.humidity}%
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {activeMetric === 'temp' ? (
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
            ) : (
              <Area
                type="monotone"
                dataKey="rain"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#rainGradient)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
