import React from 'react';
import { cn } from '@/lib/utils';

interface SakuraBranchProps {
  className?: string;
  isSelected?: boolean;
  canPlace?: boolean;
  mirrored?: boolean; // true для левой колонки (тонкий конец справа)
}

export const SakuraBranch: React.FC<SakuraBranchProps> = ({ 
  className, 
  isSelected, 
  canPlace,
  mirrored = false
}) => {
  return (
    <svg
      viewBox="0 0 500 40"
      className={cn("w-full h-full", className)}
      xmlns="http://www.w3.org/2000/svg"
      style={mirrored ? { transform: 'scaleX(-1)' } : undefined}
    >
      {/* Wood + lacquer material: gradients and subtle grain */}
      <defs>
        {/* Slightly variegated wood stroke */}
        <linearGradient id="woodStroke" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7a4a16" />
          <stop offset="50%" stopColor="#8b5a2b" />
          <stop offset="100%" stopColor="#704014" />
        </linearGradient>
        {/* Top lacquer highlight (white to transparent) */}
        <linearGradient id="topHighlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        {/* Fine wood grain pattern (very subtle) */}
        <pattern id="woodGrain" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="transparent" />
          <path d="M0 6 H12" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
          <path d="M0 3 H12" stroke="rgba(0,0,0,0.04)" strokeWidth="0.4" />
          <path d="M0 9 H12" stroke="rgba(0,0,0,0.04)" strokeWidth="0.4" />
        </pattern>
      </defs>

      {/* Grain underlay (kept subtle and below strokes) */}
      <rect x="0" y="0" width="500" height="40" fill="url(#woodGrain)" opacity="0.08" />

      {/* Main branch - base layer (thinnest) */}
      <path
        d="M2 25 Q70 20 140 22 Q210 24 280 20 Q350 16 420 18 Q460 19 498 20"
        stroke="url(#woodStroke)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        className={cn(
          "transition-all duration-300",
          isSelected && "stroke-green-600",
          canPlace && "stroke-green-600"
        )}
      />
      
      {/* Gradual thickness increase - layer 1 */}
      <path
        d="M150 22 Q210 24 280 20 Q350 16 420 18 Q460 19 498 20"
        stroke="url(#woodStroke)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        className={cn(
          "transition-all duration-300",
          isSelected && "stroke-green-600",
          canPlace && "stroke-green-600"
        )}
      />
      
      {/* Gradual thickness increase - layer 2 */}
      <path
        d="M250 22 Q280 20 350 16 Q420 18 460 19 Q480 19 498 20"
        stroke="url(#woodStroke)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        className={cn(
          "transition-all duration-300",
          isSelected && "stroke-green-600",
          canPlace && "stroke-green-600"
        )}
      />
      
      {/* Gradual thickness increase - layer 3 */}
      <path
        d="M350 16 Q420 18 460 19 Q480 19 498 20"
        stroke="url(#woodStroke)"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
        className={cn(
          "transition-all duration-300",
          isSelected && "stroke-green-600",
          canPlace && "stroke-green-600"
        )}
      />
      
      {/* Final thick right end */}
      <path
        d="M420 18 Q460 19 498 20"
        stroke="url(#woodStroke)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        className={cn(
          "transition-all duration-300",
          isSelected && "stroke-green-600",
          canPlace && "stroke-green-600"
        )}
      />
      
      {/* Small branches */}
      <path d="M40 23 Q45 16 50 13" stroke="url(#woodStroke)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M80 22 Q85 29 90 32" stroke="url(#woodStroke)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M120 23 Q125 16 130 13" stroke="url(#woodStroke)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M160 22 Q165 29 170 32" stroke="url(#woodStroke)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M200 21 Q205 14 210 11" stroke="url(#woodStroke)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M240 20 Q245 27 250 30" stroke="url(#woodStroke)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M280 19 Q285 12 290 9" stroke="url(#woodStroke)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M320 18 Q325 25 330 28" stroke="url(#woodStroke)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M360 18 Q365 11 370 8" stroke="url(#woodStroke)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M400 18 Q405 25 410 28" stroke="url(#woodStroke)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M440 19 Q445 12 450 9" stroke="url(#woodStroke)" strokeWidth="3" fill="none" strokeLinecap="round" />
      
      {/* Sakura flowers */}
      {/* Flower 1 */}
      <g transform="translate(50, 13)">
        <circle cx="0" cy="0" r="3" fill="#FFB7C5" opacity="0.9" />
        <circle cx="-2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="-2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="0" cy="0" r="1" fill="#FFE4E1" />
      </g>
      
      {/* Flower 2 */}
      <g transform="translate(90, 32)">
        <circle cx="0" cy="0" r="3" fill="#FFB7C5" opacity="0.9" />
        <circle cx="-2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="-2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="0" cy="0" r="1" fill="#FFE4E1" />
      </g>
      
      {/* Flower 3 */}
      <g transform="translate(130, 13)">
        <circle cx="0" cy="0" r="3" fill="#FFB7C5" opacity="0.9" />
        <circle cx="-2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="-2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="0" cy="0" r="1" fill="#FFE4E1" />
      </g>
      
      {/* Flower 4 */}
      <g transform="translate(170, 32)">
        <circle cx="0" cy="0" r="3" fill="#FFB7C5" opacity="0.9" />
        <circle cx="-2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="-2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="0" cy="0" r="1" fill="#FFE4E1" />
      </g>
      
      {/* Flower 5 */}
      <g transform="translate(210, 11)">
        <circle cx="0" cy="0" r="3" fill="#FFB7C5" opacity="0.9" />
        <circle cx="-2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="-2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="0" cy="0" r="1" fill="#FFE4E1" />
      </g>
      
      {/* Flower 6 */}
      <g transform="translate(250, 30)">
        <circle cx="0" cy="0" r="3" fill="#FFB7C5" opacity="0.9" />
        <circle cx="-2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="-2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="0" cy="0" r="1" fill="#FFE4E1" />
      </g>
      
      {/* Flower 7 */}
      <g transform="translate(290, 9)">
        <circle cx="0" cy="0" r="3" fill="#FFB7C5" opacity="0.9" />
        <circle cx="-2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="-2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="0" cy="0" r="1" fill="#FFE4E1" />
      </g>
      
      {/* Flower 8 */}
      <g transform="translate(330, 28)">
        <circle cx="0" cy="0" r="3" fill="#FFB7C5" opacity="0.9" />
        <circle cx="-2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="-2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="0" cy="0" r="1" fill="#FFE4E1" />
      </g>
      
      {/* Flower 9 */}
      <g transform="translate(370, 8)">
        <circle cx="0" cy="0" r="3" fill="#FFB7C5" opacity="0.9" />
        <circle cx="-2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="-2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="0" cy="0" r="1" fill="#FFE4E1" />
      </g>
      
      {/* Flower 10 */}
      <g transform="translate(410, 28)">
        <circle cx="0" cy="0" r="3" fill="#FFB7C5" opacity="0.9" />
        <circle cx="-2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="-2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="0" cy="0" r="1" fill="#FFE4E1" />
      </g>
      
      {/* Flower 11 */}
      <g transform="translate(450, 9)">
        <circle cx="0" cy="0" r="3" fill="#FFB7C5" opacity="0.9" />
        <circle cx="-2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="-2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="-2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="2" cy="2" r="2.5" fill="#FFC0CB" opacity="0.8" />
        <circle cx="0" cy="0" r="1" fill="#FFE4E1" />
      </g>
      
      {/* Small buds */}
      <circle cx="65" cy="21" r="1.5" fill="#FFB7C5" opacity="0.7" />
      <circle cx="105" cy="22" r="1.5" fill="#FFB7C5" opacity="0.7" />
      <circle cx="145" cy="21" r="1.5" fill="#FFB7C5" opacity="0.7" />
      <circle cx="185" cy="20" r="1.5" fill="#FFB7C5" opacity="0.7" />
      <circle cx="225" cy="19" r="1.5" fill="#FFB7C5" opacity="0.7" />
      <circle cx="265" cy="18" r="1.5" fill="#FFB7C5" opacity="0.7" />
      <circle cx="305" cy="17" r="1.5" fill="#FFB7C5" opacity="0.7" />
      <circle cx="345" cy="18" r="1.5" fill="#FFB7C5" opacity="0.7" />
      <circle cx="385" cy="19" r="1.5" fill="#FFB7C5" opacity="0.7" />
      <circle cx="425" cy="20" r="1.5" fill="#FFB7C5" opacity="0.7" />
      <circle cx="465" cy="20" r="1.5" fill="#FFB7C5" opacity="0.7" />
      {/* Soft top lacquer highlight at ~50% opacity */}
      <rect x="0" y="0" width="500" height="14" fill="url(#topHighlight)" opacity="0.5" />
    </svg>
  );
};
