import { useState, useCallback, useEffect } from "react";
import { Branch, GameState, KanaTile, HIRAGANA_SET } from "@/types/game";
import { playMoveSound } from "@/utils/audio";
import { useToast } from "@/hooks/use-toast";
import { getLevelConfig, type LevelConfig } from "@/config/levels";
import { getPlayerProgress, updateProgressAfterLevel } from "@/utils/progress";
import { generateKanaColorMap } from '@/utils/colors';

interface UseGameLogicProps {
  level?: number;
}

export const useGameLogic = ({ level = 1 }: UseGameLogicProps = {}) => {
  const { toast } = useToast();

  const createInitialState = useCallback((levelConfig?: LevelConfig): GameState => {
    // Get level configuration or use default
    const config = levelConfig || getLevelConfig(level) || {
      level: 1,
      name: "Default",
      description: "Default level",
      kanaCount: 5,
      tilesPerKana: 4,
      branchCount: 5,
      branchCapacity: 4,
      kanaSubset: ["あ", "い", "う", "え", "お"]
    };

    // Generate the color map for the current level's kana subset
    const kanaColorMap = generateKanaColorMap(config.kanaSubset);

    // Create tiles based on level configuration
    const allTiles: KanaTile[] = [];
    config.kanaSubset.forEach((kanaChar) => {
      const kanaData = HIRAGANA_SET.find(h => h.kana === kanaChar);
      if (kanaData) {
        for (let i = 0; i < config.tilesPerKana; i++) {
          allTiles.push({
            color: kanaColorMap.get(kanaData.kana),
            id: `${kanaData.kana}-${i}`,
            kana: kanaData.kana,
            romaji: kanaData.romaji,
          });
        }
      }
    });

    // Debug: log tile creation
    if (import.meta.env.DEV) {
      console.log(`Created ${allTiles.length} tiles for level ${config.level}:`, config.kanaSubset);
    }

    // Shuffle tiles
    const shuffledTiles = [...allTiles].sort(() => Math.random() - 0.5);

    // Create branches based on level configuration
    const branches: Branch[] = [];
    for (let i = 0; i < config.branchCount; i++) {
      branches.push({
        id: `branch-${i}`,
        tiles: [],
        maxCapacity: config.branchCapacity,
      });
    }

    // Distribute tiles among branches more strategically
    // Fill branches densely, leaving some completely empty for strategy
    const tilesPerFilledBranch = Math.min(config.branchCapacity, 4); // Max 4 tiles per branch for better gameplay
    const branchesToFill = Math.min(config.branchCount - 1, Math.ceil(shuffledTiles.length / tilesPerFilledBranch));
    
    console.log(`Level ${config.level}: ${shuffledTiles.length} tiles, filling ${branchesToFill} branches with ~${tilesPerFilledBranch} tiles each`);
    
    let tileIndex = 0;
    for (let branchIndex = 0; branchIndex < branchesToFill && tileIndex < shuffledTiles.length; branchIndex++) {
      // Fill this branch up to the limit or until we run out of tiles
      const tilesToAdd = Math.min(tilesPerFilledBranch, shuffledTiles.length - tileIndex);
      
      for (let i = 0; i < tilesToAdd; i++) {
        branches[branchIndex].tiles.push(shuffledTiles[tileIndex]);
        tileIndex++;
      }
    }
    
    // If there are remaining tiles, distribute them among the filled branches
    while (tileIndex < shuffledTiles.length) {
      for (let branchIndex = 0; branchIndex < branchesToFill && tileIndex < shuffledTiles.length; branchIndex++) {
        if (branches[branchIndex].tiles.length < config.branchCapacity) {
          branches[branchIndex].tiles.push(shuffledTiles[tileIndex]);
          tileIndex++;
        }
      }
    }

    // Debug: log branch distribution
    if (import.meta.env.DEV) {
      console.log('Branch distribution:', branches.map((b, i) => `Branch ${i}: ${b.tiles.length} tiles`));
    }

    return {
      branches,
      selectedBranch: null,
      moves: 0,
      score: 0,
      isComplete: false,
      learnedKana: [],
      kanaColorMap,
    };
  }, [level]);

  const [gameState, setGameState] = useState<GameState>(() => createInitialState());
  const [gameHistory, setGameHistory] = useState<GameState[]>([]);
  const [showKanaPopup, setShowKanaPopup] = useState<{kana: string; romaji: string; learned: boolean} | null>(null);
  const [flippingTiles, setFlippingTiles] = useState<Set<string>>(new Set());
  const [selectedTileCount, setSelectedTileCount] = useState<number>(1);
  const [currentLevel, setCurrentLevel] = useState<number>(level);
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);

  // Update game when level changes
  useEffect(() => {
    if (currentLevel !== level) {
      setCurrentLevel(level);
      setGameState(createInitialState());
      setGameHistory([]);
      setShowKanaPopup(null);
      setFlippingTiles(new Set());
      setSelectedTileCount(1);
      setIsLevelComplete(false);
    }
  }, [level, currentLevel, createInitialState]);

  // Handle level completion
  useEffect(() => {
    if (gameState.isComplete && !isLevelComplete) {
      setIsLevelComplete(true);
      
      // Save progress
      const updatedProgress = updateProgressAfterLevel(
        currentLevel,
        gameState.score,
        gameState.moves,
        gameState.learnedKana
      );

      // Show completion message
      toast({
        title: "Level Complete! 🎉",
        description: `You completed level ${currentLevel} with ${gameState.score} points!`,
        duration: 5000,
      });

      console.log('Level completed! Progress saved:', updatedProgress);
    }
  }, [gameState.isComplete, isLevelComplete, currentLevel, gameState.score, gameState.moves, gameState.learnedKana, toast]);

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

  // Check if the player has any valid moves available
  const hasValidMoves = useCallback((branches: Branch[]): boolean => {
    // If any branch is empty, there are always moves available
    const hasEmptyBranch = branches.some(branch => branch.tiles.length === 0);
    console.log('🔍 Checking valid moves:', {
      totalBranches: branches.length,
      emptyBranches: branches.filter(b => b.tiles.length === 0).length,
      hasEmptyBranch
    });
    if (hasEmptyBranch) return true;

    // Check if any tiles can be moved between branches
    for (let sourceIndex = 0; sourceIndex < branches.length; sourceIndex++) {
      const sourceBranch = branches[sourceIndex];
      if (sourceBranch.tiles.length === 0) continue;

      const topTile = sourceBranch.tiles[sourceBranch.tiles.length - 1];
      
      // Count consecutive identical tiles from the top (like in the actual game logic)
      const consecutiveCount = getConsecutiveCount(sourceBranch);
      
      // Check if this group of tiles can be placed on any other branch
      for (let targetIndex = 0; targetIndex < branches.length; targetIndex++) {
        if (sourceIndex === targetIndex) continue;
        
        const targetBranch = branches[targetIndex];
        
        // Can place if target is empty or top tile matches AND there's enough space
        const canPlace = targetBranch.tiles.length === 0 || 
                        (targetBranch.tiles.length < targetBranch.maxCapacity && 
                         targetBranch.tiles[targetBranch.tiles.length - 1].kana === topTile.kana);
        
        const hasEnoughSpace = targetBranch.tiles.length + consecutiveCount <= targetBranch.maxCapacity;
        
        if (canPlace && hasEnoughSpace) {
          console.log('✅ Found valid move:', {
            from: `${consecutiveCount}x ${topTile.kana} (branch ${sourceIndex})`,
            to: `branch ${targetIndex}`,
            targetEmpty: targetBranch.tiles.length === 0,
            targetKana: targetBranch.tiles.length > 0 ? targetBranch.tiles[targetBranch.tiles.length - 1].kana : 'empty',
            spaceNeeded: consecutiveCount,
            spaceAvailable: targetBranch.maxCapacity - targetBranch.tiles.length
          });
          return true;
        }
      }
    }
    
    console.log('❌ No valid moves found');
    return false;
  }, [getConsecutiveCount]);

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

      // Handle completions with sequential flip animation
      if (completed.length > 0) {
        console.log('🎉 Completed kana detected:', completed);
        
        // Find completed branches and their alignment
        const completedBranches = newBranches.filter(branch => 
          branch.tiles.length === 4 && branch.tiles.every(tile => tile.kana === branch.tiles[0].kana)
        );
        
        setTimeout(() => {
          // Animate each completed branch sequentially
          completedBranches.forEach((branch, branchIndex) => {
            // Determine if this is a left or right column branch
            const branchIndexInGame = newBranches.findIndex(b => b.id === branch.id);
            const isRightColumn = branchIndexInGame >= Math.ceil(newBranches.length / 2);
            
            // For right column: flex-row-reverse means index 0 is visually rightmost, so flip (3,2,1,0) to go left to right visually
            // For left column: normal order, so flip (3,2,1,0) to go right to left visually  
            const tileIndices = isRightColumn ? [3, 2, 1, 0] : [3, 2, 1, 0];
            
            tileIndices.forEach((tileIndex, animationIndex) => {
              setTimeout(() => {
                const tileId = branch.tiles[tileIndex].id;
                setFlippingTiles(prev => new Set([...prev, tileId]));
              }, branchIndex * 500 + animationIndex * 400); // 400ms between tiles, 500ms between branches
            });
          });
          
          // After all animations, remove tiles and clear flipping
          const totalAnimationTime = completedBranches.length * 500 + 4 * 400 + 500; // Extra 0.5s to show romaji
          setTimeout(() => {
            setFlippingTiles(new Set());
            
            // Remove completed tiles
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
          }, totalAnimationTime);
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
          kanaColorMap: prevState.kanaColorMap,
        };
      }

      // No completions - normal flow
      const { completed: normalCompleted, updatedBranches } = checkForCompletion(newBranches);
      const isComplete = updatedBranches.every(branch => branch.tiles.length === 0);
      
      // Check for deadlock (no valid moves available)
      const hasMovesAvailable = hasValidMoves(updatedBranches);
      if (!isComplete && !hasMovesAvailable) {
        toast({
          title: "No moves available! 😔",
          description: "The game is stuck. Try using the undo button or restart the level.",
          variant: "destructive",
          duration: 10000,
        });
      }

      return {
        branches: updatedBranches,
        selectedBranch: null,
        moves: newMoves,
        score: Math.max(0, 1000 - newMoves * 10),
        isComplete,
        learnedKana: prevState.learnedKana,
        kanaColorMap: prevState.kanaColorMap,
      };
    });
  }, [canPlaceTile, checkForCompletion, toast, getConsecutiveCount, selectedTileCount, hasValidMoves]);

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
    setIsLevelComplete(false);
  }, [createInitialState]);

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
    currentLevel,
    isLevelComplete,
    hasValidMoves: () => hasValidMoves(gameState.branches),
  };
};