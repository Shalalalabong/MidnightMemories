import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { playFoilTearSound } from '../utils/audio';

interface PhysicalBoosterPackProps {
  onRipComplete: () => void;
  disabled?: boolean;
}

export const PhysicalBoosterPack: React.FC<PhysicalBoosterPackProps> = ({
  onRipComplete,
  disabled = false,
}) => {
  const packRef = useRef<HTMLDivElement>(null);
  const [tearProgress, setTearProgress] = useState(0); // 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const [hasRipped, setHasRipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // 3D pack tilt on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || hasRipped || !packRef.current) return;
    const rect = packRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: (y / rect.height) * -8,
      y: (x / rect.width) * 8,
    });
  };

  const handleMouseLeave = () => {
    if (!isDragging) setTilt({ x: 0, y: 0 });
  };

  // Start swipe tear gesture
  const startTear = (clientX: number) => {
    if (disabled || hasRipped || !packRef.current) return;
    setIsDragging(true);
    playFoilTearSound();
    updateTear(clientX);
  };

  const updateTear = useCallback((clientX: number) => {
    if (!packRef.current || hasRipped) return;
    const rect = packRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const rawProgress = Math.min(100, Math.max(0, (relativeX / rect.width) * 100));

    setTearProgress(rawProgress);

    // If swiped past 60%, trigger complete rip!
    if (rawProgress >= 60) {
      completeRip();
    }
  }, [hasRipped]);

  const completeRip = useCallback(() => {
    if (hasRipped) return;
    setHasRipped(true);
    setIsDragging(false);
    setTearProgress(100);
    playFoilTearSound();

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.45 },
        colors: ['#ffd0ee', '#c684ff', '#ffe17d', '#ffffff', '#ff66c4'],
        disableForReducedMotion: true,
      });
    } catch {
      // Ignore
    }

    setTimeout(() => {
      onRipComplete();
    }, 800);
  }, [hasRipped, onRipComplete]);

  // Pointer move / up listeners while dragging
  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      updateTear(e.clientX);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      if (tearProgress < 60) {
        setTearProgress(0);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, tearProgress, updateTear]);

  return (
    <div className="flex flex-col items-center justify-center py-2 sm:py-6 select-none touch-none w-full">
      {/* 3D Physical Pack Stage - Disgustingly optimized for phone screens */}
      <div
        ref={packRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-[215px] h-[320px] sm:w-[260px] sm:h-[385px] cursor-grab active:cursor-grabbing transition-transform duration-300 touch-none"
        style={{
          perspective: '1200px',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glow ambient aura behind pack */}
        <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 via-purple-600/30 to-indigo-600/20 rounded-3xl blur-2xl pointer-events-none" />

        {/* TOP FOIL FLAP (Rips off with 3D spin on swipe) */}
        <div
          className={`absolute top-0 left-0 right-0 h-[60px] sm:h-[65px] z-30 rounded-t-2xl overflow-hidden transition-all ${
            hasRipped
              ? 'duration-700 -translate-y-24 rotate-[-15deg] scale-95 opacity-0 pointer-events-none'
              : 'duration-75'
          }`}
          style={{
            transform: !hasRipped && tearProgress > 0
              ? `rotateZ(${tearProgress * -0.15}deg) translateY(${tearProgress * -0.1}px)`
              : undefined,
            transformOrigin: 'top left',
          }}
        >
          {/* Crimped metallic foil top border */}
          <div 
            className="w-full h-3.5 sm:h-4 bg-gradient-to-r from-[#ffe4f6] via-[#d499e4] to-[#fce4f6] border-b border-purple-900/40"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, #381a4b 0px, #381a4b 2px, #fce0f5 2px, #fce0f5 4px)',
            }}
          />

          {/* Top flap body */}
          <div className="w-full h-[46px] sm:h-[49px] bg-gradient-to-b from-[#e39cd3] via-[#8c4ea7] to-[#472259] relative flex items-center justify-center border-x border-pink-300/40">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-black/20" />
            <span className="relative z-10 text-[8px] sm:text-[9px] font-black tracking-[0.25em] text-pink-100 uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              ✦ LIMITED BOOSTER ✦
            </span>
          </div>

          {/* Perforated tear line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 flex items-center justify-between px-1 bg-purple-950/60 border-t border-dashed border-pink-200/50" />
        </div>

        {/* INTERACTIVE SWIPE / TEAR STRIP (The Rip Zone) */}
        {!hasRipped && (
          <div
            onPointerDown={(e) => startTear(e.clientX)}
            className="absolute top-[48px] sm:top-[52px] left-[-12px] right-[-12px] h-[36px] z-40 cursor-ew-resize flex items-center justify-between px-2 touch-none group"
            style={{ touchAction: 'none' }}
          >
            {/* Tear guide track line */}
            <div className="absolute inset-x-2 h-[4px] bg-pink-400/40 rounded-full overflow-hidden border border-pink-200/50 shadow-[0_0_12px_rgba(255,140,210,0.9)]">
              <div
                className="h-full bg-gradient-to-r from-pink-300 via-yellow-200 to-white shadow-[0_0_10px_#ffffff]"
                style={{ width: `${tearProgress}%` }}
              />
            </div>

            {/* Glowing Rip Thumb / Tab */}
            <div
              className="relative z-50 w-8 h-8 rounded-full bg-gradient-to-br from-pink-200 via-pink-400 to-purple-600 border-2 border-white shadow-[0_0_16px_rgba(255,100,190,1)] flex items-center justify-center text-purple-950 font-black text-sm transition-transform group-hover:scale-110 active:scale-125"
              style={{
                left: `calc(${tearProgress}% - 16px)`,
                transform: `scale(${isDragging ? 1.25 : 1})`,
              }}
            >
              ✂
            </div>
          </div>
        )}

        {/* LOWER PACK BODY */}
        <div
          className={`absolute top-[56px] sm:top-[62px] bottom-0 left-0 right-0 z-20 rounded-b-2xl overflow-hidden border-x border-b border-pink-300/40 bg-gradient-to-b from-[#4a245d] via-[#2d153d] to-[#1a0c25] shadow-[0_16px_45px_rgba(10,5,20,0.8)] flex flex-col justify-between transition-all ${
            hasRipped ? 'duration-700 translate-y-24 opacity-0 pointer-events-none' : ''
          }`}
        >
          {/* Metallic foil reflection */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.4) 45%, transparent 60%)',
              backgroundSize: '250% 250%',
            }}
          />

          <div className="absolute inset-2 border border-pink-200/30 rounded-xl pointer-events-none" />

          {/* Pack Branding */}
          <div className="relative z-10 pt-3 px-3 text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-pink-300/80 bg-gradient-to-tr from-purple-900 to-pink-900 flex items-center justify-center shadow-[0_0_20px_rgba(255,140,210,0.5)] mb-1.5">
              <span className="text-xl sm:text-2xl text-pink-200 drop-shadow-[0_0_8px_rgba(255,200,240,0.9)]">
                ✿
              </span>
            </div>

            <div className="text-[9px] tracking-[0.22em] text-pink-300 font-semibold uppercase mb-0.5">
              ✦ LIMITED RELEASE ✦
            </div>

            <h3
              className="font-serif font-black text-2xl sm:text-3xl text-white tracking-wider leading-tight drop-shadow-[0_3px_8px_rgba(40,10,50,0.9)]"
              style={{ fontFamily: '"Cinzel", Georgia, serif' }}
            >
              MIDNIGHT
              <span className="block text-pink-200 text-base sm:text-xl font-normal tracking-[0.18em]">
                MEMORIES
              </span>
            </h3>

            <div className="mt-2.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[8px] sm:text-[9px] font-bold text-pink-100 tracking-wider">
              5 CARDS · 1 GUARANTEED SECRET RARE
            </div>
          </div>

          {/* Bottom crimped border */}
          <div 
            className="w-full h-4 sm:h-5 bg-gradient-to-r from-[#ffe4f6] via-[#d499e4] to-[#fce4f6] border-t border-purple-900/40 relative z-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, #381a4b 0px, #381a4b 2px, #fce0f5 2px, #fce0f5 4px)',
            }}
          />
        </div>
      </div>

      {/* Swipe Instruction Guide & Fallback Click Action */}
      {!hasRipped && (
        <div className="mt-4 sm:mt-6 flex flex-col items-center text-center px-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-950/70 border border-pink-400/40 text-pink-200 text-[11px] sm:text-xs font-semibold shadow-lg backdrop-blur-sm animate-pulse">
            <span>✂</span>
            <span>Swipe across top seam to rip open</span>
            <span className="text-pink-300 font-black">➔</span>
          </div>

          <button
            type="button"
            onClick={completeRip}
            disabled={disabled}
            className="mt-2.5 text-[11px] font-semibold text-pink-300/80 hover:text-pink-100 underline decoration-pink-300/40 transition-colors cursor-pointer py-1 px-3"
          >
            Or tap here to rip directly ✦
          </button>
        </div>
      )}

      {hasRipped && (
        <div className="mt-4 sm:mt-6 text-xs sm:text-sm font-semibold text-pink-200 tracking-wider animate-pulse flex items-center gap-2">
          <span>✧</span> Ripping pack open... <span>✧</span>
        </div>
      )}
    </div>
  );
};
