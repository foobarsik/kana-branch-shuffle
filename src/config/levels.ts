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
    level: 8,
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
    level: 10,
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
    level: 12,
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
    level: 14,
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
    level: 16,
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
    level: 18,
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
    level: 20,
    name: "Random Challenge",
    description: "8 random kana from the full set, 10 branches",
    kanaCount: 8,
    tilesPerKana: 4,
    branchCount: 10,
    branchCapacity: 4,
    kanaSubset: [], // будет заполнено случайно
    isRandomKana: true
  },
  
  // Продвинутый случайный уровень с еще большим пространством
  {
    level: 22,
    name: "Expert Random",
    description: "9 random kana from the full set, 11 branches",
    kanaCount: 9,
    tilesPerKana: 4,
    branchCount: 11,
    branchCapacity: 4,
    kanaSubset: [], // будет заполнено случайно
    isRandomKana: true
  },
  
  // Максимальный случайный уровень
  {
    level: 24,
    name: "Master Random",
    description: "10 random kana from the full set, 12 branches",
    kanaCount: 10,
    tilesPerKana: 4,
    branchCount: 12,
    branchCapacity: 4,
    kanaSubset: [], // будет заполнено случайно
    isRandomKana: true
  },
  
  // Супер экспертный уровень
  {
    level: 26,
    name: "Super Expert",
    description: "11 random kana from the full set, 13 branches",
    kanaCount: 11,
    tilesPerKana: 4,
    branchCount: 13,
    branchCapacity: 4,
    kanaSubset: [], // будет заполнено случайно
    isRandomKana: true
  },
  
  // Легендарный уровень
  {
    level: 28,
    name: "Legendary Challenge",
    description: "12 random kana from the full set, 14 branches",
    kanaCount: 12,
    tilesPerKana: 4,
    branchCount: 14,
    branchCapacity: 4,
    kanaSubset: [], // будет заполнено случайно
    isRandomKana: true
  },
  // 5-kana variants for levels 6–17
  {
    level: 7, // based on level 6
    name: "K-Series Complete (set of 5)",
    description: "5 kana variant of K-Series Complete",
    kanaCount: 5,
    tilesPerKana: 5,
    branchCount: 7,
    branchCapacity: 5,
    kanaSubset: [],
    isRandomKana: true
  },
  {
    level: 9, // based on level 8
    name: "Mixed Practice (set of 5)",
    description: "5 kana variant of Mixed Practice",
    kanaCount: 5,
    tilesPerKana: 5,
    branchCount: 8,
    branchCapacity: 5,
    kanaSubset: [],
    isRandomKana: true
  },
  {
    level: 11, // based on level 10
    name: "S-Series (set of 5)",
    description: "5 kana variant of S-Series",
    kanaCount: 5,
    tilesPerKana: 5,
    branchCount: 7,
    branchCapacity: 5,
    kanaSubset: [],
    isRandomKana: true
  },
  {
    level: 13, // based on level 12
    name: "Spacious Challenge (set of 5)",
    description: "5 kana variant of Spacious Challenge",
    kanaCount: 5,
    tilesPerKana: 5,
    branchCount: 8,
    branchCapacity: 5,
    kanaSubset: [],
    isRandomKana: true
  },
  {
    level: 15, // based on level 14
    name: "T-Series (set of 5)",
    description: "5 kana variant of T-Series",
    kanaCount: 5,
    tilesPerKana: 5,
    branchCount: 7,
    branchCapacity: 5,
    kanaSubset: [],
    isRandomKana: true
  },
  {
    level: 17, // based on level 16
    name: "Advanced Mix (set of 5)",
    description: "5 kana variant of Advanced Mix",
    kanaCount: 5,
    tilesPerKana: 5,
    branchCount: 9,
    branchCapacity: 5,
    kanaSubset: [],
    isRandomKana: true
  },
  {
    level: 19, // based on level 18
    name: "Master Level (set of 5)",
    description: "5 kana variant of Master Level",
    kanaCount: 5,
    tilesPerKana: 5,
    branchCount: 10,
    branchCapacity: 5,
    kanaSubset: [],
    isRandomKana: true
  },
  {
    level: 21, // based on level 20
    name: "Random Challenge (set of 5)",
    description: "5 random kana, 11 branches",
    kanaCount: 5,
    tilesPerKana: 5,
    branchCount: 11,
    branchCapacity: 5,
    kanaSubset: [],
    isRandomKana: true
  },
  {
    level: 23, // based on level 22
    name: "Expert Random (set of 5)",
    description: "5 random kana, 12 branches",
    kanaCount: 5,
    tilesPerKana: 5,
    branchCount: 12,
    branchCapacity: 5,
    kanaSubset: [],
    isRandomKana: true
  },
  {
    level: 25, // based on level 24
    name: "Master Random (set of 5)",
    description: "5 random kana, 13 branches",
    kanaCount: 5,
    tilesPerKana: 5,
    branchCount: 13,
    branchCapacity: 5,
    kanaSubset: [],
    isRandomKana: true
  },
  {
    level: 27, // based on level 26
    name: "Super Expert (set of 5)",
    description: "5 random kana, 14 branches",
    kanaCount: 5,
    tilesPerKana: 5,
    branchCount: 14,
    branchCapacity: 5,
    kanaSubset: [],
    isRandomKana: true
  },
  {
    level: 29, // based on level 17
    name: "Legendary Challenge (set of 5)",
    description: "5 random kana, 15 branches",
    kanaCount: 5,
    tilesPerKana: 5,
    branchCount: 15,
    branchCapacity: 5,
    kanaSubset: [],
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
