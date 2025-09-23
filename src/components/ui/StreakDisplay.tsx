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

  // Determine streak level for visual styling
  const getStreakLevel = (streak: number) => {
    if (streak >= 30) return { level: 'legendary', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' };
    if (streak >= 14) return { level: 'epic', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' };
    if (streak >= 7) return { level: 'rare', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' };
    if (streak >= 3) return { level: 'common', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' };
    return { level: 'none', color: 'text-muted-foreground', bg: 'bg-muted/20' };
  };

  const streakLevel = getStreakLevel(streakData.currentStreak);

  // Motivational messages
  const getMotivationalMessage = (streak: number) => {
    if (streak === 0) return "Start playing every day!";
    if (streak === 1) return "Great start! Keep it up tomorrow.";
    if (streak < 7) return "Good streak! Don't stop now.";
    if (streak < 14) return "Impressive streak! You're on the right track.";
    if (streak < 30) return "Incredible streak! You're a true master.";
    return "Legendary streak! You've reached the top!";
  };

  // Icon based on streak level
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
            {streakData.currentStreak} days
          </div>
          <div className="text-xs text-muted-foreground">
            Streak
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
          <span className="font-medium">Day Streak</span>
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
          <span className="text-sm text-muted-foreground">Current Streak</span>
          <span className={cn("font-bold text-lg", streakLevel.color)}>
            {streakData.currentStreak} days
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Best Streak</span>
          <span className="font-semibold">
            {streakData.longestStreak} days
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Days</span>
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

      {/* Progress to next level */}
      {streakData.currentStreak > 0 && (
        <div className="mt-3">
          <div className="text-xs text-muted-foreground mb-1">
            To next level:
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
                  title={`${milestone} days`}
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
