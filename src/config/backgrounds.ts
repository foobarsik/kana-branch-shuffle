import { THEME_CLASSES, type ThemeClass } from "@/utils/themes";

export type BackgroundThemeId = ThemeClass;

export interface BackgroundThemeOption {
  id: BackgroundThemeId;
  label: string;
  // Optional description for future expansion
  description?: string;
}

// Human-friendly labels for existing CSS themes (see index.css body.sakura.theme-*)
export const BACKGROUND_THEMES: BackgroundThemeOption[] = [
  { id: "theme-dots", label: "Dots" },
  { id: "theme-grid", label: "Grid" },
  { id: "theme-stripes", label: "Stripes" },
  { id: "theme-ricepaper", label: "Rice Paper" },
  { id: "theme-mountains", label: "Mountains" },
  { id: "theme-branches", label: "Branches" },
  { id: "theme-waves", label: "Waves" },
  { id: "theme-geo", label: "Geometry" },
  { id: "theme-tsunami", label: "Tsunami" },
];

export const DEFAULT_BACKGROUND_THEME: BackgroundThemeId = "theme-waves";

export function isValidBackgroundTheme(id: string | null | undefined): id is BackgroundThemeId {
  return !!id && (THEME_CLASSES as readonly string[]).includes(id);
}
