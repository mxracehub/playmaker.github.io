"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AthleteProps {
  id: string;
  name: string;
  team: string;
  sport: string;
  avatar: string;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function AthleteCard({ name, team, sport, avatar, isSelected, onSelect }: AthleteProps) {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 border-2",
      isSelected ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border hover:border-primary/50"
    )}>
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted/20">
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            data-ai-hint="athlete portrait"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <Badge className="absolute left-3 top-3 bg-primary/80 backdrop-blur-sm text-white font-bold border-none">
            {sport.toUpperCase()}
          </Badge>
          <div className="absolute bottom-3 left-3">
            <p className="font-headline text-lg font-bold leading-none text-white">{name}</p>
            <p className="text-xs font-medium text-muted-foreground mt-1 uppercase tracking-wider">{team}</p>
          </div>
        </div>
        
        <div className="p-4">
          <Button 
            onClick={onSelect}
            variant={isSelected ? "default" : "outline"}
            className={cn(
              "w-full font-bold uppercase tracking-wider h-11 transition-all",
              isSelected ? "bg-accent text-accent-foreground hover:bg-accent/90" : "hover:bg-primary hover:text-white"
            )}
          >
            {isSelected ? (
              <><Check className="mr-2 h-4 w-4" /> Selected</>
            ) : (
              <><Plus className="mr-2 h-4 w-4" /> Play Game</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
