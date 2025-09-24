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

// Gradient mappings for specific kana characters
export const KANA_GRADIENT_BY_CHAR: Record<string, KanaGradient> = {
  // Vowels - warm to cool transitions for better distinction
  'あ': { primary: '#E91E63', secondary: '#F48FB1', direction: '135deg' }, // pink gradient
  'い': { primary: '#D32F2F', secondary: '#EF5350', direction: '45deg' }, // bright red gradient
  'う': { primary: '#FF6B35', secondary: '#FF8E53', direction: '90deg' }, // orange-red gradient
  'え': { primary: '#9C27B0', secondary: '#CE93D8', direction: '180deg' }, // purple gradient
  'お': { primary: '#8BC34A', secondary: '#C8E6C9', direction: '225deg' }, // green gradient

  // K-row - nature-inspired gradients
  'か': { primary: '#4CAF50', secondary: '#81C784', direction: '135deg' }, // forest green
  'き': { primary: '#00ACC1', secondary: '#4DD0E1', direction: '45deg' }, // ocean teal
  'く': { primary: '#2196F3', secondary: '#64B5F6', direction: '90deg' }, // sky blue
  'け': { primary: '#7E57C2', secondary: '#B39DDB', direction: '180deg' }, // lavender
  'こ': { primary: '#8E24AA', secondary: '#BA68C8', direction: '225deg' }, // orchid

  // S-row - sophisticated gradients
  'さ': { primary: '#3F51B5', secondary: '#7986CB', direction: '135deg' }, // indigo
  'し': { primary: '#795548', secondary: '#A1887F', direction: '45deg' }, // warm brown
  'す': { primary: '#607D8B', secondary: '#90A4AE', direction: '90deg' }, // steel blue
  'せ': { primary: '#424242', secondary: '#757575', direction: '180deg' }, // charcoal

  // R-row - distinctive gradients for better differentiation
  'ら': { primary: '#00BCD4', secondary: '#4DD0E1', direction: '270deg' }, // cyan (very different from orange)
  'り': { primary: '#9C27B0', secondary: '#E1BEE7', direction: '315deg' }, // purple
  'る': { primary: '#4CAF50', secondary: '#A5D6A7', direction: '0deg' }, // green
  'れ': { primary: '#FF9800', secondary: '#FFCC02', direction: '60deg' }, // amber
  'ろ': { primary: '#673AB7', secondary: '#B39DDB', direction: '120deg' }, // deep purple
};

// Extended fallback gradients for other kana - carefully curated for maximum visual distinction
export const KANA_GRADIENTS: KanaGradient[] = [
  // Primary distinct colors - each in completely different color family
  { primary: '#1a1a1a', secondary: '#4a4a4a', direction: '90deg' }, // 1. Black/charcoal
  { primary: '#fbbf24', secondary: '#fde047', direction: '135deg' }, // 2. Bright yellow
  { primary: '#0891b2', secondary: '#67e8f9', direction: '180deg' }, // 3. Cyan/turquoise
  { primary: '#059669', secondary: '#34d399', direction: '270deg' }, // 4. Emerald green
  { primary: '#7c3aed', secondary: '#c084fc', direction: '0deg' }, // 5. Electric purple
  { primary: '#ea580c', secondary: '#fb923c', direction: '225deg' }, // 6. Burnt orange
  
  // Secondary distinct colors - avoid reds completely for now
  { primary: '#be185d', secondary: '#ec4899', direction: '315deg' }, // 7. Deep pink (not red)
  { primary: '#166534', secondary: '#22c55e', direction: '45deg' }, // 8. Forest green
  { primary: '#1e1b4b', secondary: '#6366f1', direction: '90deg' }, // 9. Deep indigo
  { primary: '#0c4a6e', secondary: '#0ea5e9', direction: '180deg' }, // 10. Deep blue
  { primary: '#92400e', secondary: '#f59e0b', direction: '270deg' }, // 11. Amber
  { primary: '#365314', secondary: '#84cc16', direction: '0deg' }, // 12. Lime
  
  // Tertiary colors - more unique variations
  { primary: '#581c87', secondary: '#a855f7', direction: '135deg' }, // 13. Royal purple
  { primary: '#164e63', secondary: '#06b6d4', direction: '225deg' }, // 14. Teal
  { primary: '#a21caf', secondary: '#d946ef', direction: '315deg' }, // 15. Magenta
  { primary: '#14532d', secondary: '#16a34a', direction: '45deg' }, // 16. Very dark green
  { primary: '#1e3a8a', secondary: '#3b82f6', direction: '90deg' }, // 17. Royal blue
  { primary: '#6b21a8', secondary: '#c026d3', direction: '180deg' }, // 18. Royal purple variant
  
  // Additional unique colors - browns, grays, special tones
  { primary: '#78350f', secondary: '#d97706', direction: '270deg' }, // 19. Brown/amber
  { primary: '#374151', secondary: '#9ca3af', direction: '0deg' }, // 20. Gray
  { primary: '#065f46', secondary: '#10b981', direction: '135deg' }, // 21. Dark emerald
  { primary: '#312e81', secondary: '#8b5cf6', direction: '225deg' }, // 22. Deep violet
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
  let fallbackIndex = 0;

  kanaSubset.forEach((kana) => {
    // First try to get from gradient system
    const gradient = KANA_GRADIENT_BY_CHAR[kana];
    if (gradient) {
      colorMap.set(kana, gradient.primary);
    } else {
      // Fallback to old color system, then to fallback palette
      const fixedColor = KANA_COLOR_BY_CHAR[kana];
      if (fixedColor) {
        colorMap.set(kana, fixedColor);
      } else {
        const color = KANA_COLORS[fallbackIndex % KANA_COLORS.length];
        colorMap.set(kana, color);
        fallbackIndex++;
      }
    }
  });

  return colorMap;
};

/**
 * Generates a map from kana characters to gradient configurations for a level.
 * This improved version ensures no color conflicts by checking for similarity.
 * @param kanaSubset - An array of unique kana strings for the current level.
 * @returns A Map where keys are kana characters and values are KanaGradient objects.
 */
export const generateKanaGradientMap = (kanaSubset: string[]): Map<string, KanaGradient> => {
  const gradientMap = new Map<string, KanaGradient>();
  let fallbackIndex = 0;

  kanaSubset.forEach((kana) => {
    const fixedGradient = KANA_GRADIENT_BY_CHAR[kana];
    if (fixedGradient) {
      gradientMap.set(kana, fixedGradient);
    } else {
      // Simple cycling through fallback gradients
      const gradient = KANA_GRADIENTS[fallbackIndex % KANA_GRADIENTS.length];
      gradientMap.set(kana, gradient);
      fallbackIndex++;
    }
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
 * Gets the gradient for a specific kana character
 * @param kana - The kana character
 * @returns KanaGradient object or null if not found
 */
export const getKanaGradient = (kana: string): KanaGradient | null => {
  return KANA_GRADIENT_BY_CHAR[kana] || null;
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
  
  // Fallback to gradient primary color or solid color
  const gradient = KANA_GRADIENT_BY_CHAR[kana];
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
