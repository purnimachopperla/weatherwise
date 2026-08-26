/**
 * WeatherAlerts.jsx — Weather alert banners.
 *
 * Displays severity-coded alert cards for:
 * storms, heavy rain, heat, fog, high wind, poor AQI, high UV.
 * Responsive: Scales cleanly on mobile without text overflow.
 */

import { AlertTriangle, CloudLightning, CloudRain, Thermometer, Eye, Wind, AlertCircle, Sun } from 'lucide-react';

const ICON_MAP = {
  'cloud-lightning': CloudLightning,
  'cloud-rain':      CloudRain,
  'thermometer':     Thermometer,
  'eye-off':         Eye,
  'eye':             Eye,
  'wind':            Wind,
  'alert-circle':    AlertCircle,
  'alert-triangle':  AlertTriangle,
  'umbrella':        CloudRain,
  'sun':             Sun,
};

const SEVERITY_STYLES = {
  danger:  { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.35)',  text: '#ef4444' },
  warning: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', text: '#f59e0b' },
  info:    { bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.35)',  text: '#06b6d4' },
};

export default function WeatherAlerts({ alerts }) {
  const alertList = alerts?.alerts || [];
  if (alertList.length === 0) return null;

  return (
    <div className="fade-in flex flex-col gap-2 sm:gap-2.5">
      <h3 className="text-xs sm:text-sm text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
        <span>⚠️ Active Alerts</span>
      </h3>

      {alertList.map((alert, i) => {
        const style = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info;
        const IconComponent = ICON_MAP[alert.icon] || AlertTriangle;

        return (
          <div
            key={i}
            className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all"
            style={{
              background: style.bg,
              borderColor: style.border,
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background: `${style.text}20`,
                color: style.text,
              }}
            >
              <IconComponent size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-bold mb-1" style={{ color: style.text }}>
                {alert.title}
              </p>
              <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed break-words">
                {alert.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

