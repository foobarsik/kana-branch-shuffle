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

// Gradient system for enhanced kana differentiation
export interface KanaGradient {
  primary: string;
  secondary: string;
  direction?: string;
}

export const GAME_GRADIENTS: KanaGradient[] = [
  { primary: '#f44336', secondary: '#f44336', direction: '45deg' },   // 2. Красный
  { primary: '#ff9800', secondary: '#ff9800', direction: '45deg' },   // 3. Оранжевый
  // { primary: '#ffeb3b', secondary: '#ffeb3b', direction: '45deg' },   // 4. Желтый
  { primary: '#8bc34a', secondary: '#8bc34a', direction: '45deg' },   // 5. Салатовый
  { primary: '#4caf50', secondary: '#4caf50', direction: '45deg' },   // 6. Зеленый
  { primary: '#00acc1', secondary: '#00acc1', direction: '45deg' },   // 7. Бирюзовый
  { primary: '#2196f3', secondary: '#2196f3', direction: '45deg' },   // 8. Синий
  { primary: '#673ab7', secondary: '#673ab7', direction: '45deg' },   // 9. Фиолетовый
  { primary: '#9c27b0', secondary: '#9c27b0', direction: '45deg' },   // 10. Малиновый
  { primary: '#3f51b5', secondary: '#3f51b5', direction: '45deg' },   // 11. Темно-синий
  { primary: '#795548', secondary: '#795548', direction: '45deg' },   // 12. Коричневый
  { primary: '#607d8b', secondary: '#607d8b', direction: '45deg' },   // 13. Серо-синий
  { primary: '#424242', secondary: '#424242', direction: '45deg' },   // 14. Серый
];

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
 * Generates a CSS linear gradient string from a KanaGradient object
 * @param gradient - The gradient configuration
 * @returns CSS linear-gradient string
 */
export const generateLinearGradient = (gradient: KanaGradient): string => {
  const direction = gradient.direction || '135deg';
  return `linear-gradient(${direction}, ${gradient.primary}, ${gradient.secondary})`;
};

/**
 * Generates a CSS radial gradient string from a KanaGradient object
 * @param gradient - The gradient configuration
 * @returns CSS radial-gradient string
 */
export const generateRadialGradient = (gradient: KanaGradient): string => {
  return `radial-gradient(circle, ${gradient.primary}, ${gradient.secondary})`;
};

/**
 * Generates a map from kana characters to CSS gradient strings for a level.
 * This function now uses gradients by default for better visual distinction.
 * @param kanaSubset - An array of unique kana strings for the current level.
 * @param gradientType - Type of gradient: 'linear' or 'radial' (default: 'linear')
 * @returns A Map where keys are kana characters and values are CSS gradient strings.
 */
export const generateKanaColorMap = (
  kanaSubset: string[], 
  gradientType: 'linear' | 'radial' = 'linear'
): Map<string, string> => {
  // Use the gradient-based function instead
  return generateKanaGradientCSSMap(kanaSubset, gradientType);
};

/**
 * Generates a map from kana characters to primary colors (for backward compatibility).
 * @param kanaSubset - An array of unique kana strings for the current level.
 * @returns A Map where keys are kana characters and values are primary hex color strings.
 */
export const generateKanaPrimaryColorMap = (kanaSubset: string[]): Map<string, string> => {
  const colorMap = new Map<string, string>();
  
  // Get gradients using the new system and extract primary colors
  const gradientMap = generateKanaGradientMap(kanaSubset);
  
  gradientMap.forEach((gradient, kana) => {
    colorMap.set(kana, gradient.primary);
  });

  return colorMap;
};

/**
 * Simple seeded random number generator for consistent color assignment
 */
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

/**
 * Generates a map from kana characters to gradient configurations for a level.
 * NEW APPROACH: Randomly assigns unique gradients from the full palette for each game.
 * Uses a seed based on kana combination for consistency within the same level.
 * @param kanaSubset - An array of unique kana strings for the current level.
 * @returns A Map where keys are kana characters and values are KanaGradient objects.
 */
export const generateKanaGradientMap = (kanaSubset: string[]): Map<string, KanaGradient> => {
  const gradientMap = new Map<string, KanaGradient>();
  
  // Create a seed based on the kana combination for consistent results
  const seed = kanaSubset.join('').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Use the optimized set of 15 maximally distinct gradients
  const availableGradients = GAME_GRADIENTS;
  
  // Shuffle the gradients using seeded random for consistent results
  const shuffledGradients = [...availableGradients].sort((a, b) => {
    const randomA = seededRandom(seed + availableGradients.indexOf(a));
    const randomB = seededRandom(seed + availableGradients.indexOf(b));
    return randomA - randomB;
  });
  
  // Assign gradients to kana characters
  kanaSubset.forEach((kana, index) => {
    // Use modulo to cycle through if we have more kana than gradients (unlikely with 15 gradients for max 12 kana)
    const gradient = shuffledGradients[index % shuffledGradients.length];
    gradientMap.set(kana, gradient);
  });

  return gradientMap;
};

/**
 * Generates a map from kana characters to CSS gradient strings for a level.
 * @param kanaSubset - An array of unique kana strings for the current level.
 * @param gradientType - Type of gradient: 'linear' or 'radial'
 * @returns A Map where keys are kana characters and values are CSS gradient strings.
 */
