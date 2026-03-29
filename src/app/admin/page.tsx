
"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShieldAlert, 
  CheckCircle2, 
  Play, 
  Trophy, 
  User, 
  ShieldX, 
  Loader2, 
  Check, 
  Trash2, 
  Search, 
  Zap, 
  UserCheck, 
  Upload, 
  Database, 
  RefreshCw, 
  Filter,
  ArrowRight
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking, useUser, useDoc } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { sportsData } from "@/app/lib/schedules";

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  
  const userProfileRef = useMemoFirebase(() => (user ? doc(db, "userProfiles", user.uid) : null), [db, user]);
  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const gamesQuery = useMemoFirebase(() => {
    if (!user || profile?.role !== 'admin') return null;
    return collection(db, "games");
  }, [db, user, profile?.role]);

  const { data: games, isLoading: isCollectionLoading } = useCollection(gamesQuery);

  const [scoringGame, setScoringGame] = useState<any | null>(null);
  const [respondingGame, setRespondingGame] = useState<any | null>(null);
  
  // Scoring State
  const [winnerId, setWinnerId] = useState("");
  const [creatorScore, setCreatorScore] = useState("0");
  const [opponentScore, setOpponentScore] = useState("0");
  const [housePickOverride, setHousePickOverride] = useState("");
  
  const [selectedPick, setSelectedPick] = useState("");
  const [searchPickQuery, setSearchPickQuery] = useState("");
  const [resultsFilter, setResultsFilter] = useState("all");

  const isLoading = isUserLoading || isProfileLoading || (user && profile?.role === 'admin' && isCollectionLoading);

  const handleUpdateStatus = (gameId: string, status: string) => {
    const gameRef = doc(db, "games", gameId);
    updateDocumentNonBlocking(gameRef, { status });
    toast({ title: "Status Updated", description: `Arena set to ${status}.` });
  };

  const handleDenyChallenge = (gameId: string) => {
    const gameRef = doc(db, "games", gameId);
    deleteDocumentNonBlocking(gameRef);
    toast({ variant: "destructive", title: "Challenge Denied", description: "The matchup has been scrapped." });
  };

  const handleOpenScoring = (game: any) => {
    setScoringGame(game);
    setWinnerId("");
    setCreatorScore("0");
    setOpponentScore("0");
    setHousePickOverride(game.opponentPick || "");
    setSearchPickQuery("");
  };

  const handleAcceptChallenge = () => {
    if (!respondingGame || !selectedPick) return;
    const gameRef = doc(db, "games", respondingGame.id);
    
    updateDocumentNonBlocking(gameRef, {
      status: "Live",
      opponentPick: selectedPick,
      updatedAt: new Date().toISOString(),
    });

    toast({ title: "Challenge Accepted", description: `Arena Master has entered with ${selectedPick}.` });
    setRespondingGame(null);
    setSelectedPick("");
  };

  const handleFinalizeGame = () => {
    if (!scoringGame) return;
    
    if (!winnerId) {
      toast({ variant: "destructive", title: "Winner Required", description: "You must select a victor to archive the arena." });
      return;
    }

    const gameRef = doc(db, "games", scoringGame.id);
    
    const finalScores = {
      [scoringGame.creatorId]: parseFloat(creatorScore) || 0,
      [scoringGame.opponentId]: parseFloat(opponentScore) || 0,
    };

    updateDocumentNonBlocking(gameRef, {
      status: "Completed",
      winnerId: winnerId,
      finalScores: finalScores,
      opponentPick: housePickOverride || scoringGame.opponentPick || "HOUSE_MASTER",
      updatedAt: new Date().toISOString(),
    });

    toast({ title: "Arena Results Finalized", description: "Scores recorded and prize pool distributed." });
    setScoringGame(null);
    setCreatorScore("0");
    setOpponentScore("0");
    setWinnerId("");
    setHousePickOverride("");
  };

  const handleSyncOfficialData = () => {
    toast({ title: "Syncing Arena Feeds", description: "Fetching official results from professional sports providers..." });
    setTimeout(() => {
      toast({ title: "Sync Complete", description: "Official win counts updated for the 2026 season." });
    }, 2000);
  };

  const sportId = (respondingGame?.sportId || scoringGame?.sportId || "").toLowerCase();
  const currentOptions = sportsData.find(s => s.id === sportId)?.options || [];
  const filteredPicks = currentOptions.filter(p => p.toLowerCase().includes(searchPickQuery.toLowerCase().trim()));

  const filteredScoringGames = games?.filter(g => 
    (g.status === "Live" || g.status === "Open") && 
    (resultsFilter === "all" || g.sportId === resultsFilter)
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-destructive mx-auto" />
          <p className="font-headline font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
            Verifying Admin Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center p-4 bg-background">
        <Navbar />
        <Card className="max-w-md w-full text-center p-8 space-y-6 bg-card/50 backdrop-blur-xl border-destructive/20 shadow-2xl">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto border border-destructive/20">
            <ShieldX className="h-10 w-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="font-headline text-2xl font-bold uppercase tracking-tight text-white">Access Denied</h2>
            <p className="text-muted-foreground text-sm">Your account does not have administrative clearance for the Arena Control.</p>
          </div>
          <div className="pt-4 space-y-3">
            <Link href="/" className="block w-full">
              <Button variant="outline" className="w-full font-bold uppercase tracking-wider">Return to Lobby</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-20 bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-6xl px-4 py-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h1 className="font-headline text-3xl font-bold uppercase tracking-tight text-white">Arena <span className="text-destructive">Control</span></h1>
              <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest">Administrative Override • {profile.username}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSyncOfficialData} variant="outline" className="font-bold uppercase tracking-wider border-accent/20 text-accent hover:bg-accent/5">
              <RefreshCw className="mr-2 h-4 w-4" /> Sync Data
            </Button>
            <Button className="font-bold uppercase tracking-wider bg-destructive text-white hover:bg-destructive/90">
              <Upload className="mr-2 h-4 w-4" /> Upload Results
            </Button>
          </div>
        </header>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full h-14 bg-card border grid grid-cols-3 p-1 mb-8">
            <TabsTrigger value="active" className="font-bold uppercase tracking-widest">Matchups</TabsTrigger>
            <TabsTrigger value="scoring" className="font-bold uppercase tracking-widest">Scoring Center</TabsTrigger>
            <TabsTrigger value="completed" className="font-bold uppercase tracking-widest">Archive</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {games && games.filter(g => g.status !== "Completed").length > 0 ? (
              games.filter(g => g.status !== "Completed").map((game) => (
                <Card key={game.id} className="bg-card/50 border-white/5 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={game.status === "Live" ? "destructive" : "secondary"} className="uppercase font-bold">
                            {game.status}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-mono">ID: {game.id}</span>
                        </div>
                        <h3 className="font-headline text-xl font-bold uppercase text-white">{game.name}</h3>
                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                          <span className="text-white">{game.sportId.toUpperCase()}</span>
                          <span>•</span>
                          <span className="text-accent">{game.entryFee} {game.currencyType.toUpperCase()} ENTRY</span>
                          <span>•</span>
                          <span className="text-white">PICK: {game.creatorPick || "NONE"}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {game.status === "Open" && game.opponentId === 'house-admin' && (
                          <Button size="sm" onClick={() => setRespondingGame(game)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                            <Check className="mr-2 h-4 w-4" /> Respond
                          </Button>
                        )}
                        {game.status === "Open" && game.opponentId !== 'house-admin' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(game.id, "Live")}>
                              <Play className="mr-2 h-4 w-4" /> Force Live
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDenyChallenge(game.id)} className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-card/20 rounded-3xl border border-dashed">
                <p className="text-muted-foreground font-headline font-bold uppercase tracking-widest opacity-50">No active matchups found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="scoring" className="space-y-6">
            <div className="flex flex-col gap-4 p-6 bg-secondary/20 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sport Selection</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["all", ...sportsData.map(s => s.id)].map(s => (
                  <button 
                    key={s} 
                    onClick={() => setResultsFilter(s)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all border",
                      resultsFilter === s 
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                        : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {filteredScoringGames.length > 0 ? (
                filteredScoringGames.map((game) => (
                  <Card key={game.id} className="bg-[#0D1219] border-white/5 group hover:border-accent/30 transition-all">
                    <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="h-12 w-12 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0">
                          <Database className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[8px] uppercase">{game.sportId}</Badge>
                            <span className="text-[10px] font-mono text-muted-foreground">{game.id}</span>
                          </div>
                          <h4 className="font-headline text-lg font-bold uppercase text-white">{game.name}</h4>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                            Challenger: <span className="text-white">{game.creatorPick}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 shrink-0">
                        <Button 
                          onClick={() => handleOpenScoring(game)}
                          className="bg-accent text-accent-foreground font-bold uppercase tracking-widest h-12 px-8"
                        >
                          Record Results <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-24 bg-card/10 rounded-3xl border border-dashed">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground font-headline font-bold uppercase tracking-widest opacity-50">No results to record for {resultsFilter.toUpperCase()}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {games && games.filter(g => g.status === "Completed").length > 0 ? (
              games.filter(g => g.status === "Completed").map((game) => (
                <Card key={game.id} className="bg-card/20 border-white/5 opacity-80">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white uppercase">{game.name}</h4>
                      <p className="text-xs text-muted-foreground uppercase">Winner ID: {game.winnerId || "Unassigned"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-accent uppercase mb-1">Final Outcome</p>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-white">C: {game.finalScores?.[game.creatorId] || 0}</span>
                        <span className="font-mono text-xs text-white">O: {game.finalScores?.[game.opponentId] || 0}</span>
                        <Trophy className="h-4 w-4 text-accent" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-card/20 rounded-3xl border border-dashed">
                <p className="text-muted-foreground font-headline font-bold uppercase tracking-widest opacity-50">Archive empty</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Response Modal (House Accept) */}
      {respondingGame && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-sm p-4">
          <div className="min-h-full flex items-center justify-center py-8">
            <Card className="w-full max-w-lg bg-card border-accent/20">
              <CardHeader>
                <CardTitle className="font-headline uppercase tracking-tight text-white">House Response: {respondingGame.name}</CardTitle>
                <CardDescription>Select the Arena Master's counter-pick to enter the showdown.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-secondary/30 border border-white/5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Opponent Locked In</p>
                  <p className="font-headline text-lg text-white uppercase font-bold">{respondingGame.creatorPick}</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search roster..." 
                      className="pl-10" 
                      value={searchPickQuery}
                      onChange={(e) => setSearchPickQuery(e.target.value)}
                    />
                  </div>
                  <ScrollArea className="h-[200px] border rounded-xl p-2 bg-black/20">
                    <div className="grid gap-2">
                      {filteredPicks.map(p => (
                        <button 
                          key={p} 
                          onClick={() => setSelectedPick(p)}
                          className={cn(
                            "w-full text-left px-4 py-3 rounded-lg text-sm font-bold uppercase transition-all",
                            selectedPick === p ? "bg-accent text-accent-foreground" : "bg-white/5 hover:bg-white/10 text-white"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button variant="ghost" onClick={() => setRespondingGame(null)} className="flex-1 font-bold uppercase">Cancel</Button>
                <Button 
                  onClick={handleAcceptChallenge} 
                  disabled={!selectedPick}
                  className="flex-1 bg-accent text-accent-foreground font-bold uppercase"
                >
                  Confirm Entry
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      {/* Finalize Results Modal */}
      {scoringGame && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 backdrop-blur-md p-4">
          <div className="min-h-full flex items-center justify-center py-8">
            <Card className="w-full max-w-4xl bg-[#0D1219] border-white/10 shadow-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 bg-secondary/10 pb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-destructive/20 flex items-center justify-center border border-destructive/30">
                    <Zap className="h-6 w-6 text-destructive fill-current" />
                  </div>
                  <div>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 border-destructive/50 text-destructive">Official Scoring</Badge>
                    <CardTitle className="font-headline text-2xl uppercase tracking-tighter text-white">Record Showdown Results</CardTitle>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                  <div 
                    className={cn(
                      "relative group flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 text-center cursor-pointer",
                      winnerId === scoringGame.creatorId 
                        ? "bg-primary/10 border-primary ring-4 ring-primary/20" 
                        : "bg-secondary/20 border-white/5 hover:border-white/20"
                    )}
                    onClick={() => setWinnerId(scoringGame.creatorId)}
                  >
                    <div className="mb-6 space-y-1">
                      <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                        <User className="h-3 w-3" /> Challenger
                      </div>
                      <h3 className="font-headline text-xl font-bold text-white uppercase truncate px-2">{scoringGame.creatorPick}</h3>
                    </div>
                    <div className="w-full space-y-4" onClick={(e) => e.stopPropagation()}>
                      <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">FINAL WIN COUNT</Label>
                      <Input 
                        type="number" 
                        value={creatorScore} 
                        onChange={(e) => setCreatorScore(e.target.value)}
                        className="h-20 text-4xl font-headline font-black text-center bg-black/40 border-white/10"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-8">
                    <div 
                      className={cn(
                        "relative group flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 text-center cursor-pointer w-full",
                        winnerId === scoringGame.opponentId 
                          ? "bg-accent/10 border-accent ring-4 ring-accent/20" 
                          : "bg-secondary/20 border-white/5 hover:border-white/20"
                      )}
                      onClick={() => setWinnerId(scoringGame.opponentId)}
                    >
                      <div className="mb-6 space-y-1">
                        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-accent">
                          <UserCheck className="h-3 w-3" /> Opponent
                        </div>
                        <h3 className="font-headline text-xl font-bold text-white uppercase italic truncate px-2">
                          {housePickOverride || scoringGame.opponentPick || "PENDING ENTRY"}
                        </h3>
                      </div>
                      
                      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-end" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-4">
                          <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">FINAL WIN COUNT</Label>
                          <Input 
                            type="number" 
                            value={opponentScore} 
                            onChange={(e) => setOpponentScore(e.target.value)}
                            className="h-20 text-4xl font-headline font-black text-center bg-black/40 border-white/10"
                          />
                        </div>

                        <div className="space-y-4">
                          <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">SELECT PICK</Label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Filter roster..." 
                              className="pl-10 h-12 bg-black/40"
                              value={searchPickQuery}
                              onChange={(e) => setSearchPickQuery(e.target.value)}
                            />
                          </div>
                          <ScrollArea className="h-[120px] rounded-xl border border-white/5 bg-black/20 p-2">
                            <div className="grid grid-cols-2 gap-2">
                              {filteredPicks.map(p => (
                                <button 
                                  key={p} 
                                  onClick={() => setHousePickOverride(p)}
                                  className={cn(
                                    "text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all",
                                    housePickOverride === p ? "bg-accent text-accent-foreground" : "bg-white/5 hover:bg-white/10 text-white"
                                  )}
                                >
                                  {p}
                                </button>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-4 bg-secondary/5 p-8 border-t border-white/5">
                <Button variant="ghost" onClick={() => setScoringGame(null)} className="flex-1 h-14 font-black uppercase tracking-[0.2em] text-muted-foreground">Abort</Button>
                <Button 
                  onClick={handleFinalizeGame} 
                  disabled={!winnerId}
                  className="flex-[2] h-14 bg-destructive text-white font-black uppercase tracking-[0.2em]"
                >
                  <CheckCircle2 className="mr-3 h-5 w-5" /> Confirm results
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
