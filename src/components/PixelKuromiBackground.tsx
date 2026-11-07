import React, { useMemo } from 'react';
import { BUILTIN_PIXEL_SPRITES, CUSTOM_KUROMI_DECORATIONS } from '../data/kuromiDecor';

interface PixelKuromiBackgroundProps {
  enabled?: boolean;
}

interface FloatingItem {
  id: string;
  type: 'custom' | 'builtin' | 'star';
  spriteIndex?: number;
  customUrl?: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  rotation: number;
  opacity: number;
}

export const PixelKuromiBackground: React.FC<PixelKuromiBackgroundProps> = ({ enabled = true }) => {
  // Generate stable floating positions across the viewport
  const items = useMemo<FloatingItem[]>(() => {
    const list: FloatingItem[] = [];
    const hasCustom = CUSTOM_KUROMI_DECORATIONS.length > 0;

    // Floating Kuromi decorations (custom or built-in)
    const count = 10;
    for (let i = 0; i < count; i++) {
      if (hasCustom && i % 2 === 0) {
        const custom = CUSTOM_KUROMI_DECORATIONS[i % CUSTOM_KUROMI_DECORATIONS.length];
        list.push({
          id: `custom-kuromi-${i}`,
          type: 'custom',
          customUrl: custom.url,
          x: 5 + (i * 9) + (Math.sin(i) * 3),
          y: 8 + ((i * 19) % 85),
          size: 38 + ((i * 7) % 18),
          duration: 14 + (i % 6) * 3,
          delay: (i * 1.5) % 8,
          driftX: (i % 2 === 0 ? 1 : -1) * (15 + (i * 3)),
          driftY: (i % 3 === 0 ? -1 : 1) * (20 + (i * 4)),
          rotation: (i % 2 === 0 ? 8 : -8),
          opacity: 0.35 + ((i % 4) * 0.12),
        });
      } else {
        const spriteIdx = i % BUILTIN_PIXEL_SPRITES.length;
        list.push({
          id: `builtin-kuromi-${i}`,
          type: 'builtin',
          spriteIndex: spriteIdx,
          x: 4 + (i * 9.5) + (Math.cos(i) * 4),
          y: 6 + ((i * 18 + 12) % 84),
          size: BUILTIN_PIXEL_SPRITES[spriteIdx].size,
          duration: 16 + (i % 5) * 4,
          delay: (i * 1.2) % 7,
          driftX: (i % 2 === 0 ? -1 : 1) * (18 + (i * 2)),
          driftY: (i % 3 === 0 ? 1 : -1) * (22 + (i * 3)),
          rotation: (i % 2 === 0 ? -6 : 6),
          opacity: 0.38 + ((i % 3) * 0.14),
        });
      }
    }

    // Twinkling pixel stars
    for (let s = 0; s < 18; s++) {
      list.push({
        id: `pixel-star-${s}`,
        type: 'star',
        x: (s * 5.6 + Math.sin(s * 2) * 5 + 100) % 96,
        y: (s * 8.2 + Math.cos(s * 3) * 6 + 100) % 95,
        size: s % 3 === 0 ? 10 : 6,
        duration: 3 + (s % 4) * 1.5,
        delay: (s * 0.7) % 5,
        driftX: 0,
        driftY: 0,
        rotation: 0,
        opacity: 0.25 + ((s % 5) * 0.12),
      });
    }

    return list;
  }, []);

  if (!enabled) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Background starlight grid overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1.5px), radial-gradient(#f492cb 1px, transparent 1.5px)',
          backgroundSize: '40px 40px, 80px 80px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />

      {items.map((item) => {
        if (item.type === 'star') {
          return (
            <div
              key={item.id}
              className="absolute text-pink-200"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                fontSize: `${item.size}px`,
                opacity: item.opacity,
                filter: 'drop-shadow(0 0 6px rgba(255,140,210,0.6))',
                animation: `twinkleStar ${item.duration}s ease-in-out infinite alternate`,
                animationDelay: `${item.delay}s`,
              }}
            >
              ✦
            </div>
          );
        }

        if (item.type === 'custom' && item.customUrl) {
          return (
            <div
              key={item.id}
              className="absolute pointer-events-auto transition-transform hover:scale-125 cursor-default group"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                opacity: item.opacity,
                transform: `rotate(${item.rotation}deg)`,
                animation: `driftKuromi ${item.duration}s ease-in-out infinite alternate`,
                animationDelay: `${item.delay}s`,
                '--drift-x': `${item.driftX}px`,
                '--drift-y': `${item.driftY}px`,
              } as React.CSSProperties}
            >
              <img
                src={item.customUrl}
                alt="Pixel Kuromi decoration"
                className="pixelated filter drop-shadow-[0_4px_12px_rgba(30,10,40,0.7)] group-hover:drop-shadow-[0_0_16px_rgba(255,114,190,0.9)] transition-all"
                style={{
                  width: `${item.size}px`,
                  height: `${item.size}px`,
                  imageRendering: 'pixelated',
                }}
                onError={(e) => {
                  // If custom file not yet placed, hide cleanly
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          );
        }

        if (item.type === 'builtin' && item.spriteIndex !== undefined) {
          const sprite = BUILTIN_PIXEL_SPRITES[item.spriteIndex];
          return (
            <div
              key={item.id}
              className="absolute pointer-events-auto transition-transform hover:scale-125 cursor-default group"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                opacity: item.opacity,
                transform: `rotate(${item.rotation}deg)`,
                animation: `driftKuromi ${item.duration}s ease-in-out infinite alternate`,
                animationDelay: `${item.delay}s`,
                '--drift-x': `${item.driftX}px`,
                '--drift-y': `${item.driftY}px`,
              } as React.CSSProperties}
              dangerouslySetInnerHTML={{ __html: sprite.renderSvg() }}
            />
          );
        }

        return null;
      })}

      <style>{`
        @keyframes driftKuromi {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(var(--drift-x, 15px), calc(var(--drift-y, 20px) * 0.5)) rotate(5deg);
          }
          100% {
            transform: translate(calc(var(--drift-x, 15px) * -0.7), var(--drift-y, 20px)) rotate(-4deg);
          }
        }
        @keyframes twinkleStar {
          0% {
            opacity: 0.15;
            transform: scale(0.85);
          }
          100% {
            opacity: 0.9;
            transform: scale(1.3) rotate(25deg);
          }
        }
        .pixelated {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  );
};
