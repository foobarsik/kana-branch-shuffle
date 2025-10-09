import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AudioProvider } from "./contexts/AudioContext";
import Index from "./pages/Index";
import Game from "./pages/Game";
import Collection from "./pages/Collection";
import { LevelSelect } from "./pages/LevelSelect";
import Achievements from "./pages/Achievements";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <AudioProvider>
          {/* Global background layers used by Sakura themes */}
          <div className="bg-corners" />
          <div className="bg-topglow" />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/game" element={<Game />} />
              <Route path="/levels" element={<LevelSelect />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AudioProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
