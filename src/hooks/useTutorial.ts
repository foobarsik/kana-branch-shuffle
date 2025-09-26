import { useState, useEffect, useCallback } from 'react';
import { tutorialSteps, TutorialStep } from '@/config/tutorial';

const TUTORIAL_COMPLETED_KEY = 'kana-tutorial-completed';

export const useTutorial = (level: number) => {
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const hasCompletedTutorial = localStorage.getItem(TUTORIAL_COMPLETED_KEY);
    if (level === 1 && !hasCompletedTutorial) {
      setIsTutorialActive(true);
    }
  }, [level]);

  const currentStep = isTutorialActive ? tutorialSteps[currentStepIndex] : null;

  const nextStep = useCallback(() => {
    if (currentStepIndex < tutorialSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsTutorialActive(false);
      localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
    }
  }, [currentStepIndex]);

  const stopTutorial = useCallback(() => {
    setIsTutorialActive(false);
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
  }, []);

  return {
    isTutorialActive,
    currentStep,
    nextStep,
    stopTutorial,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === tutorialSteps.length - 1,
  };
};
