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
  isFlipping?: boolean;
}

export const GameTile: React.FC<GameTileProps> = ({
  tile,
  isSelectable = false,
  isSelected = false,
  onClick,
  className,
  style,
  isFlipping = false,
}) => {
  if (isFlipping) {
    console.log('🔄 Tile is flipping:', tile.id, tile.kana);
  }
  
  return (
    <div
      className={cn(
        "w-11 h-11 md:w-16 md:h-16 rounded-full relative cursor-pointer transition-all duration-300 flex-shrink-0",
        "active:scale-95",
        !isSelectable && "cursor-default",
        className
      )}
      style={{ ...(style || {}), perspective: 600 }}
      onClick={isSelectable ? onClick : undefined}
    >
      {/* 3D flipper */}
      <div
        className="absolute inset-0 [transform-style:preserve-3d] transition-transform duration-500"
        style={{ transform: (isSelected || isFlipping) ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* FRONT FACE: kana */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          {/* Inner ring (expanded because outer ring removed) */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800" />
          {/* Main surface with texture pattern (expanded accordingly) */}
          <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 overflow-hidden">
            {/* Decorative pattern background */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <g stroke="currentColor" strokeWidth="1" fill="none">
                <line x1="50" y1="15" x2="50" y2="85" />
                <line x1="15" y1="50" x2="85" y2="50" />
                <line x1="30" y1="30" x2="70" y2="70" />
                <line x1="70" y1="30" x2="30" y2="70" />
                <line x1="50" y1="25" x2="50" y2="75" transform="rotate(22.5 50 50)" />
                <line x1="50" y1="25" x2="50" y2="75" transform="rotate(45 50 50)" />
                <line x1="50" y1="25" x2="50" y2="75" transform="rotate(67.5 50 50)" />
                <line x1="50" y1="25" x2="50" y2="75" transform="rotate(112.5 50 50)" />
                <line x1="50" y1="25" x2="50" y2="75" transform="rotate(135 50 50)" />
                <line x1="50" y1="25" x2="50" y2="75" transform="rotate(157.5 50 50)" />
              </g>
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
              <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
            </svg>
            {/* Petals */}
            <div className="absolute inset-0">
              <div className="md:hidden">
                {[0, 90, 180, 270].map((angle, index) => (
                  <div key={`m-${index}`} className="absolute w-1.5 h-1.5" style={{ top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${isSelected ? '14px' : '12px'}) rotate(-${angle}deg)` }}>
                    <div className="w-full h-full bg-pink-300 rounded-full opacity-10" />
                  </div>
                ))}
              </div>
              <div className="hidden md:block">
                {[0, 90, 180, 270].map((angle, index) => (
                  <div key={`d-${index}`} className="absolute w-2 h-2" style={{ top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${isSelected ? '24px' : '22px'}) rotate(-${angle}deg)` }}>
                    <div className="w-full h-full bg-pink-300 rounded-full opacity-10" />
                  </div>
                ))}
              </div>
            </div>
            {/* Kana */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn("font-bold text-white select-none drop-shadow-lg", "text-xl md:text-3xl", isSelected && "text-yellow-200")}>{tile.kana}</span>
            </div>
          </div>
        </div>

        {/* BACK FACE: romaji */}
        <div className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: 'rotateY(180deg)' }}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-700 via-slate-800 to-black" />
          <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
            <div className="absolute mb-1 inset-0 flex items-center justify-center">
              <span className="font-bold text-amber-200 drop-shadow-lg select-none text-lg md:text-3xl">{tile.romaji}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};