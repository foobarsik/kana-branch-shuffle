import React, { useEffect, useState } from "react";
import { KanaData } from "@/types/game";
import { cn } from "@/lib/utils";

const playKanaAudio = (kana: string, romaji: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(kana);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    speechSynthesis.speak(utterance);
  }
};

interface KanaPopupProps {
  kana: KanaData;
  isVisible: boolean;
  onClose: () => void;
}

export const KanaPopup: React.FC<KanaPopupProps> = ({
  kana,
  isVisible,
  onClose,
}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setAnimate(true);
      // Play kana pronunciation
      playKanaAudio(kana.kana, kana.romaji);
      
      const timer = setTimeout(() => {
        setAnimate(false);
        setTimeout(onClose, 300);
      }, 3500); // Extended by 2 seconds (was 1500ms)
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, kana]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className={cn(
          "bg-card border-2 border-primary rounded-2xl p-8 shadow-2xl",
          "flex flex-col items-center space-y-4 transition-all duration-500",
          animate ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}
      >
        <div className="text-6xl font-bold text-primary">
          {kana.kana}
        </div>
        <div className="text-2xl text-muted-foreground font-medium">
          {kana.romaji}
        </div>
        <div className="text-sm text-success font-medium">
          ✓ Learned!
        </div>
      </div>
    </div>
  );
};