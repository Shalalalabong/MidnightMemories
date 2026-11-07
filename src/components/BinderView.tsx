import React, { useState, useMemo } from 'react';
import { CardDefinition, CardRarityKey, PulledCard, StackedCollectionItem } from '../types';
import { CARD_DATABASE, RARITY_CONFIG } from '../data/cards';
import { CardItem } from './CardItem';
import { Sparkles, Layers, Search, X } from 'lucide-react';

interface BinderViewProps {
  collection: PulledCard[];
  onOpenPackClick: () => void;
}

export const BinderView: React.FC<BinderViewProps> = ({
  collection,
  onOpenPackClick,
}) => {
  const [selectedRarity, setSelectedRarity] = useState<CardRarityKey | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stackDuplicates, setStackDuplicates] = useState(true);
  const [inspectCard, setInspectCard] = useState<StackedCollectionItem | null>(null);

  // Group collection by cardId for duplicate stacking
  const stackedItems = useMemo<StackedCollectionItem[]>(() => {
    const map = new Map<string, StackedCollectionItem>();

    collection.forEach((pulled) => {
      const cardDef = CARD_DATABASE.find((c) => c.id === pulled.cardId);
      if (!cardDef) return;

      const existing = map.get(pulled.cardId);
      if (existing) {
        existing.count += 1;
        existing.lastPulledAt = Math.max(existing.lastPulledAt, pulled.pulledAt);
        existing.instances.push(pulled);
      } else {
        map.set(pulled.cardId, {
          card: cardDef,
          count: 1,
          firstPulledAt: pulled.pulledAt,
          lastPulledAt: pulled.pulledAt,
          instances: [pulled],
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const rarityRank: Record<CardRarityKey, number> = {
        secret: 6,
        legendary: 5,
        epic: 4,
        rare: 3,
        uncommon: 2,
        common: 1,
      };
      const diff = rarityRank[b.card.rarity] - rarityRank[a.card.rarity];
      if (diff !== 0) return diff;
      return b.card.cardIndex - a.card.cardIndex;
    });
  }, [collection]);

  const uniqueDiscoveredCount = stackedItems.length;
  const totalSetCount = CARD_DATABASE.length; // 24 cards
  const completionPercentage = Math.round((uniqueDiscoveredCount / totalSetCount) * 100);

  // Filtered items based on active rarity and search
  const filteredItems = useMemo(() => {
    return stackedItems.filter((item) => {
      if (selectedRarity !== 'all' && item.card.rarity !== selectedRarity) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.card.title.toLowerCase().includes(q) ||
          item.card.cardNumber.toLowerCase().includes(q) ||
          item.card.rarity.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [stackedItems, selectedRarity, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Binder Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10">
        <div>
          <div className="text-[9px] tracking-[0.25em] text-pink-300 font-bold uppercase mb-0.5">
            ✦ COLLECTOR'S ARCHIVE ✦
          </div>
          <h2
            className="font-serif text-xl sm:text-3xl text-white font-bold tracking-wide"
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            Midnight Card Binder
          </h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-pink-200/80 mt-1">
            <span>{uniqueDiscoveredCount} of {totalSetCount} Unique Discovered</span>
            <span aria-hidden="true">·</span>
            <span>{collection.length} Total Pulls</span>
            <span aria-hidden="true">·</span>
            <span className="text-pink-300 font-semibold">{completionPercentage}% Complete</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Stack Duplicates Toggle */}
          <button
            type="button"
            onClick={() => setStackDuplicates(!stackDuplicates)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer min-h-[36px] ${
              stackDuplicates
                ? 'bg-purple-900/60 border-pink-400/50 text-pink-200 shadow-sm'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Stack Duplicates: {stackDuplicates ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-4 sm:mb-6">
        {/* Rarity Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedRarity('all')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer min-h-[36px] ${
              selectedRarity === 'all'
                ? 'bg-pink-300 text-purple-950 font-bold shadow-sm'
                : 'text-pink-200/70 hover:text-white hover:bg-white/5'
            }`}
          >
            All
          </button>
          {(['secret', 'legendary', 'epic', 'rare', 'uncommon', 'common'] as CardRarityKey[]).map((r) => {
            const cfg = RARITY_CONFIG[r];
            const isActive = selectedRarity === r;
            return (
              <button
                key={r}
                onClick={() => setSelectedRarity(r)}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer min-h-[36px] ${
                  isActive
                    ? 'text-purple-950 font-bold shadow-sm'
                    : 'text-pink-200/70 hover:text-white hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: isActive ? cfg.color : undefined,
                }}
              >
                {cfg.name}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative min-w-[180px]">
          <Search className="w-3.5 h-3.5 text-pink-300/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-pink-100 placeholder:text-pink-200/40 focus:outline-none focus:border-pink-400/60 min-h-[36px]"
          />
        </div>
      </div>

      {/* Binder Grid */}
      {collection.length === 0 ? (
        <div className="text-center py-12 sm:py-16 px-4 rounded-2xl border border-dashed border-pink-300/20 bg-white/[0.02]">
          <div className="w-11 h-11 rounded-full border border-pink-300/40 bg-purple-950/40 flex items-center justify-center mx-auto mb-2.5 text-pink-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3
            className="font-serif text-base sm:text-lg text-white font-bold"
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            Your Binder is Empty
          </h3>
          <p className="text-xs text-pink-200/70 max-w-sm mx-auto mt-1 mb-4">
            Rip open a Midnight Memories booster pack to discover rare cards and begin your collection.
          </p>
          <button
            onClick={onOpenPackClick}
            className="px-6 py-3 rounded-full font-bold text-xs tracking-wider uppercase text-purple-950 bg-gradient-to-r from-pink-200 via-pink-300 to-purple-300 shadow-[0_4px_16px_rgba(240,150,220,0.5)] hover:brightness-110 active:scale-95 transition-all cursor-pointer min-h-[44px]"
          >
            OPEN YOUR FIRST PACK ✦
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-10 text-pink-200/60 text-xs">
          No cards matched your filter. Try selecting "All" or clearing search.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 justify-items-center">
          {stackDuplicates
            ? // STACKED DUPLICATES VIEW
              filteredItems.map((item) => (
                <div
                  key={item.card.id}
                  className="flex flex-col items-center group cursor-pointer w-full max-w-[150px]"
                  onClick={() => setInspectCard(item)}
                >
                  <CardItem
                    card={item.card}
                    stackCount={item.count}
                    size="sm"
                    showStackLayers={true}
                    interactiveTilt={true}
                  />
                  <div className="mt-1.5 text-center w-full px-1">
                    <span className="text-[10px] sm:text-[11px] font-bold text-white block truncate">
                      {item.card.title}
                    </span>
                    <div className="flex items-center justify-center gap-1 text-[8px] sm:text-[9px] text-pink-300/70">
                      <span>{item.card.cardNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold">{item.count} owned</span>
                    </div>
                  </div>
                </div>
              ))
            : // UNSTACKED VIEW
              collection
                .filter((pulled) => {
                  const cardDef = CARD_DATABASE.find((c) => c.id === pulled.cardId);
                  if (!cardDef) return false;
                  if (selectedRarity !== 'all' && cardDef.rarity !== selectedRarity) return false;
                  if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase();
                    return cardDef.title.toLowerCase().includes(q);
                  }
                  return true;
                })
                .map((pulled) => {
                  const cardDef = CARD_DATABASE.find((c) => c.id === pulled.cardId)!;
                  return (
                    <div
                      key={pulled.instanceId}
                      className="flex flex-col items-center group cursor-pointer w-full max-w-[150px]"
                      onClick={() =>
                        setInspectCard({
                          card: cardDef,
                          count: 1,
                          firstPulledAt: pulled.pulledAt,
                          lastPulledAt: pulled.pulledAt,
                          instances: [pulled],
                        })
                      }
                    >
                      <CardItem
                        card={cardDef}
                        stackCount={1}
                        size="sm"
                        showStackLayers={false}
                        interactiveTilt={true}
                      />
                      <div className="mt-1.5 text-center w-full px-1">
                        <span className="text-[10px] sm:text-[11px] font-bold text-white block truncate">
                          {cardDef.title}
                        </span>
                        <span className="text-[8px] sm:text-[9px] text-pink-300/70">{cardDef.cardNumber}</span>
                      </div>
                    </div>
                  );
                })}
        </div>
      )}

      {/* CARD INSPECT MODAL */}
      {inspectCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setInspectCard(null)}
        >
          <div
            className="relative bg-gradient-to-b from-[#2d163f] to-[#160a22] border border-pink-300/40 rounded-3xl p-4 sm:p-6 max-w-sm sm:max-w-md w-full max-h-[92dvh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setInspectCard(null)}
              className="absolute top-3.5 right-3.5 text-pink-300/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-[8px] sm:text-[9px] font-mono tracking-widest text-pink-300 uppercase mb-1">
              INSPECTING · {inspectCard.card.cardNumber}
            </div>

            {/* Large 3D Card with interactive tilt & flip */}
            <div className="my-1.5">
              <CardItem
                card={inspectCard.card}
                size="md"
                stackCount={inspectCard.count}
                showStackLayers={false}
                interactiveTilt={true}
              />
            </div>

            <p className="text-[9px] sm:text-[10px] text-pink-200/60 mt-1 mb-3 text-center">
              Tap the card to flip front/back ✿
            </p>

            {/* Card Info and Ownership Details */}
            <div className="w-full bg-black/40 border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs text-pink-100">
              <div>
                <span className="font-bold text-white text-sm block">
                  {inspectCard.card.title}
                </span>
                <span className="text-[10px] text-pink-300/80 uppercase block">
                  {inspectCard.card.rarity} · Slot #{inspectCard.card.cardIndex}
                </span>
                <span className="text-[9px] text-white/50">
                  {inspectCard.card.customCaption || inspectCard.card.subtitle}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-pink-300 block">
                  {inspectCard.count} Owned
                </span>
                <span className="text-[8px] text-white/50">Stacked in Binder</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
