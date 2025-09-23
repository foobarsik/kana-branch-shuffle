import React from 'react';
import { Card } from './card';
import { Badge } from './badge';
import { Calendar, Flame, Star } from 'lucide-react';
import { getStreakData } from '@/utils/achievements';
import { cn } from '@/lib/utils';

interface StreakDisplayProps {
  className?: string;
  compact?: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ 
  className, 
  compact = false 
}) => {
  const streakData = getStreakData();

  // Определяем уровень серии для визуального оформления
  const getStreakLevel = (streak: number) => {
    if (streak >= 30) return { level: 'legendary', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' };
    if (streak >= 14) return { level: 'epic', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' };
    if (streak >= 7) return { level: 'rare', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' };
    if (streak >= 3) return { level: 'common', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' };
    return { level: 'none', color: 'text-muted-foreground', bg: 'bg-muted/20' };
  };

  const streakLevel = getStreakLevel(streakData.currentStreak);

  // Мотивационные сообщения
  const getMotivationalMessage = (streak: number) => {
    if (streak === 0) return "Начните играть каждый день!";
    if (streak === 1) return "Отличное начало! Продолжайте завтра.";
    if (streak < 7) return "Хорошая серия! Не останавливайтесь.";
    if (streak < 14) return "Впечатляющая серия! Вы на правильном пути.";
    if (streak < 30) return "Невероятная серия! Вы настоящий мастер.";
    return "Легендарная серия! Вы достигли вершины!";
  };

  // Иконка в зависимости от уровня серии
  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return <Star className="w-5 h-5" />;
    if (streak >= 7) return <Flame className="w-5 h-5" />;
    return <Calendar className="w-5 h-5" />;
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={cn("p-2 rounded-lg", streakLevel.bg)}>
          <div className={streakLevel.color}>
            {getStreakIcon(streakData.currentStreak)}
          </div>
        </div>
        <div>
          <div className="font-semibold">
            {streakData.currentStreak} дней
          </div>
          <div className="text-xs text-muted-foreground">
            Серия
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("p-4", streakLevel.bg, className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={streakLevel.color}>
            {getStreakIcon(streakData.currentStreak)}
          </div>
          <span className="font-medium">Серия дней</span>
        </div>
        
        {streakData.currentStreak > 0 && (
          <Badge 
            variant="secondary" 
            className={cn(
              "font-bold",
              streakData.currentStreak >= 7 && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
            )}
          >
            🔥 {streakData.currentStreak}
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Текущая серия</span>
          <span className={cn("font-bold text-lg", streakLevel.color)}>
            {streakData.currentStreak} дней
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Лучшая серия</span>
          <span className="font-semibold">
            {streakData.longestStreak} дней
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Всего дней</span>
          <span className="font-semibold">
            {streakData.totalDaysPlayed}
          </span>
        </div>
      </div>

      <div className="mt-3 p-2 rounded bg-background/50">
        <p className="text-sm text-center text-muted-foreground">
          {getMotivationalMessage(streakData.currentStreak)}
        </p>
      </div>

      {/* Прогресс до следующего уровня */}
      {streakData.currentStreak > 0 && (
        <div className="mt-3">
          <div className="text-xs text-muted-foreground mb-1">
            До следующего уровня:
          </div>
          <div className="flex gap-1">
            {[3, 7, 14, 30].map((milestone, index) => {
              const isReached = streakData.currentStreak >= milestone;
              const isCurrent = streakData.currentStreak < milestone && 
                (index === 0 || streakData.currentStreak >= [0, 3, 7, 14][index]);
              
              return (
                <div
                  key={milestone}
                  className={cn(
                    "flex-1 h-2 rounded",
                    isReached ? "bg-green-500" : isCurrent ? "bg-yellow-400" : "bg-muted"
                  )}
                  title={`${milestone} дней`}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>3</span>
            <span>7</span>
            <span>14</span>
            <span>30</span>
          </div>
        </div>
      )}
    </Card>
  );
};
