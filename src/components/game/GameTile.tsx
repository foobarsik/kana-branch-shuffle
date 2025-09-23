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
  showRomajiByDefault?: boolean;
}

export const GameTile: React.FC<GameTileProps> = ({
  tile,
  isSelectable = false,
  isSelected = false,
  onClick,
  className,
  style,
  isFlipping = false,
  showRomajiByDefault = false,
}) => {
  if (isFlipping) {
    console.log('🔄 Tile is flipping:', tile.id, tile.kana);
  }

  // --- Visual tuning: derive subtle gradients from tile color for ring/surface ---
  const baseColor = tile.color || '#4b5563';
  const clamp = (n: number, min = 0, max = 255) => Math.max(min, Math.min(max, n));
  const hexToRgb = (hex: string) => {
    const m = hex.replace('#','');
    const bigint = parseInt(m.length === 3 ? m.split('').map(c=>c+c).join('') : m, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };
  const rgbToHex = (r: number, g: number, b: number) => `#${clamp(r).toString(16).padStart(2,'0')}${clamp(g).toString(16).padStart(2,'0')}${clamp(b).toString(16).padStart(2,'0')}`;
  const shade = (hex: string, percent: number) => {
    const { r, g, b } = hexToRgb(hex);
    const p = percent / 100;
    const rr = clamp(Math.round(r + (p * 255 - p * (255 - r))));
    const gg = clamp(Math.round(g + (p * 255 - p * (255 - g))));
    const bb = clamp(Math.round(b + (p * 255 - p * (255 - b))));
    return rgbToHex(rr, gg, bb);
  };
  const dark1 = shade(baseColor, -18);
  const dark2 = shade(baseColor, -32);
  const light1 = shade(baseColor, 10);

  return (
    <div
      className={cn(
        "w-[43px] h-[43px] md:w-16 md:h-16 rounded-full relative cursor-pointer transition-all duration-300 flex-shrink-0",
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
        style={{ 
          transform: showRomajiByDefault 
            ? ((isSelected || isFlipping) ? 'rotateY(0deg)' : 'rotateY(180deg)')
            : ((isSelected || isFlipping) ? 'rotateY(180deg)' : 'rotateY(0deg)')
        }}
      >
        {/* FRONT FACE: kana */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          {/* Inner ring (expanded because outer ring removed) */}
          <div 
            className="absolute inset-0 rounded-full bg-gradient-to-br"
            style={{
              background: isSelected 
                ? 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)'
                : `linear-gradient(135deg, ${dark1}, ${dark2})`
            }}
          />
          {/* Main surface with texture pattern (expanded accordingly) */}
          <div
            className="absolute inset-0.5 rounded-full overflow-hidden"
            style={{ 
              background: `radial-gradient(circle at 35% 30%, ${light1} 0%, ${baseColor} 55%, ${dark1} 100%)`
            }}
          >
            {/* Decorative pattern background */}
            <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
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
              <span
                className={cn(
                  "font-bold text-white select-none",
                  "text-xl md:text-3xl",
                  isSelected && "text-yellow-200"
                )}
                style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }} // Enhanced shadow for readability
              >
                {tile.kana}
              </span>
            </div>
          </div>
        </div>

        {/* BACK FACE: romaji */}
        <div className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: 'rotateY(180deg)' }}>
          <div 
            className="absolute inset-0 rounded-full bg-gradient-to-br"
            style={{
              background: isSelected 
                ? 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)'
                : `linear-gradient(135deg, ${dark1}, ${dark2})`
            }}
          />
          <div 
            className="absolute inset-0.5 rounded-full overflow-hidden"
            style={{ background: `radial-gradient(circle at 35% 30%, ${light1} 0%, ${baseColor} 55%, ${dark1} 100%)` }}
          >
            <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
            <div className="absolute mb-1 inset-0 flex items-center justify-center">
              <span 
                className={cn(
                  "font-bold drop-shadow-lg select-none text-lg md:text-3xl",
                  showRomajiByDefault ? "text-white" : "text-yellow-300"
                )}
                style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
              >
                {tile.romaji}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};