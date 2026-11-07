import React, { useState } from 'react';
import { CardDefinition } from '../types';
import { generateBoosterPack } from '../data/cards';
import { PhysicalBoosterPack } from './PhysicalBoosterPack';
import { CardStackReveal } from './CardStackReveal';

interface PackOpeningViewProps {
  onCardPulled: (card: CardDefinition) => void;
  onPackOpenedIncrement: () => void;
}

export const PackOpeningView: React.FC<PackOpeningViewProps> = ({
  onCardPulled,
  onPackOpenedIncrement,
}) => {
  // Current pack state
  const [currentPackCards, setCurrentPackCards] = useState<CardDefinition[] | null>(null);
  const [isPackRipped, setIsPackRipped] = useState(false);

  // When user swipes across and rips the physical booster pack
  const handleRipComplete = () => {
    const newPack = generateBoosterPack();
    setCurrentPackCards(newPack);
    setIsPackRipped(true);
    onPackOpenedIncrement();
  };

  // When user wants to open another booster pack
  const handleResetForNextPack = () => {
    setIsPackRipped(false);
    setCurrentPackCards(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 min-h-[75vh] flex flex-col justify-center">
      {!isPackRipped || !currentPackCards ? (
        // STATE 1: PHYSICAL BOOSTER PACK WAITING TO BE RIPPED WITH SWIPE
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-2">
            <div className="text-[10px] tracking-[0.25em] text-pink-300 font-bold uppercase mb-1">
              ✦ BOOSTER CHAMBER ✦
            </div>
            <h2
              className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-wide"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              Ready to Rip?
            </h2>
            <p className="text-xs text-pink-200/70 max-w-md mx-auto mt-1">
              Swipe your finger or drag your cursor across the top seam of the foil booster pack to tear it open.
            </p>
          </div>

          <PhysicalBoosterPack onRipComplete={handleRipComplete} />
        </div>
      ) : (
        // STATE 2: CARDS REVEALED IN 3D FLICKABLE STACK
        <CardStackReveal
          cards={currentPackCards}
          onPackFinished={handleResetForNextPack}
          onCardRevealed={onCardPulled}
        />
      )}
    </div>
  );
};
