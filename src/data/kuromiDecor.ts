/**
 * PIXELATED KUROMI DECORATIONS CONFIGURATION
 * 
 * When publishing your website, you can add custom pixelated Kuromi images!
 * 
 * Instructions:
 * 1. Drop your pixelated Kuromi PNGs/GIFs into `public/decorations/kuromi/`
 * 2. Add their paths in the CUSTOM_KUROMI_DECORATIONS array below.
 * 3. The background will float your custom pixelated decorations seamlessly!
 * 
 * Note: High-detail built-in pixel-art Kuromi sprites are rendered by default
 * so the app looks stunning immediately even before custom files are added.
 */

export interface KuromiDecorationConfig {
  id: string;
  url: string;
  alt: string;
  scale?: number;
}

// Add paths to custom pixelated Kuromi files placed in public/decorations/kuromi/
export const CUSTOM_KUROMI_DECORATIONS: KuromiDecorationConfig[] = [
  // Example when you drop files into public/decorations/kuromi/:
  // { id: 'k1', url: '/decorations/kuromi/kuromi1.png', alt: 'Pixel Kuromi Wink', scale: 1 },
  // { id: 'k2', url: '/decorations/kuromi/kuromi2.png', alt: 'Pixel Kuromi Jester', scale: 1.1 },
  // { id: 'k3', url: '/decorations/kuromi/kuromi_skull.png', alt: 'Pixel Pink Skull', scale: 0.9 },
];

/**
 * Built-in crisp SVG pixel-art sprites for authentic Kuromi gothic-cute aesthetics.
 * Each sprite uses strict pixel grid geometry rendered with image-rendering: pixelated.
 */
