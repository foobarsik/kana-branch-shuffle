// Audio utility for game sounds

// Get the best available Japanese voice
const getBestJapaneseVoice = (): SpeechSynthesisVoice | null => {
  if (!('speechSynthesis' in window)) return null;
  
  const voices = speechSynthesis.getVoices();
  
  // Priority order for Japanese voices (best to worst)
  const preferredVoices = [
    'Kyoko',           // macOS Japanese female
    'Otoya',           // macOS Japanese male  
    'Google 日本語',    // Google Japanese
    'Microsoft Ayumi', // Windows Japanese female
    'Microsoft Ichiro', // Windows Japanese male
    'ja-JP',           // Generic Japanese
  ];
  
  // First, try to find voices by exact name match
  for (const preferredName of preferredVoices) {
    const voice = voices.find(v => 
      v.name.includes(preferredName) && v.lang.startsWith('ja')
    );
    if (voice) return voice;
  }
  
  // Fallback: any Japanese voice
  const japaneseVoice = voices.find(v => v.lang.startsWith('ja'));
  if (japaneseVoice) return japaneseVoice;
  
  // Last resort: any voice (will sound wrong but at least something)
  return voices[0] || null;
};

// Enhanced audio playback with better voice selection
export const playMoveSound = (kana: string) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  try {
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(kana);
    
    // Get the best available Japanese voice
    const bestVoice = getBestJapaneseVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    } else {
      utterance.lang = 'ja-JP';
    }
    
    // Optimized settings for Japanese pronunciation
    utterance.rate = 0.7;     // Slightly slower for clarity
    utterance.pitch = 1.1;    // Slightly higher pitch for better clarity
    utterance.volume = 0.8;   // Good audible level
    
    // Error handling
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
    };
    
    speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('Failed to play kana sound:', error);
  }
};

export const playKanaSound = (kana: string) => {
  playMoveSound(kana);
};

// Initialize voices (some browsers need this)
export const initializeVoices = () => {
  if ('speechSynthesis' in window) {
    // Some browsers need a small delay to load voices
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', () => {
        console.log('Available voices loaded:', speechSynthesis.getVoices().length);
      });
    }
  }
};