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
  Play,
  Swords,
  Timer,
  Snowflake
} from "lucide-react";

const BaseballIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 1 0 20" />
    <path d="M2 12a10 10 0 0 1 20 0" />
    <path d="M7 7c2 1 3 3 3 5s-1 4-3 5" />
    <path d="M17 7c-2 1-3 3-3 5s1 4 3 5" />
  </svg>
);

const TennisIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 1 0 20" />
    <path d="M2 12a10 10 0 0 1 20 0" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const PickleballIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 8l8 8" />
    <path d="M16 8l-8 8" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const VolleyballIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 1 0 20" />
    <path d="M2 12a10 10 0 0 1 20 0" />
    <path d="M7 7c2 1 3 3 3 5s-1 4-3 5" />
    <path d="M17 7c-2 1-3 3-3 5s1 4 3 5" />
  </svg>
);

const SoccerIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="m12 12 5-3v6l-5 3-5-3v-6z" />
    <path d="M12 2v5" />
    <path d="M12 17v5" />
    <path d="M2 12h5" />
    <path d="M17 12h5" />
  </svg>
);

const BoxingIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 11h-2a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2Z" />
    <path d="M10 10H8a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2Z" />
    <path d="M18 11V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v5" />
    <path d="M6 14v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" />
  </svg>
);

const sports = [
  { 
    id: 'all', 
    name: 'ALL SPORTS', 
    img: "https://picsum.photos/seed/all-arenas/400/250",
    icon: <LayoutGrid className="w-5 h-5 text-white" />
  },
  { 
    id: 'nba', 
    name: 'NBA', 
    img: "https://picsum.photos/seed/basketball/400/250",
    icon: <Dribbble className="w-5 h-5 text-orange-500" />
  },
  { 
    id: 'nfl', 
    name: 'NFL', 
    img: "https://picsum.photos/seed/football/400/250",
    icon: <Trophy className="w-5 h-5 text-green-500" />
  },
  { 
    id: 'hockey', 
    name: 'NHL', 
    img: "https://picsum.photos/seed/hockey/400/250",
    icon: <Snowflake className="w-5 h-5 text-cyan-400" />
  },
  { 
    id: 'soccer', 
    name: 'Soccer', 
    img: "https://picsum.photos/seed/soccer/400/250",
    icon: <SoccerIcon className="w-5 h-5 text-white" />
  },
  { 
    id: 'ufc', 
    name: 'UFC', 
    img: "https://picsum.photos/seed/ufc/400/250",
    icon: <Swords className="w-5 h-5 text-red-600" />
  },
  { 
    id: 'boxing', 
    name: 'Boxing', 
    img: "https://picsum.photos/seed/boxing/400/250",
    icon: <BoxingIcon className="w-5 h-5 text-yellow-600" />
  },
  { 
    id: 'mlb', 
    name: 'MLB', 
    img: "https://picsum.photos/seed/baseball/400/250",
    icon: <BaseballIcon className="w-5 h-5 text-blue-500" />
  },
  { 
    id: 'tennis', 
    name: 'Tennis', 
    img: "https://picsum.photos/seed/tennis/400/250",
    icon: <Target className="w-5 h-5 text-lime-400" />
  },
  { 
    id: 'pickleball', 
    name: 'Pickleball', 
    img: "https://picsum.photos/seed/pickle/400/250",
    icon: <PickleballIcon className="w-5 h-5 text-yellow-500" />
  },
  { 
    id: 'volleyball', 
    name: 'Volleyball', 
    img: "https://picsum.photos/seed/volley/400/250",
    icon: <VolleyballIcon className="w-5 h-5 text-indigo-400" />
  },
  { 
    id: 'surfing', 
    name: 'Surfing', 
    img: "https://picsum.photos/seed/surfing/400/250",
    icon: <Waves className="w-5 h-5 text-blue-400" />
  },
  { 
    id: 'skateboarding', 
    name: 'Skateboarding', 
    img: "https://picsum.photos/seed/skate/400/250",
    icon: <Zap className="w-5 h-5 text-yellow-400" />
  },
  { 
    id: 'bmx', 
    name: 'BMX', 
    img: "https://picsum.photos/seed/bmx/400/250",
    icon: <Bike className="w-5 h-5 text-red-400" />
  },
  { 
    id: 'snowboarding', 
    name: 'Snowboarding', 
    img: "https://picsum.photos/seed/snow/400/250",
    icon: <Mountain className="w-5 h-5 text-cyan-400" />
  },
  { 
    id: 'nascar', 
    name: 'NASCAR', 
    img: "https://picsum.photos/seed/nascar/400/250",
    icon: <Flag className="w-5 h-5 text-red-500" />
  },
  { 
    id: 'golf', 
    name: 'Golf', 
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
