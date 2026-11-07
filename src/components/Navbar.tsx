import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'packs' | 'binder';
  onSelectTab: (tab: 'home' | 'packs' | 'binder') => void;
  isMuted: boolean;
  onToggleMute: () => void;
  kuromiDecorEnabled: boolean;
  onToggleKuromiDecor: () => void;
  collectionCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isMuted,
  onToggleMute,
  kuromiDecorEnabled,
  onToggleKuromiDecor,
  collectionCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#180f27]/90 backdrop-blur-md border-b border-pink-300/20 px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-300 to-purple-600 flex items-center justify-center text-purple-950 font-black text-sm shadow-[0_0_15px_rgba(255,140,210,0.5)] group-hover:scale-105 transition-transform">
            ✦
          </div>
          <span
            className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-serif"
            style={{ fontFamily: '"Cinzel", Georgia, serif' }}
          >
            Midnight Memories
          </span>
        </button>

        {/* Zone 2: Clean single-line text navigation links (desktop) */}
        <nav className="hidden sm:flex items-center gap-5 sm:gap-7 text-xs font-semibold text-pink-200/70">
          <button
            onClick={() => onSelectTab('home')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              currentTab === 'home' ? 'text-pink-300 font-bold border-b-2 border-pink-400 pb-0.5' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('packs')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              currentTab === 'packs' ? 'text-pink-300 font-bold border-b-2 border-pink-400 pb-0.5' : ''
            }`}
          >
            Open Packs
          </button>
          <button
            onClick={() => onSelectTab('binder')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'binder' ? 'text-pink-300 font-bold border-b-2 border-pink-400 pb-0.5' : ''
            }`}
          >
            <span>Binder</span>
            {collectionCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-pink-500/30 text-[10px] text-pink-200">
                {collectionCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Audio / Decor toggles */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Kuromi Decor Toggle */}
          <button
            onClick={onToggleKuromiDecor}
            title={kuromiDecorEnabled ? 'Kuromi Decor: ON' : 'Kuromi Decor: OFF'}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              kuromiDecorEnabled
                ? 'bg-pink-500/20 border-pink-400/40 text-pink-300'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            className="p-2 rounded-lg border border-white/10 bg-white/5 text-pink-200/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => onSelectTab('packs')}
            className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-bold text-purple-950 bg-gradient-to-r from-pink-200 via-pink-300 to-purple-300 rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-[0_2px_12px_rgba(240,150,220,0.3)] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Rip Pack ✦
          </button>
        </div>
      </div>
    </header>
  );
};
