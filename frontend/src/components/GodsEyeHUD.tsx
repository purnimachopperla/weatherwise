import React from 'react';
import {
  Satellite,
  Radio,
  Activity,
} from 'lucide-react';
import type { TacticalData } from '../utils/tacticalTelemetry';

export type VisionMode = 'cyan' | 'nvg' | 'flir' | 'amber';

interface GodsEyeHUDProps {
  tactical: TacticalData;
  visionMode: VisionMode;
  onSelectVisionMode: (mode: VisionMode) => void;
  locationName: string;
  latitude: number;
  longitude: number;
  temperature: number;
}

export const GodsEyeHUD: React.FC<GodsEyeHUDProps> = ({
  tactical,
  visionMode,
  onSelectVisionMode,
  locationName,
  latitude,
  longitude,
  temperature,
}) => {
  const getVisionStyles = () => {
    switch (visionMode) {
      case 'nvg':
        return {
          primary: 'text-emerald-400',
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-950/80',
          glow: 'rgba(16, 185, 129, 0.4)',
        };
      case 'flir':
        return {
          primary: 'text-rose-400',
          border: 'border-rose-500/40',
          bg: 'bg-rose-950/80',
          glow: 'rgba(244, 63, 94, 0.4)',
        };
      case 'amber':
        return {
          primary: 'text-amber-400',
          border: 'border-amber-500/40',
          bg: 'bg-amber-950/80',
          glow: 'rgba(245, 158, 11, 0.4)',
        };
      default:
        return {
          primary: 'text-cyan-400',
          border: 'border-cyan-500/40',
          bg: 'bg-dark-950/85',
          glow: 'rgba(6, 182, 212, 0.4)',
        };
    }
  };

  const v = getVisionStyles();

  return (
    <div className="absolute inset-0 pointer-events-none z-[450] flex flex-col justify-between p-4 select-none font-mono">
      {/* Top Bar: Orbit Tracker, Heading Ribbon, Vision Switcher */}
      <div className="flex items-start justify-between gap-3 pointer-events-auto">
        {/* Left: Satellite Orbital Telemetry */}
        <div className={`p-2.5 rounded-xl ${v.bg} backdrop-blur-xl border ${v.border} ${v.primary} text-[10px] space-y-1 shadow-2xl max-w-[210px]`}>
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <Satellite className="w-3.5 h-3.5 animate-pulse text-current" />
            <span>GEV ORBITAL RECON</span>
          </div>
          <div className="truncate">TRACK: <span className="text-slate-200">{tactical.satOrbitId}</span></div>
          <div>PASS: <strong className="text-white">{tactical.satPassTime}</strong></div>
          <div className="text-[9px] opacity-75">ZONE: {tactical.securityZone}</div>
        </div>

        {/* Center: Heading Tape Ribbon */}
        <div className={`hidden md:flex items-center px-4 py-1.5 rounded-xl ${v.bg} backdrop-blur-xl border ${v.border} ${v.primary} text-xs font-bold gap-3 shadow-2xl`}>
          <span className="opacity-40">240</span>
          <span className="opacity-60">270 (W)</span>
          <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 shadow-inner">
            {tactical.bearingDeg.toString().padStart(3, '0')}°
          </span>
          <span className="opacity-60">300</span>
          <span className="opacity-40">330</span>
        </div>

        {/* Right: Vision Mode Switcher */}
        <div className={`p-1 rounded-xl ${v.bg} backdrop-blur-xl border ${v.border} flex items-center gap-1 shadow-2xl`}>
          {(['cyan', 'flir', 'nvg', 'amber'] as VisionMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onSelectVisionMode(mode)}
              className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold transition-all cursor-pointer ${
                visionMode === mode
                  ? 'bg-white/20 text-white shadow-sm border border-white/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Center Tactical Crosshair & Target Reticle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative flex items-center justify-center w-44 h-44 sm:w-56 sm:h-56">
          {/* Target Reticle Range Rings */}
          <div className={`absolute inset-0 rounded-full border border-dashed ${v.border} opacity-40 animate-spin-slow`} />
          <div className={`absolute inset-6 rounded-full border ${v.border} opacity-50`} />

          {/* Corner Crosshairs */}
          <div className={`absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 ${v.border}`} />
          <div className={`absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 ${v.border}`} />
          <div className={`absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 ${v.border}`} />
          <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 ${v.border}`} />

          {/* Center Dot & Reticle Cross */}
          <div className={`w-2 h-2 rounded-full ${v.primary} bg-current animate-ping opacity-75`} />
          <div className={`absolute w-3 h-3 rounded-full border ${v.border}`} />

          {/* Target Info Label */}
          <div className={`absolute -bottom-7 px-2.5 py-0.5 rounded-lg ${v.bg} border ${v.border} text-[10px] font-bold ${v.primary} tracking-wider uppercase backdrop-blur-md shadow-lg`}>
            TARGET: {locationName} [{temperature.toFixed(1)}°C]
          </div>
        </div>
      </div>

      {/* Bottom Telemetry & Status Bar */}
      <div className="flex items-end justify-between gap-3 pointer-events-auto">
        {/* Left MGRS / Coordinate Telemetry */}
        <div className={`p-2.5 rounded-xl ${v.bg} backdrop-blur-xl border ${v.border} ${v.primary} text-[10px] space-y-0.5 shadow-2xl max-w-[240px]`}>
          <div className="flex items-center gap-1.5 font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-current" />
            <span>MGRS GRID DATUM</span>
          </div>
          <div className="font-bold text-white tracking-widest text-[11px]">{tactical.mgrs}</div>
          <div className="text-[9px] opacity-80 font-mono">
            {latitude.toFixed(4)}°, {longitude.toFixed(4)}° • ALT {tactical.altitudeFt} FT
          </div>
        </div>

        {/* Right Status Badge */}
        <div className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl ${v.bg} backdrop-blur-xl border ${v.border} ${v.primary} text-[10px] shadow-2xl font-bold`}>
          <Activity className="w-3.5 h-3.5 animate-pulse text-current" />
          <span>GEV TACTICAL HUD ONLINE</span>
        </div>
      </div>
    </div>
  );
};
