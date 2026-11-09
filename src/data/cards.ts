import { CardDefinition, CardRarity, CardRarityKey } from '../types';

export const RARITY_CONFIG: Record<CardRarityKey, CardRarity> = {
  common: {
    key: 'common',
    name: 'COMMON',
    weight: 25,
    color: '#d4b3df',
    badgeBg: 'rgba(212, 179, 223, 0.18)',
    foilType: 'none',
  },
  uncommon: {
    key: 'uncommon',
    name: 'UNCOMMON',
    weight: 28,
    color: '#8fe1d9',
    badgeBg: 'rgba(143, 225, 217, 0.2)',
    foilType: 'silver',
  },
  rare: {
    key: 'rare',
    name: 'RARE',
    weight: 20,
    color: '#8cb7ff',
    badgeBg: 'rgba(140, 183, 255, 0.22)',
    foilType: 'starlight',
  },
  epic: {
    key: 'epic',
    name: 'EPIC',
    weight: 18,
    color: '#db82ff',
    badgeBg: 'rgba(219, 130, 255, 0.25)',
    foilType: 'amethyst',
  },
  legendary: {
    key: 'legendary',
    name: 'LEGENDARY',
    weight: 12,
    color: '#ffd066',
    badgeBg: 'rgba(255, 208, 102, 0.28)',
    foilType: 'gold',
  },
  secret: {
    key: 'secret',
    name: 'SECRET RARE',
    weight: 0, // 1 guaranteed per booster pack
    color: '#ff85d5',
    badgeBg: 'rgba(255, 133, 213, 0.32)',
    foilType: 'cosmic-rainbow',
  },
};

/**
 * 24 CARDS DATABASE
 * You can rename any card directly here in the `title` field,
 * or rename it dynamically via the in-app card customizer in the binder!
 * 
 * Note: Secret Rares are configured with the caption "HAPPY BIRTHDAY RAYYA!"
 */
