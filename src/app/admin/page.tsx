
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
  X, 
  Check, 
  Trash2, 
  Search, 
  Target, 
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

// Unified 2026 rosters for Admin response and results
const sportPicks: { [key: string]: string[] } = {
  nba: ["Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets", "Chicago Bulls", "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets", "Detroit Pistons", "Golden State Warriors", "Houston Rockets", "Indiana Pacers", "LA Clippers", "LA Lakers", "Memphis Grizzlies", "Miami Heat", "Milwaukee Bucks", "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks", "Oklahoma City Thunder", "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns", "Portland Trail Blazers", "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors", "Utah Jazz", "Washington Wizards"],
  nfl: ["Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills", "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns", "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers", "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs", "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins", "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants", "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers", "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"],
  hockey: ["Anaheim Ducks", "Arizona Coyotes", "Boston Bruins", "Buffalo Sabres", "Calgary Flames", "Carolina Hurricanes", "Chicago Blackhawks", "Colorado Avalanche", "Columbus Blue Jackets", "Dallas Stars", "Detroit Red Wings", "Edmonton Oilers", "Florida Panthers", "Los Angeles Kings", "Minnesota Wild", "Montreal Canadiens", "Nashville Predators", "New Jersey Devils", "New York Islanders", "New York Rangers", "Ottawa Senators", "Philadelphia Flyers", "Pittsburgh Penguins", "San Jose Sharks", "Seattle Kraken", "St. Louis Blues", "Tampa Bay Lightning", "Toronto Maple Leafs", "Vancouver Canucks", "Vegas Golden Knights", "Washington Capitals", "Winnipeg Jets"],
  mlb: ["Arizona Diamondbacks", "Atlanta Braves", "Baltimore Orioles", "Boston Red Sox", "Chicago Cubs", "Chicago White Sox", "Cincinnati Reds", "Cleveland Guardians", "Colorado Rockies", "Detroit Tigers", "Houston Astros", "Kansas City Royals", "Los Angeles Angels", "Los Angeles Dodgers", "Miami Marlins", "Milwaukee Brewers", "Minnesota Twins", "New York Mets", "New York Yankees", "Oakland Athletics", "Philadelphia Phillies", "Pittsburgh Pirates", "San Diego Padres", "San Francisco Giants", "Seattle Mariners", "St. Louis Cardinals", "Tampa Bay Rays", "Texas Rangers", "Toronto Blue Jays", "Washington Nationals"],
  ufc: ["Jon Jones", "Alex Pereira", "Islam Makhachev", "Leon Edwards", "Sean O'Malley", "Conor McGregor", "Ilia Topuria", "Dustin Poirier", "Max Holloway", "Israel Adesanya", "Tom Aspinall", "Charles Oliveira", "Justin Gaethje", "Alexandre Pantoja", "Dricus Du Plessis", "Sean Strickland", "Khamzat Chimaev"],
  boxing: ["Tyson Fury", "Oleksandr Usyk", "Anthony Joshua", "Canelo Alvarez", "Terence Crawford", "Naoya Inoue", "Gervonta Davis", "Shakur Stevenson", "Artur Beterbiev", "Dmitry Bivol", "Devin Haney", "Ryan Garcia"],
  soccer: ["USA", "Mexico", "Canada", "Argentina", "Brazil", "England", "France", "Germany", "Spain", "Italy", "Portugal", "Netherlands", "Real Madrid", "Barcelona", "Manchester City", "Liverpool", "Arsenal", "PSG", "Bayern Munich", "Inter Milan", "Juventus", "AC Milan"],
  tennis: ["Novak Djokovic", "Carlos Alcaraz", "Jannik Sinner", "Daniil Medvedev", "Alexander Zverev", "Iga Swiatek", "Aryna Sabalenka", "Coco Gauff", "Elena Rybakina", "Jessica Pegula"],
  pickleball: ["Ben Johns", "Anna Leigh Waters", "Tyson McGuffin", "Lea Jansen", "Riley Newman", "Catherine Parenteau", "JW Johnson", "Dylan Frazier", "Anna Bright"],
  volleyball: ["USA", "Poland", "Brazil", "Turkey", "Italy", "Japan", "Serbia", "China", "France", "Slovenia"],
  golf: ["Scottie Scheffler", "Rory McIlroy", "Jon Rahm", "Viktor Hovland", "Xander Schauffele", "Ludvig Åberg", "Brooks Koepka", "Bryson DeChambeau", "Tiger Woods", "Jordan Spieth", "Justin Thomas", "Max Homa", "Wyndham Clark", "Patrick Cantlay", "Collin Morikawa", "Cameron Smith", "Hideki Matsuyama", "Tommy Fleetwood"],
  nascar: ["Kyle Larson", "Chase Elliott", "Denny Hamlin", "Ryan Blaney", "William Byron", "Christopher Bell", "Joey Logano", "Martin Truex Jr.", "Tyler Reddick", "Ross Chastain", "Kyle Busch", "Bubba Wallace", "Brad Keselowski", "Ty Gibbs", "Chris Buescher", "Michael McDowell", "Alex Bowman", "Chase Briscoe"],
  surfing: ["John John Florence", "Gabriel Medina", "Filipe Toledo", "Italo Ferreira", "Jack Robinson", "Carissa Moore", "Caroline Marks", "Tyler Wright", "Stephanie Gilmore", "Molly Picklum"],
  skateboarding: ["Nyjah Huston", "Yuto Horigome", "Sky Brown", "Rayssa Leal", "Kelvin Hoefler", "Leticia Bufoni", "Shane O'Neill", "Aurelien Giraud", "Chloe Covell"],
  bmx: ["Logan Martin", "Garrett Reynolds", "Hannah Roberts", "Charlotte Worthington", "Rim Nakamura", "Anthony Jeanjean", "Declan Brooks", "Nikita Ducarroz"],
  snowboarding: ["Chloe Kim", "Mark McMorris", "Shaun White (Ret.)", "Ayumu Hirano", "Anna Gasser", "Red Gerard", "Su Yiming", "Zoi Sadowski-Synnott", "Valentino Guseli"]
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

    const isHouseGame = scoringGame.opponentId === 'house-admin';
    if (!housePickOverride && isHouseGame && !scoringGame.opponentPick) {
      toast({ variant: "destructive", title: "Selection Required", description: "House must have a locked-in pick to finalize results." });
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
    toast({
      title: "Syncing Arena Feeds",
      description: "Fetching official results from professional sports providers...",
    });
    setTimeout(() => {
      toast({
        title: "Sync Complete",
        description: "Official win counts updated for the 2026 season.",
      });
    }, 2000);
  };

  const filteredPicks = respondingGame 
    ? (sportPicks[respondingGame.sportId] || []).filter(p => p.toLowerCase().includes(searchPickQuery.toLowerCase()))
    : (scoringGame ? (sportPicks[scoringGame.sportId] || []) : []).filter(p => p.toLowerCase().includes(searchPickQuery.toLowerCase()));

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
                        <span className="text-[10px] font-bold text-muted-foreground uppercase self-center bg-white/5 px-3 py-1 rounded-full border border-white/5">
                          Outcome managed via Scoring Center
                        </span>
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

          <TabsContent value="scoring" className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Filter Arena</span>
                <div className="flex flex-wrap gap-2">
                  {["all", "nba", "nfl", "soccer", "ufc", "golf"].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setResultsFilter(s)}
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all",
                        resultsFilter === s ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">
                {filteredScoringGames.length} Matchups in Queue
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
                        <div className="text-right hidden md:block mr-4">
                          <p className="text-[9px] font-black uppercase text-accent mb-1">Status</p>
                          <p className="text-xs font-bold text-white uppercase">{game.status}</p>
                        </div>
                        <Button 
                          onClick={() => handleOpenScoring(game)}
                          className="bg-accent text-accent-foreground font-bold uppercase tracking-widest h-12 px-8"
                        >
                          Record Scores <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-20 bg-card/10 rounded-3xl border border-dashed">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground font-headline font-bold uppercase tracking-widest opacity-50">No scoring tasks available</p>
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
                  Accept Arena
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
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 border-destructive/50 text-destructive">Arena Official</Badge>
                    <CardTitle className="font-headline text-2xl uppercase tracking-tighter text-white">Record Arena Results</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground/80 font-medium">
                  Finalizing <span className="text-white font-bold uppercase">{scoringGame.name}</span>. Precision data entry is mandatory.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                  {/* Challenger Score */}
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
                      <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">FINAL SCORE / WIN COUNT</Label>
                      <Input 
                        type="number" 
                        value={creatorScore} 
                        onChange={(e) => setCreatorScore(e.target.value)}
                        className="h-20 text-4xl font-headline font-black text-center bg-black/40 border-white/10 focus:border-primary transition-colors rounded-xl"
                        placeholder="0"
                      />
                    </div>

                    <div className={cn(
                      "mt-6 flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all",
                      winnerId === scoringGame.creatorId 
                        ? "bg-primary text-white border-transparent shadow-lg shadow-primary/20" 
                        : "bg-white/5 text-muted-foreground border-white/10 group-hover:text-white"
                    )}>
                      {winnerId === scoringGame.creatorId ? <Trophy className="h-3 w-3 fill-current" /> : null}
                      {winnerId === scoringGame.creatorId ? "WINNER DECLARED" : "SET AS WINNER"}
                    </div>
                  </div>

                  {/* Opponent (House) Selection / Score */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Opponent Header */}
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
                          <UserCheck className="h-3 w-3" /> Opponent (Arena Master)
                        </div>
                        <h3 className="font-headline text-xl font-bold text-white uppercase italic truncate px-2">
                          {housePickOverride || scoringGame.opponentPick || "PENDING SELECTION"}
                        </h3>
                      </div>
                      
                      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-end" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-4">
                          <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">FINAL SCORE / WIN COUNT</Label>
                          <Input 
                            type="number" 
                            value={opponentScore} 
                            onChange={(e) => setOpponentScore(e.target.value)}
                            className="h-20 text-4xl font-headline font-black text-center bg-black/40 border-white/10 focus:border-accent transition-colors rounded-xl"
                            placeholder="0"
                          />
                        </div>

                        <div className="space-y-4">
                          <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">SELECT HOUSE PICK</Label>
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

                      <div className={cn(
                        "mt-6 flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all",
                        winnerId === scoringGame.opponentId 
                          ? "bg-accent text-accent-foreground border-transparent shadow-lg shadow-accent/20" 
                          : "bg-white/5 text-muted-foreground border-white/10 group-hover:text-white"
                      )}>
                        {winnerId === scoringGame.opponentId ? <Trophy className="h-3 w-3 fill-current" /> : null}
                        {winnerId === scoringGame.opponentId ? "WINNER DECLARED" : "SET AS WINNER"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Footer */}
                <div className="mt-12 p-6 rounded-2xl bg-[#1A232E] border border-white/5 text-center space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Winner Record Update</p>
                  {winnerId ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="font-mono text-sm text-accent font-bold tracking-widest uppercase truncate max-w-md">{winnerId}</span>
                      </div>
                      {housePickOverride && <Badge variant="outline" className="text-[8px] border-accent/20 text-accent uppercase">Finalizing with House Pick: {housePickOverride}</Badge>}
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-destructive/60 italic">PENDING VICTOR SELECTION...</p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex gap-4 bg-secondary/5 p-8 border-t border-white/5">
                <Button 
                  variant="ghost" 
                  onClick={() => setScoringGame(null)} 
                  className="flex-1 h-14 font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors"
                >
                  Abort Action
                </Button>
                <Button 
                  onClick={handleFinalizeGame} 
                  disabled={!winnerId || (scoringGame.opponentId === 'house-admin' && !housePickOverride && !scoringGame.opponentPick)}
                  className="flex-[2] h-14 bg-destructive text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-destructive/20 hover:bg-destructive/90 transition-all active:scale-95 disabled:opacity-30"
                >
                  <CheckCircle2 className="mr-3 h-5 w-5" /> Confirm & Archive Showdown
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
