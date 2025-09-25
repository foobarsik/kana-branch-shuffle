import React from "react";
import { GameBranch } from "@/components/game/GameBranch";
import { KanaPopup } from "@/components/game/KanaPopup";
import { useGameLogic } from "@/hooks/useGameLogic";
import { Branch } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Undo2, RotateCcw, Home, Trophy, ArrowLeft, ArrowRight, Shuffle as ShuffleIcon, Crown } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { initializeVoices } from "@/utils/audio";
import { getLevelConfig, getMaxLevel } from "@/config/levels";
import { getPlayerProgress } from "@/utils/progress";
import { AchievementNotificationManager } from "@/components/ui/AchievementNotification";
import { ScoreAnimation } from "@/components/ui/ScoreAnimation";
import { AudioControls } from "@/components/ui/AudioControls";
import { DisplayMode, DISPLAY_MODE_LABELS } from "@/types/displayMode";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Game: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [displayMode, setDisplayMode] = React.useState<DisplayMode>(DisplayMode.LARGE);
  
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
    sakuraAnimatingTiles,
    selectedTileCount,
    currentLevel,
    isLevelComplete,
    isAnimating,
    newAchievements,
    clearNewAchievements,
    disappearingBranchIds,
  } = useGameLogic({ level: currentLevelNumber, displayMode });

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

  const getShouldShowRomaji = (branch: Branch, tileIndex: number, align: 'left' | 'right'): boolean => {
    switch (displayMode) {
      case DisplayMode.KANA_ONLY:
        return false;
      case DisplayMode.LEFT_KANA_RIGHT_ROMAJI:
        return align === 'right';
      case DisplayMode.SMART_FLIP: {
        // If there are 2+ consecutive identical kana, show romaji for all except the one closest to center
        if (branch.tiles.length < 2) return false;
        
        const tile = branch.tiles[tileIndex];
        const nextTileIndex = tileIndex + 1;
        const prevTileIndex = tileIndex - 1;
        
        // Check if this tile has identical neighbors
        const hasIdenticalNext = nextTileIndex < branch.tiles.length && 
          branch.tiles[nextTileIndex].kana === tile.kana;
        const hasIdenticalPrev = prevTileIndex >= 0 && 
          branch.tiles[prevTileIndex].kana === tile.kana;
        
        if (!hasIdenticalNext && !hasIdenticalPrev) return false;
        
        // For tiles that have identical neighbors, show romaji for all except the closest to center
        // Closest to center is the rightmost in left column, leftmost in right column
        // Since right column uses flex-row-reverse, the last tile in array is visually leftmost
        const isClosestToCenter = tileIndex === branch.tiles.length - 1;
        
        return !isClosestToCenter;
      }
      default:
        return false;
    }
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
              <button
                onClick={goToLevelSelect}
                className="inline-flex items-center gap-2 px-3 py-1 bg-[#ffffff] border border-[#e5e7eb] rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
                title="Go to level selection"
                aria-label="Go to level selection"
              >
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-xs md:text-sm font-medium text-gray-700">
                  Level {currentLevelNumber} · {levelConfig?.name}
                </span>
              </button>
            </div>

            {/* Display Mode & Audio Controls */}
            <div className="flex items-center gap-2">
              <AudioControls compact={true} />
            </div>
          </div>

          {/* Row 2: Progress & Metrics */}
          <div className="flex flex-col min-[431px]:flex-row items-center justify-center min-[431px]:justify-between gap-2 md:gap-4">
            <div className="w-full min-[431px]:w-auto min-[431px]:flex-1 flex justify-center min-[431px]:justify-start">
              <div className="inline-flex bg-gray-100 border border-gray-200 rounded-lg p-1">
                {Object.entries(DISPLAY_MODE_LABELS).map(([mode, label]) => (
                  <button
                    key={mode}
                    onClick={() => setDisplayMode(mode as DisplayMode)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      displayMode === mode
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center min-[431px]:justify-end gap-4 text-sm md:text-base font-semibold text-muted-foreground shrink-0 whitespace-nowrap">
              <span>Score: <span className="font-bold text-foreground">{gameState.score}</span></span>
              <span>Moves: <span className="font-bold text-foreground">{gameState.moves}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 flex justify-center items-center px-0 md:px-1 mt-3 md:mt-4">
        <div className="w-full md:max-w-3xl">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {/* First column */}
            <div className="grid grid-rows-[repeat(auto-fit,minmax(0,1fr))] gap-2 md:gap-3">
              {gameState.branches.slice(0, Math.ceil(gameState.branches.length / 2)).map((branch) => (
                <div key={`wrapper-${branch.id}`} className="branch-wrapper">
                  <GameBranch
                    key={branch.id}
                    branch={branch}
                    selectedBranch={gameState.selectedBranch}
                    onBranchClick={selectBranch}
                    canPlace={getCanPlaceStatus(branch.id)}
                    align="left"
                    flippingTiles={flippingTiles}
                    sakuraAnimatingTiles={sakuraAnimatingTiles}
                    selectedTileCount={selectedTileCount}
                    getShouldShowRomaji={getShouldShowRomaji}
                    isLargeMode={displayMode === DisplayMode.LARGE}
                    isDisappearing={disappearingBranchIds?.has(branch.id)}
                  />
                </div>
              ))}
            </div>
            {/* Second column */}
            <div className="grid grid-rows-[repeat(auto-fit,minmax(0,1fr))] gap-2 md:gap-3 mt-[25px] md:mt-0">
              {gameState.branches.slice(Math.ceil(gameState.branches.length / 2)).map((branch) => (
                <div key={`wrapper-${branch.id}`} className="branch-wrapper">
                  <GameBranch
                    key={branch.id}
                    branch={branch}
                    selectedBranch={gameState.selectedBranch}
                    onBranchClick={selectBranch}
                    canPlace={getCanPlaceStatus(branch.id)}
                    align="right"
                    flippingTiles={flippingTiles}
                    sakuraAnimatingTiles={sakuraAnimatingTiles}
                    selectedTileCount={selectedTileCount}
                    getShouldShowRomaji={getShouldShowRomaji}
                    isLargeMode={displayMode === DisplayMode.LARGE}
                    isDisappearing={disappearingBranchIds?.has(branch.id)}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center items-center gap-2 md:gap-2 mt-6">
            <Button
              onClick={undoMove}
              disabled={!canUndo}
              variant="outline"
              title="Undo"
              aria-label="Undo"
              className="h-9 md:h-8 px-3 whitespace-nowrap inline-flex items-center gap-2"
            >
              <Undo2 className="w-4 h-4" />
              <span className="inline">Undo</span>
            </Button>
            <Button
              onClick={restartPreset}
              variant="outline"
              title="Restart (return to initial preset)"
              aria-label="Restart (return to initial preset)"
              className="h-9 md:h-8 px-3 whitespace-nowrap inline-flex items-center gap-2"
              disabled={gameState.moves === 0}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="inline">Restart</span>
            </Button>
            <Button
              onClick={resetGame}
              variant="outline"
              title="Shuffle (new layout)"
              aria-label="Shuffle (new layout)"
              className="h-9 md:h-8 px-3 whitespace-nowrap inline-flex items-center gap-2"
            >
              <ShuffleIcon className="w-4 h-4" />
              <span className="inline">Shuffle</span>
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-center mt-4 text-sm text-muted-foreground p-2">
          <p>Group 4 identical kana.</p>
          <p>Tap a branch, then another to move.</p>
          <p>Place only on empty branch or next to same kana.</p>
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