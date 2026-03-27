"use client";

import Link from "next/link";
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
  Target,
  Play
} from "lucide-react";

const sports = [
  { 
    id: 'all', 
    name: 'All Arenas', 
    img: "https://picsum.photos/seed/all-arenas/400/250",
    icon: <LayoutGrid className="w-5 h-5 text-white" />
  },
  { 
    id: 'nba', 
    name: 'NBA Arena', 
    img: "https://picsum.photos/seed/basketball/400/250",
    icon: <Dribbble className="w-5 h-5 text-orange-500" />
  },
  { 
    id: 'nfl', 
    name: 'NFL Gridiron', 
    img: "https://picsum.photos/seed/football/400/250",
    icon: <Trophy className="w-5 h-5 text-green-500" />
  },
  { 
    id: 'surfing', 
    name: 'Surfing Pipe', 
    img: "https://picsum.photos/seed/surfing/400/250",
    icon: <Waves className="w-5 h-5 text-blue-400" />
  },
  { 
    id: 'skateboarding', 
    name: 'Skate Park', 
    img: "https://picsum.photos/seed/skate/400/250",
    icon: <Zap className="w-5 h-5 text-yellow-400" />
  },
  { 
    id: 'bmx', 
    name: 'BMX Dirt', 
    img: "https://picsum.photos/seed/bmx/400/250",
    icon: <Bike className="w-5 h-5 text-red-400" />
  },
  { 
    id: 'snowboarding', 
    name: 'Snowboard', 
    img: "https://picsum.photos/seed/snow/400/250",
    icon: <Mountain className="w-5 h-5 text-cyan-400" />
  },
  { 
    id: 'nascar', 
    name: 'Victory Lane', 
    img: "https://picsum.photos/seed/nascar/400/250",
    icon: <Flag className="w-5 h-5 text-red-500" />
  },
  { 
    id: 'golf', 
    name: 'Masters Green', 
    img: "https://picsum.photos/seed/golf/400/250",
    icon: <Target className="h-5 w-5 text-emerald-400" />
  },
];

interface SportsFilterProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function SportsFilter({ selected, onSelect }: SportsFilterProps) {
  return (
    <div className="flex w-full gap-4 overflow-x-auto pb-6 pt-2 no-scrollbar px-1">
      {sports.map((sport) => (
        <div 
          key={sport.id}
          className={cn(
            "group relative flex min-w-[220px] flex-col rounded-2xl border-2 transition-all duration-500 overflow-hidden cursor-pointer",
            selected === sport.id
              ? "border-accent ring-2 ring-accent/20 scale-105 shadow-2xl shadow-accent/10"
              : "border-white/5 hover:border-white/20"
          )}
          onClick={() => onSelect(sport.id)}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src={sport.img} 
              alt={sport.name} 
              className={cn(
                "h-full w-full object-cover transition-transform duration-700 group-hover:scale-110",
                selected !== sport.id && "grayscale opacity-40 brightness-50"
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
          </div>

          {/* Arena Content */}
          <div className="relative z-10 flex flex-col justify-end h-36 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 shadow-xl">
                {sport.icon}
              </div>
              <span className="font-headline font-bold text-sm uppercase tracking-tighter text-white">
                {sport.name}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 mt-auto">
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest transition-opacity duration-300",
                selected === sport.id ? "text-accent opacity-100" : "text-white/40 opacity-0 group-hover:opacity-100"
              )}>
                {selected === sport.id ? "Arena Active" : "Enter Arena"}
              </span>
              
              {sport.id !== 'all' && (
                <Link 
                  href={`/games/create?sport=${sport.id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-xl shadow-accent/30 hover:scale-110 transition-transform active:scale-95">
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
