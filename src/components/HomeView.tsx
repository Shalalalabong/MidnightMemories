import React from 'react';
import { CardDefinition } from '../types';
import { CARD_DATABASE } from '../data/cards';
import { CardItem } from './CardItem';
import { Sparkles, Layers, HandMetal } from 'lucide-react';

interface HomeViewProps {
  onOpenPackClick: () => void;
  onViewBinderClick: () => void;
  packsOpened: number;
  uniqueDiscoveredCount: number;
  secretRareCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenPackClick,
  onViewBinderClick,
  packsOpened,
  uniqueDiscoveredCount,
  secretRareCount,
}) => {
  // Showcase card for the landing page banner (Secret Rare Nocturne Sovereign)
  const showcaseCard: CardDefinition = CARD_DATABASE[0];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-6 space-y-6 sm:space-y-10">
      {/* LANDING PAGE BANNER OF "MIDNIGHT MEMORIES" */}
      <section className="relative overflow-hidden rounded-3xl border border-pink-300/30 bg-gradient-to-br from-[#3b1f52]/90 via-[#261238]/95 to-[#150a22] p-5 sm:p-10 shadow-[0_16px_45px_rgba(10,5,20,0.6)]">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Banner Copy & CTAs */}
          <div className="md:col-span-7 space-y-3 sm:space-y-4 text-center md:text-left flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-400/30 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-pink-200 uppercase">
              <span>✦</span>
              <span>LIMITED COLLECTOR RELEASE</span>
              <span>✦</span>
            </div>

            <h1
              className="font-serif text-3xl sm:text-5xl text-white font-extrabold tracking-wide leading-tight"
              style={{ fontFamily: '"Cinzel", Georgia, serif' }}
            >
              Midnight
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-pink-300 to-purple-300">
                Memories
              </span>
            </h1>

            <p className="text-xs sm:text-base text-pink-200/80 leading-relaxed max-w-lg">
              Five collectible cards in every booster. Swipe across the foil seam to rip open,
              flick cards with tactile physics, and collect stacked duplicates in your midnight binder.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={onOpenPackClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-xs tracking-wider uppercase text-purple-950 bg-gradient-to-r from-pink-200 via-pink-300 to-purple-300 shadow-[0_6px_25px_rgba(240,150,220,0.5)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>OPEN A BOOSTER PACK</span>
                <span>✦</span>
              </button>

              <button
                onClick={onViewBinderClick}
                className="w-full sm:w-auto px-5 py-3 rounded-full font-semibold text-xs tracking-wider uppercase text-pink-200 bg-white/5 border border-pink-300/30 hover:bg-white/10 active:scale-95 transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
              >
                View Collection Binder
              </button>
            </div>
          </div>

          {/* Banner Card Showcase */}
          <div className="md:col-span-5 flex justify-center items-center pt-2 md:pt-0">
            <div className="relative group">
              <div
                className="absolute -top-2 -right-2 w-[165px] h-[248px] sm:w-[190px] sm:h-[285px] rounded-2xl bg-gradient-to-br from-[#8c4ea7] to-[#2d153d] border border-pink-300/40 opacity-50 shadow-xl transition-transform group-hover:rotate-6"
                style={{ transform: 'rotate(6deg)' }}
              />

              <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                <CardItem
                  card={showcaseCard}
                  size="md"
                  showStackLayers={false}
                  interactiveTilt={true}
                />
              </div>

              <div className="absolute -bottom-2 -left-2 z-20 px-2 py-0.5 rounded-full bg-black/85 border border-pink-300/60 text-[8px] sm:text-[9px] font-bold text-pink-200 shadow-md">
                ✦ 1 GUARANTEED SECRET RARE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS STRIP - Compact on mobile */}
      <section className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-2xl border border-pink-300/20 bg-white/[0.03] backdrop-blur-sm text-center">
          <div className="text-xl sm:text-3xl font-serif font-black text-white tabular-nums">
            {packsOpened}
          </div>
          <div className="text-[9px] sm:text-[10px] tracking-wider uppercase text-pink-200/70 font-semibold mt-0.5">
            Packs Ripped
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl border border-pink-300/20 bg-white/[0.03] backdrop-blur-sm text-center">
          <div className="text-xl sm:text-3xl font-serif font-black text-pink-200 tabular-nums">
            {uniqueDiscoveredCount}
            <span className="text-[10px] sm:text-xs font-normal text-white/50">/24</span>
          </div>
          <div className="text-[9px] sm:text-[10px] tracking-wider uppercase text-pink-200/70 font-semibold mt-0.5">
            Discovered
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl border border-pink-300/20 bg-white/[0.03] backdrop-blur-sm text-center">
          <div className="text-xl sm:text-3xl font-serif font-black text-pink-300 tabular-nums">
            {secretRareCount}
          </div>
          <div className="text-[9px] sm:text-[10px] tracking-wider uppercase text-pink-200/70 font-semibold mt-0.5">
            Secret Rares
          </div>
        </div>
      </section>

      {/* FEATURE PILLARS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
        <div className="p-4 sm:p-5 rounded-2xl border border-pink-300/15 bg-white/[0.02] space-y-1.5 sm:space-y-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300">
            <HandMetal className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-white">Physical Pack Ripping</h3>
          <p className="text-[11px] sm:text-xs text-pink-200/70 leading-relaxed">
            Drag your finger or cursor along the top foil seam to tear the pack open with authentic
            crinkle acoustics.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-pink-300/15 bg-white/[0.02] space-y-1.5 sm:space-y-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-white">Tactile Card Flicking</h3>
          <p className="text-[11px] sm:text-xs text-pink-200/70 leading-relaxed">
            Flick cards away with swipe physics to reveal what lies beneath, or tap to flip and inspect
            the medallion back.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-pink-300/15 bg-white/[0.02] space-y-1.5 sm:space-y-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-white">Stacked Duplicate Binder</h3>
          <p className="text-[11px] sm:text-xs text-pink-200/70 leading-relaxed">
            Duplicates stack together neatly with count badges, 3D depth layers, and full collection
            completion tracking.
          </p>
        </div>
      </section>
    </div>
  );
};
