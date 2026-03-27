
"use client";

import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Users, Zap, Clock, Share2, Target, Dribbble, Flag } from "lucide-react";

export default function GameArenaPage({ params }: { params: { gameId: string } }) {
  const searchParams = useSearchParams();
  const sportId = searchParams.get('sport') || 'nba';

  const themes = {
    nba: {
      color: "from-orange-600/20 to-orange-900/40",
      accent: "text-orange-500",
      bg: "bg-orange-500/10",
      icon: <Dribbble className="h-10 w-10" />,
      label: "NBA Arena"
    },
    nfl: {
      color: "from-green-600/20 to-green-900/40",
      accent: "text-green-500",
      bg: "bg-green-500/10",
      icon: <Trophy className="h-10 w-10" />,
      label: "NFL Gridiron"
    },
    golf: {
      color: "from-emerald-600/20 to-emerald-900/40",
      accent: "text-emerald-400",
      bg: "bg-emerald-400/10",
      icon: <Target className="h-10 w-10" />,
      label: "Masters Green"
    },
    nascar: {
      color: "from-red-600/20 to-red-900/40",
      accent: "text-red-500",
      bg: "bg-red-500/10",
      icon: <Flag className="h-10 w-10" />,
      label: "Victory Lane"
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
                    <h1 className="font-headline text-4xl font-bold uppercase tracking-tight">Game #{params.gameId.split('-')[1]}</h1>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> LIVE IN 14M</span>
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> 2/2 PLAYERS</span>
                  <span className={`flex items-center gap-1.5 font-bold ${theme.accent}`}><Zap className="h-4 w-4" /> 500 SC POOL</span>
                </div>
              </div>
              <Button className="font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/10">
                <Share2 className="mr-2 h-4 w-4" /> Invite Link
              </Button>
            </header>

            {/* Scoreboard / Roster */}
            <Card className="bg-card/40 backdrop-blur-xl border-white/5 shadow-2xl overflow-hidden">
              <CardHeader className="bg-secondary/30 border-b">
                <CardTitle className="font-headline text-lg uppercase flex items-center gap-2">
                  <Trophy className={`h-5 w-5 ${theme.accent}`} />
                  Live Standings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="font-headline font-bold text-2xl text-muted-foreground">#0{i}</span>
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                          <AvatarImage src={`https://picsum.photos/seed/p${i}/100/100`} />
                          <AvatarFallback>P{i}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-lg leading-none mb-1">Elite_Player_{i}</p>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">3 Active Picks</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-headline text-3xl font-bold ${i === 1 ? theme.accent : 'text-white/60'}`}>{i === 1 ? '142.5' : '118.0'}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">FANTASY POINTS</p>
                      </div>
                    </div>
                  ))}
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
                  "Luka Doncic scores a 3-pointer! +3.5 pts",
                  "Game started. May the best playmaker win.",
                  "Entry fees collected and secured in the prize pool."
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
                  <span className="text-xs font-bold uppercase">1st Place</span>
                  <span className="font-headline font-bold text-accent">450 SC</span>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase">2nd Place</span>
                  <span className="font-headline font-bold">50 SC</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary/10 border-dashed border-2 p-6">
              <h4 className="font-headline font-bold uppercase text-center mb-4">Arena Rules</h4>
              <ul className="space-y-3 text-xs text-muted-foreground font-medium">
                <li className="flex items-start gap-2">• Points based on live athlete performance</li>
                <li className="flex items-start gap-2">• Highest score at final whistle wins</li>
                <li className="flex items-start gap-2">• Tiebreakers decided by top performer pts</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
