/**
 * WeatherChart.jsx — Recharts-powered weather charts.
 *
 * Two charts:
 * 1. Temperature trend (hourly, 24h)
 * 2. Rain probability (hourly, 24h)
 *
 * Fully responsive: adapts padding, ticks, and containers cleanly across all screen sizes.
 */

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { formatHour } from '../utils/weatherUtils';

// Custom tooltip that matches our dark theme
function CustomTooltip({ active, payload, label, unit, color }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-950/95 backdrop-blur-md border border-indigo-500/30 rounded-xl px-3 py-2 text-xs shadow-xl shadow-black/60">
      <p className="text-slate-400 font-medium mb-1">{label}</p>
      <p className="font-bold text-sm" style={{ color }}>
        {payload[0].value}{unit}
      </p>
    </div>
  );
}

export default function WeatherChart({ weather }) {
  if (!weather?.hourly?.length) return null;

  // Use first 24 hours
  const hourly = weather.hourly.slice(0, 24);
  const chartData = hourly.map((h, i) => ({
    time: i === 0 ? 'Now' : formatHour(h.time),
    temperature: Math.round(h.temperature),
    rain: h.rain_probability,
    humidity: Math.round(h.humidity),
  }));

  return (
    <div className="flex flex-col gap-3.5 sm:gap-5 fade-in w-full overflow-hidden">
      {/* ── Temperature Chart ───────────────────────── */}
      <div className="glass-card-static p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-indigo-500/20">
        <h3 className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider mb-3 sm:mb-4">
          🌡️ Temperature Trend (24h)
        </h3>
        <div className="w-full h-44 sm:h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.12)" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={24}
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
                fill="url(#tempGradient)"
                dot={false}
                activeDot={{ r: 4, fill: '#f97316', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Rain Probability Chart ───────────────────── */}
      <div className="glass-card-static p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-indigo-500/20">
        <h3 className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider mb-3 sm:mb-4">
          🌧️ Rain Probability (24h)
        </h3>
        <div className="w-full h-40 sm:h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.12)" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={24}
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
                fill="url(#rainGradient)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

