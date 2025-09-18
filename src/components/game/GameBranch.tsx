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
          "relative w-20 h-80 rounded-2xl bg-gradient-branch shadow-md",
          "border-2 border-branch transition-all duration-300 cursor-pointer",
          "flex flex-col-reverse items-center justify-start p-2 gap-1",
          isSelected && "border-primary scale-105 shadow-lg",
          canPlace && selectedBranch && selectedBranch !== branch.id && "border-success/60 bg-success/10",
          !isEmpty && !isFull && "hover:scale-105"
        )}
        onClick={() => onBranchClick(branch.id)}
      >
        {/* Tiles stacked from bottom */}
        {branch.tiles.map((tile, index) => (
          <GameTile
            key={`${tile.id}-${index}`}
            tile={tile}
            isSelectable={index === branch.tiles.length - 1 && !selectedBranch}
            isSelected={isSelected && index === branch.tiles.length - 1}
            className={cn(
              "absolute transition-all duration-300",
              `bottom-${2 + index * 16}`
            )}
            style={{
              bottom: `${8 + index * 68}px`,
              zIndex: index + 1,
            }}
          />
        ))}
        
        {/* Empty branch indicator */}
        {isEmpty && (
          <div className="absolute bottom-2 w-14 h-14 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
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