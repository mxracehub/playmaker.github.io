"use client";

import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Users, Zap, Clock, Share2, Target, Dribbble, Flag, CheckCircle2, Waves, Bike, Mountain, Swords, Timer, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";

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

const HockeyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 3l-2 2-7 7-3-1-2 2 4 4 2-2-1-3 7-7 2-2" />
    <circle cx="19" cy="5" r="2" />
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
      statLabel: "WINS"
    },
    nfl: {
      color: "from-green-600/20 to-green-900/40",
      accent: "text-green-500",
      bg: "bg-green-500/10",
      icon: <Trophy className="h-10 w-10" />,
      label: "NFL Gridiron",
      statLabel: "WINS"
    },
    hockey: {
      color: "from-cyan-600/20 to-cyan-900/40",
      accent: "text-cyan-400",
      bg: "bg-cyan-400/10",
      icon: <Snowflake className="h-10 w-10" />,
      label: "Frozen Fortress",
      statLabel: "WINS"
    },
    soccer: {
      color: "from-slate-600/20 to-slate-900/40",
      accent: "text-white",
      bg: "bg-white/10",
      icon: <SoccerIcon className="h-10 w-10" />,
      label: "Pitch Battle",
      statLabel: "WINS"
    },
    ufc: {
      color: "from-red-600/20 to-red-900/40",
      accent: "text-red-500",
      bg: "bg-red-500/10",
      icon: <Swords className="h-10 w-10" />,
      label: "The Octagon",
      statLabel: "WINS"
    },
    boxing: {
      color: "from-yellow-600/20 to-yellow-900/40",
      accent: "text-yellow-500",
      bg: "bg-yellow-500/10",
      icon: <BoxingIcon className="h-10 w-10" />,
      label: "Main Event",
      statLabel: "WINS"
    },
    mlb: {
      color: "from-blue-600/20 to-blue-900/40",
      accent: "text-blue-500",
      bg: "bg-blue-500/10",
      icon: <BaseballIcon className="h-10 w-10" />,
      label: "Diamond Duel",
      statLabel: "WINS"
    },
    tennis: {
      color: "from-lime-600/20 to-lime-900/40",
      accent: "text-lime-400",
      bg: "bg-lime-400/10",
      icon: <TennisIcon className="h-10 w-10" />,
      label: "Grand Slam",
      statLabel: "WINS"
    },
    pickleball: {
      color: "from-yellow-600/20 to-yellow-900/40",
      accent: "text-yellow-500",
      bg: "bg-yellow-500/10",
      icon: <PickleballIcon className="h-10 w-10" />,
      label: "Kitchen Combat",
      statLabel: "WINS"
    },
    volleyball: {
      color: "from-indigo-600/20 to-indigo-900/40",
      accent: "text-indigo-400",
      bg: "bg-indigo-400/10",
      icon: <VolleyballIcon className="h-10 w-10" />,
      label: "The Net Zone",
      statLabel: "WINS"
    },
    golf: {
      color: "from-emerald-600/20 to-emerald-900/40",
      accent: "text-emerald-400",
      bg: "bg-emerald-400/10",
      icon: <Target className="h-10 w-10" />,
      label: "Masters Green",
      statLabel: "WINS"
    },
    nascar: {
      color: "from-red-600/20 to-red-900/40",
      accent: "text-red-500",
      bg: "bg-red-500/10",
      icon: <Flag className="h-10 w-10" />,
      label: "Victory Lane",
      statLabel: "WINS"
    },
    surfing: {
      color: "from-blue-600/20 to-blue-400/40",
      accent: "text-blue-400",
      bg: "bg-blue-400/10",
      icon: <Waves className="h-10 w-10" />,
      label: "Pipe Masters",
      statLabel: "WINS"
    },
    skateboarding: {
      color: "from-yellow-600/20 to-yellow-400/40",
      accent: "text-yellow-400",
      bg: "bg-yellow-400/10",
      icon: <Zap className="h-10 w-10" />,
      label: "Skate Park",
      statLabel: "WINS"
    },
    bmx: {
      color: "from-red-600/20 to-red-400/40",
      accent: "text-red-400",
      bg: "bg-red-400/10",
      icon: <Bike className="h-10 w-10" />,
      label: "BMX Dirt",
      statLabel: "WINS"
    },
    snowboarding: {
      color: "from-cyan-600/20 to-cyan-400/40",
      accent: "text-cyan-400",
      bg: "bg-cyan-400/10",
      icon: <Mountain className="h-10 w-10" />,
      label: "Halfpipe",
      statLabel: "WINS"
    }
  };

  const theme = themes[sportId as keyof typeof themes] || themes.nba;

  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-background relative overflow-hidden">
      <Navbar />
      
      {/* Sport Specific Gradient */}
      <div className={`absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b ${theme.color} to-transparent -z-10 opacity-40`} />

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-10">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-2xl bg-card border border-white/10 flex items-center justify-center shadow-2xl">
                <div className={theme.accent}>{theme.icon}</div>
              </div>
              <div className="space-y-1">
                <Badge className="bg-white/10 text-white font-bold uppercase text-[10px] tracking-widest py-1 border-none">{theme.label}</Badge>
                <h1 className="font-headline text-5xl font-bold uppercase tracking-tighter text-white">{params.gameId}</h1>
                <div className="flex items-center gap-6 text-[11px] text-muted-foreground font-bold uppercase tracking-widest pt-2">
                  <span className="flex items-center gap-2 text-accent"><Clock className="h-3.5 w-3.5" /> LIVE SHOWDOWN</span>
                  <span className="flex items-center gap-2"><Users className="h-3.5 w-3.5" /> 2/2 PLAYMAKERS</span>
                  <span className={cn("flex items-center gap-2 font-bold", theme.accent)}>
                    <Zap className="h-4 w-4 fill-current" />
                    {(parseInt(fee) * 2).toLocaleString()} {currency.toUpperCase()} PRIZE POOL
                  </span>
                </div>
              </div>
            </div>
            <Button className="font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 h-12 px-6">
              <Share2 className="mr-2 h-4 w-4" /> Share Game
            </Button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              {/* My Prediction Card - MATCHING IMAGE REFERENCE */}
              <Card className="bg-[#0D1219] border-[#1F2937] border-2 overflow-hidden rounded-xl">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-full bg-[#1A232E]/40 flex items-center justify-center border border-[#374151]">
                      <Trophy className="h-7 w-7 text-accent" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-accent uppercase tracking-[0.25em] mb-1">Your Prediction</p>
                      <h2 className="font-headline text-4xl font-bold text-white uppercase tracking-tighter">{myPick}</h2>
                    </div>
                  </div>
                  <div className="px-6 py-2 rounded-full border border-accent/40 text-accent font-black uppercase tracking-[0.15em] text-[10px]">
                    LOCKED IN
                  </div>
                </CardContent>
              </Card>

              {/* Standings Card */}
              <Card className="bg-card/40 backdrop-blur-xl border-white/5 shadow-2xl overflow-hidden rounded-2xl">
                <CardHeader className="bg-secondary/20 border-b border-white/5 px-8 py-6">
                  <CardTitle className="font-headline text-sm uppercase flex items-center gap-3 tracking-widest text-white/80">
                    <div className="h-5 w-5 rounded-full border-2 border-accent flex items-center justify-center">
                      <div className="h-1.5 w-1.5 bg-accent rounded-full animate-ping" />
                    </div>
                    Live Showdown Standings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-white/5">
                    {/* Player Row: You */}
                    <div className="px-8 py-8 flex items-center justify-between bg-accent/5">
                      <div className="flex items-center gap-6">
                        <span className="font-headline font-bold text-3xl text-accent tracking-tighter italic">#01</span>
                        <div className="relative">
                          <Avatar className="h-14 w-14 border-2 border-accent shadow-xl">
                            <AvatarImage src={`https://picsum.photos/seed/you/100/100`} />
                            <AvatarFallback>YOU</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 bg-accent rounded-full p-1 border-2 border-background">
                            <CheckCircle2 className="h-3 w-3 text-background" />
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-xl leading-none text-white mb-1">You (Elite_Playmaker)</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">PICK: {myPick}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-headline text-4xl font-bold ${theme.accent} tracking-tighter`}>15</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{theme.statLabel}</p>
                      </div>
                    </div>

                    {/* Player Row: Opponent */}
                    <div className="px-8 py-8 flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-6">
                        <span className="font-headline font-bold text-3xl text-muted-foreground tracking-tighter italic">#02</span>
                        <Avatar className="h-14 w-14 border-2 border-white/10">
                          <AvatarImage src={`https://picsum.photos/seed/${challenger}/100/100`} />
                          <AvatarFallback>CH</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-xl leading-none text-white/80 mb-1">{challenger}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">PICK: Underdog Squad</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-headline text-4xl font-bold text-white/40 tracking-tighter">12</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{theme.statLabel}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Details */}
            <aside className="space-y-6">
              <Card className="bg-[#1A232E]/60 border border-white/5 p-6 rounded-2xl">
                <h4 className="font-headline font-bold uppercase tracking-widest text-[10px] text-muted-foreground mb-6">Arena Intel</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">Prize Split</span>
                    <span className="font-bold text-accent">Winner Take All</span>
                  </div>
                  <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Total Reward Pool</span>
                    <div className={cn("flex items-center gap-2 font-bold", theme.accent)}>
                      <Zap className="h-5 w-5 fill-current" />
                      <span className="font-headline text-2xl">{(parseInt(fee) * 2).toLocaleString()} {currency.toUpperCase()} POOL</span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="p-6 rounded-2xl bg-secondary/10 border border-dashed border-white/10 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className={`h-4 w-4 ${theme.accent}`} />
                  <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Showdown Rules</h5>
                </div>
                <ul className="space-y-3 text-[11px] text-muted-foreground font-medium leading-relaxed">
                  <li className="flex gap-2"><span>•</span> <span>Winner determined by official provider score at arena close.</span></li>
                  <li className="flex gap-2"><span>•</span> <span>Scoring updates trigger every 30 seconds via global satellite feed.</span></li>
                  <li className="flex gap-2"><span>•</span> <span>In the event of an arena tie, stakes are returned to all playmakers.</span></li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
