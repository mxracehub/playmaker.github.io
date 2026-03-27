
"use client";

import { cn } from "@/lib/utils";
import { 
  Dribbble, 
  Flag, 
  Target, 
  CircleDot, 
  Trophy,
  LayoutGrid,
  Waves,
  Zap
} from "lucide-react";

const sports = [
  { id: 'all', name: 'All', icon: <LayoutGrid className="w-5 h-5" /> },
  { id: 'nba', name: 'NBA', icon: <Dribbble className="w-5 h-5" /> },
  { id: 'nfl', name: 'NFL', icon: <Trophy className="w-5 h-5" /> },
  { id: 'surfing', name: 'Surfing', icon: <Waves className="w-5 h-5" /> },
  { id: 'extreme', name: 'X-Games', icon: <Zap className="w-5 h-5" /> },
  { id: 'nascar', name: 'NASCAR', icon: <Flag className="w-5 h-5" /> },
  { id: 'golf', name: 'Golf', icon: <Target className="w-5 h-5" /> },
  { id: 'nhl', name: 'NHL', icon: <CircleDot className="w-5 h-5" /> },
];

interface SportsFilterProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function SportsFilter({ selected, onSelect }: SportsFilterProps) {
  return (
    <div className="flex w-full gap-2 overflow-x-auto pb-4 no-scrollbar">
      {sports.map((sport) => (
        <button
          key={sport.id}
          onClick={() => onSelect(sport.id)}
          className={cn(
            "flex min-w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 border",
            selected === sport.id
              ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
              : "bg-card border-border text-muted-foreground hover:bg-secondary hover:border-accent/30"
          )}
        >
          {sport.icon}
          {sport.name}
        </button>
      ))}
    </div>
  );
}
