import React from 'react';
import { Achievement } from '@/types/achievements';
import { getCategoryColor, getRarityColor } from '@/config/achievements';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Progress } from './progress';

interface AchievementCardProps {
  achievement: Achievement;
  className?: string;
  showProgress?: boolean;
  onClick?: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  className,
  showProgress = false,
  onClick
}) => {
  const categoryColor = getCategoryColor(achievement.category);
  const rarityColor = getRarityColor(achievement.rarity);
  
  const rarityLabels = {
    common: 'Обычное',
    rare: 'Редкое',
    epic: 'Эпическое',
    legendary: 'Легендарное'
  };

  const categoryLabels = {
    learning: 'Обучение',
    efficiency: 'Эффективность',
    speed: 'Скорость',
    streak: 'Серии',
    mastery: 'Мастерство',
    special: 'Особое'
  };

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg border transition-all duration-300",
        achievement.isUnlocked
          ? "bg-card border-border shadow-sm hover:shadow-md"
          : "bg-muted/30 border-muted-foreground/20",
        onClick && "cursor-pointer hover:scale-105",
        className
      )}
      onClick={onClick}
      style={{
        borderColor: achievement.isUnlocked ? rarityColor : undefined,
        borderWidth: achievement.isUnlocked ? '2px' : '1px'
      }}
    >
      {/* Индикатор редкости */}
      <div
        className="absolute top-2 right-2 w-3 h-3 rounded-full"
        style={{ backgroundColor: rarityColor }}
        title={rarityLabels[achievement.rarity]}
      />

      {/* Иконка и заголовок */}
      <div className="flex items-start gap-3 mb-2">
        <div
          className={cn(
            "text-2xl flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center",
            achievement.isUnlocked ? "bg-background" : "bg-muted grayscale"
          )}
          style={{
            backgroundColor: achievement.isUnlocked ? categoryColor + '20' : undefined
          }}
        >
          {achievement.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-semibold text-sm mb-1",
              achievement.isUnlocked ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {achievement.title}
          </h3>
          
          <div className="flex flex-wrap gap-1 mb-2">
            <Badge
              variant="outline"
              className="text-xs"
              style={{
                borderColor: categoryColor,
                color: categoryColor
              }}
            >
              {categoryLabels[achievement.category]}
            </Badge>
            
            <Badge
              variant="outline"
              className="text-xs"
              style={{
                borderColor: rarityColor,
                color: rarityColor
              }}
            >
              {rarityLabels[achievement.rarity]}
            </Badge>
          </div>
        </div>
      </div>

      {/* Описание */}
      <p
        className={cn(
          "text-xs mb-3",
          achievement.isUnlocked ? "text-muted-foreground" : "text-muted-foreground/70"
        )}
      >
        {achievement.description}
      </p>

      {/* Прогресс (если показываем) */}
      {showProgress && achievement.progress !== undefined && !achievement.isUnlocked && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">Прогресс</span>
            <span className="text-xs text-muted-foreground">{achievement.progress}%</span>
          </div>
          <Progress value={achievement.progress} className="h-1" />
        </div>
      )}

      {/* Награда */}
      {achievement.reward && (
        <div
          className={cn(
            "text-xs p-2 rounded border",
            achievement.isUnlocked
              ? "bg-success/10 border-success/20 text-success-foreground"
              : "bg-muted/50 border-muted-foreground/20 text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-1">
            <span>🎁</span>
            <span>{achievement.reward.description}</span>
          </div>
        </div>
      )}

      {/* Дата разблокировки */}
      {achievement.isUnlocked && achievement.unlockedAt && (
        <div className="mt-2 text-xs text-muted-foreground">
          Разблокировано: {new Date(achievement.unlockedAt).toLocaleDateString('ru-RU')}
        </div>
      )}

      {/* Эффект свечения для разблокированных */}
      {achievement.isUnlocked && (
        <div
          className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${rarityColor}20, transparent)`
          }}
        />
      )}
    </div>
  );
};
