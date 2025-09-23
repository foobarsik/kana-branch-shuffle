import { Achievement, PlayerAchievements, GameSession, StreakData } from '@/types/achievements';
import { ACHIEVEMENTS, getAchievementById } from '@/config/achievements';
import { getPlayerProgress } from './progress';

const ACHIEVEMENTS_COOKIE_NAME = 'kana_game_achievements';
const STREAK_COOKIE_NAME = 'kana_game_streak';
const COOKIE_EXPIRY_DAYS = 365;

// === УПРАВЛЕНИЕ ДОСТИЖЕНИЯМИ ===

// Получить достижения игрока
export const getPlayerAchievements = (): PlayerAchievements => {
  if (typeof document === 'undefined') {
    return getDefaultAchievements();
  }

  try {
    const cookieValue = getCookie(ACHIEVEMENTS_COOKIE_NAME);
    if (cookieValue) {
      const achievements = JSON.parse(decodeURIComponent(cookieValue));
      return validateAchievements(achievements);
    }
  } catch (error) {
    console.warn('Failed to parse achievements cookie:', error);
  }

  return getDefaultAchievements();
};

// Сохранить достижения игрока
export const savePlayerAchievements = (achievements: PlayerAchievements): void => {
  if (typeof document === 'undefined') return;

  try {
    const cookieValue = encodeURIComponent(JSON.stringify(achievements));
    setCookie(ACHIEVEMENTS_COOKIE_NAME, cookieValue, COOKIE_EXPIRY_DAYS);
  } catch (error) {
    console.error('Failed to save achievements:', error);
  }
};

// Проверить и разблокировать достижения после игровой сессии
export const checkAndUnlockAchievements = (session: GameSession): Achievement[] => {
  const playerAchievements = getPlayerAchievements();
  const playerProgress = getPlayerProgress();
  const streakData = getStreakData();
  const newlyUnlocked: Achievement[] = [];

  // Проверяем каждое достижение
  for (const achievement of ACHIEVEMENTS) {
    // Пропускаем уже разблокированные
    if (playerAchievements.unlockedAchievements.includes(achievement.id)) {
      continue;
    }

    let isUnlocked = false;

    // Проверяем условие достижения
    switch (achievement.condition.type) {
      case 'level_complete':
        isUnlocked = checkLevelComplete(achievement, session.level);
        break;
      case 'score_threshold':
        isUnlocked = checkScoreThreshold(achievement, session.score);
        break;
      case 'moves_limit':
        isUnlocked = checkMovesLimit(achievement, session.moves);
        break;
      case 'speed_clear':
        isUnlocked = checkSpeedClear(achievement, session.timeSpent);
        break;
      case 'kana_learned':
        isUnlocked = checkKanaLearned(achievement, playerProgress.totalKanaLearned.length);
        break;
      case 'total_games':
        isUnlocked = checkTotalGames(achievement, playerProgress.totalGamesPlayed);
        break;
      case 'consecutive_days':
        isUnlocked = checkConsecutiveDays(achievement, streakData.currentStreak);
        break;
      case 'perfect_level':
        isUnlocked = checkPerfectLevel(achievement, session);
        break;
    }

    if (isUnlocked) {
      // Разблокируем достижение
      playerAchievements.unlockedAchievements.push(achievement.id);
      
      // Добавляем награду
      if (achievement.reward) {
        switch (achievement.reward.type) {
          case 'points':
            playerAchievements.totalPoints += Number(achievement.reward.value);
            break;
          case 'title':
            if (!playerAchievements.unlockedTitles.includes(String(achievement.reward.value))) {
              playerAchievements.unlockedTitles.push(String(achievement.reward.value));
            }
            break;
          case 'badge':
            if (!playerAchievements.badges.includes(String(achievement.reward.value))) {
              playerAchievements.badges.push(String(achievement.reward.value));
            }
            break;
        }
      }

      // Создаем копию достижения с информацией о разблокировке
      const unlockedAchievement: Achievement = {
        ...achievement,
        isUnlocked: true,
        unlockedAt: new Date()
      };

      newlyUnlocked.push(unlockedAchievement);
    }
  }

  // Сохраняем обновленные достижения
  savePlayerAchievements(playerAchievements);

  return newlyUnlocked;
};

