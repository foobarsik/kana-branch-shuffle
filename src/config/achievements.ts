import { Achievement, AchievementCategory, AchievementRarity } from '@/types/achievements';

// Конфигурация всех достижений в игре
export const ACHIEVEMENTS: Achievement[] = [
  // === ОБУЧЕНИЕ (LEARNING) ===
  {
    id: 'first_steps',
    title: 'Первые шаги',
    description: 'Завершите первый уровень',
    icon: '👶',
    category: 'learning',
    rarity: 'common',
    condition: {
      type: 'level_complete',
      value: 1,
      comparison: 'greater_equal'
    },
    reward: {
      type: 'points',
      value: 100,
      description: '+100 очков достижений'
    },
    isUnlocked: false
  },
  {
    id: 'vowel_master',
    title: 'Мастер гласных',
    description: 'Завершите все уровни с гласными (1-4)',
    icon: '🎓',
    category: 'learning',
    rarity: 'rare',
    condition: {
      type: 'level_complete',
      value: 4,
      comparison: 'greater_equal'
    },
    reward: {
      type: 'title',
      value: 'Мастер гласных',
      description: 'Разблокирован титул "Мастер гласных"'
    },
    isUnlocked: false
  },
  {
    id: 'kana_collector',
    title: 'Коллекционер кана',
    description: 'Изучите 20 различных кана',
    icon: '📚',
    category: 'learning',
    rarity: 'rare',
    condition: {
      type: 'kana_learned',
      value: 20,
      comparison: 'greater_equal'
    },
    reward: {
      type: 'badge',
      value: 'kana_collector',
      description: 'Значок "Коллекционер кана"'
    },
    isUnlocked: false
  },
  {
    id: 'hiragana_master',
    title: 'Мастер хираганы',
    description: 'Изучите все основные хирагана (46 символов)',
    icon: '🏆',
    category: 'learning',
    rarity: 'legendary',
    condition: {
      type: 'kana_learned',
      value: 46,
      comparison: 'greater_equal'
    },
    reward: {
      type: 'title',
      value: 'Мастер хираганы',
      description: 'Легендарный титул "Мастер хираганы"'
    },
    isUnlocked: false
  },

  // === ЭФФЕКТИВНОСТЬ (EFFICIENCY) ===
  {
    id: 'efficient_solver',
    title: 'Эффективный решатель',
    description: 'Завершите уровень менее чем за 20 ходов',
    icon: '⚡',
    category: 'efficiency',
    rarity: 'common',
    condition: {
      type: 'moves_limit',
      value: 20,
      comparison: 'less'
    },
    reward: {
      type: 'points',
      value: 150,
      description: '+150 очков достижений'
    },
    isUnlocked: false
  },
  {
    id: 'perfectionist',
    title: 'Перфекционист',
    description: 'Завершите уровень с максимальным счетом (1000 очков)',
    icon: '💎',
    category: 'efficiency',
    rarity: 'epic',
    condition: {
      type: 'score_threshold',
      value: 1000,
      comparison: 'greater_equal'
    },
    reward: {
      type: 'title',
      value: 'Перфекционист',
      description: 'Титул "Перфекционист"'
    },
    isUnlocked: false
  },
  {
    id: 'speed_demon',
    title: 'Демон скорости',
    description: 'Завершите уровень менее чем за 60 секунд',
    icon: '🏃‍♂️',
    category: 'speed',
    rarity: 'rare',
    condition: {
      type: 'speed_clear',
      value: 60,
      comparison: 'less'
    },
    reward: {
      type: 'badge',
      value: 'speed_demon',
      description: 'Значок "Демон скорости"'
    },
    isUnlocked: false
  },

  // === СЕРИИ (STREAK) ===
  {
    id: 'daily_player',
    title: 'Ежедневный игрок',
    description: 'Играйте 3 дня подряд',
    icon: '📅',
    category: 'streak',
    rarity: 'common',
    condition: {
      type: 'consecutive_days',
      value: 3,
      comparison: 'greater_equal'
    },
    reward: {
      type: 'points',
      value: 200,
      description: '+200 очков достижений'
    },
    isUnlocked: false
  },
  {
    id: 'dedicated_learner',
    title: 'Преданный ученик',
    description: 'Играйте 7 дней подряд',
    icon: '🔥',
    category: 'streak',
    rarity: 'rare',
    condition: {
      type: 'consecutive_days',
      value: 7,
      comparison: 'greater_equal'
    },
    reward: {
      type: 'title',
      value: 'Преданный ученик',
      description: 'Титул "Преданный ученик"'
    },
    isUnlocked: false
  },
  {
    id: 'unstoppable',
    title: 'Неудержимый',
    description: 'Играйте 30 дней подряд',
    icon: '🌟',
    category: 'streak',
    rarity: 'legendary',
    condition: {
      type: 'consecutive_days',
      value: 30,
      comparison: 'greater_equal'
    },
    reward: {
      type: 'title',
      value: 'Неудержимый',
      description: 'Легендарный титул "Неудержимый"'
    },
    isUnlocked: false
  },

  // === МАСТЕРСТВО (MASTERY) ===
  {
    id: 'level_master',
    title: 'Мастер уровней',
    description: 'Завершите 10 уровней',
    icon: '🎯',
    category: 'mastery',
    rarity: 'rare',
    condition: {
      type: 'level_complete',
      value: 10,
      comparison: 'greater_equal'
    },
    reward: {
      type: 'badge',
      value: 'level_master',
      description: 'Значок "Мастер уровней"'
    },
    isUnlocked: false
  },
  {
    id: 'game_master',
    title: 'Мастер игры',
    description: 'Завершите все доступные уровни',
    icon: '👑',
    category: 'mastery',
    rarity: 'legendary',
    condition: {
      type: 'level_complete',
      value: 13, // максимальный уровень
      comparison: 'greater_equal'
    },
    reward: {
      type: 'title',
      value: 'Мастер игры',
      description: 'Легендарный титул "Мастер игры"'
    },
    isUnlocked: false
  },

  // === ОСОБЫЕ (SPECIAL) ===
  {
    id: 'century_club',
    title: 'Клуб сотни',
    description: 'Сыграйте 100 игр',
    icon: '💯',
    category: 'special',
    rarity: 'epic',
    condition: {
      type: 'total_games',
      value: 100,
      comparison: 'greater_equal'
    },
    reward: {
      type: 'title',
      value: 'Ветеран',
      description: 'Титул "Ветеран"'
    },
    isUnlocked: false
  },
  {
    id: 'explorer',
    title: 'Исследователь',
    description: 'Попробуйте случайный уровень',
    icon: '🗺️',
    category: 'special',
    rarity: 'rare',
    condition: {
      type: 'level_complete',
      value: 13, // случайный уровень
      comparison: 'equal'
    },
    reward: {
      type: 'badge',
      value: 'explorer',
      description: 'Значок "Исследователь"'
    },
    isUnlocked: false
  }
];

