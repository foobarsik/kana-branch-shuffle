import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Home, Volume2, Moon, Sun, Palette, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useUserSettings } from "@/hooks/useUserSettings";
import { BackgroundPicker } from "@/components/ui/BackgroundPicker";

const KANA_PRONUNCIATION_KEY = 'kanaPronunciationEnabled';

export const getKanaPronunciationEnabled = (): boolean => {
  const stored = localStorage.getItem(KANA_PRONUNCIATION_KEY);
  return stored === null ? true : stored === 'true'; // Default to enabled
};

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [kanaPronunciation, setKanaPronunciation] = useState(getKanaPronunciationEnabled);
  const { settings, setUseKanaSvgBg, setKanaTextureStrength, setKanaTextureBlend } = useUserSettings();

  const handlePronunciationToggle = (enabled: boolean) => {
    setKanaPronunciation(enabled);
    localStorage.setItem(KANA_PRONUNCIATION_KEY, enabled.toString());
  };

  const handleThemeToggle = (isDark: boolean) => {
    setTheme(isDark ? "dark" : "light");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Customize your game experience</p>
        </div>

        {/* Settings Cards */}
        <div className="space-y-4">
          {/* Appearance Settings */}
          <Card className="p-6 bg-gradient-tile">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              {theme === "dark" ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
              Appearance
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="dark-mode" className="text-base font-medium">
                    Dark Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark theme
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={theme === "dark"}
                  onCheckedChange={handleThemeToggle}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="kana-svg-bg" className="text-base font-medium flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" /> Customise your kanas
                  </Label>
                </div>
                <Switch
                  id="kana-svg-bg"
                  checked={settings.useKanaSvgBg}
                  onCheckedChange={setUseKanaSvgBg}
                />
              </div>

              {settings.useKanaSvgBg && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 pr-4">
                      <Label htmlFor="kana-texture-strength" className="text-base font-medium">
                        Kawaii strength
                      </Label>
                    </div>
                    <div className="flex items-center gap-3 min-w-[220px]">
                      <input
                        id="kana-texture-strength"
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={settings.kanaTextureStrength}
                        onChange={(e) => setKanaTextureStrength(parseFloat(e.target.value))}
                        className="w-[160px]"
                      />
                      <span className="tabular-nums w-10 text-right text-sm">{Math.round(settings.kanaTextureStrength * 100)}%</span>
                    </div>
                  </div>

                  {/* <div className="flex items-center justify-between">
                    <div className="space-y-1 pr-4">
                      <Label htmlFor="kana-texture-blend" className="text-base font-medium">
                      Kawaii blend mode
                      </Label>
                    </div>
                    <select
                      id="kana-texture-blend"
                      value={settings.kanaTextureBlend}
                      onChange={(e) => setKanaTextureBlend(e.target.value as 'multiply' | 'overlay' | 'soft-light')}
                      className="h-8 rounded-md border bg-background px-2 text-sm"
                    >
                      <option value="multiply">Multiply (default)</option>
                      <option value="overlay">Overlay</option>
                      <option value="soft-light">Soft light</option>
                    </select>
                  </div> */}
                </>
              )}

              {/* Background theme selection */}
              <div className="flex items-center justify-between">
                <div className="space-y-1 pr-4">
                  <Label className="text-base font-medium">
                    Background theme
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Choose a global background or keep Auto per level
                  </p>
                </div>
                <div>
                  <BackgroundPicker compact={false} />
                </div>
              </div>
            </div>
          </Card>

          {/* Audio Settings */}
          <Card className="p-6 bg-gradient-tile">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" />
              Audio Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="kana-pronunciation" className="text-base font-medium">
                    Kana Pronunciation
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Play kana sound when clicking on tiles
                  </p>
                </div>
                <Switch
                  id="kana-pronunciation"
                  checked={kanaPronunciation}
                  onCheckedChange={handlePronunciationToggle}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
