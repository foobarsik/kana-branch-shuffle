import React from "react";
import { Branch, KanaTile } from "@/types/game";
import { GameTile } from "./GameTile";
import { SakuraBranch } from "@/components/ui/SakuraBranch";
import { cn } from "@/lib/utils";

interface GameBranchProps {
  branch: Branch;
  selectedBranch: string | null;
  onBranchClick: (branchId: string) => void;
  canPlace: boolean;
  align: 'left' | 'right';
}

export const GameBranch: React.FC<GameBranchProps> = ({
  branch,
  selectedBranch,
  onBranchClick,
  canPlace,
  align,
}) => {
  const isSelected = selectedBranch === branch.id;
  const isEmpty = branch.tiles.length === 0;
  const isFull = branch.tiles.length >= branch.maxCapacity;
  const topTile = branch.tiles[branch.tiles.length - 1];

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={cn(
          "relative w-full max-w-44 md:max-w-80 h-14 md:h-24 cursor-pointer transition-all duration-300",
          "flex items-end justify-start p-1 md:p-2 gap-1",
          // Selection and interaction states  
          isSelected && "scale-105",
          canPlace && selectedBranch && selectedBranch !== branch.id && "bg-success/10",
          !isEmpty && !isFull && "hover:scale-102"
        )}
        onClick={() => onBranchClick(branch.id)}
      >
        {/* The sakura branch - replaces the old shelf */}
        <div className="absolute bottom-0 left-1 md:left-4 right-1 md:right-4 h-4 md:h-6">
          <SakuraBranch
            isSelected={isSelected}
            canPlace={canPlace && selectedBranch && selectedBranch !== branch.id}
          />
        </div>
        
        {/* Tiles container */}
        <div className={cn(
          "absolute inset-x-0 bottom-3 md:bottom-5 flex items-end gap-1 px-2",
          align === 'left' ? 'justify-start' : 'justify-end'
        )}>
          {branch.tiles.map((tile, index) => (
            <GameTile
              key={`${tile.id}-${index}`}
              tile={tile}
              isSelectable={index === branch.tiles.length - 1 && !selectedBranch}
              isSelected={isSelected && index === branch.tiles.length - 1}
              className="transition-all duration-300"
            />
          ))}
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