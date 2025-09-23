import React, { useEffect, useState } from 'react';
import { Achievement } from '@/types/achievements';
import { getRarityColor } from '@/config/achievements';
import { cn } from '@/lib/utils';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  duration?: number;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  
  const rarityColor = getRarityColor(achievement.rarity);

  useEffect(() => {
    // Показываем уведомление с анимацией
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Скрываем уведомление через заданное время
    const hideTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 300); // Даем время для анимации исчезновения
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const handleClick = () => {
    setIsLeaving(true);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-sm w-full",
        "transform transition-all duration-300 ease-out",
        isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div
        className={cn(
          "bg-card border-2 rounded-lg shadow-lg p-4 cursor-pointer",
          "hover:shadow-xl transition-shadow duration-200"
        )}
        style={{ borderColor: rarityColor }}
        onClick={handleClick}
      >
        {/* Заголовок */}
        <div className="flex items-center gap-2 mb-2">
          <div className="text-lg">🏆</div>
          <div className="text-sm font-semibold text-foreground">
            Достижение разблокировано!
          </div>
        </div>

        {/* Содержимое достижения */}
        <div className="flex items-start gap-3">
          <div
            className="text-2xl flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: rarityColor + '20' }}
          >
            {achievement.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground mb-1">
              {achievement.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-2">
              {achievement.description}
            </p>
            
            {/* Награда */}
            {achievement.reward && (
              <div className="text-xs text-success-foreground bg-success/10 px-2 py-1 rounded">
                🎁 {achievement.reward.description}
              </div>
            )}
          </div>
        </div>

        {/* Индикатор закрытия */}
        <div className="absolute top-2 right-2 text-xs text-muted-foreground">
          ✕
        </div>

        {/* Эффект свечения */}
        <div
          className="absolute inset-0 rounded-lg opacity-10 pointer-events-none animate-pulse"
          style={{
            background: `linear-gradient(135deg, ${rarityColor}, transparent)`
          }}
        />
      </div>
    </div>
  );
};

// Компонент-контейнер для управления очередью уведомлений
interface AchievementNotificationManagerProps {
  achievements: Achievement[];
  onAchievementShown: (achievementId: string) => void;
}

export const AchievementNotificationManager: React.FC<AchievementNotificationManagerProps> = ({
  achievements,
  onAchievementShown
}) => {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [queue, setQueue] = useState<Achievement[]>([]);

  useEffect(() => {
    if (achievements.length > 0) {
      setQueue(prev => [...prev, ...achievements]);
    }
  }, [achievements]);

  useEffect(() => {
    if (!currentAchievement && queue.length > 0) {
      const nextAchievement = queue[0];
      setCurrentAchievement(nextAchievement);
      setQueue(prev => prev.slice(1));
    }
  }, [currentAchievement, queue]);

  const handleClose = () => {
    if (currentAchievement) {
      onAchievementShown(currentAchievement.id);
      setCurrentAchievement(null);
    }
  };

  if (!currentAchievement) {
    return null;
  }

  return (
    <AchievementNotification
      achievement={currentAchievement}
      onClose={handleClose}
    />
  );
};
