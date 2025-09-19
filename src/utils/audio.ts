// Audio utility for game sounds
export const playMoveSound = () => {
  // Create a simple tone for tile movement
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Configure the sound - a pleasant short tone
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
  oscillator.type = 'sine';
  
  // Quick fade out
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
};

export const playKanaSound = (kana: string) => {
  // For now, play the same move sound when kana is learned
  // This could be enhanced later with actual pronunciation
  playMoveSound();
};