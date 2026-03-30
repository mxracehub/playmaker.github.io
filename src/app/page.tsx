
"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { SportsFilter } from "@/components/sports-filter";
import { AthleteCard } from "@/components/athlete-card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowRight, 
  Target, 
  Gamepad2, 
  Trophy, 
  Sparkles, 
  Loader2,
  Dribbble,
  Swords,
  Snowflake,
  Waves,
  Zap,
  Bike,
  Mountain,
  Flag,
  SearchX
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection } from "firebase/firestore";
import { cn } from "@/lib/utils";

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

const BaseballIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 1 0 20" />
    <path d="M2 12a10 10 0 0 1 20 0" />
    <path d="M7 7c2 1 3 3 3 5s-1 4-3 5" />
    <path d="M17 7c-2 1-3 3-3 5s1 4 3 5" />
  </svg>
);

const mockAthletes = [
  { id: "nba-1", name: "Luka Doncic", team: "Dallas Mavericks", sport: "NBA", avatar: "https://picsum.photos/seed/nba-pro/400/400" },
  { id: "nfl-1", name: "Patrick Mahomes", team: "KC Chiefs", sport: "NFL", avatar: "https://picsum.photos/seed/nfl-pro/400/400" },
  { id: "mlb-1", name: "Shohei Ohtani", team: "LA Dodgers", sport: "MLB", avatar: "https://picsum.photos/seed/mlb-pro/400/400" },
  { id: "nhl-1", name: "Connor McDavid", team: "Edmonton Oilers", sport: "NHL", avatar: "https://picsum.photos/seed/nhl-pro/400/400" },
  { id: "soccer-1", name: "Lionel Messi", team: "Inter Miami", sport: "Soccer", avatar: "https://picsum.photos/seed/soccer-pro/400/400" },
  { id: "ufc-1", name: "Jon Jones", team: "Elite Heavyweight", sport: "UFC", avatar: "https://picsum.photos/seed/ufc-pro/400/400" },
  { id: "boxing-1", name: "Tyson Fury", team: "Heavyweight Pro", sport: "Boxing", avatar: "https://picsum.photos/seed/boxing-pro/400/400" },
  { id: "tennis-1", name: "Novak Djokovic", team: "ATP Tour Elite", sport: "Tennis", avatar: "https://picsum.photos/seed/tennis-pro/400/400" },
  { id: "pickle-1", name: "Ben Johns", team: "PPA Tour Champ", sport: "Pickleball", avatar: "https://picsum.photos/seed/pickleball-pro/400/400" },
  { id: "vball-1", name: "USA National", team: "Olympic Roster", sport: "Volleyball", avatar: "https://picsum.photos/seed/volleyball-pro/400/400" },
  { id: "surf-1", name: "J.J. Florence", team: "WSL Pro Tour", sport: "Surfing", avatar: "https://picsum.photos/seed/surfing-pro/400/400" },
  { id: "skate-1", name: "Nyjah Huston", team: "SLS Pro Elite", sport: "Skateboarding", avatar: "https://picsum.photos/seed/skateboarding-pro/400/400" },
  { id: "bmx-1", name: "Logan Martin", team: "UCI World Elite", sport: "BMX", avatar: "https://picsum.photos/seed/bmx-pro/400/400" },
  { id: "snow-1", name: "Chloe Kim", team: "X-Games Champ", sport: "Snowboarding", avatar: "https://picsum.photos/seed/snowboarding-pro/400/400" },
  { id: "nas-1", name: "Kyle Larson", team: "Hendrick Motor", sport: "NASCAR", avatar: "https://picsum.photos/seed/nascar-pro/400/400" },
  { id: "golf-1", name: "S. Scheffler", team: "PGA Tour Elite", sport: "Golf", avatar: "https://picsum.photos/seed/golf-pro/400/400" },
];

