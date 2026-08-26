/**
 * WeatherAlerts.jsx — Modern weather warning and alert banners.
 *
 * Displays severity-coded alerts for severe conditions.
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
  danger:  { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  text: '#ef4444' },
  warning: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b' },
  info:    { bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.3)',  text: '#06b6d4' },
};

export default function WeatherAlerts({ alerts }) {
  const alertList = alerts?.alerts || [];
  if (alertList.length === 0) return null;

  return (
    <section aria-label="Active Weather Alerts" className="fade-in w-full flex flex-col gap-2.5">
      <div className="flex items-center gap-1.5 px-1">
        <AlertTriangle size={15} className="text-amber-400" />
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          Active Weather Alerts ({alertList.length})
        </h3>
      </div>

      {alertList.map((alert, i) => {
        const style = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info;
        const IconComponent = ICON_MAP[alert.icon] || AlertTriangle;

        return (
          <div
            key={i}
            className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all"
            style={{
              background: style.bg,
              borderColor: style.border,
            }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background: `${style.text}20`,
                color: style.text,
              }}
            >
              <IconComponent size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-bold mb-0.5 break-words" style={{ color: style.text }}>
                {alert.title}
              </p>
              <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed break-words">
                {alert.message}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
