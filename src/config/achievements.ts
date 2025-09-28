import { Achievement, AchievementCategory, AchievementRarity } from '@/types/achievements';

// Configuration of all in-game achievements
export const ACHIEVEMENTS: Achievement[] = [
  // === LEARNING ===
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Complete the first level',
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
      description: '+100 achievement points'
    },
    isUnlocked: false
  },
  {
    id: 'vowel_master',
    title: 'Vowel Master',
    description: 'Complete all vowel levels (1-4)',
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
      value: 'Vowel Master',
      description: 'Unlocked title "Vowel Master"'
    },
    isUnlocked: false
  },
  {
    id: 'kana_collector',
    title: 'Kana Collector',
    description: 'Learn 20 different kana',
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
      description: '"Kana Collector" badge'
    },
    isUnlocked: false
  },
  {
    id: 'hiragana_master',
    title: 'Hiragana Master',
    description: 'Learn all basic hiragana (46 characters)',
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
      value: 'Hiragana Master',
      description: 'Legendary "Hiragana Master" title'
    },
    isUnlocked: false
  },

  // === EFFICIENCY ===
  {
    id: 'efficient_solver',
    title: 'Efficient Solver',
    description: 'Complete a level in less than 20 moves',
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
      description: '+150 achievement points'
    },
    isUnlocked: false
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete a level with the maximum possible score',
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
      value: 'Perfectionist',
      description: 'Unlocked title "Perfectionist"'
    },
    isUnlocked: false
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete a level in less than 60 seconds',
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
      description: '"Speed Demon" badge'
    },
    isUnlocked: false
  },

  // === STREAKS ===
  {
    id: 'daily_player',
    title: 'Daily Player',
    description: 'Play for 3 consecutive days',
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
      description: '+200 achievement points'
    },
    isUnlocked: false
  },
  {
    id: 'dedicated_learner',
    title: 'Dedicated Learner',
    description: 'Play for 7 consecutive days',
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
      value: 'Dedicated Learner',
      description: 'Title "Dedicated Learner"'
    },
    isUnlocked: false
  },
  {
    id: 'unstoppable',
    title: 'Unstoppable',
    description: 'Play for 30 consecutive days',
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
      value: 'Unstoppable',
      description: 'Legendary title "Unstoppable"'
    },
    isUnlocked: false
  },

  // === MASTERY ===
  {
    id: 'level_master',
    title: 'Level Master',
    description: 'Complete 10 levels',
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
      description: '"Level Master" badge'
    },
    isUnlocked: false
  },
  {
    id: 'game_master',
    title: 'Game Master',
    description: 'Complete all available levels',
    icon: '👑',
    category: 'mastery',
    rarity: 'legendary',
    condition: {
      type: 'level_complete',
      value: 13, // maximum level
      comparison: 'greater_equal'
    },
    reward: {
      type: 'title',
      value: 'Game Master',
      description: 'Legendary title "Game Master"'
    },
    isUnlocked: false
  },

  // === SPECIAL ===
  {
    id: 'century_club',
    title: 'Century Club',
    description: 'Play 100 games',
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
      value: 'Veteran',
      description: 'Title "Veteran"'
    },
    isUnlocked: false
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Try a random level',
    icon: '🗺️',
    category: 'special',
    rarity: 'rare',
    condition: {
      type: 'level_complete',
      value: 13, // random level
      comparison: 'equal'
    },
    reward: {
      type: 'badge',
      value: 'explorer',
      description: '"Explorer" badge'
    },
    isUnlocked: false
  },

  // === FROZEN TILES ACHIEVEMENTS ===
  {
    id: 'ice_breaker',
    title: 'Ice Breaker',
    description: 'Complete your first level with frozen tiles',
    icon: '🧊',
    category: 'special',
    rarity: 'rare',
    condition: {
      type: 'level_complete',
      value: 30,
      comparison: 'greater_equal'
    },
    reward: {
      type: 'points',
      value: 200,
      description: '+200 achievement points'
    },
    isUnlocked: false
  },
  {
    id: 'frozen_master',
    title: 'Frozen Master',
    description: 'Complete all frozen tile levels (30-32)',
    icon: '❄️',
    category: 'mastery',
    rarity: 'epic',
    condition: {
      type: 'level_complete',
      value: 32,
      comparison: 'greater_equal'
    },
    reward: {
      type: 'title',
      value: 'Frozen Master',
      description: 'Unlocked title "Frozen Master"'
    },
    isUnlocked: false
  },
  {
    id: 'patience_of_ice',
    title: 'Patience of Ice',
    description: 'Complete a level without moving any frozen tiles',
    icon: '🧘',
    category: 'efficiency',
    rarity: 'legendary',
    condition: {
      type: 'custom',
      value: 'no_frozen_moves',
      comparison: 'equal'
    },
    reward: {
      type: 'points',
      value: 500,
      description: '+500 achievement points'
    },
    isUnlocked: false
  }
];

// Get achievement by ID
export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find(achievement => achievement.id === id);
};

// Get achievements by category
export const getAchievementsByCategory = (category: AchievementCategory): Achievement[] => {
  return ACHIEVEMENTS.filter(achievement => achievement.category === category);
};

// Get achievements by rarity
export const getAchievementsByRarity = (rarity: AchievementRarity): Achievement[] => {
  return ACHIEVEMENTS.filter(achievement => achievement.rarity === rarity);
};

// Get all achievement categories
export const getAchievementCategories = (): AchievementCategory[] => {
  return ['learning', 'efficiency', 'speed', 'streak', 'mastery', 'special'];
};

// Get color for achievement category
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

// Get color for achievement rarity
export const getRarityColor = (rarity: AchievementRarity): string => {
  const colors = {
    common: '#6b7280', // gray
    rare: '#3b82f6', // blue
    epic: '#8b5cf6', // violet
    legendary: '#f59e0b' // amber
  };
  return colors[rarity];
};