const sportEmptyStates: Record<string, { icon: React.ReactNode; label: string }> = {
  all: { icon: <Sparkles className="h-16 w-16" />, label: "NO ATHLETES IN THE LINEUP YET" },
  nba: { icon: <Dribbble className="h-16 w-16" />, label: "NO NBA PLAYMAKERS FOUND" },
  nfl: { icon: <Trophy className="h-16 w-16" />, label: "NO NFL PLAYMAKERS FOUND" },
  nhl: { icon: <Snowflake className="h-16 w-16" />, label: "NO NHL PLAYMAKERS FOUND" },
  soccer: { icon: <SoccerIcon className="h-16 w-16" />, label: "NO SOCCER PLAYMAKERS FOUND" },
  ufc: { icon: <Swords className="h-16 w-16" />, label: "NO UFC FIGHTERS FOUND" },
  boxing: { icon: <BoxingIcon className="h-16 w-16" />, label: "NO BOXING CONTENDERS FOUND" },
  mlb: { icon: <BaseballIcon className="h-16 w-16" />, label: "NO MLB PLAYMAKERS FOUND" },
  tennis: { icon: <Target className="h-16 w-16" />, label: "NO TENNIS PLAYMAKERS FOUND" },
  pickleball: { icon: <Trophy className="h-16 w-16" />, label: "NO PICKLEBALL PLAYMAKERS FOUND" },
  volleyball: { icon: <Trophy className="h-16 w-16" />, label: "NO VOLLEYBALL PLAYMAKERS FOUND" },
  surfing: { icon: <Waves className="h-16 w-16" />, label: "NO SURFING PLAYMAKERS FOUND" },
  skateboarding: { icon: <Zap className="h-16 w-16" />, label: "NO SKATE PLAYMAKERS FOUND" },
  bmx: { icon: <Bike className="h-16 w-16" />, label: "NO BMX PLAYMAKERS FOUND" },
  snowboarding: { icon: <Mountain className="h-16 w-16" />, label: "NO SNOW PLAYMAKERS FOUND" },
  nascar: { icon: <Flag className="h-16 w-16" />, label: "NO NASCAR PLAYMAKERS FOUND" },
  golf: { icon: <Target className="h-16 w-16" />, label: "NO GOLF PLAYMAKERS FOUND" },
};

export default function Home() {
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);

  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const gamesQuery = useMemoFirebase(() => {
    // Guard the query to prevent unauthorized list requests before authentication is confirmed
    if (isUserLoading || !user) return null;
    return collection(db, "games");
  }, [db, user, isUserLoading]);
  
  const { data: games, isLoading: isCollectionLoading } = useCollection(gamesQuery);

  const isGamesLoading = isUserLoading || isCollectionLoading;
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

  const emptyState = sportEmptyStates[selectedSport] || sportEmptyStates.all;

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
            
            <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[220px]">
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-2xl px-5 py-4 rounded-2xl border border-white/10 shadow-2xl transition-all hover:scale-105 hover:bg-white/10 duration-300">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                  {isGamesLoading ? <Loader2 className="h-5 w-5 text-accent animate-spin" /> : <Gamepad2 className="h-5 w-5 text-accent" />}
                </div>
                <div>
                  <p className="text-[8px] text-white/40 font-black uppercase tracking-[0.25em] mb-0.5">ACTIVE GAMES</p>
                  <p className="text-3xl font-headline font-bold tracking-tighter italic leading-none">
                    {activeGamesCount.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-2xl px-5 py-4 rounded-2xl border border-white/10 shadow-2xl transition-all hover:scale-105 hover:bg-white/10 duration-300">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                  {isGamesLoading ? <Loader2 className="h-5 w-5 text-accent animate-spin" /> : <Target className="h-5 w-5 text-accent" />}
                </div>
                <div>
                  <p className="text-[8px] text-white/40 font-black uppercase tracking-[0.25em] mb-0.5">WINNERS TODAY</p>
                  <p className="text-3xl font-headline font-bold tracking-tighter italic leading-none">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pr-4 h-full">
            {filteredAthletes.length > 0 ? (
              filteredAthletes.map((athlete) => (
                <AthleteCard 
                  key={athlete.id} 
                  {...athlete} 
                  isSelected={selectedAthletes.includes(athlete.id)}
                  onSelect={() => toggleAthlete(athlete.id)}
                />
              ))
            ) : (
              <div className="col-span-full h-full min-h-[400px] flex flex-col items-center justify-center text-center px-4">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full scale-150" />
                  <div className="relative text-muted-foreground opacity-20">
                    {emptyState.icon}
                  </div>
                </div>
                <h3 className="font-headline text-2xl md:text-3xl font-bold uppercase tracking-widest text-muted-foreground/60 mb-3">
                  {emptyState.label}
                </h3>
                <p className="text-sm text-muted-foreground/40 max-w-xs font-medium uppercase tracking-wider">
                  The official 2026 roster is being verified. Try selecting another sport to see the elite lineup.
                </p>
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
                {selectedAthletes.slice(0, 3).map((id) => {
                  const athlete = mockAthletes.find(a => a.id === id);
                  return (
                    <div key={id} className="h-10 w-10 rounded-full border-2 border-primary bg-secondary overflow-hidden ring-2 ring-background">
                      <img 
                        src={athlete?.avatar || `https://picsum.photos/seed/${id}/100/100`} 
                        alt="athlete"
                        className="object-cover h-full w-full"
                      />
                    </div>
                  );
                })}
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
