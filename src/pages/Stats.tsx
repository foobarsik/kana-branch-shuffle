import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Trophy, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayerStats } from '@/components/ui/PlayerStats';
import { StreakDisplay } from '@/components/ui/StreakDisplay';
import { Leaderboard } from '@/components/ui/Leaderboard';
import { getPlayerProgress } from '@/utils/progress';
import { getAchievementStats } from '@/utils/achievements';
import { getOverallStats } from '@/utils/leaderboard';

const Stats: React.FC = (): JSX.Element => {
  const playerProgress = getPlayerProgress();
  const achievementStats = getAchievementStats();
  const overallStats = getOverallStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <BarChart3 className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-foreground">Statistics</h1>
        </div>

        {/* Main Statistics */}
        <PlayerStats showDetailed={true} className="mb-8" />

        {/* Tabs */}
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress">
              <Target className="w-4 h-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="leaderboard">
              <BarChart3 className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>
          
          {/* Progress */}
          <TabsContent value="progress" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Streak */}
              <StreakDisplay />
              
              {/* Level Progress */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">Level Progress</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Level</span>
                    <span className="font-bold text-lg text-blue-600">
                      {playerProgress.currentLevel}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Levels Completed</span>
                    <span className="font-bold text-lg text-green-600">
                      {playerProgress.completedLevels.length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Kana Learned</span>
                    <span className="font-bold text-lg text-purple-600">
                      {playerProgress.totalKanaLearned.length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">High Score</span>
                    <span className="font-bold text-lg text-yellow-600">
                      {Math.max(...Object.values(playerProgress.bestScores), 0)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Achievements */}
            {achievementStats.unlockedCount > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold">Achievements</h3>
                  </div>
                  <Link to="/achievements">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {achievementStats.unlockedCount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Unlocked
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {achievementStats.totalPoints}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Points
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {achievementStats.completionPercentage}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Completed
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {achievementStats.unlockedTitles}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Title
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
          
          {/* Achievements */}
          <TabsContent value="achievements" className="mt-6">
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">
                Achievements System
              </h3>
              <p className="text-muted-foreground mb-6">
                Unlock achievements by playing the game and learning kana
              </p>
              <Link to="/achievements">
                <Button size="lg">
                  <Trophy className="w-4 h-4 mr-2" />
                  View Achievements
                </Button>
              </Link>
            </div>
          </TabsContent>
          
          {/* Leaderboard */}
          <TabsContent value="leaderboard" className="mt-6">
            <Leaderboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Stats;
