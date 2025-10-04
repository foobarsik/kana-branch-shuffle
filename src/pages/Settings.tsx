import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Home, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const KANA_PRONUNCIATION_KEY = 'kanaPronunciationEnabled';

export const getKanaPronunciationEnabled = (): boolean => {
  const stored = localStorage.getItem(KANA_PRONUNCIATION_KEY);
  return stored === null ? true : stored === 'true'; // Default to enabled
};

const Settings = () => {
  const navigate = useNavigate();
  const [kanaPronunciation, setKanaPronunciation] = useState(getKanaPronunciationEnabled);

  const handlePronunciationToggle = (enabled: boolean) => {
    setKanaPronunciation(enabled);
    localStorage.setItem(KANA_PRONUNCIATION_KEY, enabled.toString());
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

          {/* Future settings placeholder */}
          <Card className="p-6 bg-gradient-tile opacity-60">
            <div className="text-center py-4">
              <p className="text-muted-foreground">More settings coming soon...</p>
            </div>
          </Card>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
