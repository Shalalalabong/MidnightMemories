import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CardDefinition, CardRarityKey } from '../types';
import { RARITY_CONFIG } from '../data/cards';
import { getPhotoForCard } from '../data/photos';
import { playCardFlipSound } from '../utils/audio';

interface CardItemProps {
  card: CardDefinition;
  isFlipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  stackCount?: number;
  interactiveTilt?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  onClick?: () => void;
  showStackLayers?: boolean;
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  isFlipped: controlledFlipped,
  onFlip,
  stackCount = 1,
  interactiveTilt = true,
  size = 'md',
  className = '',
  onClick,
  showStackLayers = true,
}) => {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const isFlipped = controlledFlipped !== undefined ? controlledFlipped : internalFlipped;

  // Ensure card always resets to front-face and image error state on card change
  useEffect(() => {
    setInternalFlipped(false);
    setImageError(false);
    setIsInteracting(false);
  }, [card.id, card.photoPath]);

  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number; glareX: number; glareY: number }>({
    x: 0,
    y: 0,
    glareX: 50,
    glareY: 50,
  });

  const rarity = RARITY_CONFIG[card.rarity];
  const photoUrl = getPhotoForCard(card.cardIndex, card.photoPath);
  const displayTitle = card.title;

  // Mobile gyroscope tilt tracking: tilts realistically when holding the phone
  useEffect(() => {
    if (!interactiveTilt) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      // gamma is left-to-right tilt [-90, 90], beta is front-to-back tilt [-180, 180]
      const rotY = Math.max(-9, Math.min(9, (e.gamma / 25) * 9));
      const rotX = Math.max(-9, Math.min(9, ((e.beta - 45) / 25) * -9));

      const glareX = Math.max(15, Math.min(85, 50 + (e.gamma / 25) * 35));
      const glareY = Math.max(15, Math.min(85, 50 + ((e.beta - 45) / 25) * 35));

      setTilt({ x: rotX, y: rotY, glareX, glareY });
      setIsInteracting(true);
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [interactiveTilt]);

  // Dynamic 3D tilt and holographic glare tracking for mouse
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -11;
    const rotateY = ((x - centerX) / centerX) * 11;
    const glareX = Math.max(10, Math.min(90, (x / rect.width) * 100));
    const glareY = Math.max(10, Math.min(90, (y / rect.height) * 100));

    setTilt({ x: rotateX, y: rotateY, glareX, glareY });
    setIsInteracting(true);
  }, [interactiveTilt]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
    setIsInteracting(false);
  }, []);

  // Touch tracking on touchscreen devices
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!interactiveTilt || !cardRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    const glareX = Math.max(15, Math.min(85, (x / rect.width) * 100));
    const glareY = Math.max(15, Math.min(85, (y / rect.height) * 100));

    setTilt({ x: rotateX, y: rotateY, glareX, glareY });
    setIsInteracting(true);
  }, [interactiveTilt]);

  const handleTouchEnd = useCallback(() => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
    setIsInteracting(false);
  }, []);

  const toggleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    playCardFlipSound();
    const next = !isFlipped;
    setInternalFlipped(next);
    onFlip?.(next);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    } else {
      toggleFlip(e);
    }
  };

  // Mobile-optimized dimensions
  const sizeClasses = {
    sm: 'w-[130px] h-[195px] sm:w-[145px] sm:h-[218px] text-[10px]',
    md: 'w-[165px] h-[248px] sm:w-[190px] sm:h-[285px] text-[11px]',
    lg: 'w-[230px] h-[345px] sm:w-[260px] sm:h-[390px] text-xs',
    hero: 'w-[min(80vw,265px)] h-[min(120vw,395px)] text-xs',
  }[size];

  // Thematic artwork when no photo has been placed
  const renderThematicArt = () => {
    switch (card.defaultArtTheme) {
      case 'crown':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#2a133d] via-[#1c0f2a] to-[#3f1954] p-3 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_40%,#ffd066_0%,transparent_65%)]" />
            <div className="text-3xl sm:text-4xl text-amber-200 drop-shadow-[0_0_12px_rgba(255,208,102,0.8)] mb-1">♕</div>
            <div className="text-[9px] tracking-[0.2em] uppercase text-amber-100/70 font-semibold">Astral Crown</div>
          </div>
        );
      case 'constellation':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#120a24] via-[#20103b] to-[#39124e] p-3 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_50%_50%,#ff85d5_0%,transparent_70%)]" />
            <div className="text-2xl sm:text-3xl text-pink-200 drop-shadow-[0_0_15px_rgba(255,133,213,0.9)] mb-1">✧ ✦ ✧</div>
            <div className="text-[9px] tracking-[0.2em] uppercase text-pink-200/80 font-semibold">Deep Galaxy</div>
          </div>
        );
      case 'moon':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#170e28] via-[#2a1443] to-[#1a112e] p-3 text-center overflow-hidden">
            <div className="text-3xl sm:text-4xl text-indigo-100 drop-shadow-[0_0_14px_rgba(200,215,255,0.7)] mb-1">☽</div>
            <div className="text-[9px] tracking-[0.2em] uppercase text-indigo-200/80 font-semibold">Lunar Sphere</div>
          </div>
        );
      case 'rose':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#2a0e28] via-[#43143c] to-[#1c0c1e] p-3 text-center overflow-hidden">
            <div className="text-2xl sm:text-3xl text-rose-300 drop-shadow-[0_0_14px_rgba(255,115,160,0.8)] mb-1">❦</div>
            <div className="text-[9px] tracking-[0.2em] uppercase text-rose-200/80 font-semibold">Midnight Rose</div>
          </div>
        );
      case 'butterfly':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1336] via-[#2b184c] to-[#140e2b] p-3 text-center overflow-hidden">
            <div className="text-2xl sm:text-3xl text-purple-200 drop-shadow-[0_0_12px_rgba(219,130,255,0.8)] mb-1">ᰔ</div>
            <div className="text-[9px] tracking-[0.2em] uppercase text-purple-200/80 font-semibold">Cosmic Chrysalis</div>
          </div>
        );
      case 'crystals':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#121c33] via-[#1c2a4f] to-[#17122b] p-3 text-center overflow-hidden">
            <div className="text-2xl sm:text-3xl text-cyan-200 drop-shadow-[0_0_12px_rgba(140,230,255,0.8)] mb-1">◇ ◈ ◇</div>
            <div className="text-[9px] tracking-[0.2em] uppercase text-cyan-200/80 font-semibold">Astral Geode</div>
          </div>
        );
      case 'skull':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#200e2b] via-[#351543] to-[#170a21] p-3 text-center overflow-hidden">
            <div className="text-2xl sm:text-3xl text-pink-300 drop-shadow-[0_0_12px_rgba(255,114,190,0.8)] mb-1">☠︎</div>
            <div className="text-[9px] tracking-[0.2em] uppercase text-pink-300/80 font-semibold">Gothic Emblem</div>
          </div>
        );
      default:
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1f1030] via-[#2d1744] to-[#190c28] p-3 text-center overflow-hidden">
            <div className="text-2xl sm:text-3xl text-purple-200 drop-shadow-[0_0_10px_rgba(255,200,240,0.7)] mb-1">✦</div>
            <div className="text-[9px] tracking-[0.2em] uppercase text-purple-200/70 font-semibold">Midnight Realm</div>
          </div>
        );
    }
  };

  // Holographic Foil gradient overlay styles
  // When idle / touchscreen (not actively tracked), uses an ambient animated sheen
  // so no harsh static hotspot is centered on the person's face.
  const getFoilStyles = () => {
    switch (rarity.foilType) {
      case 'cosmic-rainbow':
        if (!isInteracting) {
          return {
            background: `linear-gradient(125deg, 
              rgba(255, 140, 210, 0.16) 0%, 
              rgba(140, 220, 255, 0.22) 25%, 
              rgba(255, 255, 255, 0.32) 45%, 
              rgba(255, 230, 130, 0.22) 65%, 
              rgba(219, 130, 255, 0.2) 85%, 
              rgba(255, 140, 210, 0.16) 100%)`,
            backgroundSize: '250% 250%',
            animation: 'idleHoloSweep 5.5s ease-in-out infinite alternate',
            mixBlendMode: 'screen' as const,
          };
        }
        return {
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.46) 0%, rgba(255,140,210,0.3) 25%, rgba(140,220,255,0.26) 45%, rgba(255,230,130,0.22) 65%, transparent 80%)`,
          mixBlendMode: 'screen' as const,
        };

      case 'gold':
        if (!isInteracting) {
          return {
            background: `linear-gradient(135deg, 
              rgba(255, 215, 120, 0.12) 0%, 
              rgba(255, 245, 205, 0.3) 35%, 
              rgba(255, 195, 75, 0.22) 55%, 
              rgba(255, 240, 180, 0.28) 75%, 
              rgba(255, 205, 85, 0.12) 100%)`,
            backgroundSize: '250% 250%',
            animation: 'idleHoloSweep 5s ease-in-out infinite alternate',
            mixBlendMode: 'screen' as const,
          };
        }
        return {
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,250,215,0.42) 0%, rgba(255,205,90,0.26) 35%, transparent 70%)`,
          mixBlendMode: 'screen' as const,
        };

      case 'amethyst':
        if (!isInteracting) {
          return {
            background: `linear-gradient(135deg, 
              rgba(219, 130, 255, 0.12) 0%, 
              rgba(255, 220, 255, 0.28) 35%, 
              rgba(180, 90, 240, 0.2) 55%, 
              rgba(255, 190, 255, 0.26) 75%, 
              rgba(190, 100, 245, 0.12) 100%)`,
            backgroundSize: '250% 250%',
            animation: 'idleHoloSweep 6s ease-in-out infinite alternate',
            mixBlendMode: 'screen' as const,
          };
        }
        return {
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,230,255,0.36) 0%, rgba(219,130,255,0.22) 40%, transparent 70%)`,
          mixBlendMode: 'screen' as const,
        };

      case 'starlight':
        if (!isInteracting) {
          return {
            background: `linear-gradient(135deg, 
              rgba(140, 183, 255, 0.1) 0%, 
              rgba(230, 245, 255, 0.26) 35%, 
              rgba(120, 170, 255, 0.18) 55%, 
              rgba(215, 235, 255, 0.24) 75%, 
              rgba(140, 183, 255, 0.1) 100%)`,
            backgroundSize: '250% 250%',
            animation: 'idleHoloSweep 6.5s ease-in-out infinite alternate',
            mixBlendMode: 'screen' as const,
          };
        }
        return {
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.34) 0%, rgba(140,183,255,0.18) 40%, transparent 70%)`,
          mixBlendMode: 'screen' as const,
        };

      case 'silver':
        if (!isInteracting) {
          return {
            background: `linear-gradient(135deg, 
              rgba(200, 230, 240, 0.08) 0%, 
              rgba(255, 255, 255, 0.2) 40%, 
              rgba(180, 220, 235, 0.14) 60%, 
              rgba(200, 230, 240, 0.08) 100%)`,
            backgroundSize: '250% 250%',
            animation: 'idleHoloSweep 7s ease-in-out infinite alternate',
            mixBlendMode: 'screen' as const,
          };
        }
        return {
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.26) 0%, rgba(180,225,235,0.13) 40%, transparent 65%)`,
          mixBlendMode: 'screen' as const,
        };

      default:
        return null;
    }
  };

  const foilStyles = getFoilStyles();

  // Border & frame styling based on rarity
  const getRarityFrameClasses = (key: CardRarityKey) => {
    switch (key) {
      case 'secret':
        return 'border-[2px] border-pink-300/90 shadow-[0_8px_30px_rgba(255,133,213,0.42)] bg-gradient-to-b from-[#ffd2ee] via-[#2c153f] to-[#1a0c28]';
      case 'legendary':
        return 'border-[2px] border-amber-300/80 shadow-[0_8px_25px_rgba(255,208,102,0.38)] bg-gradient-to-b from-[#ffe5a3] via-[#331b10] to-[#1c1022]';
      case 'epic':
        return 'border-[2px] border-purple-300/70 shadow-[0_6px_22px_rgba(219,130,255,0.32)] bg-gradient-to-b from-[#e5b3ff] via-[#27133e] to-[#170a25]';
      case 'rare':
        return 'border-[1.5px] border-blue-300/60 shadow-[0_6px_18px_rgba(140,183,255,0.28)] bg-gradient-to-b from-[#c0d9ff] via-[#1a1b38] to-[#120f26]';
      case 'uncommon':
        return 'border-[1.5px] border-teal-300/50 shadow-[0_5px_15px_rgba(143,225,217,0.22)] bg-gradient-to-b from-[#b8ece6] via-[#16252d] to-[#121325]';
      case 'common':
      default:
        return 'border-[1.5px] border-purple-200/40 shadow-[0_5px_15px_rgba(20,10,30,0.6)] bg-gradient-to-b from-[#dfcae8] via-[#241733] to-[#150d21]';
    }
  };

  return (
    <div className={`relative inline-block select-none touch-none ${className}`}>
      {/* Visual Stacked Duplicate Cards (Behind main card) */}
      {showStackLayers && stackCount > 1 && (
        <>
          {stackCount >= 3 && (
            <div
              className={`absolute top-0 left-0 ${sizeClasses} rounded-2xl bg-[#1b0e2b] border border-pink-400/20 shadow-md pointer-events-none transition-transform`}
              style={{
                transform: 'translate(6px, -6px) rotate(3deg)',
                opacity: 0.6,
                zIndex: 0,
              }}
            />
          )}
          <div
            className={`absolute top-0 left-0 ${sizeClasses} rounded-2xl bg-[#28153d] border border-pink-400/30 shadow-md pointer-events-none transition-transform`}
            style={{
              transform: 'translate(3px, -3px) rotate(1.5deg)',
              opacity: 0.8,
              zIndex: 1,
            }}
          />
        </>
      )}

      {/* Main Interactive Card */}
      <div
        ref={cardRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onDragStart={(e) => e.preventDefault()}
        className={`relative ${sizeClasses} cursor-pointer transition-transform duration-200 ease-out select-none`}
        style={{
          perspective: '1000px',
          zIndex: 2,
          transform: interactiveTilt && isInteracting ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : undefined,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Flip container */}
        <div
          className="w-full h-full relative transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* FRONT FACE */}
          <div
            className={`absolute inset-0 rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between overflow-hidden ${getRarityFrameClasses(
              card.rarity
            )}`}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg) translateZ(1px)',
              zIndex: isFlipped ? 0 : 2,
              opacity: isFlipped ? 0 : 1,
              pointerEvents: isFlipped ? 'none' : 'auto',
              transition: 'opacity 0.25s ease-in-out',
            }}
          >
            {/* Holographic foil overlay layer */}
            {foilStyles && (
              <div
                className="absolute inset-0 pointer-events-none z-20 transition-opacity"
                style={foilStyles}
              />
            )}

            {/* Inner foil hairline */}
            <div className="absolute inset-[3px] border border-white/20 rounded-[13px] pointer-events-none z-10" />

            {/* Top Bar: Rarity badge & Card Number */}
            <div className="relative z-10 flex items-center justify-between gap-1 px-0.5 pt-0.5">
              <span
                className="font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] uppercase shadow-sm"
                style={{
                  backgroundColor: rarity.badgeBg,
                  color: rarity.color,
                  border: `1px solid ${rarity.color}55`,
                }}
              >
                {rarity.name}
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] text-pink-200/90 tracking-wider">
                {card.cardNumber}
              </span>
            </div>

            {/* Artwork Frame */}
            <div className="relative z-10 my-1 sm:my-1.5 w-full flex-1 rounded-xl overflow-hidden border border-white/20 shadow-inner bg-black/40">
              {photoUrl && !imageError ? (
                <img
                  src={photoUrl}
                  alt={displayTitle}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  onError={() => setImageError(true)}
                />
              ) : (
                renderThematicArt()
              )}

              {/* Secret Rare Rainbow Holo Shimmer */}
              {card.rarity === 'secret' && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
                  style={{
                    background:
                      'linear-gradient(115deg, transparent 25%, rgba(255,255,255,0.5) 48%, transparent 70%)',
                    backgroundSize: '200% 200%',
                    animation: 'shimmerSweep 4.5s linear infinite',
                  }}
                />
              )}
            </div>

            {/* Card Info */}
            <div className="relative z-10 px-1 pb-0.5">
              <div className="flex items-baseline justify-between gap-1">
                <h4
                  className="font-serif font-bold text-white tracking-wide truncate"
                  style={{
                    fontFamily: '"Cinzel", Georgia, serif',
                    fontSize: size === 'sm' ? '10px' : size === 'md' ? '12px' : '14px',
                    textShadow: '0 2px 6px rgba(0,0,0,0.8)',
                  }}
                >
                  {displayTitle}
                </h4>
                {card.rarity === 'secret' && <span className="text-pink-300 text-[10px]">★</span>}
              </div>

              {/* CAPTION AREA */}
              <div className="mt-1 pt-1 border-t border-white/10 text-[8.5px] sm:text-[10px] flex items-center justify-center">
                {card.rarity === 'secret' || card.customCaption ? (
                  <span className="font-extrabold tracking-wider text-pink-300 uppercase drop-shadow-[0_0_10px_rgba(255,140,210,0.9)] text-center truncate">
                    {card.customCaption || 'HAPPY BIRTHDAY RAYYA!'}
                  </span>
                ) : (
                  <span className="text-pink-200/75 italic text-center truncate">
                    {card.subtitle}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* BACK FACE (Midnight Medallion Card Back) */}
          <div
            className="absolute inset-0 rounded-2xl p-2.5 flex flex-col items-center justify-center overflow-hidden border-[2px] border-pink-200/50 shadow-2xl bg-gradient-to-br from-[#2a133d] via-[#190a26] to-[#3a144c]"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg) translateZ(1px)',
              zIndex: isFlipped ? 2 : 0,
              opacity: isFlipped ? 1 : 0,
              pointerEvents: isFlipped ? 'auto' : 'none',
              transition: 'opacity 0.25s ease-in-out',
            }}
          >
            <div className="absolute inset-[3px] border border-white/30 rounded-[12px] pointer-events-none" />
            <div className="absolute inset-[7px] border border-pink-300/20 rounded-[8px] pointer-events-none" />

            <span className="absolute top-2 left-2.5 text-pink-300/80 text-xs">✿</span>
            <span className="absolute top-2 right-2.5 text-pink-300/80 text-xs">✧</span>
            <span className="absolute bottom-2 left-2.5 text-pink-300/80 text-xs">✧</span>
            <span className="absolute bottom-2 right-2.5 text-pink-300/80 text-xs">✿</span>

            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/70 bg-gradient-to-br from-pink-200/90 via-purple-300/80 to-indigo-900/90 shadow-[0_0_20px_rgba(240,150,220,0.5)] flex items-center justify-center">
              <div className="absolute inset-1 rounded-full border border-white/40 border-dashed" />
              <span className="text-2xl sm:text-3xl text-purple-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
                ✿
              </span>
            </div>

            <div className="mt-2.5 text-center">
              <div
                className="font-serif font-black tracking-[0.2em] text-[10px] sm:text-[11px] text-pink-100"
                style={{ fontFamily: '"Cinzel", serif' }}
              >
                MIDNIGHT
              </div>
              <div className="text-[7px] sm:text-[8px] tracking-[0.3em] uppercase text-pink-300/80 mt-0.5">
                MEMORIES
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stack Count Badge */}
      {stackCount > 1 && (
        <div
          className="absolute -top-1.5 -right-1.5 z-30 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black shadow-lg flex items-center gap-0.5 border border-pink-200/60 bg-gradient-to-r from-pink-500 to-purple-600 text-white"
          style={{
            boxShadow: '0 4px 12px rgba(230, 80, 160, 0.6)',
          }}
        >
          <span className="text-[9px] opacity-90">×</span>
          <span>{stackCount}</span>
        </div>
      )}

      <style>{`
        @keyframes shimmerSweep {
          0% {
            background-position: -200% -200%;
          }
          100% {
            background-position: 200% 200%;
          }
        }
        @keyframes idleHoloSweep {
          0% {
            background-position: 0% 15%;
            opacity: 0.65;
          }
          50% {
            background-position: 100% 85%;
            opacity: 0.9;
          }
          100% {
            background-position: 0% 15%;
            opacity: 0.65;
          }
        }
      `}</style>
    </div>
  );
};
