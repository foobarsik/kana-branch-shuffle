import React from 'react';
import { Card } from './card';
import { Badge } from './badge';
import { Progress } from './progress';
import { Trophy, Star, Calendar, Target, Zap, Crown } from 'lucide-react';
import { getPlayerProgress, getPlayerStats } from '@/utils/progress';
import { getAchievementStats, getStreakData } from '@/utils/achievements';

interface PlayerStatsProps {
  className?: string;
  showDetailed?: boolean;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ 
  className, 
  showDetailed = false 
}) => {
  const playerProgress = getPlayerProgress();
  const playerStats = getPlayerStats();
  const achievementStats = getAchievementStats();
  const streakData = getStreakData();

  const stats = [
    {
      icon: <Trophy className="w-5 h-5 text-yellow-500" />,
      label: 'Levels Completed',
      value: playerProgress.completedLevels.length,
      color: 'text-yellow-600'
    },
    {
      icon: <Target className="w-5 h-5 text-blue-500" />,
      label: 'Kana Learned',
      value: playerProgress.totalKanaLearned.length,
      color: 'text-blue-600'
    },
    {
      icon: <Star className="w-5 h-5 text-purple-500" />,
      label: 'Achievements',
      value: `${achievementStats.unlockedCount}/${achievementStats.totalAchievements}`,
      color: 'text-purple-600'
    },
    {
      icon: <Calendar className="w-5 h-5 text-red-500" />,
      label: 'Current Streak',
      value: `${streakData.currentStreak} days`,
      color: 'text-red-600'
    }
  ];

  const detailedStats = [
    {
      icon: <Zap className="w-5 h-5 text-orange-500" />,
      label: 'Total Moves',
      value: playerStats.totalMoves,
      color: 'text-orange-600'
    },
    {
      icon: <Crown className="w-5 h-5 text-indigo-500" />,
      label: 'Achievement Points',
      value: achievementStats.totalPoints,
      color: 'text-indigo-600'
    },
    {
      icon: <Target className="w-5 h-5 text-green-500" />,
      label: 'Games Played',
      value: playerStats.totalGamesPlayed,
      color: 'text-green-600'
    },
    {
      icon: <Calendar className="w-5 h-5 text-pink-500" />,
      label: 'Best Streak',
      value: `${streakData.longestStreak} days`,
      color: 'text-pink-600'
    }
  ];

  const allStats = showDetailed ? [...stats, ...detailedStats] : stats;

  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {allStats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {stat.icon}
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </Card>
        ))}
      </div>

      {/* Прогресс достижений */}
      {showDetailed && (
        <Card className="p-4 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">Achievement Progress</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Unlocked</span>
              <span>{achievementStats.completionPercentage}%</span>
            </div>
            <Progress value={achievementStats.completionPercentage} className="h-2" />
          </div>
        </Card>
      )}

      {/* Серия дней */}
      {showDetailed && streakData.currentStreak > 0 && (
        <Card className="p-4 mt-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-red-500" />
            <span className="font-medium">Activity Streak</span>
            <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
              🔥 {streakData.currentStreak} days
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Keep playing daily to increase your streak!
          </p>
        </Card>
      )}
    </div>
  );
};
