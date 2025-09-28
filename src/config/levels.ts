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
  frozenTiles?: {
    enabled: boolean; // включена ли механика замороженных тайлов
    percentage: number; // процент тайлов, которые будут заморожены (0-100)
    duration: number; // на сколько ходов замораживать тайлы
  };
}

export const LEVELS: LevelConfig[] = [
  // Начальные уровни - простые гласные
  {
    level: 1,
    name: "First Steps",
    description: "Basic vowels: あ, い — 2 kana, 4 branches",
    kanaCount: 2,
    tilesPerKana: 4,
    branchCount: 4,
    branchCapacity: 4,
    kanaSubset: ["あ", "い"]
  },
  {
    level: 2,
    name: "Three Vowels",
    description: "Vowels あ, い, う — 3 kana, 5 branches",
    kanaCount: 3,
    tilesPerKana: 4,
    branchCount: 5,
    branchCapacity: 4,
    kanaSubset: ["あ", "い", "う"]
  },
  {
    level: 3,
    name: "Four Vowels",
    description: "Vowels あ, い, う, え — 4 kana, 6 branches",
    kanaCount: 4,
    tilesPerKana: 4,
    branchCount: 6,
    branchCapacity: 4,
    kanaSubset: ["あ", "い", "う", "え"]
  },
  {
    level: 4,
    name: "All Vowels",
    description: "All vowels あ, い, う, え, お — 5 kana, 7 branches",
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
    description: "K-series intro — 3 kana, 5 branches",
    kanaCount: 3,
    tilesPerKana: 4,
    branchCount: 5,
    branchCapacity: 4,
    kanaSubset: ["か", "き", "く"]
  },
  {
    level: 6,
    name: "K-Series Complete",
    description: "K-series — 4 kana, 6 branches",
    kanaCount: 4,
    tilesPerKana: 4,
    branchCount: 6,
    branchCapacity: 4,
    kanaSubset: ["か", "き", "く", "け"]
  },

  // based on 6
  {
    level: 7,
    name: "K-Series Complete (set of 5)",
    description: "K-series — 4 kana, 6 branches; 5 tiles each",
    kanaCount: 4,            // = level 6
    tilesPerKana: 5,
    branchCount: 6,
    branchCapacity: 5,
    kanaSubset: ["か", "き", "く", "け"]
  },

  // Смешанные уровни
  {
    level: 8,
    name: "Mixed Practice",
    description: "Mixed vowels & K-series — 5 kana, 7 branches",
    kanaCount: 5,
    tilesPerKana: 4,
    branchCount: 7,
    branchCapacity: 4,
    kanaSubset: ["あ", "い", "か", "き", "く"]
  },

  // based on 8
  {
    level: 9,
    name: "Mixed Practice (set of 5)",
    description: "Mixed — 5 kana, 7 branches; 5 tiles each",
    kanaCount: 5,            // = level 8
    tilesPerKana: 5,
    branchCount: 7,
    branchCapacity: 5,
    kanaSubset: ["あ", "い", "か", "き", "く"]
  },

  // S-ряд
  {
    level: 10,
    name: "S-Series",
    description: "S-series — 4 kana, 6 branches",
    kanaCount: 4,
    tilesPerKana: 4,
    branchCount: 6,
    branchCapacity: 4,
    kanaSubset: ["さ", "し", "す", "せ"]
  },

  // based on 10
  {
    level: 11,
    name: "S-Series (set of 5)",
    description: "S-series — 4 kana, 6 branches; 5 tiles each",
    kanaCount: 4,            // = level 10
    tilesPerKana: 5,
    branchCount: 6,
    branchCapacity: 5,
    kanaSubset: ["さ", "し", "す", "せ"]
  },

  // Больше пространства для маневра
  {
    level: 12,
    name: "Spacious Challenge",
    description: "Spacious challenge — 5 kana, 7 branches",
    kanaCount: 5,
    tilesPerKana: 4,
    branchCount: 7,
    branchCapacity: 4,
    kanaSubset: ["あ", "か", "さ", "た", "な"]
  },

  // based on 12
  {
    level: 13,
    name: "Spacious Challenge (set of 5)",
    description: "Spacious challenge — 5 kana, 7 branches; 5 tiles each",
    kanaCount: 5,            // = level 12
    tilesPerKana: 5,
    branchCount: 7,
    branchCapacity: 5,
    kanaSubset: ["あ", "か", "さ", "た", "な"]
  },

  // T-ряд
  {
    level: 14,
    name: "T-Series",
    description: "T-series — 4 kana, 6 branches",
    kanaCount: 4,
    tilesPerKana: 4,
    branchCount: 6,
    branchCapacity: 4,
    kanaSubset: ["た", "ち", "つ", "て"]
  },

  // based on 14
  {
    level: 15,
    name: "T-Series (set of 5)",
    description: "T-series — 4 kana, 6 branches; 5 tiles each",
    kanaCount: 4,            // = level 14
    tilesPerKana: 5,
    branchCount: 6,
    branchCapacity: 5,
    kanaSubset: ["た", "ち", "つ", "て"]
  },

  // Продвинутые уровни с большим пространством
  {
    level: 16,
    name: "Advanced Mix",
    description: "Advanced mix — 6 kana, 8 branches",
    kanaCount: 6,
    tilesPerKana: 4,
    branchCount: 8,
    branchCapacity: 4,
    kanaSubset: ["あ", "か", "さ", "た", "な", "は"]
  },

  // based on 16
  {
    level: 17,
    name: "Advanced Mix (set of 5)",
    description: "Advanced mix — 6 kana, 8 branches; 5 tiles each",
    kanaCount: 6,            // = level 16
    tilesPerKana: 5,
    branchCount: 8,
    branchCapacity: 5,
    kanaSubset: ["あ", "か", "さ", "た", "な", "は"]
  },

  // Финальный уровень с максимальным пространством
  {
    level: 18,
    name: "Master Level",
    description: "Master level — 7 kana, 9 branches",
    kanaCount: 7,
    tilesPerKana: 4,
    branchCount: 9,
    branchCapacity: 4,
    kanaSubset: ["あ", "か", "さ", "た", "な", "は", "ま"]
  },

  // based on 18
  {
    level: 19,
    name: "Master Level (set of 5)",
    description: "Master level — 7 kana, 9 branches; 5 tiles each",
    kanaCount: 7,            // = level 18
    tilesPerKana: 5,
    branchCount: 9,
    branchCapacity: 5,
    kanaSubset: ["あ", "か", "さ", "た", "な", "は", "ま"]
  },

  // Случайный уровень с большим количеством веток
  {
    level: 20,
    name: "Random Challenge",
    description: "Random — 8 kana, 10 branches",
    kanaCount: 8,
    tilesPerKana: 4,
    branchCount: 10,
    branchCapacity: 4,
    kanaSubset: [],
    isRandomKana: true
  },

  // based on 20
  {
    level: 21,
    name: "Random Challenge (set of 5)",
    description: "Random — 8 kana, 10 branches; 5 tiles each",
    kanaCount: 8,            // = level 20
    tilesPerKana: 5,
    branchCount: 10,
    branchCapacity: 5,
    kanaSubset: [],
    isRandomKana: true
  },

  // Продвинутый случайный уровень с еще большим пространством
  {
    level: 22,
    name: "Expert Random",
    description: "Expert random — 9 kana, 11 branches",
    kanaCount: 9,
    tilesPerKana: 4,
    branchCount: 11,
    branchCapacity: 4,
    kanaSubset: [],
    isRandomKana: true
  },

  // based on 22
  {
    level: 23,
    name: "Expert Random (set of 5)",
    description: "Expert random — 9 kana, 11 branches; 5 tiles each",
    kanaCount: 9,            // = level 22
    tilesPerKana: 5,
    branchCount: 11,
    branchCapacity: 5,
    kanaSubset: [],
    isRandomKana: true
  },

  // Максимальный случайный уровень
  {
    level: 24,
    name: "Master Random",
    description: "Master random — 10 kana, 12 branches",
    kanaCount: 10,
    tilesPerKana: 4,
    branchCount: 12,
    branchCapacity: 4,
    kanaSubset: [],
    isRandomKana: true
  },

  // based on 24
  {
    level: 25,
    name: "Master Random (set of 5)",
    description: "Master random — 10 kana, 12 branches; 5 tiles each",
    kanaCount: 10,           // = level 24
    tilesPerKana: 5,
    branchCount: 12,
    branchCapacity: 5,
    kanaSubset: [],
    isRandomKana: true
  },

  // Супер экспертный уровень
  {
    level: 26,
    name: "Super Expert",
    description: "Super expert — 11 kana, 13 branches",
    kanaCount: 11,
    tilesPerKana: 4,
    branchCount: 13,
    branchCapacity: 4,
    kanaSubset: [],
    isRandomKana: true
  },

  // based on 26
  {
    level: 27,
    name: "Super Expert (set of 5)",
    description: "Super expert — 11 kana, 13 branches; 5 tiles each",
    kanaCount: 11,           // = level 26
    tilesPerKana: 5,
    branchCount: 13,
    branchCapacity: 5,
    kanaSubset: [],
    isRandomKana: true
  },

  // Легендарный уровень
  {
    level: 28,
    name: "Legendary Challenge",
    description: "Legendary — 12 kana, 14 branches",
    kanaCount: 12,
    tilesPerKana: 4,
    branchCount: 14,
    branchCapacity: 4,
    kanaSubset: [],
    isRandomKana: true
  },

  // based on 28
  {
    level: 29,
    name: "Legendary Challenge (set of 5)",
    description: "Legendary — 12 kana, 14 branches; 5 tiles each",
    kanaCount: 12,           // = level 28
    tilesPerKana: 5,
    branchCount: 14,
    branchCapacity: 5,
    kanaSubset: [],
    isRandomKana: true
  },

  // Новая механика: замороженные тайлы
  {
    level: 30,
    name: "Frozen Challenge",
    description: "Frozen tiles — 10 kana, 12 branches; some tiles frozen for 4 moves",
    kanaCount: 10,
    tilesPerKana: 4,
    branchCount: 12,
    branchCapacity: 4,
    kanaSubset: [],
    isRandomKana: true,
    frozenTiles: {
      enabled: true,
      percentage: 25, // 25% тайлов будут заморожены
      duration: 4     // на 4 хода
    }
  },

  // Усложненная версия с большим количеством замороженных тайлов
  {
    level: 31,
    name: "Ice Storm",
    description: "Ice storm — 8 kana, 10 branches; more frozen tiles for 3 moves",
    kanaCount: 8,
    tilesPerKana: 4,
    branchCount: 10,
    branchCapacity: 4,
    kanaSubset: [],
    isRandomKana: true,
    frozenTiles: {
      enabled: true,
      percentage: 40, // 40% тайлов заморожены
      duration: 6     // на 4 хода
    }
  },

  // Экстремальный вызов с долгой заморозкой
  {
    level: 32,
    name: "Deep Freeze",
    description: "Deep freeze — 12 kana, 14 branches; few tiles frozen for 6 moves",
    kanaCount: 12,
    tilesPerKana: 4,
    branchCount: 14,
    branchCapacity: 4,
    kanaSubset: [],
    isRandomKana: true,
    frozenTiles: {
      enabled: true,
      percentage: 15, // меньше тайлов, но...
      duration: 6     // дольше заморожены
    }
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
