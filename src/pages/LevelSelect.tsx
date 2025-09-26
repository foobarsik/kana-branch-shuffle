import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Home, Star, Lock, Play, RotateCcw } from "lucide-react";
import { LEVELS, getLevelConfig, getMaxLevel, isLevelUnlocked } from "@/config/levels";
import { getPlayerProgress, resetProgress, getPlayerStats } from "@/utils/progress";
import type { PlayerProgress } from "@/utils/progress";

export const LevelSelect: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setProgress(getPlayerProgress());
  }, []);

  const handleLevelSelect = (level: number) => {
    navigate(`/game?level=${level}`);
  };

  const handleResetProgress = () => {
    const newProgress = resetProgress();
    setProgress(newProgress);
    setShowResetConfirm(false);
  };

  if (!progress) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>;
  }

  const stats = getPlayerStats();
  const maxLevel = getMaxLevel();
  const progressPercentage = (progress.completedLevels.length / maxLevel) * 100;

  return (
    <div className="min-h-screen p-0">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-6xl mx-auto px-3 py-2 md:px-4 md:py-3">
          <div className="flex items-center justify-between gap-2">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="icon"
              className="h-9 w-9 md:h-8 md:w-auto md:px-3"
              title="Home"
              aria-label="Home"
            >
              <Home className="w-5 h-5 md:w-4 md:h-4" />
              <span className="hidden md:inline ml-2">Home</span>
            </Button>

            <div className="text-center flex-1 min-w-0">
              <h1 className="text-base md:text-3xl font-bold text-foreground truncate">Level Select</h1>
              <p className="text-[10px] md:text-sm text-muted-foreground">Choose your challenge</p>
            </div>

            <Button
              onClick={() => setShowResetConfirm(true)}
              variant="outline"
              size="icon"
              className="h-9 w-9 md:h-8 md:w-auto md:px-3 text-destructive hover:text-destructive"
              title="Reset Progress"
              aria-label="Reset Progress"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden md:inline ml-2">Reset</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-4">

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.levelsCompleted}</div>
                <div className="text-sm text-muted-foreground">Levels Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalKanaLearned}</div>
                <div className="text-sm text-muted-foreground">Kana Learned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{Math.round(stats.averageScore)}</div>
                <div className="text-sm text-muted-foreground">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalGamesPlayed}</div>
                <div className="text-sm text-muted-foreground">Games Played</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{progress.completedLevels.length}/{maxLevel} levels</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Level Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEVELS.map((level) => {
            const isCompleted = progress.completedLevels.includes(level.level);
            const isUnlocked = isLevelUnlocked(level.level, progress.completedLevels);
            const isCurrent = level.level === progress.currentLevel;
            const bestScore = progress.bestScores[level.level] || 0;

            return (
              <Card 
                key={level.level}
                className={`relative transition-all duration-200 ${
                  isUnlocked 
                    ? 'hover:shadow-lg cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                } ${
                  isCurrent ? 'ring-2 ring-primary' : ''
                } ${
                  isCompleted ? 'bg-green-50 dark:bg-green-950/20' : ''
                }`}
                onClick={() => isUnlocked && handleLevelSelect(level.level)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        Level {level.level}
                        {isCompleted && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                        {!isUnlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                        {isCurrent && <Badge variant="secondary">Current</Badge>}
                      </CardTitle>
                      <CardDescription className="font-medium">{level.name}</CardDescription>
                    </div>
                    {isUnlocked && (
                      <Button size="sm" variant="ghost" className="p-1">
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">{level.description}</p>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Kana Types:</span>
                      <span className="font-medium">{level.kanaCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Branches:</span>
                      <span className="font-medium">{level.branchCount}</span>
                    </div>
                    {bestScore > 0 && (
                      <div className="flex justify-between">
                        <span>Best Score:</span>
                        <span className="font-medium text-primary">{bestScore}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {level.kanaSubset.slice(0, 6).map((kana) => (
                      <Badge key={kana} variant="outline" className="text-xs">
                        {kana}
                      </Badge>
                    ))}
                    {level.kanaSubset.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{level.kanaSubset.length - 6}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Reset Confirmation Dialog */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Reset Progress?</CardTitle>
                <CardDescription>
                  This will delete all your progress, scores, and learned kana. This action cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleResetProgress}
                  className="flex-1"
                >
                  Reset Everything
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
