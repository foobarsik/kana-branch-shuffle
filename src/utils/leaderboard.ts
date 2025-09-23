// Система локальной таблицы рекордов

export interface LeaderboardEntry {
  id: string;
  level: number;
  score: number;
  moves: number;
  timeSpent: number; // в секундах
  date: Date;
  kanaCount: number; // количество изученных кана в этой игре
}

export interface LevelLeaderboard {
  level: number;
  bestScore: LeaderboardEntry | null;
  bestTime: LeaderboardEntry | null;
  bestMoves: LeaderboardEntry | null;
  recentGames: LeaderboardEntry[];
}

const LEADERBOARD_COOKIE_NAME = 'kana_game_leaderboard';
const MAX_ENTRIES_PER_LEVEL = 10;
const COOKIE_EXPIRY_DAYS = 365;

// Получить все записи таблицы рекордов
export const getLeaderboard = (): Record<number, LevelLeaderboard> => {
  if (typeof document === 'undefined') {
    return {};
  }

  try {
    const cookieValue = getCookie(LEADERBOARD_COOKIE_NAME);
    if (cookieValue) {
      const data = JSON.parse(decodeURIComponent(cookieValue));
      // Восстанавливаем даты из строк
      const leaderboard: Record<number, LevelLeaderboard> = {};
      
      for (const [levelStr, levelData] of Object.entries(data)) {
        const level = parseInt(levelStr, 10);
        const levelLeaderboard = levelData as Record<string, unknown>;
        
        // Type guards для безопасного доступа к свойствам
        const bestScore = levelLeaderboard.bestScore && typeof levelLeaderboard.bestScore === 'object' 
          ? levelLeaderboard.bestScore as LeaderboardEntry 
          : null;
        const bestTime = levelLeaderboard.bestTime && typeof levelLeaderboard.bestTime === 'object' 
          ? levelLeaderboard.bestTime as LeaderboardEntry 
          : null;
        const bestMoves = levelLeaderboard.bestMoves && typeof levelLeaderboard.bestMoves === 'object' 
          ? levelLeaderboard.bestMoves as LeaderboardEntry 
          : null;
        const recentGames = Array.isArray(levelLeaderboard.recentGames) 
          ? levelLeaderboard.recentGames as LeaderboardEntry[] 
          : [];

        leaderboard[level] = {
          level,
          bestScore: bestScore ? {
            ...bestScore,
            date: new Date(bestScore.date)
          } : null,
          bestTime: bestTime ? {
            ...bestTime,
            date: new Date(bestTime.date)
          } : null,
          bestMoves: bestMoves ? {
            ...bestMoves,
            date: new Date(bestMoves.date)
          } : null,
          recentGames: recentGames.map((entry) => ({
            ...entry,
            date: new Date(entry.date)
          }))
        };
      }
      
      return leaderboard;
    }
  } catch (error) {
    console.warn('Failed to parse leaderboard cookie:', error);
  }

  return {};
};

// Сохранить таблицу рекордов
export const saveLeaderboard = (leaderboard: Record<number, LevelLeaderboard>): void => {
  if (typeof document === 'undefined') return;

  try {
    const cookieValue = encodeURIComponent(JSON.stringify(leaderboard));
    setCookie(LEADERBOARD_COOKIE_NAME, cookieValue, COOKIE_EXPIRY_DAYS);
  } catch (error) {
    console.error('Failed to save leaderboard:', error);
  }
};

// Добавить новую запись в таблицу рекордов
export const addLeaderboardEntry = (
  level: number,
  score: number,
  moves: number,
  timeSpent: number,
  kanaCount: number
): LeaderboardEntry => {
  const leaderboard = getLeaderboard();
  
  const newEntry: LeaderboardEntry = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    level,
    score,
    moves,
    timeSpent,
    date: new Date(),
    kanaCount
  };

  // Инициализируем уровень, если его нет
  if (!leaderboard[level]) {
    leaderboard[level] = {
      level,
      bestScore: null,
      bestTime: null,
      bestMoves: null,
      recentGames: []
    };
  }

  const levelLeaderboard = leaderboard[level];

  // Обновляем рекорды
  if (!levelLeaderboard.bestScore || score > levelLeaderboard.bestScore.score) {
    levelLeaderboard.bestScore = newEntry;
  }

  if (!levelLeaderboard.bestTime || timeSpent < levelLeaderboard.bestTime.timeSpent) {
    levelLeaderboard.bestTime = newEntry;
  }

  if (!levelLeaderboard.bestMoves || moves < levelLeaderboard.bestMoves.moves) {
    levelLeaderboard.bestMoves = newEntry;
  }

  // Добавляем в недавние игры
  levelLeaderboard.recentGames.unshift(newEntry);
  
  // Ограничиваем количество записей
  if (levelLeaderboard.recentGames.length > MAX_ENTRIES_PER_LEVEL) {
    levelLeaderboard.recentGames = levelLeaderboard.recentGames.slice(0, MAX_ENTRIES_PER_LEVEL);
  }

  // Сохраняем
  saveLeaderboard(leaderboard);
  
  return newEntry;
};

