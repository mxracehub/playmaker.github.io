
"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Clock, Users, ArrowRight, Plus, Zap, Check, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const initialActiveGames = [
  { 
    id: "game-1", 
    title: "Sunday Night Showdown", 
    sport: "NFL", 
    players: 12, 
    entries: 8, 
    pool: "5,000 SC", 
    time: "Starts in 2h 45m",
    status: "open",
    accent: "text-green-500",
    bg: "bg-green-500/10"
  },
  { 
    id: "game-2", 
    title: "Mavericks vs Lakers Pick-em", 
    sport: "NBA", 
    players: 2, 
    entries: 2, 
    pool: "200 SC", 
    time: "Live Now",
    status: "live",
    accent: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  { 
    id: "game-3", 
    title: "The Masters Elite Pack", 
    sport: "Golf", 
    players: 50, 
    entries: 42, 
    pool: "10,000 SC", 
    time: "Starts tomorrow",
    status: "open",
    accent: "text-emerald-400",
    bg: "bg-emerald-400/10"
  },
];

const initialInvites = [
  {
    id: "inv-1",
    challenger: "Jordan 'Swish' Smith",
    title: "3pt Contest Shootout",
    sport: "NBA",
    fee: "500 GC",
    expires: "22m left"
  },
  {
    id: "inv-2",
    challenger: "Sarah 'Quarterback' Jones",
    title: "Super Bowl Prediction",
    sport: "NFL",
    fee: "1,000 SC",
    expires: "1h left"
  }
];

const historyGames = [
  { id: "game-h1", title: "Global Skate Jam", sport: "Skate", pool: "500 GC", result: "Won", date: "Oct 24, 2023" },
  { id: "game-h2", title: "Pipe Masters Final", sport: "Surf", pool: "1,000 SC", result: "Lost", date: "Oct 20, 2023" },
];

