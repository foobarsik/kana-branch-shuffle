import React from "react";
import { GameBranch } from "@/components/game/GameBranch";
import { KanaPopup } from "@/components/game/KanaPopup";
import { useGameLogic } from "@/hooks/useGameLogic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Undo2, RotateCcw, Home, Trophy, ArrowLeft, ArrowRight, Shuffle as ShuffleIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { initializeVoices } from "@/utils/audio";
import { getLevelConfig, getMaxLevel } from "@/config/levels";
import { getPlayerProgress } from "@/utils/progress";
import { AchievementNotificationManager } from "@/components/ui/AchievementNotification";
import { ScoreAnimation } from "@/components/ui/ScoreAnimation";

export const Game: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get level from URL params, default to 1, and clamp to available range
  const levelParam = searchParams.get('level');
  const requestedLevel = levelParam ? parseInt(levelParam, 10) : 1;
  const maxLevel = getMaxLevel();
  const currentLevelNumber = Math.min(Math.max(1, requestedLevel || 1), maxLevel);
  
  const {
    gameState,
    selectBranch,
    undoMove,
    resetGame,
    restartPreset,
    canUndo,
    showKanaPopup,
    closeKanaPopup,
    flippingTiles,
    selectedTileCount,
    currentLevel,
    isLevelComplete,
    newAchievements,
    clearNewAchievements,
  } = useGameLogic({ level: currentLevelNumber });

  // Get level configuration and player progress
  const levelConfig = getLevelConfig(currentLevelNumber);
  const playerProgress = getPlayerProgress();

  // Initialize voices for better audio quality
  React.useEffect(() => {
    initializeVoices();
  }, []);

  // Navigation functions
  const goToNextLevel = () => {
    if (currentLevelNumber < maxLevel) {
      navigate(`/game?level=${currentLevelNumber + 1}`);
    }
  };

  const goToPreviousLevel = () => {
    if (currentLevelNumber > 1) {
      navigate(`/game?level=${currentLevelNumber - 1}`);
    }
  };

  const goToLevelSelect = () => {
    navigate('/levels');
  };

  const getCanPlaceStatus = (branchId: string): boolean => {
    if (!gameState.selectedBranch || gameState.selectedBranch === branchId) return false;
    
    const selectedBranch = gameState.branches.find(b => b.id === gameState.selectedBranch);
    const targetBranch = gameState.branches.find(b => b.id === branchId);
    
    if (!selectedBranch || !targetBranch || selectedBranch.tiles.length === 0) return false;
    
    const tileToMove = selectedBranch.tiles[selectedBranch.tiles.length - 1];
    
    if (targetBranch.tiles.length >= targetBranch.maxCapacity) return false;
    if (targetBranch.tiles.length === 0) return true;
    
    const topTile = targetBranch.tiles[targetBranch.tiles.length - 1];
    return topTile.kana === tileToMove.kana;
  };

  if (gameState.isComplete) {
    const canGoToNext = currentLevelNumber < maxLevel;
    const isLevelUnlocked = playerProgress.completedLevels.includes(currentLevelNumber - 1) || currentLevelNumber === 1;
    
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl">🎉</div>
          <div>
            <Badge variant="secondary" className="mb-2">Level {currentLevelNumber}</Badge>
            <h1 className="text-3xl font-bold text-foreground">Level Complete!</h1>
            <h2 className="text-lg font-medium text-muted-foreground">{levelConfig?.name}</h2>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-2xl font-bold text-primary">{gameState.score}</div>
                <div className="text-muted-foreground">Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{gameState.moves}</div>
                <div className="text-muted-foreground">Moves</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {canGoToNext && (
              <Button onClick={goToNextLevel} className="w-full">
                <ArrowRight className="w-4 h-4 mr-2" />
                Next Level ({currentLevelNumber + 1})
              </Button>
            )}
            <div className="flex gap-2">
              <Button onClick={goToLevelSelect} variant="outline" className="flex-1">
                <Trophy className="w-4 h-4 mr-2" />
                Levels
              </Button>
              <Button onClick={resetGame} variant="outline" className="flex-1">
                <ShuffleIcon className="w-4 h-4 mr-2" />
                Shuffle and play again
              </Button>
              <Button onClick={() => navigate("/")} variant="outline" className="flex-1">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background p-0 pb-4 flex flex-col">
      {/* Header - sticky & compact on mobile */}
      <div className="sticky top-0 z-40 bg-gradient-background/80 backdrop-blur supports-[backdrop-filter]:bg-gradient-background/60 border-b">
        <div className="px-3 py-2 md:px-4 md:py-3 space-y-2">
          {/* Row 1: Context */}
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

            <div className="flex-1 text-center min-w-0">
              <div className="inline-flex items-center gap-2">
                <Badge className="px-2 py-0.5 text-xs md:text-sm" variant="secondary">
                  Level {currentLevelNumber}
                </Badge>
                {levelConfig && (
                  <span className="text-xs md:text-sm text-muted-foreground truncate inline-block max-w-[40vw] md:max-w-none">
                    {levelConfig.name}
                  </span>
                )}
              </div>
            </div>

            {/* Reserve space for alignment */}
            <div className="w-9 md:w-[72px]" />
          </div>

          {/* Row 2: Progress & Metrics */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[10px] md:text-xs text-muted-foreground mb-1">
                <span className="font-medium text-foreground">Progress in this level</span>
                <span className="font-medium text-foreground">
                  {gameState.learnedKana.length}/{levelConfig?.kanaCount || 5}
                </span>
              </div>
              <Progress value={(gameState.learnedKana.length / (levelConfig?.kanaCount || 5)) * 100} className="h-2" />
            </div>
            <div className="flex items-center gap-3 text-[10px] md:text-sm text-muted-foreground shrink-0">
              <span>Score: <span className="font-medium text-foreground">{gameState.score}</span></span>
              <span>Moves: <span className="font-medium text-foreground">{gameState.moves}</span></span>
            </div>
          </div>

          {/* Row 3: Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                onClick={goToPreviousLevel}
                disabled={currentLevelNumber <= 1}
                variant="outline"
                size="icon"
                title="Previous Level"
                aria-label="Previous Level"
                className="h-9 w-9 md:h-8 md:w-auto md:px-3"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden md:inline ml-2">Back</span>
              </Button>
              <Button
                onClick={goToNextLevel}
                disabled={currentLevelNumber >= maxLevel}
                variant="outline"
                size="icon"
                title="Next Level"
                aria-label="Next Level"
                className="h-9 w-9 md:h-8 md:w-auto md:px-3"
              >
                <ArrowRight className="w-4 h-4" />
                <span className="hidden md:inline ml-2">Next</span>
              </Button>
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              <Button
                onClick={undoMove}
                disabled={!canUndo}
                variant="outline"
                size="icon"
                title="Undo"
                aria-label="Undo"
                className="h-9 w-9 md:h-8 md:w-auto md:px-3"
              >
                <Undo2 className="w-4 h-4" />
                <span className="hidden md:inline ml-2">Undo</span>
              </Button>
              <Button
                onClick={restartPreset}
                variant="outline"
                size="icon"
                title="Restart (return to initial preset)"
                aria-label="Restart (return to initial preset)"
                className="h-9 w-9 md:h-8 md:w-auto md:px-3"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden md:inline ml-2">Restart</span>
              </Button>
              <Button
                onClick={resetGame}
                variant="outline"
                size="icon"
                title="Shuffle (new layout)"
                aria-label="Shuffle (new layout)"
                className="h-9 w-9 md:h-8 md:w-auto md:px-3"
              >
                <ShuffleIcon className="w-4 h-4" />
                <span className="hidden md:inline ml-2">Shuffle</span>
              </Button>
            </div>

            <div>
              <Button
                onClick={goToLevelSelect}
                variant="secondary"
                size="icon"
                title="Level Select"
                aria-label="Level Select"
                className="h-9 w-9 md:h-8 md:w-auto md:px-3"
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden md:inline ml-2">Levels</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 flex justify-center items-center px-0 md:px-1 mt-3 md:mt-4">
        <div className="w-full md:max-w-3xl">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {/* First column */}
            <div className="flex flex-col gap-3 md:gap-4">
              {gameState.branches.slice(0, Math.ceil(gameState.branches.length / 2)).map((branch) => (
                <GameBranch
                  key={branch.id}
                  branch={branch}
                  selectedBranch={gameState.selectedBranch}
                  onBranchClick={selectBranch}
                  canPlace={getCanPlaceStatus(branch.id)}
                  align="left"
                  flippingTiles={flippingTiles}
                  selectedTileCount={selectedTileCount}
                />
              ))}
            </div>
            {/* Second column */}
            <div className="flex flex-col gap-3 md:gap-4 mt-[25px] md:mt-0">
              {gameState.branches.slice(Math.ceil(gameState.branches.length / 2)).map((branch) => (
                <GameBranch
                  key={branch.id}
                  branch={branch}
                  selectedBranch={gameState.selectedBranch}
                  onBranchClick={selectBranch}
                  canPlace={getCanPlaceStatus(branch.id)}
                  align="right"
                  flippingTiles={flippingTiles}
                  selectedTileCount={selectedTileCount}
                />
              ))}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="text-center mt-8 text-sm text-muted-foreground p-2">
          <p>Group {levelConfig?.tilesPerKana || 4} identical kana tiles.</p>
          <p>Tap a branch to select the kana, then tap another branch to move it there.</p>
          <p>You can only place a kana on an empty branch or next to the same kana.</p>
            {/* {levelConfig && (
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                <span className="text-xs">Kana in this level:</span>
                {levelConfig.kanaSubset.map((kana) => (
                  <Badge key={kana} variant="outline" className="text-xs">
                    {kana}
                  </Badge>
                ))}
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Kana Popup */}
      {showKanaPopup && (
        <KanaPopup
          kana={showKanaPopup}
          isVisible={true}
          onClose={closeKanaPopup}
        />
      )}

      {/* Achievement Notifications */}
      <AchievementNotificationManager
        achievements={newAchievements}
        onAchievementShown={clearNewAchievements}
      />
    </div>
  );
};

export default Game;