// === СИСТЕМА СЕРИЙ ===

// Получить данные о сериях
export const getStreakData = (): StreakData => {
  if (typeof document === 'undefined') {
    return getDefaultStreakData();
  }

  try {
    const cookieValue = getCookie(STREAK_COOKIE_NAME);
    if (cookieValue) {
      const data = JSON.parse(decodeURIComponent(cookieValue));
      return {
        ...data,
        lastPlayDate: data.lastPlayDate ? new Date(data.lastPlayDate) : null
      };
    }
  } catch (error) {
    console.warn('Failed to parse streak cookie:', error);
  }

  return getDefaultStreakData();
};

// Обновить серию после игры
export const updateStreak = (): StreakData => {
  const streakData = getStreakData();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Обнуляем время для сравнения дат

  const lastPlayDate = streakData.lastPlayDate;
  
  if (!lastPlayDate) {
    // Первая игра
    streakData.currentStreak = 1;
    streakData.totalDaysPlayed = 1;
  } else {
    const lastPlay = new Date(lastPlayDate);
    lastPlay.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - lastPlay.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Играем в тот же день - серия не меняется
    } else if (daysDiff === 1) {
      // Играем на следующий день - увеличиваем серию
      streakData.currentStreak += 1;
      streakData.totalDaysPlayed += 1;
    } else {
      // Пропустили дни - сбрасываем серию
      streakData.currentStreak = 1;
      streakData.totalDaysPlayed += 1;
    }
  }

  // Обновляем самую длинную серию
  streakData.longestStreak = Math.max(streakData.longestStreak, streakData.currentStreak);
  streakData.lastPlayDate = today;

  // Сохраняем
  saveStreakData(streakData);
  
  return streakData;
};

// Сохранить данные о сериях
const saveStreakData = (streakData: StreakData): void => {
  if (typeof document === 'undefined') return;

  try {
    const cookieValue = encodeURIComponent(JSON.stringify(streakData));
    setCookie(STREAK_COOKIE_NAME, cookieValue, COOKIE_EXPIRY_DAYS);
  } catch (error) {
    console.error('Failed to save streak data:', error);
  }
};

// === ПРОВЕРКИ УСЛОВИЙ ДОСТИЖЕНИЙ ===

const checkLevelComplete = (achievement: Achievement, level: number): boolean => {
  const { value, comparison = 'greater_equal' } = achievement.condition;
  switch (comparison) {
    case 'equal': return level === value;
    case 'greater': return level > value;
    case 'less': return level < value;
    case 'greater_equal': return level >= value;
    case 'less_equal': return level <= value;
    default: return false;
  }
};

const checkScoreThreshold = (achievement: Achievement, score: number): boolean => {
  const { value, comparison = 'greater_equal' } = achievement.condition;
  switch (comparison) {
    case 'equal': return score === value;
    case 'greater': return score > value;
    case 'less': return score < value;
    case 'greater_equal': return score >= value;
    case 'less_equal': return score <= value;
    default: return false;
  }
};

const checkMovesLimit = (achievement: Achievement, moves: number): boolean => {
  const { value, comparison = 'less' } = achievement.condition;
  switch (comparison) {
    case 'equal': return moves === value;
    case 'greater': return moves > value;
    case 'less': return moves < value;
    case 'greater_equal': return moves >= value;
    case 'less_equal': return moves <= value;
    default: return false;
  }
};

const checkSpeedClear = (achievement: Achievement, timeSpent: number): boolean => {
  const { value, comparison = 'less' } = achievement.condition;
  switch (comparison) {
    case 'equal': return timeSpent === value;
    case 'greater': return timeSpent > value;
    case 'less': return timeSpent < value;
    case 'greater_equal': return timeSpent >= value;
    case 'less_equal': return timeSpent <= value;
    default: return false;
  }
};

const checkKanaLearned = (achievement: Achievement, kanaCount: number): boolean => {
  const { value, comparison = 'greater_equal' } = achievement.condition;
  switch (comparison) {
    case 'equal': return kanaCount === value;
    case 'greater': return kanaCount > value;
    case 'less': return kanaCount < value;
    case 'greater_equal': return kanaCount >= value;
    case 'less_equal': return kanaCount <= value;
    default: return false;
  }
};

