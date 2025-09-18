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
}

export interface KanaData {
  kana: string;
  romaji: string;
  learned: boolean;
}

export const HIRAGANA_SET = [
  { kana: "あ", romaji: "a" },
  { kana: "い", romaji: "i" }, 
  { kana: "う", romaji: "u" },
  { kana: "え", romaji: "e" },
  { kana: "お", romaji: "o" },
];