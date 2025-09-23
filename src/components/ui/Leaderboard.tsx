import React, { useState } from 'react';
import { Card } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Trophy, Clock, Target, Calendar } from 'lucide-react';
import { 
  getLeaderboard, 
  getLevelStats, 
  getOverallStats, 
  getTopGames, 
  formatTime,
  LeaderboardEntry 
} from '@/utils/leaderboard';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  level?: number;
  className?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ 
  level, 
  className 
}) => {
  const [selectedTab, setSelectedTab] = useState<'level' | 'overall'>('level');
  
  const leaderboard = getLeaderboard();
  const levelStats = level ? getLevelStats(level) : null;
  const overallStats = getOverallStats();
  const topScores = getTopGames('score', 5);
  const topTimes = getTopGames('time', 5);
  const topMoves = getTopGames('moves', 5);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const EntryCard: React.FC<{ entry: LeaderboardEntry; rank: number; highlight?: 'score' | 'time' | 'moves' }> = ({ 
    entry, 
    rank, 
    highlight 
  }) => (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold text-muted-foreground min-w-[3rem]">
            {getRankIcon(rank)}
          </div>
          <div>
            <div className="font-semibold">Уровень {entry.level}</div>
            <div className="text-sm text-muted-foreground">
              {formatDate(entry.date)}
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 text-sm">
          <div className={cn("text-center", highlight === 'score' && "text-yellow-600 font-bold")}>
            <div className="text-lg font-semibold">{entry.score}</div>
            <div className="text-muted-foreground">очков</div>
          </div>
          <div className={cn("text-center", highlight === 'time' && "text-blue-600 font-bold")}>
            <div className="text-lg font-semibold">{formatTime(entry.timeSpent)}</div>
            <div className="text-muted-foreground">время</div>
          </div>
          <div className={cn("text-center", highlight === 'moves' && "text-green-600 font-bold")}>
            <div className="text-lg font-semibold">{entry.moves}</div>
            <div className="text-muted-foreground">ходов</div>
          </div>
        </div>
      </div>
    </Card>
  );

  if (level && (!leaderboard[level] || leaderboard[level].recentGames.length === 0)) {
    return (
      <Card className={cn("p-6 text-center", className)}>
        <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          Нет записей для уровня {level}
        </h3>
        <p className="text-muted-foreground">
          Завершите уровень, чтобы увидеть свои результаты здесь
        </p>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'level' | 'overall')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="level" disabled={!level}>
            Уровень {level || '?'}
          </TabsTrigger>
          <TabsTrigger value="overall">
            Общая статистика
          </TabsTrigger>
        </TabsList>
        
        {/* Статистика уровня */}
        {level && levelStats && (
          <TabsContent value="level" className="space-y-4">
            {/* Рекорды уровня */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {leaderboard[level]?.bestScore && (
                <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium">Лучший счет</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {leaderboard[level].bestScore.score}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(leaderboard[level].bestScore!.date)}
                  </div>
                </Card>
              )}
              
              {leaderboard[level]?.bestTime && (
                <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Лучшее время</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatTime(leaderboard[level].bestTime.timeSpent)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(leaderboard[level].bestTime!.date)}
                  </div>
                </Card>
              )}
              
              {leaderboard[level]?.bestMoves && (
                <Card className="p-4 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Меньше ходов</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {leaderboard[level].bestMoves.moves}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(leaderboard[level].bestMoves!.date)}
                  </div>
                </Card>
              )}
            </div>

            {/* Недавние игры */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Недавние игры</h3>
              <div className="space-y-2">
                {leaderboard[level]?.recentGames.slice(0, 5).map((entry, index) => (
                  <EntryCard key={entry.id} entry={entry} rank={index + 1} />
                ))}
              </div>
            </div>
          </TabsContent>
        )}
        
        {/* Общая статистика */}
        <TabsContent value="overall" className="space-y-4">
          {overallStats.totalGames > 0 ? (
            <>
              {/* Общие показатели */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {overallStats.totalGames}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Игр сыграно
                  </div>
                </Card>
                
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {overallStats.levelsPlayed}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Уровней пройдено
                  </div>
                </Card>
                
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {overallStats.averageScore}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Средний счет
                  </div>
                </Card>
                
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatTime(overallStats.totalTime)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Общее время
                  </div>
                </Card>
              </div>

              {/* Топ результаты */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Лучшие счета
                  </h3>
                  <div className="space-y-2">
                    {topScores.slice(0, 3).map((entry, index) => (
                      <EntryCard key={entry.id} entry={entry} rank={index + 1} highlight="score" />
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Лучшее время
                  </h3>
                  <div className="space-y-2">
                    {topTimes.slice(0, 3).map((entry, index) => (
                      <EntryCard key={entry.id} entry={entry} rank={index + 1} highlight="time" />
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-500" />
                    Меньше ходов
                  </h3>
                  <div className="space-y-2">
                    {topMoves.slice(0, 3).map((entry, index) => (
                      <EntryCard key={entry.id} entry={entry} rank={index + 1} highlight="moves" />
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Card className="p-6 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                Нет данных
              </h3>
              <p className="text-muted-foreground">
                Завершите несколько уровней, чтобы увидеть статистику
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
