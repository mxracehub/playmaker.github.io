
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
    img: "https://picsum.photos/seed/all/100/100",
    icon: <LayoutGrid className="w-4 h-4" />
  },
  { 
    id: 'nba', 
    name: 'NBA', 
    img: "https://picsum.photos/seed/basketball/100/100",
    icon: <Dribbble className="w-4 h-4 text-orange-500" />
  },
  { 
    id: 'nfl', 
    name: 'NFL', 
    img: "https://picsum.photos/seed/football/100/100",
    icon: <Trophy className="w-4 h-4 text-green-500" />
  },
  { 
    id: 'surfing', 
    name: 'Surfing', 
    img: "https://picsum.photos/seed/surfing/100/100",
    icon: <Waves className="w-4 h-4 text-blue-400" />
  },
  { 
    id: 'skateboarding', 
    name: 'Skate', 
    img: "https://picsum.photos/seed/skate/100/100",
    icon: <Zap className="w-4 h-4 text-yellow-400" />
  },
  { 
    id: 'bmx', 
    name: 'BMX', 
    img: "https://picsum.photos/seed/bmx/100/100",
    icon: <Bike className="w-4 h-4 text-red-400" />
  },
  { 
    id: 'snowboarding', 
    name: 'Snowboard', 
    img: "https://picsum.photos/seed/snow/100/100",
    icon: <Mountain className="w-4 h-4 text-cyan-400" />
  },
  { 
    id: 'nascar', 
    name: 'NASCAR', 
    img: "https://picsum.photos/seed/nascar/100/100",
    icon: <Flag className="w-4 h-4 text-red-500" />
  },
  { 
    id: 'golf', 
    name: 'Golf', 
    img: "https://picsum.photos/seed/golf/100/100",
    icon: <Target className="h-4 w-4 text-emerald-400" />
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
            "flex min-w-fit items-center gap-3 rounded-2xl pl-1.5 pr-5 py-1.5 text-sm font-bold transition-all duration-300 border-2",
            selected === sport.id
              ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
              : "bg-card/50 border-white/5 text-muted-foreground hover:bg-secondary hover:border-accent/30"
          )}
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10 shrink-0">
            <img 
              src={sport.img} 
              alt={sport.name} 
              className={cn("h-full w-full object-cover transition-all", selected !== sport.id && "grayscale opacity-50")}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              {sport.icon}
            </div>
          </div>
          <span className="uppercase tracking-tight whitespace-nowrap">{sport.name}</span>
        </button>
      ))}
    </div>
  );
}
