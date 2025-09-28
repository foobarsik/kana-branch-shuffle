import { useState, useCallback, useEffect, useRef } from "react";
import { Branch, GameState, KanaTile, HIRAGANA_SET, BranchType, LevelState } from "@/types/game";
import { playMoveSound } from "@/utils/audio";
import { useToast } from "@/hooks/use-toast";
import { getLevelConfig, type LevelConfig } from "@/config/levels";
import { getPlayerProgress, updateProgressAfterLevel, incrementBranchesCollected } from "@/utils/progress";
import { generateKanaColorMap } from '@/utils/colors';
import { checkAndUnlockAchievements, updateStreak } from '@/utils/achievements';
import { Achievement, GameSession } from '@/types/achievements';
import { addLeaderboardEntry } from '@/utils/leaderboard';
import { DisplayMode } from '@/types/displayMode';
import { telemetry } from '@/utils/telemetry';

interface UseGameLogicProps {
  level?: number;
  displayMode?: DisplayMode;
}

export const useGameLogic = ({ level = 1, displayMode = DisplayMode.LEFT_KANA_RIGHT_ROMAJI }: UseGameLogicProps = {}) => {
  const { toast } = useToast();

  // Keep an immutable snapshot of the initially generated branches for the current preset
  const initialBranchesRef = useRef<Array<{ id: string; maxCapacity: number; tiles: KanaTile[] }>>([]);

  // Max number of empty NORMAL branches allowed before triggering wave replacement
  const MAX_EMPTY_NORMAL_BRANCHES = 2;

  // Helper to check if a branch is complete
  const isBranchComplete = useCallback((branch: Branch, levelConfig: LevelConfig): boolean => {
    // Check if branch is complete (must have exactly tilesPerKana tiles of the same kana)
    if (branch.tiles.length === 0) return false;
    const firstKana = branch.tiles[0].kana;
    return branch.tiles.length === levelConfig.tilesPerKana && 
           branch.tiles.every(tile => tile.kana === firstKana);
  }, []);

  // Shuffle board to ensure no branches are complete at the start
  const ensureNoCompletedBranches = useCallback((initialBranches: Branch[], levelConfig: LevelConfig): Branch[] => {
    const branches = [...initialBranches.map(b => ({ ...b, tiles: [...b.tiles] }))];
    let attempts = 0;

    while (attempts < 50) { // Safety break to avoid infinite loops
      const completedBranchIndex = branches.findIndex(b => isBranchComplete(b, levelConfig));

      if (completedBranchIndex === -1) {
        console.log('✅ Board is valid, no pre-completed branches.');
        return branches; // No completed branches found
      }

      console.log(`⚠️ Found completed branch at index ${completedBranchIndex}. Reshuffling...`);

      const completedBranch = branches[completedBranchIndex];
      const kanaToSwap = completedBranch.tiles[0].kana;

      // Find a branch to swap with
      let swapCandidateIndex = -1;
      for (let i = 0; i < branches.length; i++) {
        if (i === completedBranchIndex) continue;
        const candidateBranch = branches[i];
        if (candidateBranch.tiles.length > 0 && candidateBranch.tiles[candidateBranch.tiles.length - 1].kana !== kanaToSwap) {
          swapCandidateIndex = i;
          break;
        }
      }

      if (swapCandidateIndex !== -1) {
        // Swap the last tile
        const tileToMove = branches[completedBranchIndex].tiles.pop()!;
        const tileToReceive = branches[swapCandidateIndex].tiles.pop()!;
        branches[completedBranchIndex].tiles.push(tileToReceive);
        branches[swapCandidateIndex].tiles.push(tileToMove);
      } else {
        // Fallback: if no ideal swap found, just shuffle the whole board again
        // This is a brute-force but effective way to resolve tricky situations
        console.warn('Could not find a suitable swap partner. Shuffling all tiles.');
        const allTiles = branches.flatMap(b => b.tiles).sort(() => Math.random() - 0.5);
        let tileIndex = 0;
        branches.forEach(branch => {
          const newTileCount = branch.tiles.length;
          branch.tiles = allTiles.slice(tileIndex, tileIndex + newTileCount);
          tileIndex += newTileCount;
        });
      }
      attempts++;
    }

    console.error('❌ Failed to create a board without pre-completed branches after 50 attempts.');
    return initialBranches; // Return original if we can't fix it
  }, [isBranchComplete]);

  // Simple and reliable board generation
  const generateSolvableBoard = useCallback((levelConfig: LevelConfig, colorMap: Record<string, string>): Branch[] => {
    console.log(`🎮 Generating board for level ${levelConfig.level}`);
    
    // Create all tiles first - using tilesPerKana from level config
    const allTiles: KanaTile[] = [];
    levelConfig.kanaSubset.forEach((kana) => {
      const kanaData = HIRAGANA_SET.find(h => h.kana === kana);
      if (!kanaData) {
        console.warn(`⚠️ Kana not found in HIRAGANA_SET: ${kana}`);
        return;
      }
      
      // Create the specified number of tiles for this kana
      for (let i = 0; i < levelConfig.tilesPerKana; i++) {
        allTiles.push({
          id: `${kana}-${i}`,
          kana: kana,
          romaji: kanaData.romaji,
          color: colorMap[kana] || '#6b7280'
        });
      }
    });
    
    // Shuffle tiles thoroughly
    const shuffledTiles = [...allTiles].sort(() => Math.random() - 0.5);
    
    // Create branches
    const branches: Branch[] = [];
    for (let i = 0; i < levelConfig.branchCount; i++) {
      branches.push({
        id: `branch-${i}`,
        tiles: [],
        maxCapacity: levelConfig.branchCapacity,
        type: BranchType.NORMAL,
      });
    }
    
    // Distribute tiles using the proven strategy from memory
    // Fill branches densely, leaving some empty for strategy
    const tilesPerFilledBranch = levelConfig.branchCapacity;
    const branchesToFill = Math.min(levelConfig.branchCount - 1, Math.ceil(shuffledTiles.length / tilesPerFilledBranch));
    
    let tileIndex = 0;
    for (let branchIndex = 0; branchIndex < branchesToFill && tileIndex < shuffledTiles.length; branchIndex++) {
      const tilesToAdd = Math.min(tilesPerFilledBranch, shuffledTiles.length - tileIndex);
      
      for (let i = 0; i < tilesToAdd; i++) {
        branches[branchIndex].tiles.push(shuffledTiles[tileIndex]);
        tileIndex++;
      }
    }
    
    // Place remaining tiles
    while (tileIndex < shuffledTiles.length) {
      for (let branchIndex = 0; branchIndex < branchesToFill && tileIndex < shuffledTiles.length; branchIndex++) {
        if (branches[branchIndex].tiles.length < levelConfig.branchCapacity) {
          branches[branchIndex].tiles.push(shuffledTiles[tileIndex]);
          tileIndex++;
        }
      }
    }
    
    // Verify we placed all tiles
    const totalPlaced = branches.reduce((sum, branch) => sum + branch.tiles.length, 0);
    console.log(`📊 Placed ${totalPlaced}/${allTiles.length} tiles`);
    
    if (totalPlaced !== allTiles.length) {
      console.error(`❌ Lost tiles! Expected: ${allTiles.length}, Placed: ${totalPlaced}`);
    }

    // Ensure no branches are already completed
    const finalBranches = ensureNoCompletedBranches(branches, levelConfig);

    return finalBranches;
  }, [ensureNoCompletedBranches]);

  // Create initial state with solvable board generation
  const createInitialState = useCallback(() => {
    console.log(`🎮 Creating initial state for level ${level}`);
    const config = getLevelConfig(level);
    if (!config) {
      // Fallback to default config
      const defaultConfig: LevelConfig = {
        level: 1,
        name: "Default",
        description: "Default level",
        kanaCount: 5,
        tilesPerKana: 4,
        branchCount: 5,
        branchCapacity: 4,
        kanaSubset: ["あ", "い", "う", "え", "お"]
      };
      const kanaColorMap = generateKanaColorMap(defaultConfig.kanaSubset);
      const colorMapObject = Object.fromEntries(kanaColorMap);
      const solvableBranches = generateSolvableBoard(defaultConfig, colorMapObject);
      
      const newState = {
        branches: solvableBranches,
        selectedBranch: null,
        moves: 0,
        score: 0,
        isComplete: false,
        learnedKana: [],
        kanaColorMap,
        completedSets: new Set<string>(),
        levelState: LevelState.IDLE,
      };
      
      console.log(`📊 Default state created with score: ${newState.score}`);
      return newState;
    }

    const kanaColorMap = generateKanaColorMap(config.kanaSubset);
    const colorMapObject = Object.fromEntries(kanaColorMap);
    
    // Use solvable board generation for better gameplay
    const solvableBranches = generateSolvableBoard(config, colorMapObject);
    // Save initial preset snapshot
    initialBranchesRef.current = solvableBranches.map(b => ({
      id: b.id,
      maxCapacity: b.maxCapacity,
      tiles: b.tiles.map(t => ({ ...t }))
    }));
    
    const newState = {
      branches: solvableBranches,
      selectedBranch: null,
      moves: 0,
      score: 0,
      isComplete: false,
      learnedKana: [],
      kanaColorMap,
      completedSets: new Set<string>(),
      levelState: LevelState.IDLE,
    };
    
    console.log(`📊 Level ${level} state created with score: ${newState.score}`);
    return newState;
  }, [level, generateSolvableBoard]);

  const [gameState, setGameState] = useState<GameState>(() => createInitialState());
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Define state machine functions after gameState is available
  const setLevelState = useCallback((newState: LevelState) => {
    setGameState(prev => ({ ...prev, levelState: newState }));
  }, []);

  const transitionToState = useCallback((newState: LevelState) => {
    console.log(`🎮 State transition: ${gameState.levelState} → ${newState}`);
    setGameState(prev => ({ ...prev, levelState: newState }));
  }, [gameState.levelState]);
  const [gameHistory, setGameHistory] = useState<GameState[]>([]);
  const [showKanaPopup, setShowKanaPopup] = useState<{kana: string; romaji: string; learned: boolean} | null>(null);
  const [flippingTiles, setFlippingTiles] = useState<Set<string>>(new Set());
  const [sakuraAnimatingTiles, setSakuraAnimatingTiles] = useState<Set<string>>(new Set());
  // Track tiles that just moved to trigger micro drop animation in UI
  const [recentlyMovedTileIds, setRecentlyMovedTileIds] = useState<Set<string>>(new Set());
  const [selectedTileCount, setSelectedTileCount] = useState<number>(1);
  const [currentLevel, setCurrentLevel] = useState<number>(level);
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [gameStartTime, setGameStartTime] = useState<Date>(new Date());
  // Track branches that are in the process of disappearing (for animation)
  const [disappearingBranchIds, setDisappearingBranchIds] = useState<Set<string>>(new Set());
  // Force re-check of empty branches after removal
  const [emptyBranchCheckTrigger, setEmptyBranchCheckTrigger] = useState<number>(0);
  // Queue for sequential branch removal
  const [branchRemovalQueue, setBranchRemovalQueue] = useState<string[]>([]);
  // Track active animation timers to cancel on level transition
  const animationTimersRef = useRef<NodeJS.Timeout[]>([]);
  // Track if animations are currently in progress
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  // Global metric: total branches collected across games/levels
  const [branchesCollected, setBranchesCollected] = useState<number>(() => getPlayerProgress().branchesCollected || 0);
  // State for the end-of-level quiz
  const [quizState, setQuizState] = useState<{ 
    isOpen: boolean;
    kana: string;
    options: string[];
    correctAnswer: string;
    answered: boolean;
    wasCorrect: boolean | null;
  } | null>(null);

  // Clean up all active animation timers
  const cleanupAnimationTimers = useCallback(() => {
    console.log(`🧹 Cleaning up ${animationTimersRef.current.length} animation timers`);
    animationTimersRef.current.forEach(timer => {
      clearTimeout(timer);
    });
    animationTimersRef.current = [];
    setIsAnimating(false); // Reset animation state
  }, []);

  // Update game when level changes
  useEffect(() => {
    if (currentLevel !== level) {
      console.log(`🔄 Level transition: ${currentLevel} -> ${level}`);
      console.log(`📊 Current score before transition: ${gameStateRef.current.score}`);
      
      // Cancel all pending animation timers to prevent score updates after transition
      cleanupAnimationTimers();
      
      setCurrentLevel(level);
      const newState = createInitialState();
      console.log(`📊 New state score after createInitialState: ${newState.score}`);
      setGameState(newState);
      console.log(`📊 GameState set - checking if update is synchronous...`);
      // Note: setGameState is async, so we can't immediately check the updated value
      // But we can add a useEffect to monitor gameState changes
      setGameHistory([]);
      setShowKanaPopup(null);
      setFlippingTiles(new Set());
      setSakuraAnimatingTiles(new Set());
      setSelectedTileCount(1);
      setIsLevelComplete(false);
      setNewAchievements([]);
      setGameStartTime(new Date());
      setDisappearingBranchIds(new Set());
      setBranchRemovalQueue([]);
      
      // Track game start telemetry
      const config = getLevelConfig(level);
      const kanaCount = config?.kanaCount || HIRAGANA_SET.length;
      telemetry.trackGameStart(`level_${level}`, kanaCount);
      
      console.log(`✅ Level ${level} initialized with score: ${newState.score}`);
    }
  }, [level, currentLevel, createInitialState, cleanupAnimationTimers]);

  // Monitor gameState changes for debugging
  useEffect(() => {
    console.log(`🔄 GameState updated - score: ${gameState.score}, level: ${currentLevel}, moves: ${gameState.moves}`);
  }, [gameState.score, gameState.moves, currentLevel]);

  // Initialize game start time
  useEffect(() => {
    setGameStartTime(new Date());
    
    // Clean up all timers on component unmount
    return () => {
      cleanupAnimationTimers();
    };
  }, [cleanupAnimationTimers]);

  // Handle level completion
  useEffect(() => {
    if (gameState.isComplete && !isLevelComplete && !quizState) {
      setIsLevelComplete(true);

      // --- Start of Quiz Generation ---
      const levelConfig = getLevelConfig(currentLevel);
      if (levelConfig && levelConfig.kanaSubset.length > 0) {
        // Pick a random kana from the level
        const questionKana = levelConfig.kanaSubset[Math.floor(Math.random() * levelConfig.kanaSubset.length)];
        const kanaInfo = HIRAGANA_SET.find(k => k.kana === questionKana);

        if (kanaInfo) {
          const correctAnswer = kanaInfo.romaji;

          // Get 3 other random options
          const otherOptions = HIRAGANA_SET
            .filter(k => k.romaji !== correctAnswer)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(k => k.romaji);

          const options = [...otherOptions, correctAnswer].sort(() => 0.5 - Math.random());

          console.log(`🧠 Generating quiz for level ${currentLevel}. Kana: ${questionKana}`);
          setQuizState({
            isOpen: true,
            kana: questionKana,
            options,
            correctAnswer,
            answered: false,
            wasCorrect: null,
          });
        } else {
          // If for some reason we can't generate a quiz, just proceed
          setIsLevelComplete(false); // Allow the final screen to show
        }
      } else {
        // No kana in level, can't make a quiz
        setIsLevelComplete(false);
      }
      // --- End of Quiz Generation ---
    }
  }, [gameState.isComplete, isLevelComplete, currentLevel, quizState]);

  // Enforce: at most 2 EMPTY branches on the board
  // Use queue-based approach for reliable sequential removal
  useEffect(() => {
    try {
      // Do not trigger disappearing/wave replacement after level is complete
      if (gameState.isComplete) {
        console.log('✅ Level complete - skipping empty branch checks and replacements');
        return;
      }
      // Only run the effect when branches change or when we need to re-check
      const emptyBranchIds: string[] = [];
      gameState.branches.forEach((b) => {
        // Treat branches without explicit type as NORMAL, and only exclude WAVE branches
        if (b.tiles.length === 0 && b.type !== BranchType.WAVE) emptyBranchIds.push(b.id);
      });

      console.log(`🌿 Empty branches check: found ${emptyBranchIds.length} empty normal branches (threshold ${MAX_EMPTY_NORMAL_BRANCHES}), disappearing: ${disappearingBranchIds.size}, queue: ${branchRemovalQueue.length}`);
      console.log(`📊 Total branches: ${gameState.branches.length}`);

      // Guard: Do not replace branches if there is one or fewer kana sets left on the board
      const remainingKana = new Set<string>();
      for (const b of gameState.branches) {
        for (const t of b.tiles) remainingKana.add(t.kana);
      }
      const remainingSets = remainingKana.size;
      if (remainingSets <= 1) {
        console.log(`🛑 Skipping wave replacement: only ${remainingSets} kana set(s) left`);
        return;
      }

      // If at or below threshold, don't replace anything
      if (emptyBranchIds.length <= MAX_EMPTY_NORMAL_BRANCHES) {
        console.log(`✅ Empty branches count is OK: ${emptyBranchIds.length} <= ${MAX_EMPTY_NORMAL_BRANCHES}`);
        return;
      }

      // Previously: do not replace on small boards (<=6). Removed to ensure replacement always triggers when needed.
      // if (gameState.branches.length <= 6) {
      //   console.log(`✅ Total branches count is OK: ${gameState.branches.length} <= 6 - no removal needed for gameplay`);
      //   return;
      // }

      // If there's already a branch disappearing or in queue, don't add more
      if (disappearingBranchIds.size > 0 || branchRemovalQueue.length > 0) {
        console.log(`⏳ Waiting for current removal to finish. Disappearing: ${disappearingBranchIds.size}, Queue: ${branchRemovalQueue.length}`);
        return;
      }

      // Find the visually lowest empty branch considering 2-column layout
      // Left column: indices [0 .. leftCount-1], Right column: indices [leftCount .. total-1]
      const total = gameState.branches.length;
      const leftCount = Math.ceil(total / 2);

      const emptyBranchesWithPlacement = emptyBranchIds.map(id => {
        const pos = gameState.branches.findIndex(b => b.id === id);
        if (pos < 0) {
          console.warn(`⚠️ Empty branch id not found in current array order: ${id}`);
          return { id, pos: -1, row: -1, isRight: false };
        }
        const isRight = pos >= leftCount;
        const row = isRight ? (pos - leftCount) : pos; // 0-based visual row across both columns
        return { id, pos, row, isRight };
      }).filter(b => b.pos >= 0);

      if (emptyBranchesWithPlacement.length === 0) {
        console.warn(`⚠️ No valid empty branches found to remove`);
        return;
      }

      // Prefer the lowest row; if tie, prefer right column (so the bottom-most right disappears first)
      const branchVisuallyLowest = emptyBranchesWithPlacement.reduce((best, cur) => {
        if (!best) return cur;
        if (cur.row > best.row) return cur;
        if (cur.row === best.row) {
          if (cur.isRight && !best.isRight) return cur; // prefer right on same row
          if (cur.isRight === best.isRight) return cur.pos > best.pos ? cur : best; // fallback to deeper position
        }
        return best;
      }, emptyBranchesWithPlacement[0]);

      const idToRemove = branchVisuallyLowest.id;
      const branchToRemove = gameState.branches.find(b => b.id === idToRemove);
      
      if (!branchToRemove) {
        console.warn(`⚠️ Branch to remove not found: ${idToRemove}`);
        return;
      }

      console.log(`🌊 Adding branch to wave replacement queue: ${idToRemove} (${emptyBranchIds.length} -> ${emptyBranchIds.length - 1})`);
      console.log(`📋 Total branches: ${gameState.branches.length} (will remain same after replacement)`);
      
      // Add to queue
      setBranchRemovalQueue([idToRemove]);
    } catch (error) {
      console.error('❌ Error in empty branch check:', error);
    }
  }, [gameState.branches, disappearingBranchIds, branchRemovalQueue, emptyBranchCheckTrigger, gameState.isComplete]);

  // Process branch wave replacement queue
  useEffect(() => {
    // Stop processing if the level is complete
    if (gameState.isComplete) {
      if (branchRemovalQueue.length > 0) {
        console.log('✅ Level complete - clearing branch replacement queue');
        setBranchRemovalQueue([]);
      }
      return;
    }
    // Guard: if there is one or fewer kana sets left, do not process replacements
    const remainingKana = new Set<string>();
    for (const b of gameState.branches) {
      for (const t of b.tiles) remainingKana.add(t.kana);
    }
    const remainingSets = remainingKana.size;
    if (remainingSets <= 1) {
      if (branchRemovalQueue.length > 0) {
        console.log(`🛑 Skipping queue processing: only ${remainingSets} kana set(s) left. Clearing queue.`);
        setBranchRemovalQueue([]);
      }
      return;
    }
    if (branchRemovalQueue.length === 0) return;
    
    try {
      const idToReplace = branchRemovalQueue[0];
      const branchToReplace = gameState.branches.find(b => b.id === idToReplace);
      if (!branchToReplace) {
        console.warn(`⚠️ Branch to replace not found in queue processing: ${idToReplace}`);
        // Branch not found, remove from queue
        setBranchRemovalQueue(prev => prev.slice(1));
        return;
      }

      console.log(`🚀 Processing branch wave replacement from queue: ${idToReplace}`);

      // Mark as disappearing to trigger UI animation
      setDisappearingBranchIds(prev => new Set(prev).add(idToReplace));

      // After animation duration, replace the branch with wave
      const ANIMATION_DURATION_MS = 350;
      const removalTimer = setTimeout(() => {
        try {
          setGameState(prev => {
            const nextBranches = prev.branches.map((b) => 
              b.id === idToReplace ? { ...b, type: BranchType.WAVE, tiles: [] } : b
            );
            const nextSelected = prev.selectedBranch === idToReplace ? null : prev.selectedBranch;
            
            const remainingEmpty = nextBranches.filter(b => b.tiles.length === 0 && b.type === BranchType.NORMAL).length;
            console.log(`✅ Branch ${idToReplace} replaced with wave. Total branches: ${nextBranches.length}, normal empty: ${remainingEmpty}`);
            
            return { ...prev, branches: nextBranches, selectedBranch: nextSelected };
          });

          // Increment global branches collected counter and sync local state
          try {
            const updated = incrementBranchesCollected(1);
            setBranchesCollected(updated.branchesCollected);
            console.log(`🌊 branchesCollected incremented: ${updated.branchesCollected}`);
          } catch (e) {
            console.warn('⚠️ Failed to increment branchesCollected', e);
          }
          
          // Clear disappearing state and remove from queue
          const cleanupTimer = setTimeout(() => {
            try {
              setDisappearingBranchIds(prev => {
                const next = new Set(prev);
                next.delete(idToReplace);
                return next;
              });
              
              // Remove from queue
              setBranchRemovalQueue(prev => prev.slice(1));
              
              // Trigger a re-check by incrementing the trigger
              setEmptyBranchCheckTrigger(prev => prev + 1);
              
              console.log(`🎯 Branch wave replacement process completed for: ${idToReplace}`);
            } catch (error) {
              console.error('❌ Error in branch wave replacement cleanup:', error);
              // Force cleanup even if there's an error
              setDisappearingBranchIds(prev => {
                const next = new Set(prev);
                next.delete(idToReplace);
                return next;
              });
              setBranchRemovalQueue(prev => prev.slice(1));
            }
          }, 50);
          
          // Store timer ID for cleanup
          (cleanupTimer as unknown as { isBranchCleanup?: boolean }).isBranchCleanup = true;
        } catch (error) {
          console.error('❌ Error in branch wave replacement execution:', error);
          // Force cleanup even if there's an error
          setDisappearingBranchIds(prev => {
            const next = new Set(prev);
            next.delete(idToReplace);
            return next;
          });
          setBranchRemovalQueue(prev => prev.slice(1));
        }
      }, ANIMATION_DURATION_MS);
      
      // Store timer ID for cleanup
      (removalTimer as unknown as { isBranchRemoval?: boolean }).isBranchRemoval = true;
      
      // Cleanup function to clear timers if component unmounts
      return () => {
        clearTimeout(removalTimer);
        // Clear any cleanup timers that might be pending
        const timersToClear: NodeJS.Timeout[] = [];
        // This is a simplified approach - in a real app, we'd use a proper timer management system
        // For now, we'll just rely on the useEffect cleanup mechanism
      };
    } catch (error) {
      console.error('❌ Error in branch removal queue processing:', error);
      // Clear the queue to prevent infinite loops
      setBranchRemovalQueue([]);
    }
  }, [branchRemovalQueue, gameState.branches, gameState.isComplete]);

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
    const levelConfig = getLevelConfig(level);

    branches.forEach(branch => {
      if (branch.tiles.length === levelConfig.tilesPerKana && 
          branch.tiles.every(tile => tile.kana === branch.tiles[0].kana)) {
        completed.push(branch.tiles[0].kana);
        // Replace completed branch with empty one in the same position
        updatedBranches.push({
          ...branch,
          tiles: [],
        });
      } else {
        updatedBranches.push(branch);
      }
    });

    return { completed, updatedBranches };
  }, [level]);

  // Sakura animation for SMART_FLIP mode
  const animateSakuraCompletion = useCallback((completedBranches: Branch[], newBranches: Branch[]) => {
    console.log('🌸 Starting sakura animation for completed branches:', completedBranches.length);
    
    // Update score IMMEDIATELY but keep tiles for animation
    setGameState(currentState => {
      const { completed: newCompleted } = checkForCompletion(currentState.branches);
      const newLearnedKanaAfter = [...new Set([...currentState.learnedKana, ...newCompleted])];
      const isCompleteAfter = currentState.branches.every(branch => {
        // Check if branch is completed (all tiles matched) but don't remove tiles yet
        return branch.tiles.length === 0 || completedBranches.some(cb => cb.id === branch.id);
      });
      
      // Calculate new completed sets and update score
      const newCompletedSets = new Set(currentState.completedSets);
      let scoreIncrease = 0;
      
      completedBranches.forEach(branch => {
        const setKey = `${branch.tiles[0].kana}-${branch.id}`;
        if (!newCompletedSets.has(setKey)) {
          newCompletedSets.add(setKey);
          scoreIncrease += 100;
          console.log(`🎯 Set completed: ${branch.tiles[0].kana} on branch ${branch.id}, +100 points`);
          
          // Track set completion telemetry
          telemetry.trackSetCompleted(newCompletedSets.size, currentState.score + scoreIncrease);
        }
      });
      
      const newScore = currentState.score + scoreIncrease;
      
      return {
        ...currentState,
        learnedKana: newLearnedKanaAfter,
        isComplete: isCompleteAfter,
        score: newScore,
        completedSets: newCompletedSets,
        // Keep branches as they are for animation
      };
    });
    
    // Now start the animation as a visual effect only
    setIsAnimating(true);
    
    // Start sakura animation immediately without flipping tiles first
    const initialTimer = setTimeout(() => {
      // Animate each completed branch with sakura effect
      completedBranches.forEach((branch, branchIndex) => {
        // Add all tiles to sakura animation simultaneously for a more dramatic effect
        branch.tiles.forEach((tile, tileIndex) => {
          const tileTimer = setTimeout(() => {
            setSakuraAnimatingTiles(prev => new Set([...prev, tile.id]));
          }, branchIndex * 150 + tileIndex * 80); // Slightly faster stagger for smoother effect
          animationTimersRef.current.push(tileTimer);
        });
      });
      
      // After all sakura animations start, remove tiles and clear animation state
      // Use dynamic tile count instead of hardcoded 4
      const maxTilesPerBranch = completedBranches.reduce((max, b) => Math.max(max, b.tiles.length), 0);
      const totalAnimationTime = completedBranches.length * 150 + maxTilesPerBranch * 80 + 1800; // Extra time for sakura to fall
      const cleanupTimer = setTimeout(() => {
        setSakuraAnimatingTiles(new Set());
        
        // Now actually remove the tiles from branches
        setGameState(currentState => {
          const { completed: newCompleted, updatedBranches: finalBranches } = checkForCompletion(currentState.branches);
          return {
            ...currentState,
            branches: finalBranches,
            learnedKana: [...new Set([...currentState.learnedKana, ...newCompleted])],
          };
        });
        
        setIsAnimating(false); // Animation complete
      }, totalAnimationTime);
      animationTimersRef.current.push(cleanupTimer);
    }, 50); // Reduced delay for more immediate response
    animationTimersRef.current.push(initialTimer);
  }, [checkForCompletion]);

  // Regular flip animation for other display modes
  const animateFlipCompletion = useCallback((completedBranches: Branch[], newBranches: Branch[]) => {
    console.log('🎉 Starting flip animation for completed branches:', completedBranches.length);
    
    // Update score IMMEDIATELY but keep tiles for animation
    setGameState(currentState => {
      const { completed: newCompleted } = checkForCompletion(currentState.branches);
      const newLearnedKanaAfter = [...new Set([...currentState.learnedKana, ...newCompleted])];
      const isCompleteAfter = currentState.branches.every(branch => {
        // Check if branch is completed (all tiles matched) but don't remove tiles yet
        return branch.tiles.length === 0 || completedBranches.some(cb => cb.id === branch.id);
      });
      
      // Calculate new completed sets and update score
      const newCompletedSets = new Set(currentState.completedSets);
      let scoreIncrease = 0;
      
      completedBranches.forEach(branch => {
        const setKey = `${branch.tiles[0].kana}-${branch.id}`;
        if (!newCompletedSets.has(setKey)) {
          newCompletedSets.add(setKey);
          scoreIncrease += 100;
          console.log(`🎯 Set completed: ${branch.tiles[0].kana} on branch ${branch.id}, +100 points`);
          
          // Track set completion telemetry
          telemetry.trackSetCompleted(newCompletedSets.size, currentState.score + scoreIncrease);
        }
      });
      
      const newScore = currentState.score + scoreIncrease;

      return {
        ...currentState,
        learnedKana: newLearnedKanaAfter,
        isComplete: isCompleteAfter,
        score: newScore,
        completedSets: newCompletedSets,
        // Keep branches as they are for animation
      };
    });
    
    // Now start the animation as a visual effect only
    setIsAnimating(true);
    
    const initialTimer = setTimeout(() => {
      // Animate each completed branch sequentially
      completedBranches.forEach((branch, branchIndex) => {
        const branchIndexInGame = newBranches.findIndex(b => b.id === branch.id);
        const isRightColumn = branchIndexInGame >= Math.ceil(newBranches.length / 2);
        // Use dynamic tile indices based on actual tiles in the branch (tilesPerKana)
        const tilesCount = branch.tiles.length;
        const tileIndices = Array.from({ length: tilesCount }, (_, i) => tilesCount - 1 - i);

        tileIndices.forEach((tileIndex, animationIndex) => {
          const tileTimer = setTimeout(() => {
            const tileId = branch.tiles[tileIndex].id;
            setFlippingTiles(prev => new Set([...prev, tileId]));
          }, branchIndex * 500 + animationIndex * 400);
          animationTimersRef.current.push(tileTimer);
        });
      });
      
      // After all animations, remove tiles and clear flipping state
      // Use dynamic tiles count rather than hardcoded 4
      const maxTilesPerBranch = completedBranches.reduce((max, b) => Math.max(max, b.tiles.length), 0);
      const totalAnimationTime = completedBranches.length * 500 + maxTilesPerBranch * 400 + 500;
      const cleanupTimer = setTimeout(() => {
        setFlippingTiles(new Set());
        
        // Now actually remove the tiles from branches
        setGameState(currentState => {
          const { completed: newCompleted, updatedBranches: finalBranches } = checkForCompletion(currentState.branches);
          return {
            ...currentState,
            branches: finalBranches,
            learnedKana: [...new Set([...currentState.learnedKana, ...newCompleted])],
          };
        });
        
        setIsAnimating(false); // Animation complete
      }, totalAnimationTime);
      animationTimersRef.current.push(cleanupTimer);
    }, 100);
    animationTimersRef.current.push(initialTimer);
  }, [checkForCompletion]);

  // Simple scoring: +100 points for each completed set
  const computeScore = useCallback((completedSetsCount: number): number => {
    return completedSetsCount * 100;
  }, []);

  const moveTile = useCallback((sourceBranchId: string, targetBranchId: string) => {
    console.log('🎲 moveTile called:', { from: sourceBranchId, to: targetBranchId });
    if (sourceBranchId === targetBranchId) {
      console.log('❌ Same branch, aborting');
      return;
    }

    setGameState(prevState => {
      const sourceBranch = prevState.branches.find(b => b.id === sourceBranchId);
      const targetBranch = prevState.branches.find(b => b.id === targetBranchId);

      console.log('🔍 Branches found:', {
        source: sourceBranch ? `${sourceBranch.tiles.length} tiles` : 'NOT FOUND',
        target: targetBranch ? `${targetBranch.tiles.length}/${targetBranch.maxCapacity} tiles` : 'NOT FOUND'
      });

      if (!sourceBranch || !targetBranch || sourceBranch.tiles.length === 0) {
        console.log('❌ Invalid branches or empty source');
        return prevState;
      }

      // Get the tiles to move (consecutive identical tiles from the end)
      const consecutiveCount = Math.min(selectedTileCount, getConsecutiveCount(sourceBranch));
      const tilesToMove = sourceBranch.tiles.slice(-consecutiveCount);
      const topTile = tilesToMove[tilesToMove.length - 1];

      console.log('🎴 Tiles to move:', {
        count: consecutiveCount,
        selectedTileCount,
        topTile: topTile?.kana,
        targetTopTile: targetBranch.tiles.length > 0 ? targetBranch.tiles[targetBranch.tiles.length - 1].kana : 'empty'
      });

      // Check if we can place the top tile
      if (!canPlaceTile(topTile, targetBranch)) {
        console.log('❌ Cannot place tile - validation failed');
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

      // Get level config for tilesPerKana
      const levelConfig = getLevelConfig(level);
      const tilesNeeded = levelConfig.tilesPerKana;
      
      // Check for completions manually (without removing tiles yet)
      const completed: string[] = [];
      const tilesToDisappear = new Set<string>();
      
      newBranches.forEach(branch => {
        if (branch.tiles.length === tilesNeeded && branch.tiles.every(tile => tile.kana === branch.tiles[0].kana)) {
          completed.push(branch.tiles[0].kana);
          branch.tiles.forEach(tile => tilesToDisappear.add(tile.id));
        }
      });

      // Handle completions with appropriate animation based on display mode
      if (completed.length > 0) {
        console.log('🎉 Completed kana detected:', completed);
        
        // Find completed branches
        const completedBranches = newBranches.filter(branch => 
          branch.tiles.length === tilesNeeded && branch.tiles.every(tile => tile.kana === branch.tiles[0].kana)
        );
        
        // Choose animation based on display mode
        if (displayMode === DisplayMode.SMART_FLIP) {
          animateSakuraCompletion(completedBranches, newBranches);
        } else {
          animateFlipCompletion(completedBranches, newBranches);
        }
        
        // Return current state for now
        const newLearnedKana = [...new Set([...prevState.learnedKana, ...completed])];
        
        return {
          branches: newBranches,
          selectedBranch: null,
          moves: newMoves,
          score: prevState.score, // Score will be updated after animation
          isComplete: false,
          learnedKana: newLearnedKana,
          kanaColorMap: prevState.kanaColorMap,
          completedSets: prevState.completedSets,
          levelState: LevelState.RESOLVING, // Переходим в состояние обработки завершенных наборов
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
        score: prevState.score,
        isComplete,
        learnedKana: prevState.learnedKana,
        kanaColorMap: prevState.kanaColorMap,
        completedSets: prevState.completedSets,
        levelState: isComplete ? LevelState.CELEBRATING : LevelState.IDLE,
      };
    });
  }, [canPlaceTile, checkForCompletion, toast, getConsecutiveCount, selectedTileCount, hasValidMoves, displayMode, animateFlipCompletion, animateSakuraCompletion, level]);

  const selectBranch = useCallback((branchId: string) => {
    console.log('🎯 selectBranch called:', branchId);
    setGameState(prevState => {
      const branch = prevState.branches.find(b => b.id === branchId);
      
      if (!branch) {
        console.log('❌ Branch not found:', branchId);
        return prevState;
      }

      console.log('🌿 Branch found:', { id: branchId, tilesCount: branch.tiles.length, selectedBranch: prevState.selectedBranch });

      // If no branch selected and this branch has tiles, select it
      if (!prevState.selectedBranch && branch.tiles.length > 0) {
        console.log('✅ Selecting branch with tiles:', branchId);
        // Play sound for the top tile when selecting a branch
        const topTile = branch.tiles[branch.tiles.length - 1];
        if (topTile) {
          playMoveSound(topTile.kana);
        }
        // Set the count of consecutive identical tiles to select
        const consecutiveCount = getConsecutiveCount(branch);
        setSelectedTileCount(consecutiveCount);
        return { ...prevState, selectedBranch: branchId, levelState: LevelState.PICKING };
      }

      // If this is the selected branch, deselect
      if (prevState.selectedBranch === branchId) {
        console.log('🔄 Deselecting branch:', branchId);
        return { ...prevState, selectedBranch: null, levelState: LevelState.IDLE };
      }

      // If another branch is selected, try to move tile
      if (prevState.selectedBranch) {
        console.log('🚀 Attempting to move from', prevState.selectedBranch, 'to', branchId);
        
        // Perform the move directly here instead of calling moveTile
        const sourceBranch = prevState.branches.find(b => b.id === prevState.selectedBranch);
        const targetBranch = prevState.branches.find(b => b.id === branchId);

        if (!sourceBranch || !targetBranch || sourceBranch.tiles.length === 0) {
          console.log('❌ Invalid branches or empty source');
          return { ...prevState, selectedBranch: null, levelState: LevelState.IDLE };
        }

        // Get the tiles to move (consecutive identical tiles from the end)
        const consecutiveCount = Math.min(selectedTileCount, getConsecutiveCount(sourceBranch));
        const tilesToMove = sourceBranch.tiles.slice(-consecutiveCount);
        const topTile = tilesToMove[tilesToMove.length - 1];

        console.log('🎴 Tiles to move:', {
          count: consecutiveCount,
          selectedTileCount,
          topTile: topTile?.kana,
          targetTopTile: targetBranch.tiles.length > 0 ? targetBranch.tiles[targetBranch.tiles.length - 1].kana : 'empty'
        });

        // Check if we can place the top tile
        if (!canPlaceTile(topTile, targetBranch)) {
          console.log('❌ Cannot place tile - validation failed');
          toast({
            title: "Invalid move",
            description: "You can only place tiles on empty branches or on tiles of the same kana.",
            variant: "destructive",
          });
          return { ...prevState, selectedBranch: null, levelState: LevelState.IDLE };
        }

        // Check if target branch has enough space
        if (targetBranch.tiles.length + tilesToMove.length > targetBranch.maxCapacity) {
          toast({
            title: "Invalid move", 
            description: "Not enough space in the target branch.",
            variant: "destructive",
          });
          return { ...prevState, selectedBranch: null, levelState: LevelState.IDLE };
        }

        // Save current state to history
        setGameHistory(prev => [...prev, prevState]);

        // Create new branches array with the move
        const newBranches = prevState.branches.map(branch => {
          if (branch.id === prevState.selectedBranch) {
            return { ...branch, tiles: branch.tiles.slice(0, -consecutiveCount) };
          }
          if (branch.id === branchId) {
            return { ...branch, tiles: [...branch.tiles, ...tilesToMove] };
          }
          return branch;
        });

        const newMoves = prevState.moves + 1;

        // Get level config for tilesPerKana
        const levelConfig = getLevelConfig(level);
        const tilesNeeded = levelConfig.tilesPerKana;

        // Check for completions manually (without removing tiles yet)
        const completed: string[] = [];
        const tilesToDisappear = new Set<string>();
        
        newBranches.forEach(branch => {
          if (branch.tiles.length === tilesNeeded && branch.tiles.every(tile => tile.kana === branch.tiles[0].kana)) {
            completed.push(branch.tiles[0].kana);
            branch.tiles.forEach(tile => tilesToDisappear.add(tile.id));
          }
        });

        // Signal UI about just moved tiles to play micro drop animation
        try {
          const movedIds = new Set<string>(tilesToMove.map(t => t.id));
          setRecentlyMovedTileIds(movedIds);
          const clearDropTimer = setTimeout(() => {
            setRecentlyMovedTileIds(new Set());
          }, 180);
          animationTimersRef.current.push(clearDropTimer);
        } catch (e) {
          // no-op safeguard
        }

        // If we completed any set(s), run appropriate animation based on display mode
        if (completed.length > 0) {
          console.log('🎉 Completed kana detected (selectBranch):', completed);

          const completedBranches = newBranches.filter(branch => 
            branch.tiles.length === tilesNeeded && branch.tiles.every(tile => tile.kana === branch.tiles[0].kana)
          );

          // Choose animation based on display mode
          if (displayMode === DisplayMode.SMART_FLIP) {
            animateSakuraCompletion(completedBranches, newBranches);
          } else {
            animateFlipCompletion(completedBranches, newBranches);
          }

          // Return interim state now (before removal), so UI shows flipping state
          const newLearnedKanaNow = [...new Set([...prevState.learnedKana, ...completed])];
          return {
            branches: newBranches,
            selectedBranch: null,
            moves: newMoves,
            score: prevState.score, // Score will be updated after animation
            isComplete: false,
            learnedKana: newLearnedKanaNow,
            kanaColorMap: prevState.kanaColorMap,
            completedSets: prevState.completedSets,
            levelState: LevelState.RESOLVING, // Переходим в состояние обработки завершенных наборов
          };
        }

        // No completions - normal flow (with deadlock check)
        const { completed: normalCompleted, updatedBranches } = checkForCompletion(newBranches);
        const isComplete = updatedBranches.every(branch => branch.tiles.length === 0);
        
        const hasMovesAvailable = hasValidMoves(updatedBranches);
        // Toast notification removed - now using GameOverModal component

        return {
          branches: updatedBranches,
          selectedBranch: null,
          moves: newMoves,
          score: prevState.score,
          isComplete,
          learnedKana: prevState.learnedKana,
          kanaColorMap: prevState.kanaColorMap,
          completedSets: prevState.completedSets,
          levelState: isComplete ? LevelState.CELEBRATING : LevelState.IDLE,
        };
      }

      return prevState;
    });
  }, [canPlaceTile, checkForCompletion, getConsecutiveCount, hasValidMoves, selectedTileCount, toast, displayMode, animateFlipCompletion, animateSakuraCompletion, level]);

  const undoMove = useCallback(() => {
    if (gameHistory.length > 0) {
      const previousState = gameHistory[gameHistory.length - 1];
      
      // Deduct 10 points for undo, but don't go below 0
      const newScore = Math.max(0, previousState.score - 10);
      console.log(`↩️ Undo move: ${previousState.score} -> ${newScore} (-10 points)`);
      
      // Track undo usage telemetry
      telemetry.trackUndoUsed(previousState.score, newScore);
      
      setGameState({
        ...previousState,
        selectedBranch: null,
        score: newScore
      });
      setGameHistory(prev => prev.slice(0, -1));

      // Decrement global branches collected on undo (cannot go below 0)
      try {
        const updated = incrementBranchesCollected(-1);
        setBranchesCollected(updated.branchesCollected);
        console.log(`↩️ branchesCollected decremented due to Undo: ${updated.branchesCollected}`);
      } catch (e) {
        console.warn('⚠️ Failed to decrement branchesCollected on Undo', e);
      }
    }
  }, [gameHistory]);

  const resetGame = useCallback(() => {
    // Reset all states
    setGameState(createInitialState());
    setGameHistory([]);
    setShowKanaPopup(null);
    setFlippingTiles(new Set());
    setSakuraAnimatingTiles(new Set());
    setSelectedTileCount(1);
    setIsLevelComplete(false);
    setNewAchievements([]);
    setGameStartTime(new Date());
    setDisappearingBranchIds(new Set());
    // Decrement global branches collected on Shuffle (new layout)
    try {
      const updated = incrementBranchesCollected(-1);
      setBranchesCollected(updated.branchesCollected);
      console.log(`🔀 branchesCollected decremented due to Shuffle: ${updated.branchesCollected}`);
    } catch (e) {
      console.warn('⚠️ Failed to decrement branchesCollected on Shuffle', e);
    }
  }, [createInitialState]);

  // Restart to the initially generated preset (no reshuffle)
  const restartPreset = useCallback(() => {
    console.log("🔄 Restarting to initial preset...");
    const snapshot = initialBranchesRef.current;

    if (!snapshot) {
      console.warn("⚠️ No initial preset snapshot found. Falling back to full shuffle.");
      resetGame();
      return;
    }

    console.log("✅ Snapshot found. Restoring from:", JSON.parse(JSON.stringify(snapshot)));

    // Deep copy snapshot to avoid mutations
    const newBranches = snapshot.map(b => ({
      ...b,
      tiles: b.tiles.map(t => ({ ...t }))
    }));

    setGameState(prev => {
      const newState = {
        ...prev,
        branches: newBranches,
        selectedBranch: null,
        moves: 0,
        score: 0,
        isComplete: false,
        completedSets: new Set<string>(),
      };
      console.log(" board state after restore:", JSON.parse(JSON.stringify(newState.branches)));
      return newState;
    });

    setGameHistory([]);
    setShowKanaPopup(null);
    setFlippingTiles(new Set());
    setSakuraAnimatingTiles(new Set());
    setSelectedTileCount(1);
    setIsLevelComplete(false);
    setNewAchievements([]);
    setGameStartTime(new Date());
    setDisappearingBranchIds(new Set());

    // Decrement global branches collected on Restart preset
    try {
      const updated = incrementBranchesCollected(-1);
      setBranchesCollected(updated.branchesCollected);
      console.log(`🔁 branchesCollected decremented due to Restart: ${updated.branchesCollected}`);
    } catch (e) {
      console.warn('⚠️ Failed to decrement branchesCollected on Restart', e);
    }
  }, [resetGame]);

  // Zero out moves and clear undo history, keeping the current board
  const resetMoves = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      moves: 0,
    }));
    setGameHistory([]);
    setGameStartTime(new Date()); // Reset timer for achievements
  }, []);

  const handleQuizAnswer = useCallback((answer: string) => {
    if (!quizState) return;

    const isCorrect = answer === quizState.correctAnswer;
    let finalScore = gameState.score;

    if (isCorrect) {
      finalScore += 100;
      console.log('✅ Correct quiz answer, +100 points');
    } else {
      console.log('❌ Incorrect quiz answer');
    }

    setQuizState(prev => prev ? { ...prev, answered: true, wasCorrect: isCorrect } : null);

    // Wait a moment before closing the quiz and updating the score
    setTimeout(() => {
      setGameState(prev => ({ ...prev, score: finalScore }));
      setQuizState(null); // Close and reset quiz state

      // --- Finalize Level Completion after Quiz ---
      const gameEndTime = new Date();
      const timeSpent = Math.floor((gameEndTime.getTime() - gameStartTime.getTime()) / 1000);
      const gameSession: GameSession = {
        level: currentLevel,
        score: finalScore,
        moves: gameState.moves,
        timeSpent,
        learnedKana: gameState.learnedKana,
        isPerfect: false, // Can't be perfect if there was a quiz
        completedAt: gameEndTime
      };

      // Update streak
      const updatedStreak = updateStreak();

      // Check for new achievements with final score
      const unlockedAchievements = checkAndUnlockAchievements(gameSession);
      if (unlockedAchievements.length > 0) {
        setNewAchievements(unlockedAchievements);
      }

      // Add to leaderboard with final score
      addLeaderboardEntry(currentLevel, finalScore, gameState.moves, timeSpent, gameState.learnedKana.length);

      // Save progress with final score
      updateProgressAfterLevel(currentLevel, finalScore, gameState.moves, gameState.learnedKana);

      // Track level complete telemetry
      telemetry.trackLevelComplete(finalScore);

      console.log('Level completed! Final score:', finalScore);
      console.log('Streak updated:', updatedStreak);
      console.log('New achievements after quiz:', unlockedAchievements);

    }, 1500); // Show result for 1.5s

  }, [quizState, gameState.score, currentLevel, gameState.moves, gameState.learnedKana, gameStartTime]);


  const closeKanaPopup = useCallback(() => {
    setShowKanaPopup(null);
  }, []);

  return {
    gameState,
    selectBranch,
    undoMove,
    resetGame,
    restartPreset,
    resetMoves,
    canUndo: gameHistory.length > 0,
    showKanaPopup,
    closeKanaPopup,
    quizState,
    handleQuizAnswer,
    flippingTiles,
    sakuraAnimatingTiles,
    recentlyMovedTileIds,
    selectedTileCount,
    currentLevel,
    isLevelComplete,
    isAnimating,
    hasValidMoves: () => hasValidMoves(gameState.branches),
    newAchievements,
    clearNewAchievements: () => setNewAchievements([]),
    disappearingBranchIds,
    branchesCollected,
    // State machine functions
    setLevelState,
    transitionToState,
  };
};