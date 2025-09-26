import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TutorialStep } from '@/config/tutorial';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TutorialProps {
  step: TutorialStep | null;
  onNext: () => void;
  onSkip: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export const Tutorial: React.FC<TutorialProps> = ({ step, onNext, onSkip, isFirstStep, isLastStep }) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Helper: pick the best element among multiple matches (closest to viewport center and visible)
  const pickBestElement = (elements: Element[]): Element | null => {
    if (!elements.length) return null;
    const viewportCenterY = window.innerHeight / 2;
    const candidates = elements
      .map((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        const area = Math.max(0, rect.width) * Math.max(0, rect.height);
        const visible =
          rect.bottom > 0 &&
          rect.right > 0 &&
          rect.top < window.innerHeight &&
          rect.left < window.innerWidth;
        const distanceToCenter = Math.abs(rect.top + rect.height / 2 - viewportCenterY);
        return { el, rect, area, visible, distanceToCenter };
      })
      .filter((c) => c.visible && c.area > 10);

    if (candidates.length === 0) return elements[0] as HTMLElement;

    // Prefer the one with the largest area; break ties by closeness to center
    candidates.sort((a, b) => {
      if (b.area !== a.area) return b.area - a.area;
      return a.distanceToCenter - b.distanceToCenter;
    });

    return candidates[0].el as HTMLElement;
  };

  const recalcTarget = useCallback(() => {
    if (step?.elementSelector) {
      const nodeList = document.querySelectorAll(step.elementSelector);
      const elements = Array.from(nodeList);
      const best = pickBestElement(elements);
      if (best) {
        setTargetRect((best as HTMLElement).getBoundingClientRect());
        return;
      }
    }
    setTargetRect(null);
  }, [step?.elementSelector]);

  useEffect(() => {
    recalcTarget();
    // Recalculate on scroll and resize to keep highlight in sync
    window.addEventListener('scroll', recalcTarget, { passive: true });
    window.addEventListener('resize', recalcTarget);
    return () => {
      window.removeEventListener('scroll', recalcTarget as EventListener);
      window.removeEventListener('resize', recalcTarget as EventListener);
    };
  }, [step, recalcTarget]);

  if (!step) return null;

  const getTooltipPosition = () => {
    const isMobile = window.innerWidth <= 480;
    if (isMobile) {
      // Try to place just below the lowest visible branch
      const branches = Array.from(document.querySelectorAll('[data-tutorial="branch"]')) as HTMLElement[];
      const rects = branches
        .map(el => el.getBoundingClientRect())
        .filter(r => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight);
      if (rects.length > 0) {
        const maxBottom = Math.max(...rects.map(r => r.bottom));
        const top = Math.min(maxBottom + 12, window.innerHeight - 100); // keep on screen
        return {
          top,
          left: 0,
          right: 0,
          margin: '0 auto',
          paddingLeft: '16px',
          paddingRight: '16px',
        } as React.CSSProperties;
      }
      // Fallback: bottom-centered
      return {
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
        left: 0,
        right: 0,
        margin: '0 auto',
        paddingLeft: '16px',
        paddingRight: '16px',
      } as React.CSSProperties;
    }
    if (!targetRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const placement = step.placement || 'bottom';
    const padding = 20;

    switch (placement) {
      case 'top':
        return {
          top: targetRect.top - padding,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translate(-50%, -100%)',
        };
      case 'bottom':
        return {
          top: targetRect.bottom + padding,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.left - padding,
          transform: 'translate(-100%, -50%)',
        };
      case 'right':
        return {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.right + padding,
          transform: 'translateY(-50%)',
        };
      default:
        return {
          top: targetRect.bottom + padding,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translateX(-50%)',
        };
    }
  };

  const tooltipPosition = getTooltipPosition();

  // Disable highlight rectangle completely per user request
  const shouldShowHighlight = false;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center"
      >
        {targetRect && shouldShowHighlight && (
          <motion.div
            initial={{ x: targetRect.x, y: targetRect.y, width: targetRect.width, height: targetRect.height }}
            animate={{ x: targetRect.x, y: targetRect.y, width: targetRect.width, height: targetRect.height }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute rounded-lg border-4 border-yellow-400 shadow-2xl"
            style={{ 
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.7), 0 0 20px rgba(255, 193, 7, 0.8)',
              background: 'rgba(255, 193, 7, 0.1)'
            }}
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute bg-white rounded-xl p-6 shadow-2xl max-w-sm sm:max-w-md w-auto text-center z-50 border border-gray-200"
          style={tooltipPosition}
        >
          <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>
          <div className="flex justify-center gap-3">
            {!isFirstStep && (
              <Button variant="outline" onClick={onSkip} className="px-4">
                Skip
              </Button>
            )}
            <Button onClick={onNext} className="px-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
              {isLastStep ? 'Start the game' : 'Next'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
