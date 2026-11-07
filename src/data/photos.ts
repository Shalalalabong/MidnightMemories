/**
 * PHOTO CONFIGURATION FOR ALL 24 INDIVIDUAL CARDS
 * 
 * Instructions for Publishing:
 * 1. Place your photos inside the `public/photos/` folder.
 * 2. You can name them `card1.jpg` through `card24.jpg` (or .png / .webp),
 *    OR customize the exact file path for each card in the map below!
 * 3. If a photo is not added yet, the card automatically displays its aesthetic midnight theme art.
 */

export interface CardPhotoMapping {
  cardIndex: number; // 1 to 24
  cardId: string;
  photoUrl: string;
  notes?: string;
}

// 📸 Direct mapping for all 24 individual cards:
export const CARD_PHOTO_MAPPINGS: Record<number, string> = {
  1: '/photos/card1.jpg',   // Card 001/024
  2: '/photos/card2.jpg',   // Card 002/024
  3: '/photos/card3.jpg',   // Card 003/024
  4: '/photos/card4.jpg',   // Card 004/024
  5: '/photos/card5.jpg',   // Card 005/024
  6: '/photos/card6.jpg',   // Card 006/024
  7: '/photos/card7.jpg',   // Card 007/024
  8: '/photos/card8.jpg',   // Card 008/024
  9: '/photos/card9.jpg',   // Card 009/024
  10: '/photos/card10.jpg', // Card 010/024
  11: '/photos/card11.jpg', // Card 011/024
  12: '/photos/card12.jpg', // Card 012/024
  13: '/photos/card13.jpg', // Card 013/024
  14: '/photos/card14.jpg', // Card 014/024
  15: '/photos/card15.jpg', // Card 015/024
  16: '/photos/card16.jpg', // Card 016/024
  17: '/photos/card17.jpg', // Card 017/024
  18: '/photos/card18.jpg', // Card 018/024
  19: '/photos/card19.jpg', // Card 019/024
  20: '/photos/card20.jpg', // Card 020/024
  21: '/photos/card21.jpg', // Card 021/024 ★ (Secret Rare)
  22: '/photos/card22.jpg', // Card 022/024 ★ (Secret Rare)
  23: '/photos/card23.jpg', // Card 023/024 ★ (Secret Rare)
  24: '/photos/card24.jpg', // Card 024/024 ★ (Secret Rare)
};

/**
 * Helper to get the assigned photo URL for a card index (1 to 24).
 * Auto-adapts base path for GitHub Pages subfolder hosting.
 */
export function getPhotoForCard(cardIndex: number, explicitPath?: string): string | null {
  const rawPath = explicitPath || CARD_PHOTO_MAPPINGS[cardIndex] || null;
  if (!rawPath) return null;

  // Adapt for GitHub Pages subdirectories if deployed to username.github.io/repo/
  if (rawPath.startsWith('/') && typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) {
    const base = import.meta.env.BASE_URL.endsWith('/')
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;
    return `${base}${rawPath.slice(1)}`;
  }
  return rawPath;
}
