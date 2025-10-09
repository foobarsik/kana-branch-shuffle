import * as React from "react";
import { DEFAULT_BACKGROUND_THEME, type BackgroundThemeId, isValidBackgroundTheme } from "@/config/backgrounds";

const STORAGE_KEY = "kana:userSettings";
const UPDATE_EVENT = "userSettings:updated";

export interface UserSettings {
  backgroundTheme: BackgroundThemeId | null; // null means follow per-level theme
  useKanaSvgBg: boolean; // enable kana svg background texture on tiles
  kanaTextureStrength: number; // 0..1 opacity multiplier for svg tint
  kanaTextureBlend: 'multiply' | 'overlay' | 'soft-light'; // blend mode for svg tint
}

const defaultSettings: UserSettings = {
  backgroundTheme: null,
  useKanaSvgBg: false,
  kanaTextureStrength: 1,
  kanaTextureBlend: 'multiply',
};

function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as Partial<UserSettings>;
    const backgroundTheme = parsed.backgroundTheme;
    const useKanaSvgBg = typeof parsed.useKanaSvgBg === 'boolean' ? parsed.useKanaSvgBg : true;
    const kanaTextureStrength = typeof parsed.kanaTextureStrength === 'number' ? Math.max(0, Math.min(1, parsed.kanaTextureStrength)) : defaultSettings.kanaTextureStrength;
    const kanaTextureBlend = (parsed.kanaTextureBlend as UserSettings['kanaTextureBlend']) ?? defaultSettings.kanaTextureBlend;
    return {
      backgroundTheme: isValidBackgroundTheme(backgroundTheme) ? backgroundTheme : null,
      useKanaSvgBg,
      kanaTextureStrength,
      kanaTextureBlend,
    };
  } catch {
    return defaultSettings;
  }
}

function saveSettings(s: UserSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // noop: ignore storage errors (e.g., private mode)
  }
  // Notify other hook instances within this tab
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
    } catch {
      // noop: ignore dispatch errors
    }
  }
}

export function useUserSettings() {
  const [settings, setSettings] = React.useState<UserSettings>(() => loadSettings());

  const setBackgroundTheme = React.useCallback((id: BackgroundThemeId | null) => {
    setSettings(prev => {
      const next = { ...prev, backgroundTheme: id };
      saveSettings(next);
      return next;
    });
  }, []);

  const setUseKanaSvgBg = React.useCallback((val: boolean) => {
    setSettings(prev => {
      const next = { ...prev, useKanaSvgBg: val };
      saveSettings(next);
      return next;
    });
  }, []);

  const setKanaTextureStrength = React.useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setSettings(prev => {
      const next = { ...prev, kanaTextureStrength: clamped };
      saveSettings(next);
      return next;
    });
  }, []);

  const setKanaTextureBlend = React.useCallback((val: UserSettings['kanaTextureBlend']) => {
    setSettings(prev => {
      const next = { ...prev, kanaTextureBlend: val };
      saveSettings(next);
      return next;
    });
  }, []);

  const resetToDefault = React.useCallback(() => {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
  }, []);

  // Sync across multiple hook consumers (same tab via custom event, other tabs via storage event)
  React.useEffect(() => {
    function handleUpdate() {
      setSettings(loadSettings());
    }
    function handleStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) {
        handleUpdate();
      }
    }
    if (typeof window !== "undefined") {
      window.addEventListener(UPDATE_EVENT, handleUpdate as EventListener);
      window.addEventListener("storage", handleStorage);
      return () => {
        window.removeEventListener(UPDATE_EVENT, handleUpdate as EventListener);
        window.removeEventListener("storage", handleStorage);
      };
    }
    return;
  }, []);

  return {
    settings,
    setBackgroundTheme,
    setUseKanaSvgBg,
    setKanaTextureStrength,
    setKanaTextureBlend,
    resetToDefault,
  };
}
