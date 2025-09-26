import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface LevelEndQuizProps {
  isOpen: boolean;
  kana: string;
  options: string[];
  correctAnswer: string;
  onAnswer: (answer: string) => void;
  answered: boolean;
  wasCorrect: boolean | null;
}

export const LevelEndQuiz: React.FC<LevelEndQuizProps> = ({ 
  isOpen, 
  kana, 
  options, 
  correctAnswer,
  onAnswer,
  answered,
  wasCorrect
}) => {
  if (!isOpen) return null;

  const getButtonClass = (option: string) => {
    if (!answered) return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
    if (option === correctAnswer) return 'bg-green-500/90 text-white border-green-600';
    if (option !== correctAnswer && wasCorrect === false) return 'bg-red-500/90 text-white border-red-600';
    return 'bg-muted text-muted-foreground opacity-70';
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px] text-center p-8 bg-card border-border shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Bonus Quiz!</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Guess the romaji to earn bonus points.
          </DialogDescription>
        </DialogHeader>
        <div className="my-8 flex items-center justify-center">
          <motion.div
            key={kana} // Trigger animation on new kana
            initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 10, stiffness: 300 }}
            className="text-8xl font-bold text-primary font-jp"
          >
            {kana}
          </motion.div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {options.map((option) => (
            <Button
              key={option}
              onClick={() => onAnswer(option)}
              disabled={answered}
              className={`h-16 text-2xl font-bold transition-all duration-300 transform hover:scale-105 border-b-4 border-transparent ${getButtonClass(option)}`}
            >
              {option}
            </Button>
          ))}
        </div>
        {answered && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center justify-center gap-2"
          >
            {wasCorrect ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-lg font-semibold text-green-500">Correct! +100 Points</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-500" />
                <span className="text-lg font-semibold text-red-500">Incorrect. The answer was {correctAnswer}.</span>
              </>  
            )}
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};
