
"use client";

import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  Dribbble, 
  Trophy, 
  Waves, 
  Zap, 
  Bike, 
  Mountain, 
  Flag, 
  Target 
} from "lucide-react";

const sports = [
  { 
    id: 'all', 
    name: 'All', 
    icon: <LayoutGrid className="w-4 h-4" />
  },
  { 
    id: 'nba', 
    name: 'NBA', 
    icon: <Dribbble className="w-4 h-4" />
  },
  { 
    id: 'nfl', 
    name: 'NFL', 
    icon: <Trophy className="w-4 h-4" />
  },
  { 
    id: 'surfing', 
    name: 'Surfing', 
    icon: <Waves className="w-4 h-4" />
  },
  { 
    id: 'skateboarding', 
    name: 'Skate', 
    icon: <Zap className="w-4 h-4" />
  },
  { 
    id: 'bmx', 
    name: 'BMX', 
    icon: <Bike className="w-4 h-4" />
  },
  { 
    id: 'snowboarding', 
    name: 'Snowboard', 
    icon: <Mountain className="w-4 h-4" />
  },
  { 
    id: 'nascar', 
    name: 'NASCAR', 
    icon: <Flag className="w-4 h-4" />
  },
  { 
    id: 'golf', 
    name: 'Golf', 
    icon: <Target className="w-4 h-4" />
  },
];

interface SportsFilterProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function SportsFilter({ selected, onSelect }: SportsFilterProps) {
  return (
    <div className="flex w-full gap-3 overflow-x-auto pb-4 no-scrollbar">
      {sports.map((sport) => (
        <button
          key={sport.id}
          onClick={() => onSelect(sport.id)}
          className={cn(
            "flex min-w-fit items-center gap-3 rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 border-2",
            selected === sport.id
              ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
              : "bg-card/50 border-white/5 text-muted-foreground hover:bg-secondary hover:border-accent/30"
          )}
        >
          <div className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full",
            selected === sport.id ? "bg-white/20" : "bg-white/10"
          )}>
            {sport.icon}
          </div>
          <span className="uppercase tracking-tight">{sport.name}</span>
        </button>
      ))}
    </div>
  );
}
