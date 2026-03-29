
"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert, CheckCircle2, Play, Trophy, User, Hash, Lock, ShieldX, Loader2, X, Check, Trash2, Search, Target, Zap } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking, useUser, useDoc } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Shared rosters for Admin response
const sportPicks: { [key: string]: string[] } = {
  nba: ["Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets", "Chicago Bulls", "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets", "Detroit Pistons", "Golden State Warriors", "Houston Rockets", "Indiana Pacers", "LA Clippers", "LA Lakers", "Memphis Grizzlies", "Miami Heat", "Milwaukee Bucks", "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks", "Oklahoma City Thunder", "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns", "Portland Trail Blazers", "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors", "Utah Jazz", "Washington Wizards"],
  nfl: ["Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills", "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns", "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers", "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs", "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins", "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants", "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers", "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"],
  hockey: ["Anaheim Ducks", "Arizona Coyotes", "Boston Bruins", "Buffalo Sabres", "Calgary Flames", "Carolina Hurricanes", "Chicago Blackhawks", "Colorado Avalanche", "Columbus Blue Jackets", "Dallas Stars", "Detroit Red Wings", "Edmonton Oilers", "Florida Panthers", "Los Angeles Kings", "Minnesota Wild", "Montreal Canadiens", "Nashville Predators", "New Jersey Devils", "New York Islanders", "New York Rangers", "Ottawa Senators", "Philadelphia Flyers", "Pittsburgh Penguins", "San Jose Sharks", "Seattle Kraken", "St. Louis Blues", "Tampa Bay Lightning", "Toronto Maple Leafs", "Vancouver Canucks", "Vegas Golden Knights", "Washington Capitals", "Winnipeg Jets"],
  mlb: ["Arizona Diamondbacks", "Atlanta Braves", "Baltimore Orioles", "Boston Red Sox", "Chicago Cubs", "Chicago White Sox", "Cincinnati Reds", "Cleveland Guardians", "Colorado Rockies", "Detroit Tigers", "Houston Astros", "Kansas City Royals", "Los Angeles Angels", "Los Angeles Dodgers", "Miami Marlins", "Milwaukee Brewers", "Minnesota Twins", "New York Mets", "New York Yankees", "Oakland Athletics", "Philadelphia Phillies", "Pittsburgh Pirates", "San Diego Padres", "San Francisco Giants", "Seattle Mariners", "St. Louis Cardinals", "Tampa Bay Rays", "Texas Rangers", "Toronto Blue Jays", "Washington Nationals"]
};

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
  
  const [selectedPick, setSelectedPick] = useState("");
  const [searchPickQuery, setSearchPickQuery] = useState("");

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
      updatedAt: new Date().toISOString(),
    });

    toast({ title: "Arena Results Finalized", description: "Scores recorded and prize pool distributed." });
    setScoringGame(null);
    setCreatorScore("0");
    setOpponentScore("0");
    setWinnerId("");
  };

  const filteredPicks = respondingGame 
    ? (sportPicks[respondingGame.sportId] || []).filter(p => p.toLowerCase().includes(searchPickQuery.toLowerCase()))
    : [];

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
            <p className="text-muted-foreground text-sm">
              Your account does not have administrative clearance for the Arena Control.
            </p>
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
      
      <main className="mx-auto max-w-5xl px-4 py-8">
        <header className="flex items-center gap-4 mb-12">
          <div className="h-12 w-12 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h1 className="font-headline text-3xl font-bold uppercase tracking-tight text-white">Arena <span className="text-destructive">Control</span></h1>
            <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest">Administrative Override • {profile.username}</p>
          </div>
        </header>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full h-14 bg-card border grid grid-cols-2 p-1 mb-8">
            <TabsTrigger value="active" className="font-bold uppercase tracking-widest">Active Matchups</TabsTrigger>
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
                          <span>{game.sportId.toUpperCase()}</span>
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
                        {game.status === "Open" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(game.id, "Live")}>
                              <Play className="mr-2 h-4 w-4" /> Force Live
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDenyChallenge(game.id)} className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {game.status === "Live" && (
                          <Button size="sm" variant="destructive" onClick={() => setScoringGame(game)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Enter Results
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-card/20 rounded-3xl border border-dashed">
                <p className="text-muted-foreground font-headline font-bold uppercase tracking-widest opacity-50">No active arenas found</p>
              </div>
            )}
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
                      <p className="text-[10px] font-bold text-accent uppercase mb-1">Final Score</p>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
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
                Accept Arena
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Finalize Results Modal */}
      {scoringGame && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-xl bg-card border-destructive/20 shadow-2xl">
            <CardHeader className="border-b bg-destructive/5 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-destructive" />
                </div>
                <CardTitle className="font-headline uppercase tracking-tight text-white">Record Arena Results</CardTitle>
              </div>
              <CardDescription>Enter final performance data for {scoringGame.name}. This action is irreversible.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                {/* Challenger Score */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-primary" />
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Challenger</Label>
                  </div>
                  <p className="text-xs font-bold text-white truncate mb-2">{scoringGame.creatorPick}</p>
                  <Input 
                    type="number" 
                    value={creatorScore} 
                    onChange={(e) => setCreatorScore(e.target.value)}
                    className="h-14 text-2xl font-headline font-bold text-center bg-secondary/30"
                    placeholder="0"
                  />
                  <Button 
                    variant={winnerId === scoringGame.creatorId ? "default" : "outline"}
                    className={cn("w-full font-bold uppercase text-[10px]", winnerId === scoringGame.creatorId && "bg-primary")}
                    onClick={() => setWinnerId(scoringGame.creatorId)}
                  >
                    Set as Winner
                  </Button>
                </div>

                {/* Opponent Score */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-accent" />
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Opponent</Label>
                  </div>
                  <p className="text-xs font-bold text-white truncate mb-2">{scoringGame.opponentPick}</p>
                  <Input 
                    type="number" 
                    value={opponentScore} 
                    onChange={(e) => setOpponentScore(e.target.value)}
                    className="h-14 text-2xl font-headline font-bold text-center bg-secondary/30"
                    placeholder="0"
                  />
                  <Button 
                    variant={winnerId === scoringGame.opponentId ? "default" : "outline"}
                    className={cn("w-full font-bold uppercase text-[10px]", winnerId === scoringGame.opponentId && "bg-accent text-accent-foreground")}
                    onClick={() => setWinnerId(scoringGame.opponentId)}
                  >
                    Set as Winner
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-secondary/20 border border-white/5 text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Winner ID to be Archived</p>
                <p className="font-mono text-xs text-white">{winnerId || "PLEASE SELECT A VICTOR"}</p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3 bg-secondary/10 p-6 border-t">
              <Button variant="ghost" onClick={() => setScoringGame(null)} className="flex-1 font-bold uppercase tracking-widest">Cancel</Button>
              <Button 
                onClick={handleFinalizeGame} 
                disabled={!winnerId}
                className="flex-1 bg-destructive text-white font-bold uppercase tracking-widest shadow-xl shadow-destructive/20"
              >
                Confirm & Archive
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
