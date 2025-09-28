import React from "react";
import { Branch, KanaTile, BranchType } from "@/types/game";
import { GameTile } from "./GameTile";
import { SakuraBranch } from "@/components/ui/SakuraBranch";
import { cn } from "@/lib/utils";

interface GameBranchProps {
  branch: Branch;
  selectedBranch: string | null;
  onBranchClick: (branchId: string) => void;
  canPlace: boolean;
  align: 'left' | 'right';
  flippingTiles?: Set<string>;
  sakuraAnimatingTiles?: Set<string>;
  selectedTileCount?: number;
  getShouldShowRomaji?: (branch: Branch, tileIndex: number, align: 'left' | 'right') => boolean;
  isLargeMode?: boolean;
  isDisappearing?: boolean;
  recentlyMovedTileIds?: Set<string>;
  currentMove?: number;
}

export const GameBranch: React.FC<GameBranchProps> = ({
  branch,
  selectedBranch,
  onBranchClick,
  canPlace,
  align,
  flippingTiles = new Set(),
  sakuraAnimatingTiles = new Set(),
  selectedTileCount = 1,
  getShouldShowRomaji,
  isLargeMode = false,
  isDisappearing = false,
  recentlyMovedTileIds,
  currentMove = 0,
}) => {
  const isSelected = selectedBranch === branch.id;
  const isEmpty = branch.tiles.length === 0;
  const isFull = branch.tiles.length >= branch.maxCapacity;
  const isWave = branch.type === BranchType.WAVE;
  const topTile = branch.tiles[branch.tiles.length - 1];
  
  // Dynamic scale for tile circles so they fit on the branch when capacity > 4
  // Base design optimized for 4; scale down proportionally for larger capacities
  const baseCapacity = 4;
  const capacity = Math.max(1, branch.maxCapacity || baseCapacity);
  const computedScale = Math.min(1, baseCapacity / capacity);
  // Avoid making them too small — and make them a bit larger than before
  const tilesScale = Math.max(0.82, computedScale);
  // Tighten gaps slightly more for higher capacities
  const gapClass = capacity > 4 ? 'gap-px md:gap-[2px]' : 'gap-1';
  // Keep visual alignment clean depending on column
  const originClass = align === 'right' ? 'origin-bottom-right' : 'origin-bottom-left';
  
  // Only apply disappearing animation to empty branches that are being converted to waves
  const shouldApplyDisappearingAnimation = isDisappearing && isEmpty;
  
  // Debug logging for disappearing branches
  if (isDisappearing) {
    console.log(`🔍 Branch ${branch.id} is disappearing - isEmpty: ${isEmpty}, tiles: ${branch.tiles.length}, type: ${branch.type}`);
  }

  // For wave branches, show empty space
  if (isWave) {
    return (
      <div className={cn(
        "flex flex-col items-center space-y-2 transition-all duration-300",
        isDisappearing && "opacity-0 translate-y-2 pointer-events-none"
      )}>
        <div className="relative w-full md:max-w-80 md:mx-auto h-14 md:h-24">
          {/* Empty space - no visual element */}
          <div className="absolute bottom-0 left-0 right-0 md:left-4 md:right-4 h-4 md:h-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2 transition-all duration-300 overflow-visible">
      <div
        className={cn(
          "relative w-full md:max-w-80 md:mx-auto h-14 md:h-24 cursor-pointer transition-all duration-300 overflow-visible",
          "flex items-end justify-start gap-1 md:p-2",
          // Selection and interaction states  
          // isSelected && "scale-105",
          // canPlace && selectedBranch && selectedBranch !== branch.id && "bg-success/10",
          !isEmpty && !isFull && "hover:scale-102",
          shouldApplyDisappearingAnimation && "pointer-events-none"
        )}
        data-tutorial="branch"
        onClick={() => {
          console.log('🖱️ Branch clicked:', branch.id, 'tiles:', branch.tiles.length);
          onBranchClick(branch.id);
        }}
      >
        {/* The sakura branch - replaces the old shelf */}
        <div className="absolute bottom-0 left-0 right-0 md:left-4 md:right-4 h-4 md:h-6 z-10">
          <SakuraBranch
            isSelected={isSelected}
            canPlace={false} // Remove green highlighting
            mirrored={align === 'left'} // Mirror for left column
          />
        </div>
        
        {/* Tiles container */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-3 md:bottom-5 flex items-end px-0 md:px-2 transition-all duration-300 z-20",
            gapClass,
            originClass,
            // Left column: normal flow from left edge
            // Right column: reverse visual order and keep row anchored to the right edge
            align === 'right' && 'flex-row-reverse justify-start pr-[1px] pl-2 md:pl-2',
            shouldApplyDisappearingAnimation && "opacity-0 translate-y-2"
          )}
          style={{ transform: `scale(${tilesScale})` }}
        >
          {branch.tiles.map((tile, index) => {
            // Check if this tile should be selected (for multiple consecutive tiles)
            const shouldBeSelected = isSelected && index >= branch.tiles.length - selectedTileCount;
            
            return (
              <GameTile
                key={`${tile.id}-${index}`}
                tile={tile}
                isSelectable={index === branch.tiles.length - 1 && !selectedBranch}
                isSelected={shouldBeSelected}
                className="transition-all duration-300"
                isFlipping={flippingTiles.has(tile.id)}
                isSakuraAnimating={sakuraAnimatingTiles.has(tile.id)}
                isDropping={recentlyMovedTileIds?.has(tile.id)}
                showRomajiByDefault={getShouldShowRomaji ? getShouldShowRomaji(branch, index, align) : align === 'right'}
                isLargeMode={isLargeMode}
                currentMove={currentMove}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};