export const CARD_DATABASE: CardDefinition[] = [
  // Card 24: Secret Rare
  {
    id: 'card-24',
    cardIndex: 24,
    cardNumber: '024/024 ★',
    title: 'Heavenly Light',
    subtitle: 'Midnight Starlight Crown',
    rarity: 'secret',
    aestheticStats: { charm: 99, aura: 100, mystery: 98 },
    flavorText: 'Beneath the velvet heavens, every shadow bows to the starlight sovereign.',
    defaultArtTheme: 'crown',
    photoPath: '/photos/card24.jpg',
    customCaption: 'HAPPY BIRTHDAY RAYYA!',
  },
  // Card 23: Secret Rare
  {
    id: 'card-23',
    cardIndex: 23,
    cardNumber: '023/024 ★',
    title: 'Crimson Beauty',
    subtitle: 'Cosmic Singularity',
    rarity: 'secret',
    aestheticStats: { charm: 98, aura: 99, mystery: 100 },
    flavorText: 'When the sun rests, the universe weaves its rarest masterpiece.',
    defaultArtTheme: 'constellation',
    photoPath: '/photos/card23.jpg',
    customCaption: 'HAPPY BIRTHDAY RAYYA!',
  },
  // Card 22: Secret Rare
  {
    id: 'card-22',
    cardIndex: 22,
    cardNumber: '022/024 ★',
    title: 'Natural Niveous',
    subtitle: 'Celestial Radiance',
    rarity: 'secret',
    aestheticStats: { charm: 100, aura: 97, mystery: 99 },
    flavorText: 'A constellation in human form, radiating pure stardust.',
    defaultArtTheme: 'stars',
    photoPath: '/photos/card22.jpg',
    customCaption: 'HAPPY BIRTHDAY RAYYA!',
  },
  // Card 21: Secret Rare
  {
    id: 'card-21',
    cardIndex: 21,
    cardNumber: '021/024 ★',
    title: 'Ocean Angel',
    subtitle: 'Timeless Silhouette',
    rarity: 'secret',
    aestheticStats: { charm: 97, aura: 98, mystery: 99 },
    flavorText: 'An endless night painted with memories that never fade.',
    defaultArtTheme: 'veil',
    photoPath: '/photos/card21.jpg',
    customCaption: 'HAPPY BIRTHDAY RAYYA!',
  },

  // Card 20: Legendary
  {
    id: 'card-20',
    cardIndex: 20,
    cardNumber: '020/024',
    title: 'Siren',
    subtitle: 'Smile of a Queen',
    rarity: 'legendary',
    aestheticStats: { charm: 95, aura: 96, mystery: 94 },
    flavorText: 'Woven from falling meteors and ancient starlight.',
    defaultArtTheme: 'crown',
    photoPath: '/photos/card20.jpg',
  },
  // Card 19: Legendary
  {
    id: 'card-19',
    cardIndex: 19,
    cardNumber: '019/024',
    title: 'UNIFORM',
    subtitle: 'Diligency Runs in Her Blood',
    rarity: 'legendary',
    aestheticStats: { charm: 96, aura: 95, mystery: 92 },
    flavorText: 'A brilliance so pure it turns darkness into silver spun gold.',
    defaultArtTheme: 'crystals',
    photoPath: '/photos/card19.jpg',
  },
  // Card 18: Legendary
  {
    id: 'card-18',
    cardIndex: 18,
    cardNumber: '018/024',
    title: 'Lunar Jealousy',
    subtitle: 'The Moon Wishes It Could Be You',
    rarity: 'legendary',
    aestheticStats: { charm: 94, aura: 95, mystery: 96 },
    flavorText: 'The calm quiet of 2 AM, when dreams take physical form.',
    defaultArtTheme: 'moon',
    photoPath: '/photos/card18.jpg',
  },
  // Card 17: Legendary
  {
    id: 'card-17',
    cardIndex: 17,
    cardNumber: '017/024',
    title: 'Spectacle Princess',
    subtitle: 'Spectacular Splendor~',
    rarity: 'legendary',
    aestheticStats: { charm: 93, aura: 94, mystery: 97 },
    flavorText: 'Gleaming like violet silk cast across the cosmos.',
    defaultArtTheme: 'mirror',
    photoPath: '/photos/card17.jpg',
  },

  // Card 16: Epic
  {
    id: 'card-16',
    cardIndex: 16,
    cardNumber: '016/024',
    title: 'Maroon Mesmerization',
    subtitle: 'Truly a Mesmerizing Sight',
    rarity: 'epic',
    aestheticStats: { charm: 91, aura: 92, mystery: 90 },
    flavorText: 'The boundary where purple dusk meets quiet infinity.',
    defaultArtTheme: 'constellation',
    photoPath: '/photos/card16.jpg',
  },
  // Card 15: Epic
  {
    id: 'card-15',
    cardIndex: 15,
    cardNumber: '015/024',
    title: 'Twilight Teal',
    subtitle: 'Pearlescent Princess~',
    rarity: 'epic',
    aestheticStats: { charm: 90, aura: 93, mystery: 92 },
    flavorText: 'A riddle murmured softly in the language of nightingales.',
    defaultArtTheme: 'butterfly',
    photoPath: '/photos/card15.jpg',
  },
  // Card 14: Epic
  {
    id: 'card-14',
    cardIndex: 14,
    cardNumber: '014/024',
    title: 'River',
    subtitle: 'As Deep As a River Goes~',
    rarity: 'epic',
    aestheticStats: { charm: 92, aura: 89, mystery: 91 },
    flavorText: 'Swirling clouds of amethyst dust glowing in deep space.',
    defaultArtTheme: 'crystals',
    photoPath: '/photos/card14.jpg',
  },
  // Card 13: Epic
  {
    id: 'card-13',
    cardIndex: 13,
    cardNumber: '013/024',
    title: 'Flora Queen',
    subtitle: 'Aura Bloom',
    rarity: 'epic',
    aestheticStats: { charm: 89, aura: 91, mystery: 93 },
    flavorText: 'Petals that only unfurl when illuminated by moonbeams.',
    defaultArtTheme: 'rose',
    photoPath: '/photos/card13.jpg',
  },

  // Card 12: Rare
  {
    id: 'card-12',
    cardIndex: 12,
    cardNumber: '012/024',
    title: 'Melancholy',
    subtitle: 'Warmest of The Warmest Smiles',
    rarity: 'rare',
    aestheticStats: { charm: 87, aura: 88, mystery: 89 },
    flavorText: 'Secrets shared with the crescent moon on quiet balconies.',
    defaultArtTheme: 'moon',
    photoPath: '/photos/card12.jpg',
  },
  // Card 11: Rare
  {
    id: 'card-11',
    cardIndex: 11,
    cardNumber: '011/024',
    title: 'Shy Beo',
    subtitle: 'Perfect Poser >:3',
    rarity: 'rare',
    aestheticStats: { charm: 88, aura: 86, mystery: 87 },
    flavorText: 'Every orbit is a pulse in the nocturnal symphony.',
    defaultArtTheme: 'stars',
    photoPath: '/photos/card11.jpg',
  },
  // Card 10: Rare
  {
    id: 'card-10',
    cardIndex: 10,
    cardNumber: '010/024',
    title: 'Huh?',
    subtitle: 'Confusion Is a Lifestyle Apparently',
    rarity: 'rare',
    aestheticStats: { charm: 86, aura: 87, mystery: 88 },
    flavorText: 'Peace found only when the world is completely asleep.',
    defaultArtTheme: 'crystals',
    photoPath: '/photos/card10.jpg',
  },
  // Card 9: Rare
  {
    id: 'card-9',
    cardIndex: 9,
    cardNumber: '009/024',
    title: 'Frowning Cutie',
    subtitle: 'Being Upset Is Cool When One Looks This Good',
    rarity: 'rare',
    aestheticStats: { charm: 89, aura: 85, mystery: 86 },
    flavorText: 'A brief moment of shadow kissed in pale lilac.',
    defaultArtTheme: 'veil',
    photoPath: '/photos/card9.jpg',
  },

  // Card 8: Uncommon
  {
    id: 'card-8',
    cardIndex: 8,
    cardNumber: '008/024',
    title: 'Daylight Wanderer',
    subtitle: 'Studious Wonderer Indeed',
    rarity: 'uncommon',
    aestheticStats: { charm: 84, aura: 83, mystery: 85 },
    flavorText: 'Drifting down quiet alleys lit only by silver neon.',
    defaultArtTheme: 'butterfly',
    photoPath: '/photos/card8.jpg',
  },
  // Card 7: Uncommon
  {
    id: 'card-7',
    cardIndex: 7,
    cardNumber: '007/024',
    title: 'Curiously Uninterested',
    subtitle: 'Mood.',
    rarity: 'uncommon',
    aestheticStats: { charm: 85, aura: 82, mystery: 84 },
    flavorText: 'An unmistakable outline framed against the starry dark.',
    defaultArtTheme: 'skull',
    photoPath: '/photos/card7.jpg',
  },
  // Card 6: Uncommon
  {
    id: 'card-6',
    cardIndex: 6,
    cardNumber: '006/024',
    title: 'Moonchild',
    subtitle: 'Very Chic~',
    rarity: 'uncommon',
    aestheticStats: { charm: 86, aura: 81, mystery: 82 },
    flavorText: 'Born of twilight, attuned to the gentle glow above.',
    defaultArtTheme: 'moon',
    photoPath: '/photos/card6.jpg',
  },
  // Card 5: Uncommon
  {
    id: 'card-5',
    cardIndex: 5,
    cardNumber: '005/024',
    title: 'Daydream',
    subtitle: 'Aesthetic Goddess',
    rarity: 'uncommon',
    aestheticStats: { charm: 83, aura: 84, mystery: 83 },
    flavorText: 'Even the darkest corners carry a trace of golden luster.',
    defaultArtTheme: 'rose',
    photoPath: '/photos/card5.jpg',
  },

  // Card 4: Common
  {
    id: 'card-4',
    cardIndex: 4,
    cardNumber: '004/024',
    title: 'Literally Beocat',
    subtitle: 'Smart Kitty',
    rarity: 'common',
    aestheticStats: { charm: 80, aura: 79, mystery: 81 },
    flavorText: 'The soft indigo haze that signals night has arrived.',
    defaultArtTheme: 'veil',
    photoPath: '/photos/card4.jpg',
  },
  // Card 3: Common
  {
    id: 'card-3',
    cardIndex: 3,
    cardNumber: '003/024',
    title: 'Freaky~',
    subtitle: 'Freaky Beo >:3',
    rarity: 'common',
    aestheticStats: { charm: 81, aura: 78, mystery: 80 },
    flavorText: 'Dim lamp glow echoing across cobblestones.',
    defaultArtTheme: 'stars',
    photoPath: '/photos/card3.jpg',
  },
  // Card 2: Common
  {
    id: 'card-2',
    cardIndex: 2,
    cardNumber: '002/024',
    title: 'Last Resort',
    subtitle: 'It is Exactly What It Looks Like',
    rarity: 'common',
    aestheticStats: { charm: 79, aura: 80, mystery: 79 },
    flavorText: 'Residual heat from a summer midnight dream.',
    defaultArtTheme: 'rose',
    photoPath: '/photos/card2.jpg',
  },
  // Card 1: Common
  {
    id: 'card-1',
    cardIndex: 1,
    cardNumber: '001/024',
    title: 'Labubu!',
    subtitle: 'LABUBU BEO!',
    rarity: 'common',
    aestheticStats: { charm: 80, aura: 79, mystery: 82 },
    flavorText: 'Circling peacefully while the resting earth sleeps.',
    defaultArtTheme: 'constellation',
    photoPath: '/photos/card1.jpg',
  },
];

