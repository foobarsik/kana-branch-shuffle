import { HIRAGANA_SET } from '@/types/game';

export interface LevelConfig {
  level: number;
  name: string;
  description: string;
  kanaCount: number; // количество разных кан в уровне
  tilesPerKana: number; // количество тайлов каждой каны
  branchCount: number; // количество веток
  branchCapacity: number; // вместимость каждой ветки
  kanaSubset: string[]; // какие каны использовать
  isRandomKana?: boolean; // если true, случайно выбирать каны из всего набора
}

// Прогрессивная система уровней (упрощенная для лучшего геймплея)
export const LEVELS: LevelConfig[] = [
  // Начальные уровни - простые гласные
  {
    level: 1,
    name: "First Steps",
    description: "Learn the basic vowels: あ, い",
    kanaCount: 2,
    tilesPerKana: 4,
    branchCount: 4,
    branchCapacity: 4,
    kanaSubset: ["あ", "い"]
  },
  {
    level: 2,
    name: "Three Vowels",
    description: "Add う to the mix",
    kanaCount: 3,
    tilesPerKana: 4,
    branchCount: 5,
    branchCapacity: 4,
    kanaSubset: ["あ", "い", "う"]
  },
  {
    level: 3,
    name: "Four Vowels",
    description: "Master four vowels",
    kanaCount: 4,
    tilesPerKana: 4,
    branchCount: 6,
    branchCapacity: 4,
    kanaSubset: ["あ", "い", "う", "え"]
  },
  {
    level: 4,
    name: "All Vowels",
    description: "Complete vowel set",
    kanaCount: 5,
    tilesPerKana: 4,
    branchCount: 7,
    branchCapacity: 4,
    kanaSubset: ["あ", "い", "う", "え", "お"]
  },
  
  // K-ряд
  {
    level: 5,
    name: "K-Series Intro",
    description: "Introduction to K sounds",
    kanaCount: 3,
    tilesPerKana: 4,
    branchCount: 5,
    branchCapacity: 4,
    kanaSubset: ["か", "き", "く"]
  },
  {
    level: 6,
    name: "K-Series Complete",
    description: "Complete K-series",
    kanaCount: 4,
    tilesPerKana: 4,
    branchCount: 6,
    branchCapacity: 4,
    kanaSubset: ["か", "き", "く", "け"]
  },
  
  // Смешанные уровни
  {
    level: 7,
    name: "Mixed Practice",
    description: "Mix vowels and K-series (5 kana, 7 branches)",
    kanaCount: 5,
    tilesPerKana: 4,
    branchCount: 7,
    branchCapacity: 4,
    kanaSubset: ["あ", "い", "か", "き", "く"]
  },
  
  // S-ряд
  {
    level: 8,
    name: "S-Series",
    description: "Learn S sounds",
    kanaCount: 4,
    tilesPerKana: 4,
    branchCount: 6,
    branchCapacity: 4,
    kanaSubset: ["さ", "し", "す", "せ"]
  },
  
  // Больше пространства для маневра
  {
    level: 9,
    name: "Spacious Challenge",
    description: "5 kana types, 7 branches",
    kanaCount: 5,
    tilesPerKana: 4,
    branchCount: 7,
    branchCapacity: 4,
    kanaSubset: ["あ", "か", "さ", "た", "な"]
  },
  
  // T-ряд
  {
    level: 10,
    name: "T-Series",
    description: "Master T sounds",
    kanaCount: 4,
    tilesPerKana: 4,
    branchCount: 6,
    branchCapacity: 4,
    kanaSubset: ["た", "ち", "つ", "て"]
  },
  
  // Продвинутые уровни с большим пространством
  {
    level: 11,
    name: "Advanced Mix",
    description: "6 kana types, 8 branches",
    kanaCount: 6,
    tilesPerKana: 4,
    branchCount: 8,
    branchCapacity: 4,
    kanaSubset: ["あ", "か", "さ", "た", "な", "は"]
  },
  
  // Финальный уровень с максимальным пространством
  {
    level: 12,
    name: "Master Level",
    description: "7 kana types, 9 branches",
    kanaCount: 7,
    tilesPerKana: 4,
    branchCount: 9,
    branchCapacity: 4,
    kanaSubset: ["あ", "か", "さ", "た", "な", "は", "ま"]
  },
  
  // Случайный уровень с большим количеством веток
  {
    level: 13,
    name: "Random Challenge",
    description: "8 random kana from the full set, 10 branches",
    kanaCount: 8,
    tilesPerKana: 4,
    branchCount: 10,
    branchCapacity: 4,
    kanaSubset: [], // будет заполнено случайно
    isRandomKana: true
  }
];

// Функция для случайного выбора кан из полного набора
export const getRandomKanaSubset = (count: number): string[] => {
  const allKana = HIRAGANA_SET.map(item => item.kana);
  const shuffled = [...allKana].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Получить конфигурацию уровня
export const getLevelConfig = (level: number): LevelConfig | null => {
  const levelConfig = LEVELS.find(l => l.level === level);
  if (!levelConfig) return null;
  
  // Если это случайный уровень, генерируем случайные каны
  if (levelConfig.isRandomKana) {
    return {
      ...levelConfig,
      kanaSubset: getRandomKanaSubset(levelConfig.kanaCount)
    };
  }
  
  return levelConfig;
};

// Получить максимальный уровень
export const getMaxLevel = (): number => {
  return LEVELS.length;
};

// Проверить, разблокирован ли уровень
export const isLevelUnlocked = (level: number, completedLevels: number[]): boolean => {
  if (level === 1) return true;
  return completedLevels.includes(level - 1);
};
