import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
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
            <div className="relative inline-block mx-auto">
              {/* Soft sakura glow behind the mascot */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-5 rounded-full -z-10"
                style={{
                  background: "radial-gradient(circle, rgba(255,182,193,0.25) 0%, rgba(255,182,193,0.12) 40%, transparent 70%)",
                  filter: "blur(40px)",
                }}
              />
              <img 
                src="/fail.png" 
                alt="Game Over" 
                className="w-32 object-contain"
              />
            </div>
            <DialogTitle className="text-2xl font-bold text-destructive">
              No moves available!
            </DialogTitle>
            <p className="text-muted-foreground text-center">
              The game is stuck. Try using the undo button or restart the level.
            </p>
            <DialogClose className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Close
            </DialogClose>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
