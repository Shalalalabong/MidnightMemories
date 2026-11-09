import React, { useState, useEffect, useMemo } from 'react';
import { CardDefinition, PulledCard } from './types';
import { CARD_DATABASE } from './data/cards';
import { Navbar } from './components/Navbar';
import { PixelKuromiBackground } from './components/PixelKuromiBackground';
import { HomeView } from './components/HomeView';
import { PackOpeningView } from './components/PackOpeningView';
import { BinderView } from './components/BinderView';
import { setSoundMuted } from './utils/audio';
import { Home, Sparkles, BookOpen } from 'lucide-react';

const STORAGE_KEY = 'midnightMemoriesBinder_v2';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'packs' | 'binder'>('home');
  const [collection, setCollection] = useState<PulledCard[]>([]);
  const [packsOpened, setPacksOpened] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [kuromiDecorEnabled, setKuromiDecorEnabled] = useState(true);

  // Load saved collection and statistics from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.collection)) {
          setCollection(parsed.collection);
        }
        if (typeof parsed.packsOpened === 'number') {
          setPacksOpened(parsed.packsOpened);
        }
        if (typeof parsed.isMuted === 'boolean') {
          setIsMuted(parsed.isMuted);
          setSoundMuted(parsed.isMuted);
        }
        if (typeof parsed.kuromiDecorEnabled === 'boolean') {
          setKuromiDecorEnabled(parsed.kuromiDecorEnabled);
        }
      }
    } catch (e) {
      console.warn('Could not load binder storage:', e);
    }
  }, []);

  // Save changes to localStorage
  const saveState = (
    nextCollection: PulledCard[],
    nextPacksOpened: number,
    nextMuted: boolean,
    nextKuromi: boolean
  ) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          collection: nextCollection,
          packsOpened: nextPacksOpened,
          isMuted: nextMuted,
          kuromiDecorEnabled: nextKuromi,
        })
      );
    } catch (e) {
      console.warn('Could not save binder storage:', e);
    }
  };

  // Card pulled from pack
  const handleCardPulled = (card: CardDefinition) => {
    const newInstance: PulledCard = {
      instanceId: `${card.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      cardId: card.id,
      pulledAt: Date.now(),
    };

    setCollection((prev) => {
      const next = [...prev, newInstance];
      saveState(next, packsOpened, isMuted, kuromiDecorEnabled);
      return next;
    });
  };

  // Booster pack opened increment
  const handlePackOpenedIncrement = () => {
    setPacksOpened((prev) => {
      const next = prev + 1;
      saveState(collection, next, isMuted, kuromiDecorEnabled);
      return next;
    });
  };

  // Toggle audio mute
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    setSoundMuted(next);
    saveState(collection, packsOpened, next, kuromiDecorEnabled);
  };

  // Toggle Kuromi decor
  const handleToggleKuromiDecor = () => {
    const next = !kuromiDecorEnabled;
    setKuromiDecorEnabled(next);
    saveState(collection, packsOpened, isMuted, next);
  };

  // Unique discovered cards count
  const uniqueDiscoveredCount = useMemo(() => {
    const ids = new Set(collection.map((c) => c.cardId));
    return ids.size;
  }, [collection]);

  // Secret rare cards count
  const secretRareCount = useMemo(() => {
    const secretIds = new Set(CARD_DATABASE.filter((c) => c.rarity === 'secret').map((c) => c.id));
    return collection.filter((c) => secretIds.has(c.cardId)).length;
  }, [collection]);

  return (
    <div className="min-h-screen flex flex-col relative text-[#fff1fa]">
      {/* Background with floating pixelated Kuromi decorations */}
      <PixelKuromiBackground enabled={kuromiDecorEnabled} />

      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        kuromiDecorEnabled={kuromiDecorEnabled}
        onToggleKuromiDecor={handleToggleKuromiDecor}
        collectionCount={collection.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 pb-24 sm:pb-8">
        {currentTab === 'home' && (
          <HomeView
            onOpenPackClick={() => setCurrentTab('packs')}
            onViewBinderClick={() => setCurrentTab('binder')}
            packsOpened={packsOpened}
            uniqueDiscoveredCount={uniqueDiscoveredCount}
            secretRareCount={secretRareCount}
          />
        )}

        {currentTab === 'packs' && (
          <PackOpeningView
            onCardPulled={handleCardPulled}
            onPackOpenedIncrement={handlePackOpenedIncrement}
          />
        )}

        {currentTab === 'binder' && (
          <BinderView
            collection={collection}
            onOpenPackClick={() => setCurrentTab('packs')}
          />
        )}
      </main>

      {/* Bottom Floating Navigation for Mobile screens */}
      <nav 
        className="sm:hidden fixed left-4 right-4 z-40 bg-[#1e0f30]/92 backdrop-blur-lg border border-pink-300/30 rounded-2xl p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.85)] flex items-center justify-around"
        style={{ bottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex-1 py-2.5 flex flex-col items-center gap-1 rounded-xl text-[10px] font-bold transition-all min-h-[44px] justify-center cursor-pointer ${
            currentTab === 'home'
              ? 'bg-pink-300/20 text-pink-200'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('packs')}
          className={`flex-1 py-2.5 flex flex-col items-center gap-1 rounded-xl text-[10px] font-bold transition-all min-h-[44px] justify-center cursor-pointer ${
            currentTab === 'packs'
              ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Rip Pack</span>
        </button>

        <button
          onClick={() => setCurrentTab('binder')}
          className={`flex-1 py-2.5 flex flex-col items-center gap-1 rounded-xl text-[10px] font-bold transition-all relative min-h-[44px] justify-center cursor-pointer ${
            currentTab === 'binder'
              ? 'bg-pink-300/20 text-pink-200'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Binder</span>
          {collection.length > 0 && (
            <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-pink-400" />
          )}
        </button>
      </nav>

      {/* Quiet Footer */}
      <footer className="relative z-10 border-t border-white/5 py-4" />
    </div>
  );
}
