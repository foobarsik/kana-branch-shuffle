import React from "react";
import { Branch, KanaTile } from "@/types/game";
import { GameTile } from "./GameTile";
import { cn } from "@/lib/utils";

interface GameBranchProps {
  branch: Branch;
  selectedBranch: string | null;
  onBranchClick: (branchId: string) => void;
  canPlace: boolean;
}

export const GameBranch: React.FC<GameBranchProps> = ({
  branch,
  selectedBranch,
  onBranchClick,
  canPlace,
}) => {
  const isSelected = selectedBranch === branch.id;
  const isEmpty = branch.tiles.length === 0;
  const isFull = branch.tiles.length >= branch.maxCapacity;
  const topTile = branch.tiles[branch.tiles.length - 1];

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={cn(
          "relative w-full max-w-80 h-16 md:h-20 cursor-pointer transition-all duration-300",
          "flex items-end justify-start p-1 md:p-2 gap-1",
          // Selection and interaction states  
          isSelected && "scale-105",
          canPlace && selectedBranch && selectedBranch !== branch.id && "bg-success/10",
          !isEmpty && !isFull && "hover:scale-102"
        )}
        onClick={() => onBranchClick(branch.id)}
      >
        {/* The shelf - bottom part only */}
        <div className={cn(
          "absolute bottom-0 left-2 md:left-4 right-2 md:right-4 h-2 md:h-3 rounded-lg shadow-md",
          "bg-gradient-to-b from-amber-200 to-amber-300 dark:from-amber-700 dark:to-amber-800",
          isSelected && "ring-2 ring-primary/50",
          canPlace && selectedBranch && selectedBranch !== branch.id && "ring-2 ring-success/50"
        )} />
        
        {/* Tiles standing on the shelf */}
        {branch.tiles.map((tile, index) => (
          <GameTile
            key={`${tile.id}-${index}`}
            tile={tile}
            isSelectable={index === branch.tiles.length - 1 && !selectedBranch}
            isSelected={isSelected && index === branch.tiles.length - 1}
            className={cn(
              "absolute transition-all duration-300",
            )}
            style={{
              left: `${8 + index * 52}px`, // Reduced spacing for mobile
              bottom: `8px`, // Standing on the shelf
              zIndex: index + 1,
            }}
          />
        ))}
        
        {/* Empty shelf indicator */}
        {isEmpty && (
          <div className="absolute left-3 md:left-6 bottom-2 md:bottom-3 w-10 md:w-12 h-10 md:h-12 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
            <span className="text-xs text-muted-foreground">空</span>
          </div>
        )}
      </div>
      
      {/* Capacity indicator */}
      <div className="flex space-x-1">
        {Array.from({ length: branch.maxCapacity }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index < branch.tiles.length ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
};