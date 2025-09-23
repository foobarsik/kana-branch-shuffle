import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Star, Target, Zap, Calendar, Crown, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AchievementCard } from '@/components/ui/AchievementCard';
import { getAllAchievementsWithProgress, getAchievementStats, getStreakData } from '@/utils/achievements';
import { getAchievementsByCategory, getAchievementCategories } from '@/config/achievements';
import { AchievementCategory } from '@/types/achievements';

const Achievements: React.FC = (): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  
  const achievements = getAllAchievementsWithProgress();
  const stats = getAchievementStats();
  const streakData = getStreakData();

  // Filter achievements by category
  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'all') {
      return achievements;
    }
    return achievements.filter(achievement => achievement.category === selectedCategory);
  }, [achievements, selectedCategory]);

  // Group achievements by status
  const { unlockedAchievements, lockedAchievements } = useMemo(() => {
    const unlocked = filteredAchievements.filter(a => a.isUnlocked);
    const locked = filteredAchievements.filter(a => !a.isUnlocked);
    return {
      unlockedAchievements: unlocked,
      lockedAchievements: locked
    };
  }, [filteredAchievements]);

  // Icons for categories
  const categoryIcons = {
    learning: <Target className="w-4 h-4" />,
    efficiency: <Zap className="w-4 h-4" />,
    speed: <Zap className="w-4 h-4" />,
    streak: <Calendar className="w-4 h-4" />,
    mastery: <Crown className="w-4 h-4" />,
    special: <Gift className="w-4 h-4" />
  };

  const categoryLabels = {
    learning: 'Learning',
    efficiency: 'Efficiency',
    speed: 'Speed',
    streak: 'Streaks',
    mastery: 'Mastery',
    special: 'Special'
  };

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
          
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">Unlocked</span>
            </div>
            <div className="text-2xl font-bold">{stats.unlockedCount}/{stats.totalAchievements}</div>
            <Progress value={stats.completionPercentage} className="mt-2" />
          </div>

          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Achievement Points</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalPoints}</div>
          </div>

          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Current Streak</span>
            </div>
            <div className="text-2xl font-bold">{streakData.currentStreak} days</div>
          </div>

          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Titles</span>
            </div>
            <div className="text-2xl font-bold">{stats.unlockedTitles}</div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All ({achievements.length})
            </Button>
            
            {getAchievementCategories().map(category => {
              const categoryAchievements = getAchievementsByCategory(category);
              const unlockedInCategory = categoryAchievements.filter(a => 
                achievements.find(ua => ua.id === a.id)?.isUnlocked
              ).length;
              
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center gap-1"
                >
                  {categoryIcons[category]}
                  {categoryLabels[category]} ({unlockedInCategory}/{categoryAchievements.length})
                </Button>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <Tabs defaultValue="unlocked" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unlocked">
              Unlocked ({unlockedAchievements.length})
            </TabsTrigger>
            <TabsTrigger value="locked">
              Locked ({lockedAchievements.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="unlocked" className="mt-6">
            {unlockedAchievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unlockedAchievements.map(achievement => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    showProgress={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No achievements unlocked yet
                </h3>
                <p className="text-muted-foreground">
                  Play the game to unlock achievements!
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="locked" className="mt-6">
            {lockedAchievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lockedAchievements.map(achievement => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    showProgress={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  All achievements unlocked!
                </h3>
                <p className="text-muted-foreground">
                  Congratulations! You've unlocked all available achievements.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Achievements;
