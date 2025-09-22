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
          "relative w-80 h-20 rounded-lg shadow-md",
          "border-2 transition-all duration-300 cursor-pointer",
          "flex items-end justify-start p-2 gap-1",
          // Shelf styling
          "bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-800 dark:to-amber-900",
          "border-amber-300 dark:border-amber-600",
          // Selection and interaction states
          isSelected && "border-primary scale-105 shadow-lg ring-2 ring-primary/30",
          canPlace && selectedBranch && selectedBranch !== branch.id && "border-success/60 bg-success/10 ring-2 ring-success/30",
          !isEmpty && !isFull && "hover:scale-102"
        )}
        onClick={() => onBranchClick(branch.id)}
      >
        {/* Shelf edge - bottom border to look like a shelf */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 dark:from-amber-600 dark:via-amber-500 dark:to-amber-600 rounded-b-lg" />
        
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
              left: `${8 + index * 68}px`,
              bottom: `4px`, // Standing on the shelf
              zIndex: index + 1,
            }}
          />
        ))}
        
        {/* Empty shelf indicator */}
        {isEmpty && (
          <div className="absolute left-2 bottom-2 w-14 h-14 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
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