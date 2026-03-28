
"use client";

import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Users, Zap, Clock, Share2, Target, Dribbble, Flag, CheckCircle2, Waves, Bike, Mountain, Swords, Timer } from "lucide-react";

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

export default function GameArenaPage({ params }: { params: { gameId: string } }) {
  const searchParams = useSearchParams();
  const sportId = searchParams.get('sport') || 'nba';
  const myPick = searchParams.get('pick') || 'Elite Selection';
  const fee = searchParams.get('fee') || '1000';
  const currency = searchParams.get('currency') || 'gold';
  const challenger = searchParams.get('challenger') || 'Challenger Alpha';

  const themes = {
    nba: {
      color: "from-orange-600/20 to-orange-900/40",
      accent: "text-orange-500",
      bg: "bg-orange-500/10",
      icon: <Dribbble className="h-10 w-10" />,
      label: "NBA Arena",
      statLabel: "PPG / REB"
    },
    nfl: {
      color: "from-green-600/20 to-green-900/40",
      accent: "text-green-500",
      bg: "bg-green-500/10",
      icon: <Trophy className="h-10 w-10" />,
      label: "NFL Gridiron",
      statLabel: "TD / YDS"
    },
    soccer: {
      color: "from-slate-600/20 to-slate-900/40",
      accent: "text-white",
      bg: "bg-white/10",
      icon: <SoccerIcon className="h-10 w-10" />,
      label: "Pitch Battle",
      statLabel: "GOALS / AST"
    },
    ufc: {
      color: "from-red-600/20 to-red-900/40",
      accent: "text-red-500",
      bg: "bg-red-500/10",
      icon: <Swords className="h-10 w-10" />,
      label: "The Octagon",
      statLabel: "STRIKES / SUB"
    },
    boxing: {
      color: "from-yellow-600/20 to-yellow-900/40",
      accent: "text-yellow-500",
      bg: "bg-yellow-500/10",
      icon: <BoxingIcon className="h-10 w-10" />,
      label: "Main Event",
      statLabel: "PUNCHES / KO"
    },
    mlb: {
      color: "from-blue-600/20 to-blue-900/40",
      accent: "text-blue-500",
      bg: "bg-blue-500/10",
      icon: <BaseballIcon className="h-10 w-10" />,
      label: "Diamond Duel",
      statLabel: "HR / RBI"
    },
    tennis: {
      color: "from-lime-600/20 to-lime-900/40",
      accent: "text-lime-400",
      bg: "bg-lime-400/10",
      icon: <TennisIcon className="h-10 w-10" />,
      label: "Grand Slam",
      statLabel: "ACES / WINNERS"
    },
    pickleball: {
      color: "from-yellow-600/20 to-yellow-900/40",
      accent: "text-yellow-500",
      bg: "bg-yellow-500/10",
      icon: <PickleballIcon className="h-10 w-10" />,
      label: "Kitchen Combat",
      statLabel: "DINKS / SCORE"
    },
    volleyball: {
      color: "from-indigo-600/20 to-indigo-900/40",
      accent: "text-indigo-400",
      bg: "bg-indigo-400/10",
      icon: <VolleyballIcon className="h-10 w-10" />,
      label: "The Net Zone",
      statLabel: "KILLS / BLOCKS"
    },
    golf: {
      color: "from-emerald-600/20 to-emerald-900/40",
      accent: "text-emerald-400",
      bg: "bg-emerald-400/10",
      icon: <Target className="h-10 w-10" />,
      label: "Masters Green",
      statLabel: "STROKES / BIRDIE"
    },
    nascar: {
      color: "from-red-600/20 to-red-900/40",
      accent: "text-red-500",
      bg: "bg-red-500/10",
      icon: <Flag className="h-10 w-10" />,
      label: "Victory Lane",
      statLabel: "POS / LAP"
    },
    surfing: {
      color: "from-blue-600/20 to-blue-900/40",
      accent: "text-blue-400",
      bg: "bg-blue-400/10",
      icon: <Waves className="h-10 w-10" />,
      label: "Pipe Masters",
      statLabel: "SCORE / WAVE"
    },
    skateboarding: {
      color: "from-yellow-600/20 to-yellow-900/40",
      accent: "text-yellow-400",
      bg: "bg-yellow-400/10",
      icon: <Zap className="h-10 w-10" />,
      label: "Skate Park",
      statLabel: "TRICK / STYLE"
    },
    bmx: {
      color: "from-red-600/20 to-red-900/40",
      accent: "text-red-400",
      bg: "bg-red-400/10",
      icon: <Bike className="h-10 w-10" />,
      label: "BMX Dirt",
      statLabel: "AIR / FLOW"
    },
    snowboarding: {
      color: "from-cyan-600/20 to-cyan-900/40",
      accent: "text-cyan-400",
      bg: "bg-cyan-400/10",
      icon: <Mountain className="h-10 w-10" />,
      label: "Halfpipe",
      statLabel: "ROTATION / LAND"
    }
  };

  const theme = themes[sportId as keyof typeof themes] || themes.nba;

  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-background relative overflow-hidden">
      <Navbar />
      
      {/* Sport Specific Gradient */}
      <div className={`absolute top-0 inset-x-0 h-96 bg-gradient-to-b ${theme.color} to-transparent -z-10`} />

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Arena Content */}
          <div className="flex-1 space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`h-16 w-16 rounded-2xl ${theme.bg} border border-white/10 flex items-center justify-center shadow-2xl`}>
                    <div className={theme.accent}>{theme.icon}</div>
                  </div>
                  <div>
                    <Badge className="bg-white/10 text-white font-bold uppercase mb-1">{theme.label}</Badge>
                    <h1 className="font-headline text-4xl font-bold uppercase tracking-tight">{params.gameId}</h1>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5 font-bold text-accent animate-pulse"><Clock className="h-4 w-4" /> LIVE SHOWDOWN</span>
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> 2/2 PLAYMAKERS</span>
                  <span className={`flex items-center gap-1.5 font-bold ${theme.accent}`}>
                    <Zap className="h-4 w-4" /> {parseInt(fee) * 2} {currency.toUpperCase()} PRIZE POOL
                  </span>
                </div>
              </div>
              <Button className="font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/10">
                <Share2 className="mr-2 h-4 w-4" /> Share Game
              </Button>
            </header>

            {/* My Locked Selection */}
            <Card className="bg-accent/5 border-accent/20 border-2 overflow-hidden animate-in zoom-in-95 duration-700">
               <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-accent/20 flex items-center justify-center">
                      <Trophy className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-accent uppercase tracking-widest">Your Prediction</p>
                      <h2 className="font-headline text-2xl font-bold text-white uppercase">{myPick}</h2>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="border-accent text-accent font-bold">LOCKED IN</Badge>
                  </div>
               </CardContent>
            </Card>

            {/* Scoreboard / Roster */}
            <Card className="bg-card/40 backdrop-blur-xl border-white/5 shadow-2xl overflow-hidden">
              <CardHeader className="bg-secondary/30 border-b">
                <CardTitle className="font-headline text-lg uppercase flex items-center gap-2">
                  <Target className={`h-5 w-5 ${theme.accent}`} />
                  Live Showdown Standings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  <div className="p-6 flex items-center justify-between bg-accent/5">
                    <div className="flex items-center gap-4">
                      <span className="font-headline font-bold text-2xl text-accent">#01</span>
                      <Avatar className="h-12 w-12 border-2 border-accent">
                        <AvatarImage src={`https://picsum.photos/seed/you/100/100`} />
                        <AvatarFallback>YOU</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-lg leading-none mb-1">You (Elite_Playmaker)</p>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Pick: {myPick}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-headline text-3xl font-bold ${theme.accent}`}>154.2</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{theme.statLabel}</p>
                    </div>
                  </div>
                  <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="font-headline font-bold text-2xl text-muted-foreground">#02</span>
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={`https://picsum.photos/seed/${challenger}/100/100`} />
                        <AvatarFallback>CH</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-lg leading-none mb-1">{challenger}</p>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Pick: Underdog Squad</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-headline text-3xl font-bold text-white/60">128.0</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{theme.statLabel}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Feed */}
            <div className="space-y-4">
              <h3 className="font-headline font-bold uppercase text-muted-foreground tracking-widest text-xs flex items-center gap-2">
                <div className="h-1.5 w-6 bg-accent rounded-full" />
                Live Arena Feed
              </h3>
              <div className="space-y-3">
                {[
                  `${myPick} just made a game-changing play! +12.5 pts`,
                  `${challenger} is trailing by 26.2 points.`,
                  "Game is entering the final quarter. Hold the line!"
                ].map((msg, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/20 border border-white/5 text-sm">
                    <div className={`h-2 w-2 rounded-full ${theme.bg} animate-pulse`} />
                    <p className="text-muted-foreground font-medium">{msg}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Stats */}
          <div className="w-full lg:w-80 space-y-6">
            <Card className="bg-card/50 border shadow-xl">
              <CardHeader>
                <CardTitle className="text-sm font-headline uppercase tracking-widest">Prize Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase">1st Place (90%)</span>
                  <span className="font-headline font-bold text-accent">{parseInt(fee) * 1.8} {currency.toUpperCase()}</span>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase">2nd Place (10%)</span>
                  <span className="font-headline font-bold">{parseInt(fee) * 0.2} {currency.toUpperCase()}</span>
                </div>
                <p className="text-[10px] text-center text-muted-foreground italic font-medium">
                  Forge Ratio: $1.00 = 100 {currency.toUpperCase()}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary/10 border-dashed border-2 p-6">
              <h4 className="font-headline font-bold uppercase text-center mb-4">Showdown Rules</h4>
              <ul className="space-y-3 text-xs text-muted-foreground font-medium">
                <li className="flex items-start gap-2">• Winner takes 90% of the total prize pool</li>
                <li className="flex items-start gap-2">• Score updates in real-time from official feeds</li>
                <li className="flex items-start gap-2">• Tie-breakers split the pool evenly</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
