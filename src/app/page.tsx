"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { SportsFilter } from "@/components/sports-filter";
import { AthleteCard } from "@/components/athlete-card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, Target, Gamepad2, Trophy, Sparkles } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

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
    id: "hockey-1",
    name: "Connor McDavid",
    team: "Edmonton Oilers",
    sport: "Hockey",
    avatar: "https://picsum.photos/seed/mcdavid/400/400",
    stats: [
      { label: "Points", value: "132" },
      { label: "Goals", value: "32" }
    ]
  },
  {
    id: "hockey-2",
    name: "Nathan MacKinnon",
    team: "Colorado Avalanche",
    sport: "Hockey",
    avatar: "https://picsum.photos/seed/mackinnon/400/400",
    stats: [
      { label: "Points", value: "140" },
      { label: "Assists", value: "89" }
    ]
  }
];

export default function Home() {
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);

  const db = useFirestore();
  const gamesQuery = useMemoFirebase(() => collection(db, "games"), [db]);
  const { data: games } = useCollection(gamesQuery);

  const activeGamesCount = games?.filter(g => g.status === "Open" || g.status === "Live").length || 0;
  const winnersTodayCount = games?.filter(g => g.status === "Completed" && g.winnerId).length || 0;

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
        <section className="mb-12 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1a237e] to-[#0d1219] p-8 md:p-12 text-white relative shadow-2xl border-2 border-white/5">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
            <div className="max-w-xl">
              <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-none uppercase italic">
                The Ultimate <br/><span className="text-accent">Playmaker</span> Arcade
              </h1>
              <p className="text-xl text-white/70 mb-8 font-medium leading-relaxed max-w-lg">
                Challenge your circle in the next generation of sports games. Pick your elite team or athlete and dominate.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/games/create">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest h-14 px-8 shadow-xl shadow-primary/20">
                    Start a Game <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold uppercase tracking-widest backdrop-blur-sm h-14 px-8">
                    How it Works
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Tighter Live Stats Cards - Smaller for shorter page */}
            <div className="flex flex-col gap-2 w-full md:w-auto md:min-w-[200px]">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-2xl px-4 py-3 rounded-2xl border border-white/10 shadow-2xl transition-all hover:scale-105 hover:bg-white/10 duration-300">
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                  <Gamepad2 className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-[7px] text-white/40 font-black uppercase tracking-[0.25em] mb-0.5">ACTIVE GAMES</p>
                  <p className="text-2xl font-headline font-bold tracking-tighter italic leading-none">
                    {activeGamesCount.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-2xl px-4 py-3 rounded-2xl border border-white/10 shadow-2xl transition-all hover:scale-105 hover:bg-white/10 duration-300">
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                  <Target className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-[7px] text-white/40 font-black uppercase tracking-[0.25em] mb-0.5">WINNERS TODAY</p>
                  <p className="text-2xl font-headline font-bold tracking-tighter italic leading-none">
                    {winnersTodayCount.toLocaleString()}
                  </p>
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

        {/* Athlete Grid */}
        <ScrollArea className="h-[600px] rounded-3xl border border-white/5 bg-card/20 p-6 shadow-inner mb-12">
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
                {selectedAthletes.slice(0, 3).map((id) => (
                  <div key={id} className="h-10 w-10 rounded-full border-2 border-primary bg-secondary overflow-hidden ring-2 ring-background">
                    <img 
                      src={`https://picsum.photos/seed/${id}/100/100`} 
                      alt="athlete"
                      className="object-cover h-full w-full"
                    />
                  </div>
                ))}
                {selectedAthletes.length > 3 && (
                  <div className="h-10 w-10 rounded-full border-2 border-primary bg-secondary flex items-center justify-center ring-2 ring-background text-[10px] font-bold">
                    +{selectedAthletes.length - 3}
                  </div>
                )}
              </div>
              <div>
                <p className="font-headline font-bold text-white text-lg leading-none">
                  {selectedAthletes.length} Selected
                </p>
                <p className="text-white/60 text-xs mt-1 uppercase font-bold tracking-widest">Game Lineup</p>
              </div>
            </div>
            <Link href="/games/create">
              <Button size="lg" className="bg-accent text-accent-foreground font-bold uppercase tracking-widest px-8 hover:bg-white shadow-xl">
                START GAME
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}