// Получить статистику по уровню
export const getLevelStats = (level: number) => {
  const leaderboard = getLeaderboard();
  const levelData = leaderboard[level];

  if (!levelData || levelData.recentGames.length === 0) {
    return {
      gamesPlayed: 0,
      averageScore: 0,
      averageMoves: 0,
      averageTime: 0,
      bestScore: 0,
      bestTime: 0,
      bestMoves: 0
    };
  }

  const games = levelData.recentGames;
  const totalGames = games.length;

  return {
    gamesPlayed: totalGames,
    averageScore: Math.round(games.reduce((sum, game) => sum + game.score, 0) / totalGames),
    averageMoves: Math.round(games.reduce((sum, game) => sum + game.moves, 0) / totalGames),
    averageTime: Math.round(games.reduce((sum, game) => sum + game.timeSpent, 0) / totalGames),
    bestScore: levelData.bestScore?.score || 0,
    bestTime: levelData.bestTime?.timeSpent || 0,
    bestMoves: levelData.bestMoves?.moves || 0
  };
};

// Получить общую статистику
export const getOverallStats = () => {
  const leaderboard = getLeaderboard();
  const allGames: LeaderboardEntry[] = [];
  
  // Собираем все игры
  for (const levelData of Object.values(leaderboard)) {
    allGames.push(...levelData.recentGames);
  }

  if (allGames.length === 0) {
    return {
      totalGames: 0,
      levelsPlayed: 0,
      averageScore: 0,
      totalTime: 0,
      bestScore: 0,
      bestLevel: 0
    };
  }

  // Сортируем по дате (новые первыми)
  allGames.sort((a, b) => b.date.getTime() - a.date.getTime());

  const totalGames = allGames.length;
  const levelsPlayed = new Set(allGames.map(game => game.level)).size;
  const averageScore = Math.round(allGames.reduce((sum, game) => sum + game.score, 0) / totalGames);
  const totalTime = allGames.reduce((sum, game) => sum + game.timeSpent, 0);
  const bestGame = allGames.reduce((best, game) => game.score > best.score ? game : best, allGames[0]);

  return {
    totalGames,
    levelsPlayed,
    averageScore,
    totalTime,
    bestScore: bestGame.score,
    bestLevel: bestGame.level,
    recentGames: allGames.slice(0, 10) // 10 последних игр
  };
};

// Получить топ игр по определенному критерию
export const getTopGames = (
  criterion: 'score' | 'time' | 'moves',
  limit: number = 10
): LeaderboardEntry[] => {
  const leaderboard = getLeaderboard();
  const allGames: LeaderboardEntry[] = [];
  
  // Собираем все игры
  for (const levelData of Object.values(leaderboard)) {
    allGames.push(...levelData.recentGames);
  }

  // Сортируем по критерию
  allGames.sort((a, b) => {
    switch (criterion) {
      case 'score':
        return b.score - a.score; // Больше очков лучше
      case 'time':
        return a.timeSpent - b.timeSpent; // Меньше времени лучше
      case 'moves':
        return a.moves - b.moves; // Меньше ходов лучше
      default:
        return 0;
    }
  });

  return allGames.slice(0, limit);
};

// Сбросить таблицу рекордов
export const resetLeaderboard = (): void => {
  if (typeof document === 'undefined') return;
  
  try {
    document.cookie = `${LEADERBOARD_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  } catch (error) {
    console.error('Failed to reset leaderboard:', error);
  }
};

// Форматирование времени
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
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
