"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Settings, Wallet, History, Star, Gamepad2, Landmark, Coins, Bell, Zap, ArrowRight, Check, X, DollarSign, Loader2 } from "lucide-react";
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const db = useFirestore();

  // Unified collection: userProfiles
  const userProfileRef = useMemoFirebase(() => (user ? doc(db, "userProfiles", user.uid) : null), [db, user]);
  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  // Fetch real games for synchronization
  const gamesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(db, "games");
  }, [db, user]);
  const { data: allGames, isLoading: isGamesLoading } = useCollection(gamesQuery);

  const isLoading = isAuthLoading || isProfileLoading || isGamesLoading;

  // Identity logic
  const displayName = profile?.username || user?.displayName || 'PLAYMAKER';
  const bio = profile?.bio || "Always playing for the next highlight reel.";
  const avatarUrl = profile?.profilePictureUrl || user?.photoURL || `https://picsum.photos/seed/guitar/400/400`;

  // Real balances
  const goldBalance = profile?.goldCoinsBalance ?? 0;
  const sweepBalance = profile?.sweepstakesCoinsBalance ?? 0;

  // Filter games based on user relationship
  const myInvites = allGames?.filter(g => 
    g.status === "Open" && g.opponentId === user?.uid
  ) || [];

  const myActiveGames = allGames?.filter(g => 
    (g.status === "Live" && (g.creatorId === user?.uid || g.opponentId === user?.uid)) ||
    (g.status === "Open" && g.creatorId === user?.uid)
  ) || [];

  const myHistory = allGames?.filter(g => 
    g.status === "Completed" && (g.creatorId === user?.uid || g.opponentId === user?.uid)
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="font-headline font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
            Accessing Playmaker Vault...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-20">
      <Navbar />
      
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Profile Header */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-card/40 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
            <Avatar className="h-32 w-32 border-4 border-primary shadow-2xl">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                <h1 className="font-headline text-4xl font-bold uppercase tracking-tighter">{displayName}</h1>
                <Badge className="bg-accent text-accent-foreground font-bold px-3 py-1 uppercase tracking-widest text-[10px]">PRO LEVEL 24</Badge>
                {profile?.role === 'admin' && (
                  <Badge className="bg-destructive text-white font-bold px-3 py-1 uppercase tracking-widest text-[10px]">ARENA ADMIN</Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-6 font-medium italic">"{bio}"</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border border-white/5">
                  <Gamepad2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold">{myHistory.filter(g => g.winnerId === user?.uid).length} Games Won</span>
                </div>
              </div>
            </div>
            <Link href="/settings">
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/10 hover:bg-white/5 shadow-lg">
                <Settings className="h-6 w-6" />
              </Button>
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Wallet */}
          <Card className="bg-card/50 border h-fit">
            <CardHeader>
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Wallet className="h-5 w-5 text-accent" />
                ARENA BANK
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-2xl bg-secondary/30 border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Gold Coins</p>
                  <Coins className="h-3.5 w-3.5 text-yellow-500" />
                </div>
                <p className="text-2xl font-headline font-bold">{goldBalance.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold text-accent uppercase tracking-widest">Sweeps Coins</p>
                  < Landmark className="h-3.5 w-3.5 text-accent" />
                </div>
                <p className="text-2xl font-headline font-bold text-accent">{sweepBalance.toFixed(2)} SC</p>
              </div>
              <div className="grid grid-cols-1 gap-2 pt-2">
                <Link href="/shop" className="w-full">
                  <Button className="w-full font-bold uppercase tracking-wider bg-accent text-accent-foreground">
                    <Landmark className="mr-2 h-4 w-4" /> Arcade Coins
                  </Button>
                </Link>
                <Link href="/exchange" className="w-full">
                  <Button variant="outline" className="w-full font-bold uppercase tracking-wider border-accent text-accent">
                    <DollarSign className="mr-2 h-4 w-4 text-green-500" /> Redeem SC
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Game Dashboard */}
          <Card className="md:col-span-2 bg-card/50 border flex flex-col h-[500px]">
            <Tabs defaultValue="active" className="flex flex-col h-full">
              <CardHeader className="flex flex-row items-center justify-between shrink-0 pb-2">
                <TabsList className="bg-secondary/40 border">
                  <TabsTrigger value="active" className="text-xs font-bold uppercase px-4">
                    Active ({myActiveGames.length})
                  </TabsTrigger>
                  <TabsTrigger value="invites" className="text-xs font-bold uppercase px-4 relative">
                    Invites ({myInvites.length})
                    {myInvites.length > 0 && <span className="absolute -top-1 -right-1 h-2 w-2 bg-accent rounded-full animate-pulse" />}
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="text-xs font-bold uppercase px-4">History</TabsTrigger>
                </TabsList>
                <Link href="/games">
                  <Button variant="link" className="text-accent font-bold uppercase text-[10px]">All Games</Button>
                </Link>
              </CardHeader>

              <CardContent className="flex-1 min-h-0 pt-4">
                <ScrollArea className="h-full pr-4">
                  <TabsContent value="active" className="m-0 space-y-4">
                    {myActiveGames.length > 0 ? (
                      myActiveGames.map((game) => (
                        <Link key={game.id} href={`/games/${game.id}`}>
                          <div className="group flex items-center justify-between p-5 rounded-2xl bg-secondary/20 border border-white/5 hover:border-accent/40 transition-all">
                            <div className="flex items-center gap-4">
                              <div className={cn("h-10 w-10 rounded-xl bg-background flex items-center justify-center border", game.status === 'Live' ? 'border-accent' : 'border-white/10')}>
                                {game.status === 'Live' ? <Zap className="h-5 w-5 text-accent animate-pulse" /> : <Gamepad2 className="h-5 w-5 text-primary" />}
                              </div>
                              <div>
                                <p className="font-bold text-sm leading-none mb-1 group-hover:text-accent transition-colors">{game.name}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{game.sportId.toUpperCase()} • {game.prizePool} {game.currencyType.toUpperCase()}</p>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-all" />
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="py-20 text-center opacity-30">
                        <Trophy className="h-10 w-10 mx-auto mb-2" />
                        <p className="text-xs font-bold uppercase">No active games</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="invites" className="m-0 space-y-4">
                    {myInvites.length > 0 ? (
                      myInvites.map((invite) => (
                        <div key={invite.id} className="p-5 rounded-2xl bg-accent/5 border border-accent/20">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">Incoming Challenge</p>
                              <p className="font-bold text-sm leading-none">{invite.name}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">from <span className="text-white">Arena Playmaker</span></p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-destructive/20 hover:text-destructive">
                                <X className="h-4 w-4" />
                              </Button>
                              <Link href="/games">
                                <Button size="icon" className="h-8 w-8 rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                                  <Check className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-background/50 text-[10px] font-bold uppercase">
                            <span className="text-muted-foreground">{invite.sportId.toUpperCase()} Arena</span>
                            <span className="text-accent">{invite.entryFee} {invite.currencyType.toUpperCase()} STAKES</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center opacity-30">
                        <Bell className="h-10 w-10 mx-auto mb-2" />
                        <p className="text-xs font-bold uppercase">No pending invites</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="activity" className="m-0 space-y-4">
                    {myHistory.length > 0 ? (
                      myHistory.map((game) => (
                        <div key={game.id} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-white/5">
                          <div>
                            <p className="font-bold text-sm leading-none mb-1">{game.name}</p>
                            <p className="text-xs text-muted-foreground">{game.sportId.toUpperCase()} • {game.status}</p>
                          </div>
                          <span className={cn("font-headline font-bold text-sm", game.winnerId === user?.uid ? "text-green-400" : "text-muted-foreground")}>
                            {game.winnerId === user?.uid ? `+${game.prizePool}` : "COMPLETED"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center opacity-30">
                        <History className="h-10 w-10 mx-auto mb-2" />
                        <p className="text-xs font-bold uppercase">No history found</p>
                      </div>
                    )}
                  </TabsContent>
                </ScrollArea>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
}
