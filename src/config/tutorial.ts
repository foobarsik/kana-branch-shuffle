export interface TutorialStep {
  elementSelector?: string;
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  waitForAction?: boolean; // Does this step require user action to proceed?
}

export const tutorialSteps: TutorialStep[] = [
    {
      title: 'Your Goal',
      description: 'Collect sets of identical kana characters to earn points and complete the level.',
      placement: 'bottom',
    },
    {
      title: 'How to Move Tiles',
      description: 'Tap a branch to select its top tile. Then tap another branch to move the tile there. You can place tiles only on empty branches or onto tiles with the same kana.',
      placement: 'bottom',
    },
    {
      title: 'Empty Branches Rule',
      description: 'Empty branches don\'t just disappear — they are collected into your global stash. You can later spend them on actions.',
      placement: 'bottom',
    },
    {
      elementSelector: '#game-controls',
      title: 'Helpful Tools',
      description: 'If you get stuck, you can undo the last move or restart/shuffle the board. Each action costs 1 collected branch (Undo also reduces score by 10).',
      placement: 'bottom',
    },
  ];
