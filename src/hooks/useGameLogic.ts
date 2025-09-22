import { useState, useCallback } from "react";
import { GameState, Branch, KanaTile, HIRAGANA_SET } from "@/types/game";
import { useToast } from "@/hooks/use-toast";
import { playMoveSound } from "@/utils/audio";

export const useGameLogic = () => {
  const { toast } = useToast();

  const createInitialState = (): GameState => {
    // Create 4 tiles for each kana
    const allTiles: KanaTile[] = [];
    HIRAGANA_SET.forEach((kanaData, kanaIndex) => {
      for (let i = 0; i < 4; i++) {
        allTiles.push({
          id: `${kanaData.kana}-${i}`,
          kana: kanaData.kana,
          romaji: kanaData.romaji,
        });
      }
    });

    // Shuffle tiles with validation to ensure no branch has 4 identical kana
    let shuffledTiles: KanaTile[];
    let isValidShuffle = false;
    
    while (!isValidShuffle) {
      shuffledTiles = [...allTiles].sort(() => Math.random() - 0.5);
      
      // Check if any group of 4 consecutive tiles (that will form a branch) has all identical kana
      isValidShuffle = true;
      for (let i = 0; i < 5; i++) {
        const branchTiles = shuffledTiles.slice(i * 4, (i + 1) * 4);
        const firstKana = branchTiles[0].kana;
        if (branchTiles.every(tile => tile.kana === firstKana)) {
          isValidShuffle = false;
          break;
        }
      }
    }

    // Create 7 branches (5 filled, 2 empty)
    const branches: Branch[] = [];
    
    // Fill 5 branches with 4 tiles each
    for (let i = 0; i < 5; i++) {
      branches.push({
        id: `branch-${i}`,
        tiles: shuffledTiles.slice(i * 4, (i + 1) * 4),
        maxCapacity: 4,
      });
    }

    // Add 2 empty branches
    branches.push(
      {
        id: "branch-5",
        tiles: [],
        maxCapacity: 4,
      },
      {
        id: "branch-6", 
        tiles: [],
        maxCapacity: 4,
      }
    );

    return {
      branches,
      selectedBranch: null,
      moves: 0,
      score: 0,
      isComplete: false,
      learnedKana: [],
    };
  };

  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const [gameHistory, setGameHistory] = useState<GameState[]>([]);
  const [showKanaPopup, setShowKanaPopup] = useState<{kana: string; romaji: string; learned: boolean} | null>(null);

  const canPlaceTile = useCallback((sourceTile: KanaTile, targetBranch: Branch): boolean => {
    if (targetBranch.tiles.length >= targetBranch.maxCapacity) return false;
    if (targetBranch.tiles.length === 0) return true;
    
    const topTile = targetBranch.tiles[targetBranch.tiles.length - 1];
    return topTile.kana === sourceTile.kana;
  }, []);

  const checkForCompletion = useCallback((branches: Branch[]): { completed: string[], updatedBranches: Branch[] } => {
    const completed: string[] = [];
    const updatedBranches: Branch[] = [];

    branches.forEach(branch => {
      if (branch.tiles.length === 4 && 
          branch.tiles.every(tile => tile.kana === branch.tiles[0].kana)) {
        completed.push(branch.tiles[0].kana);
        // Replace completed branch with empty one in the same position
        updatedBranches.push({
          id: `branch-${Date.now()}-${Math.random()}`,
          tiles: [],
          maxCapacity: 4,
        });
      } else {
        updatedBranches.push(branch);
      }
    });

    return { completed, updatedBranches };
  }, []);

  const moveTile = useCallback((sourceBranchId: string, targetBranchId: string) => {
    if (sourceBranchId === targetBranchId) return;

    setGameState(prevState => {
      // Save current state for undo
      setGameHistory(prev => [...prev, prevState]);

      const newBranches = [...prevState.branches];
      const sourceBranch = newBranches.find(b => b.id === sourceBranchId);
      const targetBranch = newBranches.find(b => b.id === targetBranchId);

      if (!sourceBranch || !targetBranch || sourceBranch.tiles.length === 0) {
        return prevState;
      }

      const tileToMove = sourceBranch.tiles[sourceBranch.tiles.length - 1];

      // Check specific reasons for invalid moves
      let errorMessage = "Cannot place tile here!";
      if (targetBranch.tiles.length >= targetBranch.maxCapacity) {
        errorMessage = "Branch is full! Maximum 4 tiles per branch.";
      } else if (targetBranch.tiles.length > 0) {
        const topTile = targetBranch.tiles[targetBranch.tiles.length - 1];
        if (topTile.kana !== tileToMove.kana) {
          errorMessage = `You can only place a kana next to the same kana.`;
        }
      }

      if (!canPlaceTile(tileToMove, targetBranch)) {
        toast({
          title: "Invalid Move",
          description: errorMessage,
          variant: "destructive",
        });
        return prevState;
      }

      // Move the tile
      sourceBranch.tiles = sourceBranch.tiles.slice(0, -1);
      targetBranch.tiles = [...targetBranch.tiles, tileToMove];
      
      const newMoves = prevState.moves + 1;
      
      // Check for completions
      const { completed, updatedBranches } = checkForCompletion(newBranches);

      // Show popup for new completions
      completed.forEach(kana => {
        if (!prevState.learnedKana.includes(kana)) {
          const kanaData = HIRAGANA_SET.find(k => k.kana === kana);
          if (kanaData) {
            setShowKanaPopup({ ...kanaData, learned: true });
          }
        }
      });

      const newLearnedKana = [...new Set([...prevState.learnedKana, ...completed])];
      const isComplete = updatedBranches.every(branch => branch.tiles.length === 0);

      return {
        branches: updatedBranches,
        selectedBranch: null,
        moves: newMoves,
        score: Math.max(0, 1000 - newMoves * 10),
        isComplete,
        learnedKana: newLearnedKana,
      };
    });
  }, [canPlaceTile, checkForCompletion, toast]);

  const selectBranch = useCallback((branchId: string) => {
    setGameState(prevState => {
      const branch = prevState.branches.find(b => b.id === branchId);
      
      if (!branch) return prevState;

      // If no branch selected and this branch has tiles, select it
      if (!prevState.selectedBranch && branch.tiles.length > 0) {
        // Play sound for the top tile when selecting a branch
        const topTile = branch.tiles[branch.tiles.length - 1];
        if (topTile) {
          playMoveSound(topTile.kana);
        }
        return { ...prevState, selectedBranch: branchId };
      }

      // If this is the selected branch, deselect
      if (prevState.selectedBranch === branchId) {
        return { ...prevState, selectedBranch: null };
      }

      // If another branch is selected, try to move tile
      if (prevState.selectedBranch) {
        moveTile(prevState.selectedBranch, branchId);
        return prevState; // moveTile will update the state
      }

      return prevState;
    });
  }, [moveTile]);

  const undoMove = useCallback(() => {
    if (gameHistory.length > 0) {
      const previousState = gameHistory[gameHistory.length - 1];
      setGameState(previousState);
      setGameHistory(prev => prev.slice(0, -1));
    }
  }, [gameHistory]);

  const resetGame = useCallback(() => {
    setGameState(createInitialState());
    setGameHistory([]);
    setShowKanaPopup(null);
  }, []);

  const closeKanaPopup = useCallback(() => {
    setShowKanaPopup(null);
  }, []);

  return {
    gameState,
    selectBranch,
    undoMove,
    resetGame,
    canUndo: gameHistory.length > 0,
    showKanaPopup,
    closeKanaPopup,
  };
};