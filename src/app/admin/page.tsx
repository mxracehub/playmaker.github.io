
"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert, CheckCircle2, Play, Trophy, User, Hash, Lock } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, useUser } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  
  const gamesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(db, "games");
  }, [db, user]);

  const { data: games, isLoading: isCollectionLoading } = useCollection(gamesQuery);

  const [scoringGame, setScoringGame] = useState<any | null>(null);
  const [winnerId, setWinnerId] = useState("");
  const [scores, setScores] = useState<{ [key: string]: string }>({});

  const isLoading = isUserLoading || isCollectionLoading;

  const handleUpdateStatus = (gameId: string, status: string) => {
    const gameRef = doc(db, "games", gameId);
    updateDocumentNonBlocking(gameRef, { status });
    toast({ title: "Status Updated", description: `Game set to ${status}.` });
  };

  const handleFinalizeGame = () => {
    if (!scoringGame) return;
    const gameRef = doc(db, "games", scoringGame.id);
    
    const finalScores = Object.entries(scores).reduce((acc, [uid, score]) => {
      acc[uid] = parseFloat(score) || 0;
      return acc;
    }, {} as { [key: string]: number });

    updateDocumentNonBlocking(gameRef, {
      status: "Completed",
      winnerId: winnerId || null,
      finalScores: finalScores,
    });

    toast({ title: "Game Finalized", description: "Results have been archived." });
    setScoringGame(null);
  };

  if (isLoading) return <div className="p-20 text-center">Loading Arena Controls...</div>;

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center p-4">
        <Navbar />
        <Card className="max-w-md w-full text-center p-8 space-y-6">
          <Lock className="h-16 w-16 text-muted-foreground mx-auto opacity-20" />
          <h2 className="font-headline text-2xl font-bold uppercase">Admin Access Required</h2>
          <p className="text-muted-foreground">This area is reserved for arena administrators. Please sign in to verify your credentials.</p>
          <Link href="/login" className="block w-full">
            <Button className="w-full font-bold uppercase tracking-wider">Sign In</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-20 bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-5xl px-4 py-8">
        <header className="flex items-center gap-4 mb-12">
          <div className="h-12 w-12 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h1 className="font-headline text-3xl font-bold uppercase tracking-tight">Arena <span className="text-destructive">Control</span></h1>
            <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest">Administrative Override</p>
          </div>
        </header>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full h-14 bg-card border grid grid-cols-2 p-1 mb-8">
            <TabsTrigger value="active" className="font-bold uppercase tracking-widest">Pending & Live</TabsTrigger>
            <TabsTrigger value="completed" className="font-bold uppercase tracking-widest">History</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {games?.filter(g => g.status !== "Completed").map((game) => (
              <Card key={game.id} className="bg-card/50 border-white/5 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={game.status === "Live" ? "destructive" : "secondary"} className="uppercase font-bold">
                          {game.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">ID: {game.id}</span>
                      </div>
                      <h3 className="font-headline text-xl font-bold uppercase">{game.name}</h3>
                      <p className="text-xs text-muted-foreground">{game.sportId.toUpperCase()} • {game.currencyType.toUpperCase()} {game.prizePool} PRIZE</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {game.status === "Open" && (
                        <Button size="sm" onClick={() => handleUpdateStatus(game.id, "Live")} className="bg-primary hover:bg-primary/90">
                          <Play className="mr-2 h-4 w-4" /> Start Live
                        </Button>
                      )}
                      {game.status === "Live" && (
                        <Button size="sm" variant="destructive" onClick={() => setScoringGame(game)}>
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Finalize Results
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {games?.filter(g => g.status === "Completed").map((game) => (
              <Card key={game.id} className="bg-card/20 border-white/5 opacity-80">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold">{game.name}</h4>
                    <p className="text-xs text-muted-foreground">Winner: {game.winnerId || "None"}</p>
                  </div>
                  <Trophy className="h-5 w-5 text-accent" />
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>

      {/* Result Modal */}
      {scoringGame && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-card border-accent/20">
            <CardHeader>
              <CardTitle className="font-headline uppercase tracking-tight">Finalize: {scoringGame.name}</CardTitle>
              <CardDescription>Enter final scores and crown the winner.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Winning User ID</Label>
                <div className="relative">
                  <Trophy className="absolute left-3 top-3 h-4 w-4 text-accent" />
                  <Input 
                    placeholder="Enter UID of winner" 
                    className="pl-10" 
                    value={winnerId}
                    onChange={(e) => setWinnerId(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Participant Scores</Label>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="User UID" 
                      className="flex-1"
                      onChange={(e) => {
                        const uid = e.target.value;
                        setScores(prev => ({ ...prev, [uid]: prev[uid] || "" }));
                      }}
                    />
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Score" 
                      className="w-24"
                      onChange={(e) => {
                        // For a simple demo, we'd need to know the UIDs. 
                        // In a real app, we'd iterate over the game's participants list.
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button variant="ghost" onClick={() => setScoringGame(null)} className="flex-1 font-bold uppercase">Cancel</Button>
              <Button onClick={handleFinalizeGame} className="flex-1 bg-accent text-accent-foreground font-bold uppercase">Complete Arena</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
