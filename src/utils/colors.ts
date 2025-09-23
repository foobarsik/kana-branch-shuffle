// Fixed color mapping by kana character, based on the provided design reference.
// Vowels (あいうえお) and K/S rows (かきくけこ ・ さしすせ)
// Colors are chosen to match the sample as close as possible.
export const KANA_COLOR_BY_CHAR: Record<string, string> = {
  // Vowels
  'あ': '#E91E63', // pink/magenta
  'い': '#FF5722', // deep orange
  'う': '#F4B400', // orange
  'え': '#9C27B0', // deep purple
  'お': '#8BC34A', // light green

  // K-row
  'か': '#4CAF50', // green
  'き': '#00ACC1', // teal
  'く': '#2196F3', // blue
  'け': '#7E57C2', // violet
  'こ': '#8E24AA', // purple

  // S-row
  'さ': '#3F51B5', // indigo/blue
  'し': '#795548', // brown
  'す': '#607D8B', // blue gray
  'せ': '#424242', // dark gray
  // 'そ' is not shown in the reference; fallback palette will be used
};

// Fallback palette for kana that are not explicitly specified above
export const KANA_COLORS = [
  '#ff6b6b', // red
  '#f06595', // pink
  '#cc5de8', // grape
  '#845ef7', // violet
  '#5c7cfa', // indigo
  '#339af0', // blue
  '#22b8cf', // cyan
  '#20c997', // teal
  '#51cf66', // green
  '#94d82d', // lime
  '#fcc419', // yellow
  '#ff922b', // orange
];

/**
 * Generates a map from kana characters to specific colors for a level.
 * @param kanaSubset - An array of unique kana strings for the current level.
 * @returns A Map where keys are kana characters and values are hex color strings.
 */
export const generateKanaColorMap = (kanaSubset: string[]): Map<string, string> => {
  const colorMap = new Map<string, string>();
  let fallbackIndex = 0;

  kanaSubset.forEach((kana) => {
    const fixed = KANA_COLOR_BY_CHAR[kana];
    if (fixed) {
      colorMap.set(kana, fixed);
    } else {
      // Cycle through fallback palette for unspecified kana
      const color = KANA_COLORS[fallbackIndex % KANA_COLORS.length];
      colorMap.set(kana, color);
      fallbackIndex++;
    }
  });

  return colorMap;
};
