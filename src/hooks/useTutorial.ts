import { useState, useEffect, useCallback } from 'react';
import { tutorialSteps, TutorialStep } from '@/config/tutorial';

const TUTORIAL_COMPLETED_KEY = 'kana-tutorial-completed';
const TUTORIAL_CURRENT_STEP_KEY = 'kana-tutorial-current-step';

export const useTutorial = (level: number) => {
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Initialize tutorial state from localStorage
  useEffect(() => {
    const hasCompletedTutorial = localStorage.getItem(TUTORIAL_COMPLETED_KEY);
    if (level === 1 && !hasCompletedTutorial) {
      const savedStep = localStorage.getItem(TUTORIAL_CURRENT_STEP_KEY);
      if (savedStep) {
        const stepIndex = parseInt(savedStep, 10);
        if (!isNaN(stepIndex) && stepIndex < tutorialSteps.length) {
          setCurrentStepIndex(stepIndex);
        }
      }
      setIsTutorialActive(true);
    }
  }, [level]);

  const currentStep = isTutorialActive ? tutorialSteps[currentStepIndex] : null;

  const nextStep = useCallback(() => {
    if (currentStepIndex < tutorialSteps.length - 1) {
      const newStepIndex = currentStepIndex + 1;
      setCurrentStepIndex(newStepIndex);
      localStorage.setItem(TUTORIAL_CURRENT_STEP_KEY, newStepIndex.toString());
    } else {
      setIsTutorialActive(false);
      localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
      localStorage.removeItem(TUTORIAL_CURRENT_STEP_KEY);
    }
  }, [currentStepIndex]);

  const stopTutorial = useCallback(() => {
    setIsTutorialActive(false);
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
    localStorage.removeItem(TUTORIAL_CURRENT_STEP_KEY);
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