export default function GamesPage() {
  const { toast } = useToast();
  const [activeGames, setActiveGames] = useState(initialActiveGames);
  const [invites, setInvites] = useState(initialInvites);

  const handleAccept = (invite: typeof initialInvites[0]) => {
    toast({
      title: "Challenge Accepted",
      description: `You've entered ${invite.title} arena!`,
    });
    setInvites(invites.filter(i => i.id !== invite.id));
    setActiveGames([
      {
        id: invite.id,
        title: invite.title,
        sport: invite.sport,
        players: 2,
        entries: 2,
        pool: invite.fee,
        time: "Starting Soon",
        status: "open",
        accent: invite.sport === 'NBA' ? "text-orange-500" : "text-green-500",
        bg: invite.sport === 'NBA' ? "bg-orange-500/10" : "bg-green-500/10"
      },
      ...activeGames
    ]);
  };

  const handleDecline = (id: string) => {
    toast({
      variant: "destructive",
      title: "Challenge Declined",
      description: "The arena invitation has been removed.",
    });
    setInvites(invites.filter(i => i.id !== id));
  };

  return (
    <div className="min-h-screen pb-24 pt-20 bg-background relative overflow-hidden">
      <Navbar />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-headline text-4xl font-bold uppercase tracking-tight">Your <span className="text-accent">Arena</span></h1>
            <p className="text-muted-foreground font-medium">Track your active plays and review your playmaker legacy.</p>
          </div>
          <Link href="/games/create">
            <Button className="h-14 px-8 font-headline font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
              <Plus className="mr-2 h-5 w-5" /> Start New Game
            </Button>
          </Link>
        </header>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full h-16 bg-card/40 backdrop-blur-md border grid grid-cols-3 p-1.5 mb-10 rounded-2xl">
            <TabsTrigger 
              value="active" 
              className="font-headline font-bold text-base md:text-lg uppercase tracking-wider rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
            >
              Active ({activeGames.length})
            </TabsTrigger>
            <TabsTrigger 
              value="invites" 
              className="font-headline font-bold text-base md:text-lg uppercase tracking-wider rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all relative"
            >
              Invites ({invites.length})
              {invites.length > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 rounded-full bg-accent animate-pulse" />}
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="font-headline font-bold text-base md:text-lg uppercase tracking-wider rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
            >
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-6">
            {activeGames.map((game) => (
              <Link key={game.id} href={`/games/${game.id}`}>
                <Card className="overflow-hidden bg-card/30 backdrop-blur-sm border-white/5 hover:border-accent/40 transition-all group relative">
                  <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", game.status === 'live' ? 'bg-accent animate-pulse' : 'bg-primary')} />
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="flex-1 p-8">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <Badge className={cn("font-bold uppercase tracking-widest px-3 py-1", game.bg, game.accent, "border-none")}>
                            {game.sport}
                          </Badge>
                          {game.status === 'live' ? (
                            <span className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest animate-pulse">
                              <Zap className="h-3 w-3 fill-current" /> Live Showdown
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                              <Clock className="h-3 w-3" /> {game.time}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="font-headline text-2xl font-bold mb-6 group-hover:text-accent transition-colors">{game.title}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                              <span>Players Joined</span>
                              <span className="text-white">{game.entries} / {game.players}</span>
                            </div>
                            <Progress value={(game.entries / game.players) * 100} className="h-2 bg-secondary/50" />
                          </div>
                          <div className="flex items-center gap-6 justify-start md:justify-end">
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Prize Pool</p>
                              <p className="font-headline text-2xl font-bold text-accent">{game.pool}</p>
                            </div>
                            <div className="h-14 w-14 rounded-full bg-secondary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                              <ArrowRight className="h-6 w-6" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </TabsContent>

          <TabsContent value="invites" className="space-y-4">
            {invites.length > 0 ? (
              invites.map((invite) => (
                <Card key={invite.id} className="bg-card/40 backdrop-blur-xl border-accent/20 border overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                          <Bell className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-primary/20 text-primary-foreground text-[10px] font-bold uppercase">{invite.sport}</Badge>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {invite.expires}
                            </span>
                          </div>
                          <h4 className="font-headline text-xl font-bold uppercase tracking-tight leading-none mb-1">{invite.title}</h4>
                          <p className="text-xs text-muted-foreground font-medium">Challenged by <span className="text-white">{invite.challenger}</span> • Stake: <span className="text-accent">{invite.fee}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <Button 
                          onClick={() => handleDecline(invite.id)}
                          variant="ghost" 
                          className="flex-1 md:flex-none h-12 px-6 font-bold uppercase tracking-wider text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="mr-2 h-4 w-4" /> Decline
                        </Button>
                        <Button 
                          onClick={() => handleAccept(invite)}
                          className="flex-1 md:flex-none h-12 px-8 font-bold uppercase tracking-wider bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20"
                        >
                          <Check className="mr-2 h-5 w-5" /> Accept Arena
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-24 bg-card/10 rounded-3xl border border-dashed border-white/5">
                <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-20" />
                <h3 className="font-headline text-xl font-bold uppercase tracking-widest text-muted-foreground">No pending invites</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2 italic font-medium">
                  Challenge your circle to start the showdown.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            {historyGames.length > 0 ? (
              historyGames.map((game) => (
                <Card key={game.id} className="bg-card/20 border-white/5 hover:bg-card/30 transition-all opacity-80 hover:opacity-100">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="h-12 w-12 rounded-xl bg-secondary/50 flex items-center justify-center">
                        <Trophy className={cn("h-6 w-6", game.result === 'Won' ? 'text-yellow-500' : 'text-muted-foreground')} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg leading-tight">{game.title}</h4>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mt-1">
                          {game.sport} • {game.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn("font-headline text-xl font-bold", game.result === 'Won' ? 'text-green-400' : 'text-muted-foreground')}>
                        {game.result === 'Won' ? `+${game.pool}` : 'ELIMINATED'}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Result</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-24 bg-card/10 rounded-3xl border border-dashed border-white/5">
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-20" />
                <h3 className="font-headline text-xl font-bold uppercase tracking-widest text-muted-foreground">No matches found</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2 italic font-medium">
                  "The only way to win is to enter the arena."
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
