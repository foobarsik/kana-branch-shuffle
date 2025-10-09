// Sakura theme helpers: per-level background theme selection

export const THEME_CLASSES = [
  'theme-dots',
  'theme-grid',
  'theme-stripes',
  'theme-ricepaper',
  'theme-mountains',
  'theme-branches',
  'theme-waves',
  'theme-geo',
  'theme-tsunami',
] as const;

export type ThemeClass = typeof THEME_CLASSES[number];

// Simple deterministic hash from a number (level) to index
function hashLevel(level: number): number {
  // xorshift-based small hash
  let x = (level | 0) ^ 0x9e3779b9;
  x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
  return Math.abs(x);
}

// ------------------------------
// Explicit mapping configuration
// ------------------------------
// Per-level hard overrides (exact level => theme)
const THEME_OVERRIDES: Record<number, ThemeClass> = {
  1:  'theme-waves',
  2:  'theme-geo',
  3:  'theme-grid',
  4:  'theme-mountains',
  5:  'theme-branches',
  6:  'theme-dots',
  7:  'theme-stripes',
  8:  'theme-geo',
  9:  'theme-ricepaper',
  10: 'theme-tsunami',
  11: 'theme-grid',
  12: 'theme-mountains',
  13: 'theme-branches',
  14: 'theme-dots',
  15: 'theme-stripes',
  16: 'theme-geo',
  17: 'theme-ricepaper',
};

// Range-based mapping was removed for simplicity; we use explicit overrides
// for known levels and deterministic fallback for others.

function pickDeterministicTheme(level: number): ThemeClass {
  const h = hashLevel(level);
  const idx = h % THEME_CLASSES.length;
  return THEME_CLASSES[idx];
}

export function getThemeForLevel(level: number): ThemeClass {
  if (THEME_OVERRIDES[level]) return THEME_OVERRIDES[level];
  return pickDeterministicTheme(level);
}

export function applyThemeForLevel(level: number, overrideTheme?: ThemeClass) {
  if (typeof document === 'undefined') return;
  const body = document.body;
  if (!body) return;

  // Ensure base sakura class exists
  body.classList.add('sakura');

  // Remove any previous theme-*
  THEME_CLASSES.forEach(tc => body.classList.remove(tc));
  // Remove previous level-* classes
  body.classList.forEach(c => { if (c.startsWith('level-')) body.classList.remove(c); });
  // Manage boost class
  body.classList.remove('theme-boost');

  // Apply new
  const theme = overrideTheme ?? getThemeForLevel(level);
  body.classList.add(theme);
  body.setAttribute('data-theme', theme);
  if (overrideTheme) {
    body.classList.add('theme-boost');
  }
  // Add level marker for CSS targeting
  const levelClass = `level-${level}`;
  body.classList.add(levelClass);
  body.setAttribute('data-level', String(level));
  if (typeof window !== 'undefined' && typeof window.console !== 'undefined') {
    window.console.log('[Theme]', { level, theme, bodyClass: body.className });
  }
}

// ------------------------------
// Admin helpers (optional)
// ------------------------------
export function setThemeOverride(level: number, theme: ThemeClass) {
  THEME_OVERRIDES[level] = theme;
}

export function clearThemeOverride(level: number) {
  delete THEME_OVERRIDES[level];
}

// setThemeRanges removed; ranges no longer used
