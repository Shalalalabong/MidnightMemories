import React, { useState, useEffect, useMemo, useRef } from 'react';
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

  // Dissipation state for the Title Splash Screen
  const [isDissipating, setIsDissipating] = useState(false);
  const [overlayRemoved, setOverlayRemoved] = useState(false);

  // Background music audio reference
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const bgmUrl = `${import.meta.env.BASE_URL || './'}bgm.mp3`.replace('//', '/');

  // Attempt instant autoplay on mount
  useEffect(() => {
    const audio = new Audio(bgmUrl);
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = 'auto';
    bgmRef.current = audio;

    // Check if the browser allows immediate autoplay
    audio
      .play()
      .then(() => {
        // Direct autoplay allowed by user agent: remove overlay instantly
        setOverlayRemoved(true);
      })
      .catch(() => {
        // Autoplay policy prevented playback: wait for user tap
        setOverlayRemoved(false);
      });

    return () => {
      audio.pause();
    };
  }, [bgmUrl]);

  // Trigger cosmic dissipation animation when tapped
  const handleEnterSite = () => {
    if (isDissipating) return;

    // 1. Start audio immediately upon interaction
    if (bgmRef.current && bgmRef.current.paused) {
      bgmRef.current.play().catch(() => {});
    }

    // 2. Trigger dissipation animation
    setIsDissipating(true);

    // 3. Remove overlay from DOM once animation finishes
    setTimeout(() => {
      setOverlayRemoved(true);
    }, 750);
  };

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
          if (parsed.isMuted && bgmRef.current) {
            bgmRef.current.pause();
          }
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

  // Toggle audio mute and sync background music
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    setSoundMuted(next);

    if (bgmRef.current) {
      if (next) {
        bgmRef.current.pause();
      } else {
        bgmRef.current.play().catch(() => {});
      }
    }

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

      {/* TOP BAR NAVIGATION */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        kuromiDecorEnabled={kuromiDecorEnabled}
        onToggleKuromiDecor={handleToggleKuromiDecor}
        collectionCount={collection.length}
      />

      {/* MAIN CONTENT AREA */}
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

      {/* BOTTOM FLOATING NAVIGATION FOR MOBILE */}
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

      {/* DISSIPATING "TAP TO ENTER" TITLE OVERLAY */}
      {!overlayRemoved && (
        <div 
          onClick={handleEnterSite}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 cursor-pointer select-none transition-all duration-700 ${
            isDissipating 
              ? 'opacity-0 scale-125 blur-xl pointer-events-none' 
              : 'opacity-100 scale-100 blur-0 bg-[#12081d]/95 backdrop-blur-xl'
          }`}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Ambient luminous glow expanding behind the symbol on tap */}
          <div 
            className={`absolute w-72 h-72 rounded-full bg-gradient-to-tr from-pink-500/20 via-purple-600/30 to-transparent blur-3xl pointer-events-none transition-transform duration-700 ${
              isDissipating ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
            }`} 
          />

          <div 
            className={`relative text-center flex flex-col items-center max-w-sm transition-transform duration-700 ${
              isDissipating ? 'scale-110 -translate-y-4' : 'scale-100 translate-y-0'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-300 to-purple-600 flex items-center justify-center text-purple-950 font-black text-2xl shadow-[0_0_35px_rgba(255,140,210,0.6)] mb-4 animate-pulse">
              ✦
            </div>

            <div className="text-[10px] tracking-[0.3em] uppercase text-pink-300 font-semibold mb-1">
              LIMITED COLLECTOR RELEASE
            </div>

            <h1
              className="font-serif text-3xl sm:text-4xl text-white font-extrabold tracking-wide mb-6"
              style={{ fontFamily: '"Cinzel", Georgia, serif' }}
            >
              Midnight Memories
            </h1>

            <button
              onClick={handleEnterSite}
              className="px-8 py-3.5 rounded-full font-bold text-xs tracking-[0.2em] uppercase text-purple-950 bg-gradient-to-r from-pink-200 via-pink-300 to-purple-300 shadow-[0_6px_25px_rgba(240,150,220,0.6)] hover:brightness-110 active:scale-95 transition-all cursor-pointer min-h-[46px] flex items-center gap-2"
            >
              <span>TAP TO ENTER</span>
              <span>✦</span>
            </button>
            <p className="text-[10px] text-pink-200/50 mt-3">Tap anywhere to start with sound</p>
          </div>
        </div>
      )}
    </div>
  );
}
