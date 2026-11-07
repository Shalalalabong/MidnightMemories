export type CardRarityKey = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'secret';

export interface CardRarity {
  key: CardRarityKey;
  name: string;
  weight: number;
  color: string;
  badgeBg: string;
  foilType: 'none' | 'silver' | 'starlight' | 'amethyst' | 'gold' | 'cosmic-rainbow';
}

export interface CardDefinition {
  id: string;
  cardIndex: number; // 1 to 24
  cardNumber: string; // e.g. "001/024" or "024/024 ★"
  title: string;
  subtitle: string;
  rarity: CardRarityKey;
  aestheticStats: {
    charm: number;
    aura: number;
    mystery: number;
  };
  flavorText: string;
  defaultArtTheme: 'moon' | 'stars' | 'skull' | 'rose' | 'butterfly' | 'crystals' | 'crown' | 'mirror' | 'veil' | 'constellation';
  photoPath?: string; // Explicit path to photo, e.g. "/photos/card-1.jpg"
  customCaption?: string; // Optional custom caption (e.g. "HAPPY BIRTHDAY RAYYA!")
}

export interface PulledCard {
  instanceId: string;
  cardId: string;
  pulledAt: number;
  isFlipped?: boolean;
}

export interface StackedCollectionItem {
  card: CardDefinition;
  count: number;
  firstPulledAt: number;
  lastPulledAt: number;
  instances: PulledCard[];
}
