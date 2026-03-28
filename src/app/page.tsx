
"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { SportsFilter } from "@/components/sports-filter";
import { AthleteCard } from "@/components/athlete-card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, Target, Gamepad2, Trophy, Sparkles } from "lucide-react";

const mockAthletes = [
  {
    id: "1",
    name: "Luka Doncic",
    team: "Dallas Mavericks",
    sport: "NBA",
    avatar: "https://picsum.photos/seed/luka/400/400",
    stats: [
      { label: "Points/G", value: "33.9" },
      { label: "Rebounds/G", value: "9.2" }
    ]
  },
  {
    id: "2",
    name: "Patrick Mahomes",
    team: "KC Chiefs",
    sport: "NFL",
    avatar: "https://picsum.photos/seed/mahomes/400/400",
    stats: [
      { label: "Pass Yds", value: "4,183" },
      { label: "TDs", value: "27" }
    ]
  },
  {
    id: "30",
    name: "Lionel Messi",
    team: "Inter Miami",
    sport: "Soccer",
    avatar: "https://picsum.photos/seed/messi/400/400",
    stats: [
      { label: "Goals", value: "14" },
      { label: "Assists", value: "11" }
    ]
  },
  {
    id: "40",
    name: "Jon Jones",
    team: "Heavyweight",
    sport: "UFC",
    avatar: "https://picsum.photos/seed/jones/400/400",
    stats: [
      { label: "Record", value: "27-1-0" },
      { label: "KOs", value: "10" }
    ]
  },
  {
    id: "50",
    name: "Canelo Alvarez",
    team: "Super Middle",
    sport: "Boxing",
    avatar: "https://picsum.photos/seed/canelo/400/400",
    stats: [
      { label: "Wins", value: "61" },
      { label: "KOs", value: "39" }
    ]
  },
  {
    id: "20",
    name: "Carlos Alcaraz",
    team: "ATP Elite",
    sport: "Tennis",
    avatar: "https://picsum.photos/seed/alcaraz/400/400",
    stats: [
      { label: "Rank", value: "#3" },
      { label: "Win Rate", value: "78%" }
    ]
  },
  {
    id: "21",
    name: "Ben Johns",
    team: "PPA Tour",
    sport: "Pickleball",
    avatar: "https://picsum.photos/seed/benjohns/400/400",
    stats: [
      { label: "Majors", value: "12" },
      { label: "Win Streak", value: "15" }
    ]
  },
  {
    id: "22",
    name: "Annie Drews",
    team: "Team USA",
    sport: "Volleyball",
    avatar: "https://picsum.photos/seed/annie/400/400",
    stats: [
      { label: "Kills", value: "452" },
      { label: "Avg Block", value: "2.1" }
    ]
  },
  {
    id: "3",
    name: "John John Florence",
    team: "WSL Elite",
    sport: "Surfing",
    avatar: "https://picsum.photos/seed/jjf/400/400",
    stats: [
      { label: "Avg Heat", value: "16.4" },
      { label: "Wins", value: "2" }
    ]
  },
  {
    id: "4",
    name: "Nyjah Huston",
    team: "X-Games",
    sport: "Skateboarding",
    avatar: "https://picsum.photos/seed/nyjah/400/400",
    stats: [
      { label: "Best Trick", value: "9.8" },
      { label: "Medals", value: "15" }
    ]
  },
  {
    id: "5",
    name: "Scottie Scheffler",
    team: "PGA Tour",
    sport: "Golf",
    avatar: "https://picsum.photos/seed/scottie/400/400",
    stats: [
      { label: "Avg Score", value: "68.2" },
      { label: "Wins", value: "4" }
    ]
  },
  {
    id: "6",
    name: "Kyle Larson",
    team: "Hendrick Motors",
    sport: "NASCAR",
    avatar: "https://picsum.photos/seed/larson/400/400",
    stats: [
      { label: "Avg Finish", value: "8.4" },
      { label: "Top 5s", value: "12" }
    ]
  }
];

export default function Home() {
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);

  const toggleAthlete = (id: string) => {
    setSelectedAthletes(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const filteredAthletes = selectedSport === "all" 
    ? mockAthletes 
    : mockAthletes.filter(a => a.sport.toLowerCase() === selectedSport.toLowerCase());

  return (
    <div className="min-h-screen pt-20 pb-24">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Hero Section */}
        <section className="mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent/20 p-8 text-white relative shadow-2xl border-2 border-white/10">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight uppercase italic">
                The Ultimate <br/><span className="text-accent">Playmaker</span> Arena
              </h1>
              <p className="text-lg text-white/80 mb-6 font-medium leading-relaxed">
                Challenge your friends in the next generation of sports games. Pick your elite roster, track live scores, and win big.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/games/create">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold uppercase tracking-wider">
                    Start a Game <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold uppercase tracking-wider backdrop-blur-sm">
                    How it Works
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-4">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 shadow-xl">
                <Gamepad2 className="h-6 w-6 text-accent" />
                <div>
                  <p className="text-xs text-white/60 font-bold uppercase tracking-widest">Active Games</p>
                  <p className="text-xl font-headline font-bold">142,509</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 shadow-xl">
                <Target className="h-6 w-6 text-accent" />
                <div>
                  <p className="text-xs text-white/60 font-bold uppercase tracking-widest">Winners Today</p>
                  <p className="text-xl font-headline font-bold">4,120</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Arena Navigation */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="h-5 w-5 text-accent" />
            <h2 className="font-headline text-xl font-bold uppercase tracking-widest italic">Sports Games</h2>
          </div>
          <SportsFilter selected={selectedSport} onSelect={setSelectedSport} />
        </div>

        {/* Athlete Grid with ScrollArea */}
        <ScrollArea className="h-[650px] rounded-3xl border border-white/5 bg-card/20 p-6 shadow-inner mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pr-4">
            {filteredAthletes.map((athlete) => (
              <AthleteCard 
                key={athlete.id} 
                {...athlete} 
                isSelected={selectedAthletes.includes(athlete.id)}
                onSelect={() => toggleAthlete(athlete.id)}
              />
            ))}
            {filteredAthletes.length === 0 && (
              <div className="col-span-full py-20 text-center bg-card/20 rounded-3xl border border-dashed border-white/5">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground font-headline font-bold uppercase tracking-widest">No Athletes in this Arena yet</p>
                <p className="text-xs text-muted-foreground mt-2">Try selecting another sport to see the elite roster.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </main>

      {/* Floating Selection Bar */}
      {selectedAthletes.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl animate-in slide-in-from-bottom-10">
          <div className="bg-primary/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {selectedAthletes.map((id) => (
                  <div key={id} className="h-10 w-10 rounded-full border-2 border-primary bg-secondary overflow-hidden ring-2 ring-background">
                    <img 
                      src={`https://picsum.photos/seed/${id}/400/400`} 
                      alt="athlete"
                      className="object-cover h-full w-full"
                    />
                  </div>
                ))}
              </div>
              <div>
                <p className="font-headline font-bold text-white text-lg leading-none">
                  {selectedAthletes.length} Selected
                </p>
                <p className="text-white/60 text-xs mt-1 uppercase font-bold tracking-widest">Game Lineup</p>
              </div>
            </div>
            <Link href="/games/create">
              <Button size="lg" className="bg-accent text-accent-foreground font-bold uppercase tracking-wider px-8 hover:bg-white shadow-xl">
                START GAME
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
