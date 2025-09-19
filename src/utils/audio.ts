// Audio utility for game sounds
export const playMoveSound = (kana: string) => {
  // Play pronunciation of the kana character
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(kana);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 0.7;
    speechSynthesis.speak(utterance);
  }
};

export const playKanaSound = (kana: string) => {
  playMoveSound(kana);
};