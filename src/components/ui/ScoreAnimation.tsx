import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScoreAnimationProps {
  score: number;
  previousScore?: number;
  className?: string;
  showDifference?: boolean;
}

export const ScoreAnimation: React.FC<ScoreAnimationProps> = ({
  score,
  previousScore = 0,
  className,
  showDifference = true
}) => {
  const [displayScore, setDisplayScore] = useState(previousScore);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  
  const difference = score - previousScore;

  useEffect(() => {
    if (score !== previousScore) {
      setIsAnimating(true);
      
      // Показываем бонус, если есть разница
      if (showDifference && difference > 0) {
        setShowBonus(true);
        setTimeout(() => setShowBonus(false), 2000);
      }
      
      // Анимируем счет
      const duration = 1000; // 1 секунда
      const steps = 30;
      const stepValue = difference / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const newScore = previousScore + (stepValue * currentStep);
        
        if (currentStep >= steps) {
          setDisplayScore(score);
          setIsAnimating(false);
          clearInterval(interval);
        } else {
          setDisplayScore(Math.round(newScore));
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    }
  }, [score, previousScore, difference, showDifference]);

  return (
    <div className={cn("relative", className)}>
      {/* Основной счет */}
      <div
        className={cn(
          "text-3xl font-bold transition-all duration-300",
          isAnimating && "scale-110 text-yellow-500",
          !isAnimating && "text-foreground"
        )}
      >
        {displayScore.toLocaleString()}
      </div>
      
      {/* Анимация бонуса */}
      {showBonus && difference > 0 && (
        <div
          className={cn(
            "absolute -top-8 left-1/2 transform -translate-x-1/2",
            "text-lg font-bold text-green-500",
            "animate-bounce"
          )}
          style={{
            animation: 'scoreBonus 2s ease-out forwards'
          }}
        >
          +{difference}
        </div>
      )}
      
      {/* CSS для анимации встроен в стиль */}
    </div>
  );
};

// Компонент для отображения прогресса с анимацией
interface AnimatedProgressProps {
  current: number;
  total: number;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  current,
  total,
  label,
  icon,
  color = 'bg-blue-500',
  className
}) => {
  const [animatedCurrent, setAnimatedCurrent] = useState(0);
  const percentage = Math.min((current / total) * 100, 100);
  const animatedPercentage = Math.min((animatedCurrent / total) * 100, 100);

  useEffect(() => {
    const duration = 1500; // 1.5 секунды
    const steps = 60;
    const stepValue = current / steps;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const newValue = stepValue * currentStep;
      
      if (currentStep >= steps) {
        setAnimatedCurrent(current);
        clearInterval(interval);
      } else {
        setAnimatedCurrent(Math.round(newValue));
      }
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {animatedCurrent}/{total}
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-300 ease-out", color)}
          style={{ width: `${animatedPercentage}%` }}
        />
      </div>
      
      <div className="text-right">
        <span className="text-xs text-muted-foreground">
          {Math.round(animatedPercentage)}%
        </span>
      </div>
    </div>
  );
};
