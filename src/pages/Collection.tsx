import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Home, BookOpen, Trophy, Star, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HIRAGANA_SET } from "@/types/game";
import { getPlayerProgress } from "@/utils/progress";
import { getAchievementStats, getStreakData } from "@/utils/achievements";
import { AnimatedProgress } from "@/components/ui/ScoreAnimation";

export const Collection: React.FC = () => {
  const navigate = useNavigate();
  
  // Get real player progress
  const playerProgress = getPlayerProgress();
  const achievementStats = getAchievementStats();
  const streakData = getStreakData();
  
  const learnedKana = playerProgress.totalKanaLearned;
  const totalKana = HIRAGANA_SET.length;
  const completionPercentage = Math.round((learnedKana.length / totalKana) * 100);

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-primary" />
              Kana Collection
            </h1>
            {/* <p className="text-muted-foreground mt-1">
              Your learned hiragana characters
            </p> */}
          </div>

          <div className="w-24" /> {/* Spacer for alignment */}
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold">Изучение кана</h3>
            </div>
            <AnimatedProgress
              current={learnedKana.length}
              total={totalKana}
              label="Прогресс изучения"
              color="bg-blue-500"
            />
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold">Достижения</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Разблокировано</span>
                <span className="font-semibold">{achievementStats.unlockedCount}/{achievementStats.totalAchievements}</span>
              </div>
              <Progress value={achievementStats.completionPercentage} className="h-2" />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Очки</span>
                <span className="font-semibold text-yellow-600">{achievementStats.totalPoints}</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold">Активность</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Текущая серия</span>
                <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                  🔥 {streakData.currentStreak} дней
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Лучшая серия</span>
                <span className="font-semibold">{streakData.longestStreak} дней</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Всего дней</span>
                <span className="font-semibold">{streakData.totalDaysPlayed}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Kana Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Коллекция кана</h2>
            <div className="text-sm text-muted-foreground">
              {learnedKana.length} из {totalKana} изучено ({completionPercentage}%)
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {HIRAGANA_SET.map((kanaData) => {
              const isLearned = learnedKana.includes(kanaData.kana);
              
              return (
                <Card
                  key={kanaData.kana}
                  className={`
                  p-6 text-center transition-all duration-300 cursor-pointer
                  hover:scale-105 hover:shadow-lg border-2
                  ${
                    isLearned
                      ? "bg-gradient-tile border-primary/30 shadow-md"
                      : "bg-muted/50 border-muted opacity-60"
                  }
                `}
              >
                <div className="space-y-3">
                  <div
                    className={`
                      text-4xl font-bold transition-colors
                      ${isLearned ? "text-foreground" : "text-muted-foreground"}
                    `}
                  >
                    {kanaData.kana}
                  </div>
                  <div
                    className={`
                      text-lg font-medium transition-colors
                      ${isLearned ? "text-primary" : "text-muted-foreground"}
                    `}
                  >
                    {kanaData.romaji}
                  </div>
                  {/* {isLearned && (
                    <div className="text-xs text-success font-medium">
                      ✓ Learned
                    </div>
                  )}
                  {!isLearned && (
                    <div className="text-xs text-muted-foreground">
                      Not learned yet
                    </div>
                  )} */}
                </div>
              </Card>
            );
            })}
          </div>
        </div>

        {/* Back to Game */}
        {/* <div className="text-center mt-12">
          <Button
            onClick={() => navigate("/game")}
            size="lg"
            className="px-8"
          >
            Continue Learning
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default Collection;