/**
 * Generates a booster pack of 5 cards with 1 guaranteed Secret Rare,
 * shuffled into a random position.
 */
export function generateBoosterPack(): CardDefinition[] {
  const secretCards = CARD_DATABASE.filter((c) => c.rarity === 'secret');
  const normalPool = CARD_DATABASE.filter((c) => c.rarity !== 'secret');

  // 1 guaranteed Secret Rare
  const guaranteedSecret = secretCards[Math.floor(Math.random() * secretCards.length)];

  // 4 other cards based on weighted rarity selection
  const remainingCards: CardDefinition[] = [];
  const selectedIds = new Set<string>([guaranteedSecret.id]);

  for (let i = 0; i < 4; i++) {
    const roll = Math.random() * 100;
    let chosenRarity: CardRarityKey = 'common';
    let accum = 0;

    for (const [key, config] of Object.entries(RARITY_CONFIG)) {
      if (key === 'secret') continue;
      accum += config.weight;
      if (roll <= accum) {
        chosenRarity = key as CardRarityKey;
        break;
      }
    }

    let candidates = normalPool.filter((c) => c.rarity === chosenRarity && !selectedIds.has(c.id));
    if (candidates.length === 0) {
      candidates = normalPool.filter((c) => !selectedIds.has(c.id));
    }
    if (candidates.length === 0) {
      candidates = normalPool;
    }

    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    selectedIds.add(picked.id);
    remainingCards.push(picked);
  }

  // Combine and shuffle position so secret rare is placed unpredictably
  const fullPack = [guaranteedSecret, ...remainingCards];
  for (let i = fullPack.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [fullPack[i], fullPack[j]] = [fullPack[j], fullPack[i]];
  }

  return fullPack;
}
