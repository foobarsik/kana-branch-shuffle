export const playKanaAudio = (kana: string, romaji: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(kana);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    speechSynthesis.speak(utterance);
  }
};