export const BUILTIN_PIXEL_SPRITES = [
  {
    id: 'kuromi-classic',
    name: 'Kuromi Jester',
    size: 40,
    renderSvg: () => `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated;shape-rendering:crispEdges">
        <!-- Kuromi Jester Ears (Black & Purple) -->
        <rect x="2" y="1" width="3" height="4" fill="#1b1226"/>
        <rect x="1" y="4" width="4" height="4" fill="#2d1c3e"/>
        <rect x="19" y="1" width="3" height="4" fill="#1b1226"/>
        <rect x="19" y="4" width="4" height="4" fill="#2d1c3e"/>
        <!-- Pink Pom-poms on tips -->
        <rect x="2" y="0" width="3" height="2" fill="#ff70b8"/>
        <rect x="19" y="0" width="3" height="2" fill="#ff70b8"/>
        <!-- Main Head Base (Black hood) -->
        <rect x="5" y="4" width="14" height="13" fill="#1b1226" rx="2"/>
        <rect x="6" y="5" width="12" height="11" fill="#261738"/>
        <!-- White Face -->
        <rect x="7" y="9" width="10" height="7" fill="#ffffff" rx="1"/>
        <!-- Cheek blush -->
        <rect x="7" y="13" width="2" height="1" fill="#ff9ecb"/>
        <rect x="15" y="13" width="2" height="1" fill="#ff9ecb"/>
        <!-- Kuromi Eyes (Mischievous oval eyes) -->
        <rect x="8" y="11" width="2" height="3" fill="#1b1226"/>
        <rect x="14" y="11" width="2" height="3" fill="#1b1226"/>
        <rect x="9" y="11" width="1" height="1" fill="#ffffff"/>
        <rect x="15" y="11" width="1" height="1" fill="#ffffff"/>
        <!-- Nose/Mouth -->
        <rect x="11" y="13" width="2" height="1" fill="#1b1226"/>
        <!-- Iconic Pink Skull on Hood -->
        <rect x="10" y="5" width="4" height="3" fill="#ff69b4"/>
        <rect x="11" y="8" width="2" height="1" fill="#ff69b4"/>
        <!-- Skull Eyes -->
        <rect x="10" y="6" width="1" height="1" fill="#1b1226"/>
        <rect x="13" y="6" width="1" height="1" fill="#1b1226"/>
        <!-- Jester Collar / Ruffle -->
        <rect x="6" y="17" width="12" height="2" fill="#3b2052"/>
        <rect x="8" y="18" width="2" height="2" fill="#ff69b4"/>
        <rect x="11" y="18" width="2" height="2" fill="#ff69b4"/>
        <rect x="14" y="18" width="2" height="2" fill="#ff69b4"/>
      </svg>
    `
  },
  {
    id: 'kuromi-skull-pink',
    name: 'Kuromi Pink Skull',
    size: 32,
    renderSvg: () => `
      <svg width="36" height="36" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated;shape-rendering:crispEdges">
        <!-- Skull Crown -->
        <rect x="5" y="2" width="8" height="2" fill="#ff72be"/>
        <rect x="3" y="4" width="12" height="6" fill="#ff72be"/>
        <!-- Skull Jaw -->
        <rect x="5" y="10" width="8" height="4" fill="#ff72be"/>
        <!-- Skull Eye Sockets -->
        <rect x="5" y="6" width="2" height="3" fill="#241031"/>
        <rect x="11" y="6" width="2" height="3" fill="#241031"/>
        <!-- Heart Nose -->
        <rect x="8" y="8" width="2" height="1" fill="#241031"/>
        <!-- Teeth / Crossbones subtle -->
        <rect x="6" y="12" width="1" height="2" fill="#241031"/>
        <rect x="8" y="12" width="2" height="2" fill="#241031"/>
        <rect x="11" y="12" width="1" height="2" fill="#241031"/>
        <!-- Highlight -->
        <rect x="4" y="4" width="2" height="2" fill="#ffd1ec"/>
      </svg>
    `
  },
  {
    id: 'kuromi-pixel-bat',
    name: 'Midnight Pixel Bat',
    size: 36,
    renderSvg: () => `
      <svg width="40" height="24" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated;shape-rendering:crispEdges">
        <!-- Wing Left -->
        <rect x="1" y="2" width="2" height="3" fill="#753d88"/>
        <rect x="3" y="1" width="3" height="5" fill="#4f275e"/>
        <rect x="6" y="3" width="2" height="5" fill="#2f143a"/>
        <!-- Wing Right -->
        <rect x="17" y="2" width="2" height="3" fill="#753d88"/>
        <rect x="14" y="1" width="3" height="5" fill="#4f275e"/>
        <rect x="12" y="3" width="2" height="5" fill="#2f143a"/>
        <!-- Center Body -->
        <rect x="8" y="3" width="4" height="6" fill="#1e0c26"/>
        <!-- Bat Ears -->
        <rect x="8" y="1" width="1" height="2" fill="#ff72be"/>
        <rect x="11" y="1" width="1" height="2" fill="#ff72be"/>
        <!-- Bat Eyes (Pink) -->
        <rect x="9" y="4" width="1" height="1" fill="#ff85cb"/>
        <rect x="10" y="4" width="1" height="1" fill="#ff85cb"/>
      </svg>
    `
  },
  {
    id: 'kuromi-goth-heart',
    name: 'Pixel Velvet Heart',
    size: 28,
    renderSvg: () => `
      <svg width="30" height="30" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated;shape-rendering:crispEdges">
        <rect x="2" y="3" width="4" height="2" fill="#ff6bb5"/>
        <rect x="9" y="3" width="4" height="2" fill="#ff6bb5"/>
        <rect x="1" y="5" width="13" height="4" fill="#f05b9b"/>
        <rect x="2" y="9" width="11" height="2" fill="#bd3876"/>
        <rect x="4" y="11" width="7" height="2" fill="#882253"/>
        <rect x="6" y="13" width="3" height="1" fill="#521332"/>
        <!-- Inner Pixel Highlight -->
        <rect x="3" y="4" width="2" height="2" fill="#ffe1f1"/>
      </svg>
    `
  },
  {
    id: 'kuromi-pixel-ribbon',
    name: 'Pixel Dark Ribbon',
    size: 32,
    renderSvg: () => `
      <svg width="34" height="30" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated;shape-rendering:crispEdges">
        <!-- Bow Center Knot -->
        <rect x="7" y="5" width="3" height="3" fill="#ff72be"/>
        <rect x="8" y="6" width="1" height="1" fill="#ffffff"/>
        <!-- Bow Left Loop -->
        <rect x="2" y="3" width="5" height="7" fill="#301844"/>
        <rect x="3" y="4" width="3" height="5" fill="#542c75"/>
        <!-- Bow Right Loop -->
        <rect x="10" y="3" width="5" height="7" fill="#301844"/>
        <rect x="11" y="4" width="3" height="5" fill="#542c75"/>
        <!-- Ribbons hanging down -->
        <rect x="4" y="10" width="3" height="4" fill="#ff72be"/>
        <rect x="10" y="10" width="3" height="4" fill="#ff72be"/>
      </svg>
    `
  }
];
