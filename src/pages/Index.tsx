import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, BookOpen, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Logo/Title */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground">
            ひらがな
            <span className="block text-2xl text-primary mt-2">
              Hiragana Sort
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Learn Japanese characters through puzzle sorting
          </p>
        </div>

        {/* Menu Cards */}
        <div className="space-y-4">
          <Card 
            className="p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2 hover:border-primary/50 bg-gradient-tile"
            onClick={() => navigate("/game")}
          >
            <div className="flex items-center justify-center space-x-3">
              <Play className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold">Play Game</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Start sorting hiragana tiles
            </p>
          </Card>

          <Card 
            className="p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2 hover:border-primary/50 bg-gradient-tile"
            onClick={() => navigate("/collection")}
          >
            <div className="flex items-center justify-center space-x-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold">Collection</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              View learned characters
            </p>
          </Card>

          <Card className="p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2 hover:border-primary/50 bg-gradient-tile opacity-60">
            <div className="flex items-center justify-center space-x-3">
              <Settings className="w-6 h-6 text-muted-foreground" />
              <span className="text-xl font-semibold text-muted-foreground">Settings</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Coming soon
            </p>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-sm text-muted-foreground">
          <p>Learn the Japanese hiragana alphabet</p>
          <p>through fun puzzle mechanics</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