// Получить достижение по ID
export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find(achievement => achievement.id === id);
};

// Получить достижения по категории
export const getAchievementsByCategory = (category: AchievementCategory): Achievement[] => {
  return ACHIEVEMENTS.filter(achievement => achievement.category === category);
};

// Получить достижения по редкости
export const getAchievementsByRarity = (rarity: AchievementRarity): Achievement[] => {
  return ACHIEVEMENTS.filter(achievement => achievement.rarity === rarity);
};

// Получить все категории достижений
export const getAchievementCategories = (): AchievementCategory[] => {
  return ['learning', 'efficiency', 'speed', 'streak', 'mastery', 'special'];
};

// Получить цвет для категории достижения
export const getCategoryColor = (category: AchievementCategory): string => {
  const colors = {
    learning: '#3b82f6', // blue
    efficiency: '#10b981', // emerald
    speed: '#f59e0b', // amber
    streak: '#ef4444', // red
    mastery: '#8b5cf6', // violet
    special: '#f97316' // orange
  };
  return colors[category];
};

// Получить цвет для редкости достижения
export const getRarityColor = (rarity: AchievementRarity): string => {
  const colors = {
    common: '#6b7280', // gray
    rare: '#3b82f6', // blue
    epic: '#8b5cf6', // violet
    legendary: '#f59e0b' // amber
  };
  return colors[rarity];
};
