import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CardDefinition } from '../types';
import { CardItem } from './CardItem';
import { playCardFlickSound, playSparkleFanfare, playCardFlipSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface CardStackRevealProps {
  cards: CardDefinition[];
  onPackFinished: () => void;
  onCardRevealed: (card: CardDefinition) => void;
}

interface ExitingCardState {
  card: CardDefinition;
  direction: 'left' | 'right' | 'up';
  key: string;
}

export const CardStackReveal: React.FC<CardStackRevealProps> = ({
  cards,
  onPackFinished,
  onCardRevealed,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Controlled flip state: each card starts strictly face-up
  const [isCurrentFlipped, setIsCurrentFlipped] = useState(false);

  // Drag physics state for flicking
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Separate exiting card layer to eliminate ghost trails
  const [exitingCard, setExitingCard] = useState<ExitingCardState | null>(null);

  // Rainbow "Happy Birthday Precious" curved banner state
  const [showRainbowPrecious, setShowRainbowPrecious] = useState(false);
  const celebrationTimerRef = useRef<number | null>(null);

  const dragStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const lastMoveRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const hasMovedRef = useRef(false);
  const lastFlipTimestampRef = useRef(0);

  const [revealedInSession, setRevealedInSession] = useState<CardDefinition[]>([]);
  const [isSummaryView, setIsSummaryView] = useState(false);

  const currentCard = cards[currentIndex];
  const isLastCard = currentIndex === cards.length - 1;

  // Shower confetti & display curved rainbow "Happy Birthday Precious" banner for Secret Rares
  const triggerSecretRareCelebration = useCallback(() => {
    setShowRainbowPrecious(true);

    if (celebrationTimerRef.current) {
      window.clearTimeout(celebrationTimerRef.current);
    }

    try {
      // 1. Initial burst
      confetti({
        particleCount: 80,
        spread: 95,
        origin: { y: 0.4 },
        colors: ['#ff4371', '#ff8936', '#ffd23f', '#3be8b0', '#36b9ff', '#bf55ec', '#ff5ea7', '#ffffff'],
        disableForReducedMotion: true,
      });

      // 2. Left side shower
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 65,
          origin: { x: 0.15, y: 0.5 },
          colors: ['#ff85d5', '#ffd2ee', '#a875ff', '#ffe17d', '#ffffff'],
          disableForReducedMotion: true,
        });
      }, 180);

      // 3. Right side shower
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 65,
          origin: { x: 0.85, y: 0.5 },
          colors: ['#ff85d5', '#ffd2ee', '#a875ff', '#ffe17d', '#ffffff'],
          disableForReducedMotion: true,
        });
      }, 360);
    } catch {
      // Ignore
    }

    // Hide curved rainbow banner after ~1.8 seconds
    celebrationTimerRef.current = window.setTimeout(() => {
      setShowRainbowPrecious(false);
    }, 1800);
  }, []);

  // Initial card pull notification
  useEffect(() => {
    if (cards[0] && revealedInSession.length === 0) {
      setRevealedInSession([cards[0]]);
      onCardRevealed(cards[0]);
      if (cards[0].rarity === 'secret' || cards[0].rarity === 'legendary') {
        playSparkleFanfare(cards[0].rarity === 'secret');
        if (cards[0].rarity === 'secret') {
          triggerSecretRareCelebration();
        }
      }
    }
  }, [cards, onCardRevealed, revealedInSession.length, triggerSecretRareCelebration]);

  // Robust, debounced card flip method
  const performFlip = useCallback(() => {
    if (exitingCard) return;
    const now = Date.now();
    if (now - lastFlipTimestampRef.current < 280) return;
    lastFlipTimestampRef.current = now;

    playCardFlipSound();
    setIsCurrentFlipped((prev) => !prev);
  }, [exitingCard]);

  // Execute flick transition to next card
  const executeFlick = useCallback((dir: 'left' | 'right' | 'up' = 'right') => {
    if (exitingCard) return;

    const cardToExit = cards[currentIndex];
    const exitKey = `${cardToExit.id}-exit-${currentIndex}-${Date.now()}`;

    // 1. Launch exiting card on separate fly-away layer
    setExitingCard({
      card: cardToExit,
      direction: dir,
      key: exitKey,
    });
    playCardFlickSound();

    // 2. Reset drag offsets & ensure next card is strictly facing front
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
    setIsCurrentFlipped(false);
    hasMovedRef.current = false;

    // 3. Advance to next card
    if (currentIndex < cards.length - 1) {
      const nextIdx = currentIndex + 1;
      const nextCard = cards[nextIdx];
      setCurrentIndex(nextIdx);
      setRevealedInSession((prev) => [...prev, nextCard]);
      onCardRevealed(nextCard);

      if (nextCard.rarity === 'secret' || nextCard.rarity === 'legendary') {
        playSparkleFanfare(nextCard.rarity === 'secret');
        if (nextCard.rarity === 'secret') {
          triggerSecretRareCelebration();
        }
      }
    } else {
      setTimeout(() => {
        setIsSummaryView(true);
      }, 320);
    }

    // 4. Clean up exiting card layer once its flight animation completes
    setTimeout(() => {
      setExitingCard(null);
    }, 360);
  }, [currentIndex, cards, exitingCard, onCardRevealed, triggerSecretRareCelebration]);

  // Pointer drag start
  const handlePointerDown = (e: React.PointerEvent) => {
    if (exitingCard || isSummaryView) return;
    setIsDragging(true);
    hasMovedRef.current = false;
    const now = Date.now();
    dragStartRef.current = { x: e.clientX, y: e.clientY, time: now };
    lastMoveRef.current = { x: e.clientX, y: e.clientY, time: now };
  };

  // Pointer drag move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || exitingCard) return;
    const now = Date.now();
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    if (Math.hypot(dx, dy) > 8) {
      hasMovedRef.current = true;
    }

    setDragOffset({ x: dx, y: dy });
    lastMoveRef.current = { x: e.clientX, y: e.clientY, time: now };
  };

  // Pointer drag end
  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const now = Date.now();
    const dt = Math.max(1, now - lastMoveRef.current.time);
    const vx = dragOffset.x / dt;
    const vy = dragOffset.y / dt;

    const absX = Math.abs(dragOffset.x);
    const absY = Math.abs(dragOffset.y);

    const isFlickX = absX > 60 || Math.abs(vx) > 0.35;
    const isFlickUp = dragOffset.y < -60 || vy < -0.35;

    if (isFlickUp && absY > absX) {
      executeFlick('up');
    } else if (isFlickX) {
      executeFlick(dragOffset.x > 0 ? 'right' : 'left');
    } else {
      setDragOffset({ x: 0, y: 0 });

      // If user tapped cleanly without dragging, flip!
      if (!hasMovedRef.current && absX < 6 && absY < 6) {
        performFlip();
      }
    }
  };

  // Card click callback from CardItem
  const handleCardClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!hasMovedRef.current && !exitingCard) {
      performFlip();
    }
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSummaryView) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        executeFlick('right');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        executeFlick('left');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        performFlip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeFlick, performFlip, isSummaryView]);

  if (isSummaryView) {
    return (
      <div className="flex flex-col items-center justify-center py-4 px-3 max-w-4xl mx-auto animate-fadeIn w-full">
        <div className="text-center mb-4">
          <div className="text-[9px] tracking-[0.25em] text-pink-300 font-bold uppercase mb-0.5">
            ✦ PACK UNSEALED ✦
          </div>
          <h2
            className="font-serif text-xl sm:text-3xl text-white font-bold tracking-wide"
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            Your Midnight Pulls
          </h2>
          <p className="text-[11px] text-pink-200/70 mt-1 max-w-md mx-auto">
            All 5 cards have been added to your collector's binder! Duplicate cards stack automatically.
          </p>
        </div>

        {/* 5 Cards Displayed in Responsive Mobile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 justify-items-center mb-6 w-full">
          {cards.map((card, idx) => (
            <div
              key={`${card.id}-${idx}`}
              className="flex flex-col items-center animate-slideUp"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <CardItem card={card} size="sm" showStackLayers={false} interactiveTilt={true} />
              <div className="mt-1.5 text-center">
                <span className="text-[10px] font-bold text-pink-200 block truncate max-w-[125px]">
                  {card.title}
                </span>
                <span className="text-[8px] font-mono text-pink-300/80 uppercase">
                  {card.rarity}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full pb-4">
          <button
            onClick={onPackFinished}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs tracking-wider uppercase text-purple-950 bg-gradient-to-r from-pink-200 via-pink-300 to-purple-300 shadow-[0_6px_20px_rgba(240,150,220,0.5)] hover:brightness-110 active:scale-95 transition-all cursor-pointer min-h-[44px]"
          >
            OPEN ANOTHER PACK ✦
          </button>
        </div>
      </div>
    );
  }

  // Active top card transform while dragging
  const getActiveCardTransform = () => {
    if (isDragging) {
      const rot = (dragOffset.x / 160) * 12;
      return {
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rot}deg)`,
        transition: 'none',
        cursor: 'grabbing',
      };
    }

    return {
      transform: 'translate(0px, 0px) rotate(0deg)',
      transition: 'transform 0.22s cubic-bezier(0.18, 0.9, 0.3, 1)',
      cursor: 'grab',
    };
  };

  return (
    <div className="flex flex-col items-center justify-center py-2 select-none w-full max-w-lg mx-auto touch-none">
      {/* Pack Progress and Status Header */}
      <div className="text-center mb-2">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          {cards.map((c, i) => (
            <div
              key={c.id + i}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex
                  ? 'w-6 bg-pink-300 shadow-[0_0_8px_#ff85d5]'
                  : i < currentIndex
                  ? 'w-2 bg-pink-500/50'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        <div className="text-[9px] font-mono tracking-widest text-pink-300 uppercase">
          CARD {currentIndex + 1} OF {cards.length}
        </div>

        <h3
          className="font-serif font-bold text-base sm:text-xl text-white tracking-wide"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          {currentCard.rarity === 'secret' ? (
            <span className="text-pink-300 drop-shadow-[0_0_12px_rgba(255,133,213,0.9)]">
              ✦ SECRET RARE PULL ✦
            </span>
          ) : (
            `${currentCard.rarity.toUpperCase()} PULL`
          )}
        </h3>
      </div>

      {/* 3D CARD STACK STAGE */}
      <div
        className="relative my-1 w-[min(80vw,265px)] h-[min(120vw,395px)] flex items-center justify-center touch-none"
        style={{ perspective: '1200px' }}
      >
        {/* CELEBRATORY RAINBOW CURVED BANNER: "Happy Birthday Precious" */}
        {showRainbowPrecious && (
          <div className="absolute -top-12 sm:-top-14 inset-x-0 z-40 flex items-center justify-center pointer-events-none animate-rainbowBanner">
            <svg
              viewBox="0 0 340 100"
              className="w-[280px] sm:w-[330px] h-[85px] sm:h-[95px] drop-shadow-[0_4px_18px_rgba(255,100,200,0.95)] overflow-visible"
            >
              <defs>
                <linearGradient id="rainbowGradPrecious" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff4371" />
                  <stop offset="16%" stopColor="#ff8533" />
                  <stop offset="34%" stopColor="#ffd23f" />
                  <stop offset="52%" stopColor="#3be8b0" />
                  <stop offset="70%" stopColor="#36b9ff" />
                  <stop offset="86%" stopColor="#bf55ec" />
                  <stop offset="100%" stopColor="#ff5ea7" />
                </linearGradient>
                <path id="rainbowArchPath" d="M 15 72 Q 170 14 325 72" fill="none" />
              </defs>
              {/* Outer stroke for dark background contrast */}
              <text
                fill="none"
                stroke="#1b0826"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <textPath
                  href="#rainbowArchPath"
                  startOffset="50%"
                  textAnchor="middle"
                  style={{
                    fontFamily: '"Cinzel", Georgia, serif',
                    fontWeight: 900,
                    fontSize: '19px',
                    letterSpacing: '1.2px',
                  }}
                >
                  Happy Birthday Precious
                </textPath>
              </text>
              {/* White halo rim */}
              <text
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              >
                <textPath
                  href="#rainbowArchPath"
                  startOffset="50%"
                  textAnchor="middle"
                  style={{
                    fontFamily: '"Cinzel", Georgia, serif',
                    fontWeight: 900,
                    fontSize: '19px',
                    letterSpacing: '1.2px',
                  }}
                >
                  Happy Birthday Precious
                </textPath>
              </text>
              {/* Vibrant Rainbow Gradient Fill */}
              <text fill="url(#rainbowGradPrecious)">
                <textPath
                  href="#rainbowArchPath"
                  startOffset="50%"
                  textAnchor="middle"
                  style={{
                    fontFamily: '"Cinzel", Georgia, serif',
                    fontWeight: 900,
                    fontSize: '19px',
                    letterSpacing: '1.2px',
                  }}
                >
                  Happy Birthday Precious
                </textPath>
              </text>
            </svg>
          </div>
        )}

        {/* Next card in stack underneath (Card index + 1) */}
        {currentIndex + 1 < cards.length && (
          <div
            key={`underneath-${cards[currentIndex + 1].id}-${currentIndex + 1}`}
            className="absolute top-0 left-0 pointer-events-none transition-all duration-300"
            style={{
              transform: 'translate(3px, 4px) scale(0.98)',
              opacity: 0.75,
              zIndex: 1,
            }}
          >
            <CardItem
              card={cards[currentIndex + 1]}
              size="hero"
              isFlipped={false}
              interactiveTilt={false}
              showStackLayers={false}
            />
          </div>
        )}

        {/* 3rd card in stack underneath (Card index + 2) */}
        {currentIndex + 2 < cards.length && (
          <div
            key={`deck-${cards[currentIndex + 2].id}-${currentIndex + 2}`}
            className="absolute top-0 left-0 pointer-events-none transition-all duration-300"
            style={{
              transform: 'translate(6px, 8px) scale(0.96)',
              opacity: 0.45,
              zIndex: 0,
            }}
          >
            <CardItem
              card={cards[currentIndex + 2]}
              size="hero"
              isFlipped={false}
              interactiveTilt={false}
              showStackLayers={false}
            />
          </div>
        )}

        {/* CURRENT ACTIVE CARD */}
        <div
          key={`active-${currentCard.id}-${currentIndex}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute top-0 left-0 z-10 touch-none select-none cursor-pointer"
          style={{
            ...getActiveCardTransform(),
            touchAction: 'none',
          }}
        >
          <CardItem
            card={currentCard}
            size="hero"
            isFlipped={isCurrentFlipped}
            interactiveTilt={!isDragging && !exitingCard}
            showStackLayers={false}
            onClick={handleCardClick}
          />
        </div>

        {/* EXITING CARD LAYER (Flies smoothly off-screen with zero ghosting) */}
        {exitingCard && (
          <div
            key={exitingCard.key}
            className={`absolute top-0 left-0 z-30 pointer-events-none ${
              exitingCard.direction === 'right'
                ? 'animate-flyRight'
                : exitingCard.direction === 'left'
                ? 'animate-flyLeft'
                : 'animate-flyUp'
            }`}
          >
            <CardItem
              card={exitingCard.card}
              size="hero"
              isFlipped={false}
              interactiveTilt={false}
              showStackLayers={false}
            />
          </div>
        )}
      </div>

      {/* Mobile-optimized Gesture Controls & Action Buttons */}
      <div className="mt-3 sm:mt-4 flex flex-col items-center gap-2 w-full px-4">
        <div className="text-[11px] text-pink-200/80 flex items-center gap-1.5">
          <span>👈 Flick card to reveal next 👉</span>
        </div>

        {/* Action Button: Flick to Next Card */}
        <button
          type="button"
          onClick={() => executeFlick('right')}
          disabled={!!exitingCard}
          className="w-full sm:w-auto px-7 py-3 rounded-full font-bold text-xs tracking-wider text-purple-950 bg-gradient-to-r from-pink-200 via-pink-300 to-purple-300 shadow-[0_4px_16px_rgba(240,150,220,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
        >
          <span>{isLastCard ? 'VIEW PACK SUMMARY' : `FLICK TO NEXT CARD (${currentIndex + 1}/${cards.length})`}</span>
          <span className="font-black">➔</span>
        </button>

        {/* Flip toggle button */}
        <button
          type="button"
          onClick={performFlip}
          className="text-[11px] font-semibold text-pink-300 hover:text-white underline decoration-pink-300/40 transition-colors cursor-pointer py-1 px-3"
        >
          {isCurrentFlipped ? '↺ Flip card to front' : '✿ Tap card or click here to flip'}
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes flyRight {
          0% {
            transform: translate(0px, 0px) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(520px, 70px) rotate(26deg) scale(0.88);
            opacity: 0;
          }
        }
        @keyframes flyLeft {
          0% {
            transform: translate(0px, 0px) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-520px, 70px) rotate(-26deg) scale(0.88);
            opacity: 0;
          }
        }
        @keyframes flyUp {
          0% {
            transform: translate(0px, 0px) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(0px, -520px) rotate(-8deg) scale(0.88);
            opacity: 0;
          }
        }
        @keyframes rainbowBannerFade {
          0% {
            opacity: 0;
            transform: translateY(14px) scale(0.85);
          }
          15% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          80% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px) scale(0.94);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.35s ease-out forwards;
        }
        .animate-flyRight {
          animation: flyRight 0.34s cubic-bezier(0.2, 0.85, 0.25, 1) forwards;
        }
        .animate-flyLeft {
          animation: flyLeft 0.34s cubic-bezier(0.2, 0.85, 0.25, 1) forwards;
        }
        .animate-flyUp {
          animation: flyUp 0.34s cubic-bezier(0.2, 0.85, 0.25, 1) forwards;
        }
        .animate-rainbowBanner {
          animation: rainbowBannerFade 1.8s cubic-bezier(0.18, 0.9, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
