import React from "react";
import { GameBranch } from "@/components/game/GameBranch";
import { KanaPopup } from "@/components/game/KanaPopup";
import { useGameLogic } from "@/hooks/useGameLogic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Undo2, RotateCcw, Home, Trophy, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { initializeVoices } from "@/utils/audio";
import { getLevelConfig, getMaxLevel } from "@/config/levels";
import { getPlayerProgress } from "@/utils/progress";

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
    canUndo,
    showKanaPopup,
    closeKanaPopup,
    flippingTiles,
    selectedTileCount,
    currentLevel,
    isLevelComplete,
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
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry
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
    <div className="min-h-screen bg-gradient-background p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          size="sm"
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Badge variant="secondary">Level {currentLevelNumber}</Badge>
            {levelConfig && <Badge variant="outline">{levelConfig.name}</Badge>}
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            {levelConfig?.description || "Hiragana Sort"}
          </h1>
          <div className="flex gap-2 md:gap-4 mt-1 text-xs md:text-sm text-muted-foreground">
            <span>Moves: {gameState.moves}</span>
            <span>Score: {gameState.score}</span>
            <span>Learned: {gameState.learnedKana.length}/{levelConfig?.kanaCount || 5}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={goToPreviousLevel}
            disabled={currentLevelNumber <= 1}
            variant="outline"
            size="sm"
            title="Previous Level"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={goToLevelSelect}
            variant="outline"
            size="sm"
            title="Level Select"
          >
            <Trophy className="w-4 h-4" />
          </Button>
          <Button
            onClick={goToNextLevel}
            disabled={currentLevelNumber >= maxLevel}
            variant="outline"
            size="sm"
            title="Next Level"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            onClick={undoMove}
            disabled={!canUndo}
            variant="outline"
            size="sm"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={resetGame}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 flex justify-center items-center px-1">
        <div className="w-full max-w-3xl">
          <div className="grid grid-cols-2 gap-2 md:gap-4">
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
            <div className="flex flex-col gap-3 md:gap-4">
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
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>Group {levelConfig?.tilesPerKana || 4} identical kana tiles together.</p>
            <p>Tap a branch to select all identical tiles from the top, then tap another branch to move them.</p>
            <p>You can only place tiles on an empty branch or next to the same kana.</p>
            {levelConfig && (
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                <span className="text-xs">Kana in this level:</span>
                {levelConfig.kanaSubset.map((kana) => (
                  <Badge key={kana} variant="outline" className="text-xs">
                    {kana}
                  </Badge>
                ))}
              </div>
            )}
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
    </div>
  );
};

export default Game;