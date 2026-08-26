import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import type { RecommendationResponse, RecommendationItem } from '../types/weather';

interface RecommendationCardProps {
  recommendation: RecommendationResponse;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
}) => {
  const getSeverityBadge = (severity: RecommendationItem['severity']) => {
    switch (severity) {
      case 'good':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/20',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/20',
        };
      case 'danger':
        return {
          icon: AlertCircle,
          color: 'text-rose-400',
          bg: 'bg-rose-500/10 border-rose-500/20',
        };
      default:
        return {
          icon: Info,
          color: 'text-cyan-400',
          bg: 'bg-cyan-500/10 border-cyan-500/20',
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="p-6 rounded-2xl glass-card border border-white/10 relative overflow-hidden flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Personalized {recommendation.profile_label} Intel
              </h3>
              <p className="text-xs text-slate-400">
                Actionable advice tailored to current atmospheric metrics
              </p>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/5 mb-4 text-sm text-slate-200 leading-relaxed font-medium">
          "{recommendation.summary}"
        </div>

        {recommendation.best_time && (
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent border border-cyan-500/20 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">
                Optimal Activity Window
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                {recommendation.best_time}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2.5">
          {recommendation.items.map((item, idx) => {
            const badge = getSeverityBadge(item.severity);
            const Icon = badge.icon;

            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all duration-200 flex items-start gap-3"
              >
                <div className={`p-1.5 rounded-lg border flex-shrink-0 mt-0.5 ${badge.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${badge.color}`} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {item.message}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
        <span>Tailored for {recommendation.location}</span>
        <span className="font-mono">{recommendation.items.length} actionable insights</span>
      </div>
    </motion.div>
  );
};
