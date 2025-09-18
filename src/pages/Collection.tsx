import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HIRAGANA_SET } from "@/types/game";

export const Collection: React.FC = () => {
  const navigate = useNavigate();
  
  // For now, we'll show all kana. In a real implementation, 
  // this would be connected to game progress
  const learnedKana = HIRAGANA_SET.map(k => k.kana);

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-primary" />
              Kana Collection
            </h1>
            <p className="text-muted-foreground mt-1">
              Your learned hiragana characters
            </p>
          </div>

          <div className="w-24" /> {/* Spacer for alignment */}
        </div>

        {/* Progress */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-card rounded-full px-6 py-3 shadow-lg border">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="font-medium">
              {learnedKana.length} / {HIRAGANA_SET.length} Learned
            </span>
          </div>
        </div>

        {/* Kana Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {HIRAGANA_SET.map((kanaData) => {
            const isLearned = learnedKana.includes(kanaData.kana);
            
            return (
              <Card
                key={kanaData.kana}
                className={`
                  p-6 text-center transition-all duration-300 cursor-pointer
                  hover:scale-105 hover:shadow-lg border-2
                  ${
                    isLearned
                      ? "bg-gradient-tile border-primary/30 shadow-md"
                      : "bg-muted/50 border-muted opacity-60"
                  }
                `}
              >
                <div className="space-y-3">
                  <div
                    className={`
                      text-4xl font-bold transition-colors
                      ${isLearned ? "text-foreground" : "text-muted-foreground"}
                    `}
                  >
                    {kanaData.kana}
                  </div>
                  <div
                    className={`
                      text-lg font-medium transition-colors
                      ${isLearned ? "text-primary" : "text-muted-foreground"}
                    `}
                  >
                    {kanaData.romaji}
                  </div>
                  {isLearned && (
                    <div className="text-xs text-success font-medium">
                      ✓ Learned
                    </div>
                  )}
                  {!isLearned && (
                    <div className="text-xs text-muted-foreground">
                      Not learned yet
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Back to Game */}
        <div className="text-center mt-12">
          <Button
            onClick={() => navigate("/game")}
            size="lg"
            className="px-8"
          >
            Continue Learning
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Collection;