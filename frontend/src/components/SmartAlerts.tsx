import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
} from 'lucide-react';
import type { AlertItem } from '../types/weather';

interface SmartAlertsProps {
  alerts: AlertItem[];
}

export const SmartAlerts: React.FC<SmartAlertsProps> = ({ alerts }) => {
  const [expanded, setExpanded] = useState(false);

  if (!alerts || alerts.length === 0) return null;

  const hasDanger = alerts.some((a) => a.severity === 'danger');
  const hasWarning = alerts.some((a) => a.severity === 'warning');

  const bannerColor = hasDanger
    ? 'from-rose-500/20 via-rose-500/10 to-transparent border-rose-500/30 text-rose-300'
    : hasWarning
    ? 'from-amber-500/20 via-amber-500/10 to-transparent border-amber-500/30 text-amber-300'
    : 'from-blue-500/20 via-blue-500/10 to-transparent border-blue-500/30 text-blue-300';

  const mainAlert = alerts[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl bg-gradient-to-r ${bannerColor} border p-4 backdrop-blur-xl shadow-lg`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/10 flex-shrink-0">
            {hasDanger ? (
              <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
            ) : hasWarning ? (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            ) : (
              <Info className="w-5 h-5 text-blue-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white">
                {mainAlert.title}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10">
                {alerts.length} {alerts.length === 1 ? 'Alert' : 'Alerts'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{mainAlert.message}</p>
          </div>
        </div>

        {alerts.length > 1 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5"
          >
            <span>{expanded ? 'Hide' : 'View All'}</span>
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      <AnimatePresence>
        {expanded && alerts.length > 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-white/10 space-y-2 overflow-hidden"
          >
            {alerts.slice(1).map((alert, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-dark-950/40 border border-white/5 flex items-start gap-2.5"
              >
                {alert.severity === 'danger' ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                ) : alert.severity === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs font-semibold text-white">
                    {alert.title}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {alert.message}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
