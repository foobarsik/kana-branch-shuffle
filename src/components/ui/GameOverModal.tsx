import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex flex-col items-center space-y-4">
            <img 
              src="/fail.png" 
              alt="Game Over" 
              className="w-32 mx-auto object-contain"
            />
            <DialogTitle className="text-2xl font-bold text-destructive">
              No moves available!
            </DialogTitle>
            <p className="text-muted-foreground text-center">
              The game is stuck. Try using the undo button or restart the level.
            </p>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
