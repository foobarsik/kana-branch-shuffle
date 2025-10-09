import * as React from "react";
import { BACKGROUND_THEMES, type BackgroundThemeId, isValidBackgroundTheme } from "@/config/backgrounds";
import { useUserSettings } from "@/hooks/useUserSettings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BackgroundPickerProps {
  compact?: boolean;
  value?: BackgroundThemeId | null; // controlled value (null = Auto)
  onChange?: (val: BackgroundThemeId | null) => void;
}

export const BackgroundPicker: React.FC<BackgroundPickerProps> = ({ compact = true, value, onChange }) => {
  const internal = useUserSettings();
  const currentValue = value ?? internal.settings.backgroundTheme;
  const setValue = onChange ?? internal.setBackgroundTheme;
  const current = currentValue ?? "auto";

  return (
    <div className={compact ? "text-xs" : "text-sm"}>
      <Select
        value={current}
        onValueChange={(val) => {
          if (val === "auto") {
            setValue(null);
            return;
          }
          if (isValidBackgroundTheme(val)) {
            setValue(val as BackgroundThemeId);
          }
        }}
      >
        <SelectTrigger className={compact ? "h-8 min-w-[136px]" : "h-9 min-w-[136px]"} aria-label="Background theme">
          <SelectValue placeholder="Background" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auto">Auto</SelectItem>
          {BACKGROUND_THEMES.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
