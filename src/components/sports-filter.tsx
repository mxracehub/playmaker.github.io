
"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { LayoutGrid } from "lucide-react";

const sports = [
  { 
    id: 'all', 
    name: 'All', 
    icon: <LayoutGrid className="w-4 h-4" />,
    image: null 
  },
  { 
    id: 'nba', 
    name: 'NBA', 
    image: 'https://picsum.photos/seed/basketball/100/100',
    hint: 'basketball'
  },
  { 
    id: 'nfl', 
    name: 'NFL', 
    image: 'https://picsum.photos/seed/football/100/100',
    hint: 'football'
  },
  { 
    id: 'surfing', 
    name: 'Surfing', 
    image: 'https://picsum.photos/seed/surfing/100/100',
    hint: 'surfing'
  },
  { 
    id: 'skateboarding', 
    name: 'Skate', 
    image: 'https://picsum.photos/seed/skate/100/100',
    hint: 'skateboarding'
  },
  { 
    id: 'bmx', 
    name: 'BMX', 
    image: 'https://picsum.photos/seed/bmx/100/100',
    hint: 'bmx'
  },
  { 
    id: 'snowboarding', 
    name: 'Snowboard', 
    image: 'https://picsum.photos/seed/snow/100/100',
    hint: 'snowboarding'
  },
  { 
    id: 'nascar', 
    name: 'NASCAR', 
    image: 'https://picsum.photos/seed/nascar/100/100',
    hint: 'nascar'
  },
  { 
    id: 'golf', 
    name: 'Golf', 
    image: 'https://picsum.photos/seed/golf/100/100',
    hint: 'golf'
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
          {sport.image ? (
            <div className="relative h-6 w-6 overflow-hidden rounded-full border border-white/20">
              <Image 
                src={sport.image} 
                alt={sport.name} 
                fill 
                className="object-cover"
                data-ai-hint={sport.hint}
              />
            </div>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
              {sport.icon}
            </div>
          )}
          <span className="uppercase tracking-tight">{sport.name}</span>
        </button>
      ))}
    </div>
  );
}
