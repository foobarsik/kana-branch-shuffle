import React from "react";
import { KanaTile } from "@/types/game";
import { cn } from "@/lib/utils";
import { extractPrimaryColor, isGradient } from "@/utils/colors";

interface GameTileProps {
  tile: KanaTile;
  isSelectable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  isFlipping?: boolean;
  isSakuraAnimating?: boolean;
  isDropping?: boolean;
  showRomajiByDefault?: boolean;
  isLargeMode?: boolean;
  currentMove?: number; // Current move count to determine if tile is frozen
}

export const GameTile: React.FC<GameTileProps> = ({
  tile,
  isSelectable = false,
  isSelected = false,
  onClick,
  className,
  style,
  isFlipping = false,
  isSakuraAnimating = false,
  isDropping = false,
  showRomajiByDefault = false,
  isLargeMode = false,
  currentMove = 0,
}) => {
  if (isFlipping) {
    console.log('🔄 Tile is flipping:', tile.id, tile.kana);
  }

  // Check if tile is frozen (remaining moves semantics)
  const isFrozen = typeof tile.frozenUntilMove === 'number' && tile.frozenUntilMove > 0;
  const remainingFrozenMoves = isFrozen ? tile.frozenUntilMove! : 0;

  // --- Visual tuning: derive subtle gradients from tile color for ring/surface ---
  // Extract primary color from gradient or use as-is if it's a solid color
  const tileColorValue = tile.color || '#4b5563';
  const baseColor = isGradient(tileColorValue)
    ? extractPrimaryColor(tileColorValue)
    : tileColorValue;
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

  // --- Drop micro animation: when selection (drag) ends, briefly play scale-up ---
  const prevSelectedRef = React.useRef<boolean>(isSelected);
  const [justDropped, setJustDropped] = React.useState(false);
  React.useEffect(() => {
    const wasSelected = prevSelectedRef.current;
    if (wasSelected && !isSelected) {
      setJustDropped(true);
      const timer = setTimeout(() => setJustDropped(false), 140);
      prevSelectedRef.current = isSelected;
      return () => clearTimeout(timer);
    }
    prevSelectedRef.current = isSelected;
  }, [isSelected]);

  // If sakura animating, show sakura petals falling (hooks declared above)
  if (isSakuraAnimating) {
    return (
      <div
        className={cn(
          "w-[43px] h-[43px] md:w-16 md:h-16 rounded-full relative overflow-hidden flex-shrink-0",
          className
        )}
        style={{ ...(style || {}) }}
      >
        {/* Sakura fade animation - elegant and clean */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 animate-pulse">
          {/* Center text fading out elegantly */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-lg md:text-2xl font-bold text-pink-700 drop-shadow-sm"
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
                opacity: 1,
                transform: 'scale(1)',
                transition: 'all 1.8s ease-out',
                animation: 'fadeOutScale 1.8s ease-out forwards'
              }}
            >
              {showRomajiByDefault ? tile.romaji : tile.kana}
            </span>
          </div>

          {/* Add elegant fade animation */}
          <style>{`
            @keyframes fadeOutScale {
              0% { 
                opacity: 1; 
                transform: scale(1); 
              }
              50% { 
                opacity: 0.6; 
                transform: scale(1.1); 
              }
              100% { 
                opacity: 0; 
                transform: scale(0.8); 
              }
            }
          `}</style>
        </div>

      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-[43px] h-[43px] md:w-16 md:h-16 rounded-full relative cursor-pointer transition-all duration-300 flex-shrink-0",
        "active:scale-95",
        !isSelectable && "cursor-default",
        isFrozen && "cursor-not-allowed",
        isSelected && "z-20 tile-lift",
        (isFlipping || justDropped || isDropping) && "tile-drop",
        // Enamel contour effect
        isSelected
          ? 'shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),0_3px_6px_rgba(0,0,0,0.2)]'
          : 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_1px_2px_rgba(0,0,0,0.08)]',
        // Frozen effect - blue tint (no pulsing)
        isFrozen && "",
        className
      )}
      style={{ 
        ...(style || {}), 
        perspective: 600,
        // No global hue shift when frozen; we override colors directly below
        filter: isFrozen ? undefined : undefined
      }}
      onClick={isSelectable && !isFrozen ? onClick : undefined}
    >
      {/* Oval shadow underneath the tile */}
      <div
        className="absolute left-1/2 w-[65%] h-[16%] rounded-full -translate-x-1/2 -z-10"
        style={{
          bottom: '-4px',
          background: 'rgba(0,0,0,0.25)',
          filter: 'blur(4px)',
          transition: 'all 0.3s ease',
          transform: `translateX(-50%) scale(${isSelected ? 1.15 : 1})`
        }}
      />
      {/* Oval drop shadow */}
      {!isSelected && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-3 bg-black/20 rounded-[50%] blur-sm -z-10" />
      )}
      {/* 3D flipper */}
      <div
        className="absolute inset-0 [transform-style:preserve-3d] transition-transform duration-500"
        style={{
          transform: `${isSelected || isLargeMode ? 'scale(1.25)' : 'scale(1)'} ` + (
            showRomajiByDefault
              ? (isFlipping ? 'rotateY(0deg)' : 'rotateY(180deg)')
              : (isFlipping ? 'rotateY(180deg)' : 'rotateY(0deg)')
          ),
          willChange: 'transform'
        }}
      >
        {/* FRONT FACE: kana */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          {/* Inner ring (expanded because outer ring removed) */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br"
            style={{
              background: isFrozen
                ? 'linear-gradient(135deg, #bfe6ff, #7ec8ff)'
                : `linear-gradient(135deg, ${dark1}, ${dark2})`
            }}
          />
          {/* Main surface with texture pattern (expanded accordingly) */}
          <div
            className="absolute inset-0.5 rounded-full overflow-hidden"
            style={{
              background: isFrozen
                ? 'radial-gradient(circle at 30% 30%, #e9f7ff 0%, #cfefff 45%, #a7dcff 70%, #7ac3ff 100%)'
                : (isGradient(tileColorValue)
                  ? tileColorValue // Use the original gradient
                  : `radial-gradient(circle at center, ${baseColor} ${isSelected ? '55%' : '60%'}, ${dark1} 100%)`)
            }}
          >
            {/* Very light inner shadow at bottom for embossed effect */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ boxShadow: isFrozen ? 'inset 0 -2px 5px rgba(0,80,130,0.15), inset 0 1px 2px rgba(255,255,255,0.35)' : 'inset 0 -2px 4px rgba(0,0,0,0.16), inset 0 1px 1px rgba(255,255,255,0.18)' }}
            />
            {/* Subtle top highlight (0→10% white) */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: isFrozen
                  ? 'linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0) 55%)'
                  : `linear-gradient(to bottom, rgba(255,255,255,${isSelected ? 0.25 : 0.14}), rgba(255,255,255,0) ${isSelected ? '60%' : '45%'})`
              }}
            />
            {/* Decorative pattern background */}
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: isFrozen ? 0.22 : 0.15 }} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
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
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" opacity={isFrozen ? 0.4 : 0.3} />
              <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" opacity={isFrozen ? 0.4 : 0.3} />
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
                  "font-medium text-white select-none",
                  "text-xl md:text-3xl",
                  (isSelected || isLargeMode) && "opacity-0"
                )}
                style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
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
              background: isFrozen
                ? 'linear-gradient(135deg, #bfe6ff, #7ec8ff)'
                : `linear-gradient(135deg, ${dark1}, ${dark2})`
            }}
          />
          <div
            className="absolute inset-0.5 rounded-full overflow-hidden"
            style={{
              background: isFrozen
                ? 'radial-gradient(circle at 30% 30%, #e9f7ff 0%, #cfefff 45%, #a7dcff 70%, #7ac3ff 100%)'
                : (isGradient(tileColorValue)
                  ? tileColorValue // Use the original gradient
                  : `radial-gradient(circle at center, ${baseColor} ${isSelected ? '55%' : '60%'}, ${dark1} 100%)`)
            }}
          >
            {/* Very light inner shadow at bottom for embossed effect (back face) */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.16), inset 0 1px 1px rgba(255,255,255,0.18)' }}
            />
            <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
            <div className="absolute mb-1 inset-0 flex items-center justify-center">
              <span
                className={cn(
                  "font-medium drop-shadow-lg select-none text-lg md:text-3xl",
                  showRomajiByDefault ? "text-white" : "text-yellow-300",
                  (isSelected || isLargeMode) && "opacity-0"
                )}
                style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
              >
                {tile.romaji}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Frozen overlay */}
      {isFrozen && (
        <div className="absolute inset-0 z-40 pointer-events-none">
          {/* Ice crystal effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-200/35 via-blue-300/25 to-blue-500/35 backdrop-blur-[0.5px]">
            {/* Ice crystals pattern */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/50 rounded-full" />
              <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white/30 rounded-full" />
              <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-white/40 rounded-full" />
              <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-white/25 rounded-full" />
            </div>
          </div>
          {/* Frozen moves counter */}
          <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
            <span className="text-[8px] md:text-[10px] font-bold text-white">
              {remainingFrozenMoves}
            </span>
          </div>
        </div>
      )}

      {/* Selected overlay showing both kana and romaji together */}
      {(isSelected || isLargeMode) && !isFrozen && (
        <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center">
          <span
            className="font-bold text-white text-xl md:text-3xl"
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}
          >
            {tile.kana}
          </span>
          <span
            className="mt-0.5 text-[11px] md:text-sm font-semibold text-yellow-200"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
          >
            {tile.romaji}
          </span>
        </div>
      )}
    </div>
  );
};
