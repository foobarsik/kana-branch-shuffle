// A curated palette of visually distinct and pleasing colors for the kana tiles.
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
  kanaSubset.forEach((kana, index) => {
    // Cycle through the color palette if there are more kana than colors
    const color = KANA_COLORS[index % KANA_COLORS.length];
    colorMap.set(kana, color);
  });
  return colorMap;
};
