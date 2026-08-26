import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface WeatherBackgroundProps {
  weatherCode: number;
  isDay?: number;
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({
  weatherCode,
  isDay = 1,
}) => {
  // Determine gradient style based on weather code & day/night
  const theme = useMemo(() => {
    // Thunderstorm
    if (weatherCode >= 95) {
      return {
        glowColor1: 'rgba(139, 92, 246, 0.18)',
        glowColor2: 'rgba(59, 130, 246, 0.12)',
        particleColor: 'bg-purple-300/20',
      };
    }
    // Rain / Drizzle
    if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
      return {
        glowColor1: 'rgba(56, 189, 248, 0.18)',
        glowColor2: 'rgba(59, 130, 246, 0.12)',
        particleColor: 'bg-blue-300/20',
      };
    }
    // Snow
    if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) {
      return {
        glowColor1: 'rgba(224, 242, 254, 0.16)',
        glowColor2: 'rgba(186, 230, 253, 0.10)',
        particleColor: 'bg-sky-100/30',
      };
    }
    // Clear / Sunny
    if (weatherCode === 0 || weatherCode === 1) {
      if (isDay) {
        return {
          glowColor1: 'rgba(245, 158, 11, 0.16)',
          glowColor2: 'rgba(6, 182, 212, 0.12)',
          particleColor: 'bg-amber-300/20',
        };
      }
      return {
        glowColor1: 'rgba(99, 102, 241, 0.18)',
        glowColor2: 'rgba(139, 92, 246, 0.10)',
        particleColor: 'bg-indigo-300/20',
      };
    }
    // Cloudy / Overcast / Fog
    return {
      glowColor1: 'rgba(148, 163, 184, 0.14)',
      glowColor2: 'rgba(51, 65, 85, 0.18)',
      particleColor: 'bg-slate-300/15',
    };
  }, [weatherCode, isDay]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-dark-950">
      {/* Dynamic ambient radial glows */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.7, 0.9, 0.7],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{ background: theme.glowColor1 }}
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-1/3 -left-40 w-[550px] h-[550px] rounded-full blur-[140px]"
        style={{ background: theme.glowColor2 }}
      />
      <div
        className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full blur-[130px] opacity-40"
        style={{ background: theme.glowColor1 }}
      />

      {/* Subtle fine dot matrix pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating ambient micro-particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${theme.particleColor}`}
            style={{
              width: `${(i % 3) * 2 + 3}px`,
              height: `${(i % 3) * 2 + 3}px`,
              left: `${(i * 8.3) + 2}%`,
              top: `${(i * 7.7) + 5}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 5 + (i % 5),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}
      </div>
    </div>
  );
};
