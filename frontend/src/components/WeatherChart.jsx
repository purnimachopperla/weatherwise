/**
 * WeatherChart.jsx — Interactive 24-hour temperature & rain probability trends.
 *
 * Visual Features:
 * - Tabbed or stacked clean charts using Recharts
 * - Custom glass tooltips and gradient area fills
 */

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { TrendingUp, CloudRain } from 'lucide-react';
import { formatHour } from '../utils/weatherUtils';

// Custom modern tooltip component
function CustomTooltip({ active, payload, label, unit, color }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/90 border border-indigo-500/30 rounded-xl p-2.5 shadow-xl text-xs backdrop-blur-md">
        <p className="text-slate-400 font-medium mb-0.5">{label}</p>
        <p className="font-bold flex items-center gap-1.5" style={{ color }}>
          <span>{payload[0].value}{unit}</span>
        </p>
      </div>
    );
  }
  return null;
}

export default function WeatherChart({ weather }) {
  const [activeTab, setActiveTab] = useState('temp'); // 'temp' | 'rain'

  if (!weather?.hourly?.length) return null;

  const chartData = weather.hourly.slice(0, 24).map((h, i) => ({
    time: i === 0 ? 'Now' : formatHour(h.time),
    temperature: Math.round(h.temperature),
    rain: h.rain_probability || 0,
  }));

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/5 w-full">
      {/* Header & Tab Selector */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-cyan-400" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
            24h Trends
          </h3>
        </div>

        {/* Tab Toggle */}
        <div className="inline-flex p-1 rounded-xl bg-slate-950/70 border border-white/5 text-xs">
          <button
            onClick={() => setActiveTab('temp')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'temp'
                ? 'bg-indigo-500/25 text-white border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Temperature
          </button>
          <button
            onClick={() => setActiveTab('rain')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'rain'
                ? 'bg-cyan-500/25 text-white border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rain Probability
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-48 sm:h-56">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'temp' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={20}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}°`}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip unit="°C" color="#f97316" />} />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#f97316"
                strokeWidth={2.5}
                fill="url(#tempGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#f97316', strokeWidth: 0 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={20}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip unit="%" color="#06b6d4" />} />
              <Bar
                dataKey="rain"
                fill="url(#rainGrad)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
