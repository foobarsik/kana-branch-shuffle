// Система хранения прогресса игрока через куки
import { getMaxLevel } from "@/config/levels";

export interface PlayerProgress {
  currentLevel: number;
  completedLevels: number[];
  totalKanaLearned: string[];
  bestScores: Record<number, number>; // level -> best score
  totalMoves: number;
  totalGamesPlayed: number;
}

const PROGRESS_COOKIE_NAME = 'kana_game_progress';
const COOKIE_EXPIRY_DAYS = 365; // 1 год

// Получить прогресс игрока из куки
export const getPlayerProgress = (): PlayerProgress => {
  if (typeof document === 'undefined') {
    // SSR fallback
    return getDefaultProgress();
  }

  try {
    const cookieValue = getCookie(PROGRESS_COOKIE_NAME);
    if (cookieValue) {
      const progress = JSON.parse(decodeURIComponent(cookieValue));
      // Валидация и миграция данных
      return validateAndMigrateProgress(progress);
    }
  } catch (error) {
    console.warn('Failed to parse progress cookie:', error);
  }

  return getDefaultProgress();
};

// Сохранить прогресс игрока в куки
export const savePlayerProgress = (progress: PlayerProgress): void => {
  if (typeof document === 'undefined') return;

  try {
    const cookieValue = encodeURIComponent(JSON.stringify(progress));
    setCookie(PROGRESS_COOKIE_NAME, cookieValue, COOKIE_EXPIRY_DAYS);
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

// Обновить прогресс после завершения уровня
export const updateProgressAfterLevel = (
  level: number,
  score: number,
  moves: number,
  learnedKana: string[]
): PlayerProgress => {
  const currentProgress = getPlayerProgress();
  const maxLevel = getMaxLevel();
  const nextLevel = Math.min(level + 1, maxLevel);
  
  const updatedProgress: PlayerProgress = {
    ...currentProgress,
    currentLevel: Math.max(currentProgress.currentLevel, nextLevel),
    completedLevels: [...new Set([...currentProgress.completedLevels, level])],
    totalKanaLearned: [...new Set([...currentProgress.totalKanaLearned, ...learnedKana])],
    bestScores: {
      ...currentProgress.bestScores,
      [level]: Math.max(currentProgress.bestScores[level] || 0, score)
    },
    totalMoves: currentProgress.totalMoves + moves,
    totalGamesPlayed: currentProgress.totalGamesPlayed + 1
  };

  savePlayerProgress(updatedProgress);
  return updatedProgress;
};

// Сбросить прогресс (для отладки или по желанию игрока)
export const resetProgress = (): PlayerProgress => {
  const defaultProgress = getDefaultProgress();
  savePlayerProgress(defaultProgress);
  return defaultProgress;
};

// Получить статистику игрока
export const getPlayerStats = () => {
  const progress = getPlayerProgress();
  return {
    levelsCompleted: progress.completedLevels.length,
    totalKanaLearned: progress.totalKanaLearned.length,
    averageScore: progress.completedLevels.length > 0 
      ? Object.values(progress.bestScores).reduce((a, b) => a + b, 0) / progress.completedLevels.length 
      : 0,
    totalMoves: progress.totalMoves,
    totalGamesPlayed: progress.totalGamesPlayed
  };
};

// Вспомогательные функции

const getDefaultProgress = (): PlayerProgress => ({
  currentLevel: 1,
  completedLevels: [],
  totalKanaLearned: [],
  bestScores: {},
  totalMoves: 0,
  totalGamesPlayed: 0
});

const validateAndMigrateProgress = (progress: any): PlayerProgress => {
  const defaultProgress = getDefaultProgress();
  
  return {
    currentLevel: typeof progress.currentLevel === 'number' ? progress.currentLevel : defaultProgress.currentLevel,
    completedLevels: Array.isArray(progress.completedLevels) ? progress.completedLevels : defaultProgress.completedLevels,
    totalKanaLearned: Array.isArray(progress.totalKanaLearned) ? progress.totalKanaLearned : defaultProgress.totalKanaLearned,
    bestScores: typeof progress.bestScores === 'object' ? progress.bestScores : defaultProgress.bestScores,
    totalMoves: typeof progress.totalMoves === 'number' ? progress.totalMoves : defaultProgress.totalMoves,
    totalGamesPlayed: typeof progress.totalGamesPlayed === 'number' ? progress.totalGamesPlayed : defaultProgress.totalGamesPlayed
  };
};

// Утилиты для работы с куками
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
