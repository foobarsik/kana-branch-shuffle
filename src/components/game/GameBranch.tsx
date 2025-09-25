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
}) => {
  const isSelected = selectedBranch === branch.id;
  const isEmpty = branch.tiles.length === 0;
  const isFull = branch.tiles.length >= branch.maxCapacity;
  const isWave = branch.type === BranchType.WAVE;
  const topTile = branch.tiles[branch.tiles.length - 1];

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
    <div className={cn(
      "flex flex-col items-center space-y-2 transition-all duration-300",
      isDisappearing && "opacity-0 translate-y-2 pointer-events-none"
    )}>
      <div
        className={cn(
          "relative w-full md:max-w-80 md:mx-auto h-14 md:h-24 cursor-pointer transition-all duration-300",
          "flex items-end justify-start gap-1 md:p-2",
          // Selection and interaction states  
          // isSelected && "scale-105",
          // canPlace && selectedBranch && selectedBranch !== branch.id && "bg-success/10",
          !isEmpty && !isFull && "hover:scale-102"
        )}
        onClick={() => {
          console.log('🖱️ Branch clicked:', branch.id, 'tiles:', branch.tiles.length);
          onBranchClick(branch.id);
        }}
      >
        {/* The sakura branch - replaces the old shelf */}
        <div className="absolute bottom-0 left-0 right-0 md:left-4 md:right-4 h-4 md:h-6">
          <SakuraBranch
            isSelected={isSelected}
            canPlace={false} // Remove green highlighting
            mirrored={align === 'left'} // Mirror for left column
          />
        </div>
        
        {/* Tiles container */}
        <div className={cn(
          "absolute inset-x-0 bottom-3 md:bottom-5 flex items-end gap-1 px-0 md:px-2",
          // Left column: normal flow from left edge
          align === 'left' ? 'justify-start pl-[1px] pr-2 md:pr-2' : '',
          // Right column: reverse visual order and keep row anchored to the right edge
          align === 'right' && 'flex-row-reverse justify-start pr-[1px] pl-2 md:pl-2'
        )}>
          {branch.tiles.map((tile, index) => {
            // Check if this tile should be selected (for multiple consecutive tiles)
            const shouldBeSelected = isSelected && 
              index >= branch.tiles.length - selectedTileCount;
            
            return (
              <GameTile
                key={`${tile.id}-${index}`}
                tile={tile}
                isSelectable={index === branch.tiles.length - 1 && !selectedBranch}
                isSelected={shouldBeSelected}
                className="transition-all duration-300"
                isFlipping={flippingTiles.has(tile.id)}
                isSakuraAnimating={sakuraAnimatingTiles.has(tile.id)}
                showRomajiByDefault={getShouldShowRomaji ? getShouldShowRomaji(branch, index, align) : align === 'right'}
                isLargeMode={isLargeMode}
              />
            );
          })}
        </div>
        
        {/* Empty shelf indicator */}
        {/* {isEmpty && (
          <div className="absolute left-2 md:left-6 bottom-1 md:bottom-3 w-8 md:w-12 h-8 md:h-12 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
            <span className="text-xs text-muted-foreground">空</span>
          </div>
        )} */}
      </div>
      
      {/* Capacity indicator */}
      {/* <div className="flex space-x-1">
        {Array.from({ length: branch.maxCapacity }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index < branch.tiles.length ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div> */}
    </div>
  );
};