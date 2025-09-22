import React from "react";
import { GameBranch } from "@/components/game/GameBranch";
import { KanaPopup } from "@/components/game/KanaPopup";
import { useGameLogic } from "@/hooks/useGameLogic";
import { Button } from "@/components/ui/button";
import { Undo2, RotateCcw, Home, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { initializeVoices } from "@/utils/audio";

export const Game: React.FC = () => {
  const navigate = useNavigate();
  const {
    gameState,
    selectBranch,
    undoMove,
    resetGame,
    canUndo,
    showKanaPopup,
    closeKanaPopup,
  } = useGameLogic();

  // Initialize voices for better audio quality
  React.useEffect(() => {
    initializeVoices();
  }, []);

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
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <Trophy className="w-20 h-20 text-primary mx-auto" />
          <h1 className="text-4xl font-bold text-foreground">おめでとう!</h1>
          <p className="text-xl text-muted-foreground">Congratulations!</p>
          <div className="space-y-2">
            <p className="text-lg">Moves: {gameState.moves}</p>
            <p className="text-lg">Score: {gameState.score}</p>
            <p className="text-lg">Learned Kana: {gameState.learnedKana.length}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={resetGame} variant="default">
              Play Again
            </Button>
            <Button onClick={() => navigate("/")} variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
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
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Hiragana Sort</h1>
          <div className="flex gap-2 md:gap-4 mt-1 text-xs md:text-sm text-muted-foreground">
            <span>Moves: {gameState.moves}</span>
            <span>Score: {gameState.score}</span>
            <span>Learned: {gameState.learnedKana.length}/5</span>
          </div>
        </div>

        <div className="flex gap-2">
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
                />
              ))}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>Group 4 identical kana tiles together.</p>
            <p>Tap a branch to select, then tap another branch to move the top tile.</p>
            <p>You can only place a kana on an empty branch or next to the same kana.</p>
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