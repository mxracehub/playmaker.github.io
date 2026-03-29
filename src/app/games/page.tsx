
"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Clock, Users, ArrowRight, Plus, Zap, Check, X, Bell, Target, Search, Gamepad2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFirestore, useCollection, useUser, useMemoFirebase, updateDocumentNonBlocking, useDoc } from "@/firebase";
import { collection, doc } from "firebase/firestore";

// Sport options for acceptance strategy
const sportPicks: { [key: string]: string[] } = {
  nba: ["Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets", "Chicago Bulls", "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets", "Detroit Pistons", "Golden State Warriors", "Houston Rockets", "Indiana Pacers", "LA Clippers", "LA Lakers", "Memphis Grizzlies", "Miami Heat", "Milwaukee Bucks", "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks", "Oklahoma City Thunder", "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns", "Portland Trail Blazers", "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors", "Utah Jazz", "Washington Wizards"],
  nfl: ["Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills", "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns", "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers", "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs", "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins", "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants", "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers", "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"],
};

export default function GamesPage() {
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const userProfileRef = useMemoFirebase(() => (user ? doc(db, "userProfiles", user.uid) : null), [db, user]);
  const { data: profile } = useDoc(userProfileRef);

  const gamesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(db, "games");
  }, [db, user]);
  
  const { data: allGames, isLoading: isCollectionLoading } = useCollection(gamesQuery);

  const [acceptingInvite, setAcceptingInvite] = useState<any | null>(null);
  const [selectedPick, setSelectedPick] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const isLoading = isUserLoading || isCollectionLoading;

  const activeGames = allGames?.filter(g => 
    (g.status === "Live" && (g.creatorId === user?.uid || g.opponentId === user?.uid)) ||
    (g.status === "Open" && g.creatorId === user?.uid)
  ) || [];

  const invites = allGames?.filter(g => 
    g.status === "Open" && g.opponentId === user?.uid
  ) || [];

  const historyGames = allGames?.filter(g => 
    g.status === "Completed" && (g.creatorId === user?.uid || g.opponentId === user?.uid)
  ) || [];

  const handleFinalAccept = () => {
    if (!selectedPick || !acceptingInvite) {
      toast({ variant: "destructive", title: "Selection Required", description: "You must pick your side to join the showdown." });
      return;
    }

    // Check Balance for Mandatory Match
    const fee = acceptingInvite.entryFee;
    const currency = acceptingInvite.currencyType;
    const balance = currency === 'gold' ? (profile?.goldCoinsBalance ?? 0) : (profile?.sweepstakesCoinsBalance ?? 0);

    if (fee > balance) {
      toast({ 
        variant: "destructive", 
        title: "Insufficient Funds", 
        description: `This challenge requires ${fee} ${currency.toUpperCase()} to match the opponent.` 
      });
      return;
    }

    const gameRef = doc(db, "games", acceptingInvite.id);
    updateDocumentNonBlocking(gameRef, {
      status: "Live",
      opponentPick: selectedPick,
      updatedAt: new Date().toISOString(),
    });

    toast({ title: "Challenge Accepted", description: `You've matched the stakes with ${selectedPick}!` });
    setAcceptingInvite(null);
    setSelectedPick("");
  };

  const options = sportPicks[acceptingInvite?.sportId?.toLowerCase()] || sportPicks.nba;
  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Zap className="h-12 w-12 text-primary animate-pulse mx-auto" />
          <p className="font-headline font-bold uppercase tracking-widest text-muted-foreground">Loading Arenas...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center p-4">
        <Navbar />
        <Card className="max-w-md w-full text-center p-8 space-y-6">
          <Trophy className="h-16 w-16 text-muted-foreground mx-auto opacity-20" />
          <h2 className="font-headline text-2xl font-bold uppercase">Locked Arena</h2>
          <p className="text-muted-foreground">You must be signed in to view your games and challenges.</p>
          <Link href="/login" className="block w-full">
            <Button className="w-full font-bold uppercase tracking-wider">Sign In to Play</Button>
          </Link>
        </Card>
      </div>
    );
  }

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
            <Button className="w-full h-14 px-8 font-headline font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
              <Plus className="mr-2 h-5 w-5" /> Start New Game
            </Button>
          </Link>
        </header>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full h-16 bg-card/40 backdrop-blur-md border grid grid-cols-3 p-1.5 mb-10 rounded-2xl">
            <TabsTrigger value="active" className="font-headline font-bold text-base md:text-lg uppercase tracking-wider rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">Active ({activeGames.length})</TabsTrigger>
            <TabsTrigger value="invites" className="font-headline font-bold text-base md:text-lg uppercase tracking-wider rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white relative">
              Invites ({invites.length})
              {invites.length > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 rounded-full bg-accent animate-pulse" />}
            </TabsTrigger>
            <TabsTrigger value="history" className="font-headline font-bold text-base md:text-lg uppercase tracking-wider rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <ScrollArea className="h-[600px] w-full rounded-3xl pr-4">
              <div className="space-y-6 pb-8">
                {activeGames.length > 0 ? activeGames.map((game) => {
                  const myPick = game.creatorId === user?.uid ? game.creatorPick : game.opponentPick;
                  
                  return (
                    <Link key={game.id} href={`/games/${game.id}`}>
                      <Card className="overflow-hidden bg-card/30 backdrop-blur-sm border-white/5 hover:border-accent/40 transition-all group relative">
                        <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", game.status === 'Live' ? 'bg-accent animate-pulse' : 'bg-primary')} />
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row md:items-center">
                            <div className="flex-1 p-8">
                              <div className="flex flex-wrap items-center gap-4 mb-4">
                                <Badge className="font-bold uppercase tracking-widest px-3 py-1 bg-secondary/50 text-white border-none">{game.sportId.toUpperCase()}</Badge>
                                <span className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest", game.status === 'Live' ? 'text-accent animate-pulse' : 'text-muted-foreground')}>
                                  {game.status === 'Live' ? <Zap className="h-3 w-3 fill-current" /> : <Clock className="h-3 w-3" />}
                                  {game.status === 'Live' ? 'Live Showdown' : 'Awaiting Opponent Match'}
                                </span>
                              </div>
                              
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                                <h3 className="font-headline text-2xl font-bold group-hover:text-accent transition-colors">{game.name}</h3>
                                <div className="bg-accent/10 border border-accent/20 px-4 py-2 rounded-xl flex items-center gap-3">
                                  <Target className="h-4 w-4 text-accent" />
                                  <div>
                                    <p className="text-[10px] font-bold text-accent/60 uppercase tracking-widest leading-none mb-1">Your Selection</p>
                                    <p className="font-headline font-bold text-white uppercase tracking-tighter leading-none">{myPick || "PENDING"}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    <span>Match Status</span>
                                    <span className="text-white">STAKES: {game.entryFee} {game.currencyType.toUpperCase()}</span>
                                  </div>
                                  <Progress value={game.status === 'Live' ? 100 : 50} className="h-2 bg-secondary/50" />
                                </div>
                                <div className="flex items-center gap-6 justify-start md:justify-end">
                                  <div className="text-right">
                                    <div className="flex items-center gap-1 justify-end text-accent">
                                      <Zap className="h-3 w-3 fill-current" />
                                      <p className="text-[10px] font-bold uppercase tracking-widest">Prize Reward</p>
                                    </div>
                                    <p className="font-headline text-2xl font-bold text-accent">{(game.prizePool || 0).toLocaleString()} SC POOL</p>
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
                  );
                }) : (
                  <div className="text-center py-24 bg-card/10 rounded-3xl border border-dashed border-white/5">
                    <Gamepad2 className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-20" />
                    <h3 className="font-headline text-xl font-bold uppercase tracking-widest text-muted-foreground">No active games</h3>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="invites">
            <ScrollArea className="h-[600px] w-full rounded-3xl pr-4">
              <div className="space-y-4 pb-8">
                {invites.length > 0 ? (
                  invites.map((invite) => (
                    <Card key={invite.id} className="bg-card/40 backdrop-blur-xl border-accent/20 border overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="h-14 w-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                              <Bell className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-primary/20 text-primary-foreground text-[10px] font-bold uppercase">{invite.sportId.toUpperCase()}</Badge>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                  REQUIRED: {invite.entryFee} {invite.currencyType.toUpperCase()}
                                </span>
                              </div>
                              <h4 className="font-headline text-xl font-bold uppercase tracking-tight leading-none mb-2">{invite.name}</h4>
                              <p className="text-xs text-muted-foreground font-medium">Challenge from <span className="text-white font-bold">Arena Playmaker</span></p>
                            </div>
                          </div>
                          
                          <div className="p-4 rounded-xl bg-secondary/40 border border-white/5 flex-1 w-full lg:max-w-[280px]">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                              <Target className="h-3 w-3 text-accent" /> Opponent Selection
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-headline font-bold text-lg text-white uppercase">{invite.creatorPick || "ELITE PICK"}</span>
                              <Badge variant="outline" className="border-accent text-accent text-[10px] px-2">LOCKED</Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 w-full lg:w-auto">
                            <Button variant="ghost" className="flex-1 lg:flex-none h-12 px-6 font-bold uppercase tracking-wider text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                              <X className="mr-2 h-4 w-4" /> Decline
                            </Button>
                            <Button 
                              onClick={() => setAcceptingInvite(invite)}
                              className="flex-1 lg:flex-none h-12 px-8 font-bold uppercase tracking-wider bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20"
                            >
                              <Check className="mr-2 h-5 w-5" /> Match Stakes
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
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="history">
            <ScrollArea className="h-[600px] w-full rounded-3xl pr-4">
              <div className="space-y-4 pb-8">
                {historyGames.length > 0 ? historyGames.map((game) => (
                  <Card key={game.id} className="bg-card/20 border-white/5 hover:bg-card/30 transition-all opacity-80 hover:opacity-100">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="h-12 w-12 rounded-xl bg-secondary/50 flex items-center justify-center">
                          <Trophy className={cn("h-6 w-6 text-yellow-500")} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg leading-tight">{game.name}</h4>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mt-1">
                            {game.sportId.toUpperCase()} • COMPLETED
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end text-green-400">
                          <Zap className="h-3 w-3 fill-current" />
                          <p className="text-[10px] font-bold uppercase tracking-widest">Winnings</p>
                        </div>
                        <p className="font-headline text-xl font-bold text-green-400">
                          {game.prizePool?.toLocaleString()} SC
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Winner: {game.winnerId === user?.uid ? "YOU" : "OPPONENT"}</p>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="text-center py-24 bg-card/10 rounded-3xl border border-dashed border-white/5">
                    <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-20" />
                    <p className="text-xs font-bold uppercase text-muted-foreground">No completed contests found.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!acceptingInvite} onOpenChange={(open) => !open && setAcceptingInvite(null)}>
        <DialogContent className="bg-card border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl uppercase tracking-tight">Match the Stakes</DialogTitle>
            <DialogDescription>
              Your opponent has locked in <span className="text-white font-bold">{acceptingInvite?.creatorPick}</span> with a stake of <span className="text-accent font-bold">{acceptingInvite?.entryFee} {acceptingInvite?.currencyType?.toUpperCase()}</span>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-3">
              <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <p className="text-[10px] text-accent font-bold uppercase leading-relaxed">
                Mandatory Arena Policy: To accept this challenge, you must match the exact coin type and amount staked by the challenger.
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search roster..." 
                className="pl-10 bg-secondary/30 border-white/5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <ScrollArea className="h-[200px] rounded-xl border border-white/5 bg-secondary/10 p-2">
              <div className="grid gap-2">
                {filteredOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedPick(option)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                      selectedPick === option ? "bg-accent/10 border-accent" : "bg-transparent border-transparent hover:bg-white/5"
                    )}
                  >
                    <span className={cn("font-bold text-sm uppercase", selectedPick === option ? "text-accent" : "text-white/80")}>
                      {option}
                    </span>
                    {selectedPick === option && <Check className="h-5 w-5 text-accent" />}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="ghost" onClick={() => setAcceptingInvite(null)} className="font-bold uppercase tracking-widest">Retreat</Button>
            <Button 
              onClick={handleFinalAccept} 
              disabled={!selectedPick}
              className="flex-1 h-12 font-bold uppercase tracking-widest bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Match Stakes & Play
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
