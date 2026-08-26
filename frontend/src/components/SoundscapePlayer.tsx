import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  CloudRain,
  Wind,
  Flower2,
  Radio,
  Sliders,
} from 'lucide-react';
import { soundscape } from '../services/soundscape';
import type { SoundscapePreset } from '../services/soundscape';

export const SoundscapePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<SoundscapePreset>('rain');
  const [volume, setVolume] = useState(0.4);
  const [isOpen, setIsOpen] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      soundscape.stop();
      setIsPlaying(false);
    } else {
      soundscape.play(currentPreset, volume);
      setIsPlaying(true);
    }
  };

  const handleSelectPreset = (preset: SoundscapePreset) => {
    setCurrentPreset(preset);
    if (isPlaying) {
      soundscape.play(preset, volume);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundscape.setVolume(newVol);
  };

  const presets = [
    { id: 'rain' as SoundscapePreset, label: 'Gentle Rain', icon: CloudRain, color: 'text-cyan-400' },
    { id: 'wind' as SoundscapePreset, label: 'Forest Wind', icon: Wind, color: 'text-emerald-400' },
    { id: 'meadow' as SoundscapePreset, label: 'Summer Meadow', icon: Flower2, color: 'text-amber-400' },
    { id: 'whitenoise' as SoundscapePreset, label: 'Pure Noise', icon: Radio, color: 'text-purple-400' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Expanded Control Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="mb-3 p-4 rounded-2xl bg-dark-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl w-64 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Atmospheric Audio</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                Web Audio Synth
              </span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-1.5">
              {presets.map((p) => {
                const Icon = p.icon;
                const isSelected = currentPreset === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p.id)}
                    className={`p-2 rounded-xl text-left text-xs font-medium border transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 text-white border-cyan-500/40 shadow-sm'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${p.color}`} />
                    <span className="truncate">{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Volume Slider */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Button */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-dark-900/90 backdrop-blur-xl border border-white/15 shadow-2xl">
        <button
          onClick={togglePlay}
          className={`p-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            isPlaying
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan'
              : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
          title={isPlaying ? 'Pause ambient audio' : 'Play ambient audio'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-full bg-white animate-pulse" />
                <span className="w-0.5 h-2 bg-white animate-bounce" />
                <span className="w-0.5 h-3 bg-white animate-pulse" />
              </div>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold pr-1">Soundscape</span>
            </>
          )}
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          title="Soundscape Settings"
        >
          {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
