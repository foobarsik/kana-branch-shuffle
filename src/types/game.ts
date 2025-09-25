export interface KanaTile {
  id: string;
  kana: string;
  romaji: string;
  color?: string;
}

export interface Branch {
  id: string;
  tiles: KanaTile[];
  maxCapacity: number;
}

export interface GameState {
  branches: Branch[];
  selectedBranch: string | null;
  moves: number;
  score: number;
  isComplete: boolean;
  learnedKana: string[];
  kanaColorMap: Map<string, string>;
  completedSets: Set<string>; // Track branches that have been scored for completed sets
}

export interface KanaData {
  kana: string;
  romaji: string;
  learned: boolean;
}

export const HIRAGANA_SET = [
  // Vowels (гласные)
  { kana: "あ", romaji: "a" },
  { kana: "い", romaji: "i" }, 
  { kana: "う", romaji: "u" },
  { kana: "え", romaji: "e" },
  { kana: "お", romaji: "o" },
  
  // K-series (K-ряд)
  { kana: "か", romaji: "ka" },
  { kana: "き", romaji: "ki" },
  { kana: "く", romaji: "ku" },
  { kana: "け", romaji: "ke" },
  { kana: "こ", romaji: "ko" },
  
  // S-series (S-ряд)
  { kana: "さ", romaji: "sa" },
  { kana: "し", romaji: "shi" },
  { kana: "す", romaji: "su" },
  { kana: "せ", romaji: "se" },
  { kana: "そ", romaji: "so" },
  
  // T-series (T-ряд)
  { kana: "た", romaji: "ta" },
  { kana: "ち", romaji: "chi" },
  { kana: "つ", romaji: "tsu" },
  { kana: "て", romaji: "te" },
  { kana: "と", romaji: "to" },
  
  // N-series (N-ряд)
  { kana: "な", romaji: "na" },
  { kana: "に", romaji: "ni" },
  { kana: "ぬ", romaji: "nu" },
  { kana: "ね", romaji: "ne" },
  { kana: "の", romaji: "no" },
  
  // H-series (H-ряд)
  { kana: "は", romaji: "ha" },
  { kana: "ひ", romaji: "hi" },
  { kana: "ふ", romaji: "fu" },
  { kana: "へ", romaji: "he" },
  { kana: "ほ", romaji: "ho" },
  
  // M-series (M-ряд)
  { kana: "ま", romaji: "ma" },
  { kana: "み", romaji: "mi" },
  { kana: "む", romaji: "mu" },
  { kana: "め", romaji: "me" },
  { kana: "も", romaji: "mo" },
  
  // Y-series (Y-ряд)
  { kana: "や", romaji: "ya" },
  { kana: "ゆ", romaji: "yu" },
  { kana: "よ", romaji: "yo" },
  
  // R-series (R-ряд)
  { kana: "ら", romaji: "ra" },
  { kana: "り", romaji: "ri" },
  { kana: "る", romaji: "ru" },
  { kana: "れ", romaji: "re" },
  { kana: "ろ", romaji: "ro" },
  
  // W-series and N (W-ряд и N)
  { kana: "わ", romaji: "wa" },
  { kana: "を", romaji: "wo" },
  { kana: "ん", romaji: "n" },
];