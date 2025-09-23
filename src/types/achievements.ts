// Типы для системы достижений и наград

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji или иконка
  category: AchievementCategory;
  rarity: AchievementRarity;
  condition: AchievementCondition;
  reward?: AchievementReward;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress?: number; // для прогрессивных достижений (0-100)
}

export type AchievementCategory = 
  | 'learning' // изучение кана
  | 'speed' // скорость
  | 'efficiency' // эффективность
  | 'streak' // серии
  | 'collection' // коллекционирование
  | 'mastery' // мастерство
  | 'special'; // особые достижения

export type AchievementRarity = 
  | 'common' // обычные
  | 'rare' // редкие
  | 'epic' // эпические
  | 'legendary'; // легендарные

export interface AchievementCondition {
  type: 'level_complete' | 'score_threshold' | 'moves_limit' | 'streak_count' | 
        'kana_learned' | 'perfect_level' | 'speed_clear' | 'total_games' | 
        'consecutive_days' | 'collection_complete';
  value: number;
  comparison?: 'equal' | 'greater' | 'less' | 'greater_equal' | 'less_equal';
  metadata?: Record<string, any>; // дополнительные параметры
}

export interface AchievementReward {
  type: 'points' | 'title' | 'badge' | 'unlock' | 'cosmetic';
  value: number | string;
  description: string;
}

export interface PlayerAchievements {
  unlockedAchievements: string[]; // ID разблокированных достижений
  achievementProgress: Record<string, number>; // прогресс по достижениям
  totalPoints: number; // общие очки достижений
  unlockedTitles: string[]; // разблокированные титулы
  currentTitle?: string; // текущий выбранный титул
  badges: string[]; // коллекция значков
}

export interface GameSession {
  level: number;
  score: number;
  moves: number;
  timeSpent: number; // в секундах
  learnedKana: string[];
  isPerfect: boolean; // завершен без ошибок
  completedAt: Date;
}

export interface StreakData {
  currentStreak: number; // текущая серия дней
  longestStreak: number; // самая длинная серия
  lastPlayDate: Date | null;
  totalDaysPlayed: number;
}
