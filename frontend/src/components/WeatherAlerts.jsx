/**
 * WeatherAlerts.jsx — Official Meteorological & Environmental Warning Advisories.
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
  danger:  { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c', badge: '#fee2e2', label: 'CRITICAL ALERT' },
  warning: { bg: '#fffbeb', border: '#fde68a', text: '#b45309', badge: '#fef3c7', label: 'METEOROLOGICAL WARNING' },
  info:    { bg: '#f0fdfa', border: '#99f6e4', text: '#0f766e', badge: '#ccfbf1', label: 'ADVISORY' },
};

export default function WeatherAlerts({ alerts }) {
  const alertList = alerts?.alerts || [];
  if (alertList.length === 0) return null;

  return (
    <section aria-label="Active Environmental Warnings" className="fade-in w-full flex flex-col gap-2.5">
      <div className="flex items-center gap-1.5 px-0.5">
        <AlertTriangle size={15} className="text-amber-600" />
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Active Meteorological & Environmental Warnings ({alertList.length})
        </h3>
      </div>

      {alertList.map((alert, i) => {
        const style = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info;
        const IconComponent = ICON_MAP[alert.icon] || AlertTriangle;

        return (
          <div
            key={i}
            className="p-4 rounded-xl border flex items-start gap-3 transition-all"
            style={{
              backgroundColor: style.bg,
              borderColor: style.border,
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                backgroundColor: style.badge,
                color: style.text,
              }}
            >
              <IconComponent size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded border" style={{ borderColor: style.border, color: style.text }}>
                  {style.label}
                </span>
                <p className="text-xs sm:text-sm font-bold" style={{ color: style.text }}>
                  {alert.title}
                </p>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed break-words">
                {alert.message}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
