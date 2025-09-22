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
        "w-10 h-10 md:w-16 md:h-16 rounded-full relative cursor-pointer transition-all duration-300 flex-shrink-0",
        "hover:scale-105 active:scale-95",
        isSelectable && "hover:brightness-110",
        isSelected && "scale-110 brightness-110",
        !isSelectable && "cursor-default hover:scale-100 active:scale-100",
        className
      )}
      style={style}
      onClick={isSelectable ? onClick : undefined}
    >
      {/* Outer ring - metal border */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 shadow-lg">
        {/* Inner ring */}
        <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800">
          {/* Main surface with texture pattern */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 overflow-hidden">
            
            {/* Decorative pattern background */}
            <svg 
              className="absolute inset-0 w-full h-full opacity-20" 
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Radial lines pattern */}
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
              
              {/* Concentric circles */}
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
              <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
            </svg>
            
            {/* Small decorative sakura petals around the edge */}
            <div className="absolute inset-0">
              {/* Mobile/tablet petals (default) */}
              <div className="md:hidden">
                {[0, 90, 180, 270].map((angle, index) => (
                  <div
                    key={`m-${index}`}
                    className="absolute w-1.5 h-1.5"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${isSelected ? '14px' : '12px'}) rotate(-${angle}deg)`,
                    }}
                  >
                    <div className="w-full h-full bg-pink-300 rounded-full opacity-10" />
                  </div>
                ))}
              </div>
              {/* Desktop petals (pushed closer to the rim) */}
              <div className="hidden md:block">
                {[0, 90, 180, 270].map((angle, index) => (
                  <div
                    key={`d-${index}`}
                    className="absolute w-2 h-2"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${isSelected ? '24px' : '22px'}) rotate(-${angle}deg)`,
                    }}
                  >
                    <div className="w-full h-full bg-pink-300 rounded-full opacity-10" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Central kana character */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn(
                "font-bold text-white select-none drop-shadow-lg",
                "text-base md:text-2xl",
                isSelected && "text-yellow-200"
              )}>
                {tile.kana}
              </span>
            </div>
            
            {/* Highlight effect when selected */}
            {isSelected && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 via-transparent to-transparent" />
            )}
          </div>
        </div>
      </div>
      
      {/* Outer glow effect when selectable */}
      {isSelectable && (
        <div className="absolute -inset-0.5 rounded-full bg-blue-400/20 blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
    </div>
  );
};