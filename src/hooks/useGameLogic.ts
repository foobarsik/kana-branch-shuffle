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
  const [flippingTiles, setFlippingTiles] = useState<Set<string>>(new Set());
  const [selectedTileCount, setSelectedTileCount] = useState<number>(1);

  const canPlaceTile = useCallback((sourceTile: KanaTile, targetBranch: Branch): boolean => {
    if (targetBranch.tiles.length >= targetBranch.maxCapacity) return false;
    if (targetBranch.tiles.length === 0) return true;
    
    const topTile = targetBranch.tiles[targetBranch.tiles.length - 1];
    return topTile.kana === sourceTile.kana;
  }, []);

  // Count consecutive identical tiles from the end of the branch
  const getConsecutiveCount = useCallback((branch: Branch): number => {
    if (branch.tiles.length === 0) return 0;
    
    const topTile = branch.tiles[branch.tiles.length - 1];
    let count = 0;
    
    for (let i = branch.tiles.length - 1; i >= 0; i--) {
      if (branch.tiles[i].kana === topTile.kana) {
        count++;
      } else {
        break;
      }
    }
    
    return count;
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
      const sourceBranch = prevState.branches.find(b => b.id === sourceBranchId);
      const targetBranch = prevState.branches.find(b => b.id === targetBranchId);

      if (!sourceBranch || !targetBranch || sourceBranch.tiles.length === 0) {
        return prevState;
      }

      // Get the tiles to move (consecutive identical tiles from the end)
      const consecutiveCount = Math.min(selectedTileCount, getConsecutiveCount(sourceBranch));
      const tilesToMove = sourceBranch.tiles.slice(-consecutiveCount);
      const topTile = tilesToMove[tilesToMove.length - 1];

      // Check if we can place the top tile
      if (!canPlaceTile(topTile, targetBranch)) {
        toast({
          title: "Invalid move",
          description: "You can only place tiles on empty branches or on tiles of the same kana.",
          variant: "destructive",
        });
        return prevState;
      }

      // Check if target branch has enough space
      if (targetBranch.tiles.length + tilesToMove.length > targetBranch.maxCapacity) {
        toast({
          title: "Invalid move", 
          description: "Not enough space in the target branch.",
          variant: "destructive",
        });
        return prevState;
      }

      // Save current state to history
      setGameHistory(prev => [...prev, prevState]);

      // Create new branches array with the move
      const newBranches = prevState.branches.map(branch => {
        if (branch.id === sourceBranchId) {
          return { ...branch, tiles: branch.tiles.slice(0, -consecutiveCount) };
        }
        if (branch.id === targetBranchId) {
          return { ...branch, tiles: [...branch.tiles, ...tilesToMove] };
        }
        return branch;
      });

      const newMoves = prevState.moves + 1;

      // Check for completions manually (without removing tiles yet)
      const completed: string[] = [];
      const tilesToDisappear = new Set<string>();
      
      newBranches.forEach(branch => {
        if (branch.tiles.length === 4 && branch.tiles.every(tile => tile.kana === branch.tiles[0].kana)) {
          completed.push(branch.tiles[0].kana);
          branch.tiles.forEach(tile => tilesToDisappear.add(tile.id));
        }
      });

      // Handle completions with simple flip animation
      if (completed.length > 0) {
        console.log('🎉 Completed kana detected:', completed);
        
        // Just flip tiles to show romaji for a moment, then remove them
        setTimeout(() => {
          // Flip all completed tiles at once
          setFlippingTiles(tilesToDisappear);
          
          // After showing romaji, remove tiles and clear flipping
          setTimeout(() => {
            setFlippingTiles(new Set());
            
            // Remove completed tiles immediately
            setGameState(currentState => {
              const { completed: newCompleted, updatedBranches: finalBranches } = checkForCompletion(currentState.branches);
              const newLearnedKana = [...new Set([...currentState.learnedKana, ...newCompleted])];
              const isComplete = finalBranches.every(branch => branch.tiles.length === 0);
              
              return {
                ...currentState,
                branches: finalBranches,
                learnedKana: newLearnedKana,
                isComplete,
              };
            });
          }, 1000); // Show romaji for 1 second
        }, 100);
        
        // Return current state for now
        const newLearnedKana = [...new Set([...prevState.learnedKana, ...completed])];
        
        return {
          branches: newBranches,
          selectedBranch: null,
          moves: newMoves,
          score: Math.max(0, 1000 - newMoves * 10),
          isComplete: false,
          learnedKana: newLearnedKana,
        };
      }

      // No completions - normal flow
      const { completed: normalCompleted, updatedBranches } = checkForCompletion(newBranches);
      const isComplete = updatedBranches.every(branch => branch.tiles.length === 0);

      return {
        branches: updatedBranches,
        selectedBranch: null,
        moves: newMoves,
        score: Math.max(0, 1000 - newMoves * 10),
        isComplete,
        learnedKana: prevState.learnedKana,
      };
    });
  }, [canPlaceTile, checkForCompletion, toast, getConsecutiveCount, selectedTileCount]);

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
        // Set the count of consecutive identical tiles to select
        const consecutiveCount = getConsecutiveCount(branch);
        setSelectedTileCount(consecutiveCount);
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
  }, [moveTile, getConsecutiveCount]);

  const undoMove = useCallback(() => {
    if (gameHistory.length > 0) {
      const previousState = gameHistory[gameHistory.length - 1];
      setGameState(previousState);
      setGameHistory(prev => prev.slice(0, -1));
    }
  }, [gameHistory]);

  const resetGame = useCallback(() => {
    // Reset all states
    setGameState(createInitialState());
    setGameHistory([]);
    setShowKanaPopup(null);
    setFlippingTiles(new Set());
    setSelectedTileCount(1);
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
    flippingTiles,
    selectedTileCount,
  };
};