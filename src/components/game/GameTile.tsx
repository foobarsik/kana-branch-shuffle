import React from "react";
import { KanaTile } from "@/types/game";
import { cn } from "@/lib/utils";

interface GameTileProps {
  tile: KanaTile;
  isSelectable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const GameTile: React.FC<GameTileProps> = ({
  tile,
  isSelectable = false,
  isSelected = false,
  onClick,
  className,
  style,
}) => {
  return (
    <div
      className={cn(
        "w-8 h-8 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-gradient-tile shadow-lg border-2 border-tile-shadow",
        "flex items-center justify-center cursor-pointer transition-all duration-300",
        "hover:scale-105 hover:shadow-xl active:scale-95",
        isSelectable && "hover:border-primary/50",
        isSelected && "border-primary scale-110 shadow-primary/30",
        !isSelectable && "cursor-default hover:scale-100 active:scale-100",
        className
      )}
      style={style}
      onClick={isSelectable ? onClick : undefined}
    >
      <span className="text-sm md:text-2xl font-bold text-foreground select-none">
        {tile.kana}
      </span>
    </div>
  );
};