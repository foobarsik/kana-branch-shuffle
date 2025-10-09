import * as React from "react";
import { DEFAULT_BACKGROUND_THEME, type BackgroundThemeId, isValidBackgroundTheme } from "@/config/backgrounds";

const STORAGE_KEY = "kana:userSettings";
const UPDATE_EVENT = "userSettings:updated";

export interface UserSettings {
  backgroundTheme: BackgroundThemeId | null; // null means follow per-level theme
}

const defaultSettings: UserSettings = {
  backgroundTheme: null,
};

function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as Partial<UserSettings>;
    const backgroundTheme = parsed.backgroundTheme;
    return {
      backgroundTheme: isValidBackgroundTheme(backgroundTheme) ? backgroundTheme : null,
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
    resetToDefault,
  };
}