const checkTotalGames = (achievement: Achievement, totalGames: number): boolean => {
  const { value, comparison = 'greater_equal' } = achievement.condition;
  switch (comparison) {
    case 'equal': return totalGames === value;
    case 'greater': return totalGames > value;
    case 'less': return totalGames < value;
    case 'greater_equal': return totalGames >= value;
    case 'less_equal': return totalGames <= value;
    default: return false;
  }
};

const checkConsecutiveDays = (achievement: Achievement, streak: number): boolean => {
  const { value, comparison = 'greater_equal' } = achievement.condition;
  switch (comparison) {
    case 'equal': return streak === value;
    case 'greater': return streak > value;
    case 'less': return streak < value;
    case 'greater_equal': return streak >= value;
    case 'less_equal': return streak <= value;
    default: return false;
  }
};

const checkPerfectLevel = (achievement: Achievement, session: GameSession): boolean => {
  return session.isPerfect;
};

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===

const getDefaultAchievements = (): PlayerAchievements => ({
  unlockedAchievements: [],
  achievementProgress: {},
  totalPoints: 0,
  unlockedTitles: [],
  currentTitle: undefined,
  badges: []
});

const getDefaultStreakData = (): StreakData => ({
  currentStreak: 0,
  longestStreak: 0,
  lastPlayDate: null,
  totalDaysPlayed: 0
});

const validateAchievements = (achievements: unknown): PlayerAchievements => {
  const defaultAchievements = getDefaultAchievements();
  
  // Type guard to check if achievements is an object
  if (!achievements || typeof achievements !== 'object') {
    return defaultAchievements;
  }
  
  const achievementsObj = achievements as Record<string, unknown>;
  
  return {
    unlockedAchievements: Array.isArray(achievementsObj.unlockedAchievements) 
      ? achievementsObj.unlockedAchievements 
      : defaultAchievements.unlockedAchievements,
    achievementProgress: typeof achievementsObj.achievementProgress === 'object' && achievementsObj.achievementProgress !== null
      ? achievementsObj.achievementProgress as Record<string, number>
      : defaultAchievements.achievementProgress,
    totalPoints: typeof achievementsObj.totalPoints === 'number' 
      ? achievementsObj.totalPoints 
      : defaultAchievements.totalPoints,
    unlockedTitles: Array.isArray(achievementsObj.unlockedTitles) 
      ? achievementsObj.unlockedTitles 
      : defaultAchievements.unlockedTitles,
    currentTitle: typeof achievementsObj.currentTitle === 'string' 
      ? achievementsObj.currentTitle 
      : defaultAchievements.currentTitle,
    badges: Array.isArray(achievementsObj.badges) 
      ? achievementsObj.badges 
      : defaultAchievements.badges
  };
};

// Утилиты для работы с куками (дублируем из progress.ts)
const setCookie = (name: string, value: string, days: number): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  
  return null;
};

// === ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ===

// Получить статистику достижений
export const getAchievementStats = () => {
  const playerAchievements = getPlayerAchievements();
  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedCount = playerAchievements.unlockedAchievements.length;
  
  return {
    totalAchievements,
    unlockedCount,
    completionPercentage: Math.round((unlockedCount / totalAchievements) * 100),
    totalPoints: playerAchievements.totalPoints,
    unlockedTitles: playerAchievements.unlockedTitles.length,
    badges: playerAchievements.badges.length
  };
};

// Получить все достижения с информацией о разблокировке
export const getAllAchievementsWithProgress = (): Achievement[] => {
  const playerAchievements = getPlayerAchievements();
  
  return ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    isUnlocked: playerAchievements.unlockedAchievements.includes(achievement.id),
    progress: playerAchievements.achievementProgress[achievement.id] || 0
  }));
};

// Сбросить все достижения (для отладки)
export const resetAchievements = (): void => {
  savePlayerAchievements(getDefaultAchievements());
  saveStreakData(getDefaultStreakData());
};
