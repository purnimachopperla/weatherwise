import React, { useEffect, useRef } from 'react';

interface WeatherParticleCanvasProps {
  weatherCode: number;
  isDay?: number;
  enabled?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  length?: number;
  twinkleSpeed?: number;
}

export const WeatherParticleCanvas: React.FC<WeatherParticleCanvasProps> = ({
  weatherCode,
  isDay = 1,
  enabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Identify weather type
    const isRain =
      (weatherCode >= 51 && weatherCode <= 67) ||
      (weatherCode >= 80 && weatherCode <= 82) ||
      weatherCode >= 95;
    const isSnow =
      (weatherCode >= 71 && weatherCode <= 77) ||
      (weatherCode >= 85 && weatherCode <= 86);
    const isClearNight = !isDay && (weatherCode === 0 || weatherCode === 1);
    const isSunny = isDay && (weatherCode === 0 || weatherCode === 1);

    // Initialize particles
    const count = isRain ? 90 : isSnow ? 65 : isClearNight ? 80 : isSunny ? 35 : 25;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: isRain ? (Math.random() - 0.5) * 1.5 - 1 : isSnow ? (Math.random() - 0.5) * 1.2 : (Math.random() - 0.5) * 0.4,
        vy: isRain ? Math.random() * 8 + 12 : isSnow ? Math.random() * 1.5 + 1 : (Math.random() - 0.5) * 0.4,
        size: isRain ? 1.5 : isSnow ? Math.random() * 2.5 + 1.5 : Math.random() * 2 + 1,
        opacity: Math.random() * 0.7 + 0.2,
        length: isRain ? Math.random() * 15 + 10 : undefined,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
      });
    }

    // Splashes for rain
    interface Splash {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
    }
    const splashes: Splash[] = [];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Render & update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse avoidance/repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x += (dx / dist) * 2;
          p.y += (dy / dist) * 2;
        }

        if (isRain) {
          // Rain streak
          ctx.beginPath();
          ctx.strokeStyle = `rgba(56, 189, 248, ${p.opacity * 0.5})`;
          ctx.lineWidth = p.size;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx, p.y + (p.length || 15));
          ctx.stroke();

          p.x += p.vx;
          p.y += p.vy;

          if (p.y > height - 20) {
            // Trigger splash ring
            if (Math.random() > 0.6 && splashes.length < 30) {
              splashes.push({
                x: p.x,
                y: height - Math.random() * 15,
                radius: 1,
                maxRadius: Math.random() * 8 + 4,
                opacity: 0.6,
              });
            }
            p.y = -20;
            p.x = Math.random() * width;
          }
        } else if (isSnow) {
          // Snow flake
          ctx.beginPath();
          ctx.fillStyle = `rgba(240, 249, 255, ${p.opacity * 0.7})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.vx + Math.sin(p.y * 0.02) * 0.5;
          p.y += p.vy;

          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        } else if (isClearNight) {
          // Twinkling Stardust
          p.opacity += (p.twinkleSpeed || 0.02);
          if (p.opacity > 0.9 || p.opacity < 0.2) {
            p.twinkleSpeed = -(p.twinkleSpeed || 0.02);
          }

          ctx.beginPath();
          ctx.fillStyle = `rgba(224, 231, 255, ${p.opacity * 0.8})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        } else {
          // Sunny / Calm subtle dust motes
          ctx.beginPath();
          ctx.fillStyle = isSunny
            ? `rgba(251, 191, 36, ${p.opacity * 0.3})`
            : `rgba(148, 163, 184, ${p.opacity * 0.25})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }
      }

      // Draw splash ripples
      for (let s = splashes.length - 1; s >= 0; s--) {
        const sp = splashes[s];
        ctx.beginPath();
        ctx.strokeStyle = `rgba(56, 189, 248, ${sp.opacity})`;
        ctx.lineWidth = 1;
        ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
        ctx.stroke();

        sp.radius += 0.8;
        sp.opacity -= 0.03;

        if (sp.opacity <= 0 || sp.radius >= sp.maxRadius) {
          splashes.splice(s, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weatherCode, isDay, enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
};