export const generateKanaGradientCSSMap = (
  kanaSubset: string[], 
  gradientType: 'linear' | 'radial' = 'linear'
): Map<string, string> => {
  const gradientMap = generateKanaGradientMap(kanaSubset);
  const cssMap = new Map<string, string>();

  gradientMap.forEach((gradient, kana) => {
    const cssGradient = gradientType === 'radial' 
      ? generateRadialGradient(gradient)
      : generateLinearGradient(gradient);
    cssMap.set(kana, cssGradient);
  });

  return cssMap;
};

/**
 * Gets the gradient for a specific kana character from the game gradients
 * Note: With the new random system, this returns a random gradient from the pool
 * @param kana - The kana character
 * @returns KanaGradient object (randomly selected from game gradients)
 */
export const getKanaGradient = (kana: string): KanaGradient | null => {
  // With the new system, we can't get a specific gradient for a kana without context
  // Return the first gradient as a fallback, or null if you prefer
  return GAME_GRADIENTS[0] || null;
};

/**
 * Gets the CSS gradient string for a specific kana character
 * @param kana - The kana character
 * @param gradientType - Type of gradient: 'linear' or 'radial'
 * @returns CSS gradient string or null if not found
 */
export const getKanaGradientCSS = (kana: string, gradientType: 'linear' | 'radial' = 'linear'): string | null => {
  const gradient = getKanaGradient(kana);
  if (!gradient) return null;

  return gradientType === 'radial' 
    ? generateRadialGradient(gradient)
    : generateLinearGradient(gradient);
};

/**
 * Creates a custom gradient with specified colors and direction
 * @param primary - Primary color (hex)
 * @param secondary - Secondary color (hex)
 * @param direction - Gradient direction (default: '135deg')
 * @returns KanaGradient object
 */
export const createCustomGradient = (
  primary: string, 
  secondary: string, 
  direction: string = '135deg'
): KanaGradient => {
  return { primary, secondary, direction };
};

/**
 * Generates contrasting text color (black or white) based on gradient primary color
 * @param gradient - The gradient configuration
 * @returns 'black' or 'white' for optimal contrast
 */
export const getContrastingTextColor = (gradient: KanaGradient): 'black' | 'white' => {
  // Convert hex to RGB
  const hex = gradient.primary.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return contrasting color
  return luminance > 0.5 ? 'black' : 'white';
};

/**
 * Generates a lighter version of a gradient for hover effects
 * @param gradient - The original gradient
 * @param lightenFactor - How much to lighten (0-1, default: 0.2)
 * @returns New KanaGradient with lightened colors
 */
export const lightenGradient = (gradient: KanaGradient, lightenFactor: number = 0.2): KanaGradient => {
  const lightenColor = (hex: string, factor: number): string => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * factor * 100);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  return {
    primary: lightenColor(gradient.primary, lightenFactor),
    secondary: lightenColor(gradient.secondary, lightenFactor),
    direction: gradient.direction
  };
};

/**
 * Generates a darker version of a gradient for active/pressed effects
 * @param gradient - The original gradient
 * @param darkenFactor - How much to darken (0-1, default: 0.2)
 * @returns New KanaGradient with darkened colors
 */
export const darkenGradient = (gradient: KanaGradient, darkenFactor: number = 0.2): KanaGradient => {
  const darkenColor = (hex: string, factor: number): string => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * factor * 100);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    
    return '#' + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
  };

  return {
    primary: darkenColor(gradient.primary, darkenFactor),
    secondary: darkenColor(gradient.secondary, darkenFactor),
    direction: gradient.direction
  };
};

/**
 * Checks if a color string is a CSS gradient
 * @param color - Color string to check
 * @returns true if it's a gradient, false if it's a solid color
 */
export const isGradient = (color: string): boolean => {
  return color.includes('gradient(');
};

/**
 * Extracts the primary color from a gradient or returns the color as-is if it's solid
 * @param color - Color string (gradient or solid)
 * @returns Primary color as hex string
 */
export const extractPrimaryColor = (color: string): string => {
  if (isGradient(color)) {
    // Extract first color from gradient string
    const match = color.match(/#[0-9a-fA-F]{6}/);
    return match ? match[0] : '#000000';
  }
  return color;
};

/**
 * Gets color for a kana character, preferring gradients but falling back to solid colors
 * @param kana - The kana character
 * @param useGradient - Whether to use gradient (default: true)
 * @param gradientType - Type of gradient if using gradients
 * @returns Color string (gradient or solid)
 */
export const getKanaColor = (
  kana: string, 
  useGradient: boolean = true,
  gradientType: 'linear' | 'radial' = 'linear'
): string => {
  if (useGradient) {
    const gradientCSS = getKanaGradientCSS(kana, gradientType);
    if (gradientCSS) return gradientCSS;
  }
  
  // Fallback to first game gradient or solid color
  const gradient = GAME_GRADIENTS[0];
  if (gradient) return gradient.primary;
  
  const solidColor = KANA_COLOR_BY_CHAR[kana];
  if (solidColor) return solidColor;
  
  // Final fallback
  return KANA_COLORS[0];
};

/**
 * Converts the old color system to use gradients while maintaining compatibility
 * @deprecated Use generateKanaColorMap instead, which now returns gradients by default
 */
export const generateKanaColorMapLegacy = generateKanaPrimaryColorMap;
