import React, { useMemo } from 'react';
import {
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Clock,
  Sparkles,
} from 'lucide-react';
import { calculateSunOrbit, calculateMoonPhase } from '../utils/astronomy';

interface CelestialOrbitArcProps {
  sunrise: string;
  sunset: string;
}

export const CelestialOrbitArc: React.FC<CelestialOrbitArcProps> = ({
  sunrise,
  sunset,
}) => {
  const sunInfo = useMemo(() => calculateSunOrbit(sunrise, sunset), [sunrise, sunset]);
  const moonInfo = useMemo(() => calculateMoonPhase(new Date()), []);

  const percent = sunInfo.sunPositionPercent / 100;
  const theta = Math.PI * (1 - percent);
  const cx = 150;
  const cy = 110;
  const rx = 125;
  const ry = 85;

  const sunX = cx + rx * Math.cos(theta);
  const sunY = cy - ry * Math.sin(theta);

  return (
    <div className="p-4 sm:p-6 rounded-2xl glass-card border border-white/10 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-sm sm:text-base font-bold text-white">
              Celestial Solar & Lunar Orbit
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Live ephemeris trajectory & lunar illumination
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] sm:text-xs font-semibold self-start xs:self-auto font-mono">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{sunInfo.isDaytime ? sunInfo.timeUntilSunset : `Sunrise ${sunInfo.timeUntilSunrise}`}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Animated Solar Arc Visualizer (7 Cols) */}
        <div className="md:col-span-7 flex flex-col items-center justify-center relative">
          <div className="w-full max-w-[320px] aspect-[300/150] relative">
            <svg viewBox="0 0 300 135" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="arcGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.8" />
                </linearGradient>
                <radialGradient id="sunHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fde047" stopOpacity="1" />
                  <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Base Horizon Line */}
              <line
                x1="10"
                y1="110"
                x2="290"
                y2="110"
                stroke="rgba(255,255,255,0.12)"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />

              {/* Celestial Arc Track */}
              <path
                d="M 25 110 A 125 85 0 0 1 275 110"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="4"
              />

              {/* Traversed Path Glowing Track */}
              <path
                d="M 25 110 A 125 85 0 0 1 275 110"
                fill="none"
                stroke="url(#arcGlow)"
                strokeWidth="3.5"
                strokeDasharray="400"
                strokeDashoffset={400 - (400 * sunInfo.sunPositionPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />

              {/* Solar Noon Marker */}
              <circle cx="150" cy="25" r="3" fill="#38bdf8" />
              <text x="150" y="16" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">
                Solar Noon ({sunInfo.solarNoon})
              </text>

              {/* Glowing Sun Position */}
              <g transform={`translate(${sunX}, ${sunY})`}>
                <circle cx="0" cy="0" r="16" fill="url(#sunHalo)" className="animate-pulse-subtle" />
                <circle cx="0" cy="0" r="7" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
              </g>

              {/* Sunrise & Sunset Endpoints */}
              <circle cx="25" cy="110" r="4" fill="#f59e0b" />
              <circle cx="275" cy="110" r="4" fill="#f43f5e" />
            </svg>
          </div>

          {/* Sunrise / Sunset Labels */}
          <div className="w-full max-w-[320px] flex items-center justify-between text-xs mt-1 px-2 font-mono">
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Sunrise className="w-3.5 h-3.5" />
              <span>{sunInfo.sunriseTime}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              {sunInfo.isDaytime ? `${sunInfo.sunPositionPercent}% Traversed` : 'Night Orbit'}
            </div>
            <div className="flex items-center gap-1 text-rose-400 font-semibold">
              <Sunset className="w-3.5 h-3.5" />
              <span>{sunInfo.sunsetTime}</span>
            </div>
          </div>
        </div>

        {/* Right: Moon Phase & Golden Hour Intel (5 Cols) */}
        <div className="md:col-span-5 space-y-3">
          {/* Moon Phase Capsule */}
          <div className="p-3.5 rounded-xl bg-dark-900/60 border border-white/10 flex items-center gap-3.5">
            <div className="relative w-11 h-11 rounded-full bg-slate-900 border border-slate-700 overflow-hidden flex-shrink-0 shadow-lg">
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-slate-200 via-amber-100 to-white opacity-95"
                style={{
                  clipPath:
                    moonInfo.illumination > 50
                      ? 'circle(50% at 50% 50%)'
                      : `polygon(0 0, ${moonInfo.illumination * 2}% 0, ${moonInfo.illumination * 2}% 100%, 0 100%)`,
                }}
              />
              <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-slate-400/20" />
              <div className="absolute bottom-2.5 right-3 w-3 h-3 rounded-full bg-slate-400/15" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Moon className="w-3.5 h-3.5 text-indigo-300" />
                <span>{moonInfo.phaseName}</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">
                {moonInfo.illumination}% Illumination • Age {moonInfo.ageDays}d
              </div>
            </div>
          </div>

          {/* Golden Hour Window */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                <Sparkles className="w-3 h-3" />
                Golden Hour (Evening)
              </span>
              <span className="font-mono text-slate-200 font-semibold">{sunInfo.goldenHourEvening}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-cyan-400" />
                Civil Twilight (Dusk)
              </span>
              <span className="font-mono">{sunInfo.civilTwilightDusk}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
