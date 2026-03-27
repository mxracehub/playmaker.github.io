
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Coins, Zap, ShieldCheck, Gamepad2, Users, ArrowRight, Dribbble, Target, Flag, CheckCircle2, Search, Waves, Bike, Mountain, Landmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const sports = [
  { 
    id: 'nba', 
    name: 'Basketball', 
    icon: <Dribbble className="w-5 h-5" />, 
    color: "text-orange-500",
    options: [
      "Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets", "Chicago Bulls", 
      "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets", "Detroit Pistons", "Golden State Warriors", 
      "Houston Rockets", "Indiana Pacers", "LA Clippers", "Los Angeles Lakers", "Memphis Grizzlies", 
      "Miami Heat", "Milwaukee Bucks", "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks", 
      "Oklahoma City Thunder", "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns", "Portland Trail Blazers", 
      "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors", "Utah Jazz", "Washington Wizards"
    ]
  },
  { 
    id: 'nfl', 
    name: 'Football', 
    icon: <Trophy className="w-5 h-5" />, 
    color: "text-green-500",
    options: [
      "Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills", "Carolina Panthers", 
      "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns", "Dallas Cowboys", "Denver Broncos", 
      "Detroit Lions", "Green Bay Packers", "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", 
      "Kansas City Chiefs", "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins", 
      "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants", "New York Jets", 
      "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers", "Seattle Seahawks", "Tampa Bay Buccaneers", 
      "Tennessee Titans", "Washington Commanders"
    ]
  },
  { 
    id: 'surfing', 
    name: 'Surfing', 
    icon: <Waves className="w-5 h-5" />, 
    color: "text-blue-400",
    options: [
      "John John Florence", "Carissa Moore", "Gabriel Medina", "Italo Ferreira", "Filipe Toledo",
      "Tyler Wright", "Stephanie Gilmore", "Jack Robinson", "Ethan Ewing", "Caroline Marks",
      "Caity Simmers", "Griffin Colapinto", "Kelly Slater", "Molly Picklum", "Johanne Defay"
    ]
  },
  { 
    id: 'skateboarding', 
    name: 'Skate', 
    icon: <Zap className="w-5 h-5" />, 
    color: "text-yellow-400",
    options: [
      "Nyjah Huston", "Yuto Horigome", "Rayssa Leal", "Sky Brown", "Zion Wright",
      "Leticia Bufoni", "Tony Hawk", "Bucky Lasek", "Ryan Sheckler", "Torey Pudwill",
      "Shane O'Neill", "Tyshawn Jones", "Dashawn Jordan", "Ginwoo Onodera", "Aurelien Giraud"
    ]
  },
  { 
    id: 'bmx', 
    name: 'BMX', 
    icon: <Bike className="w-5 h-5" />, 
    color: "text-red-400",
    options: [
      "Logan Martin", "Garrett Reynolds", "Hannah Roberts", "Charlotte Worthington", "Jose Torres",
      "Kieran Reilly", "Justin Dowell", "Marcus Christopher", "Kevin Peraza", "Pat Casey",
      "Dennis Enarson", "Chad Kerley", "Kriss Kyle", "Dakota Roche", "Ryan Nyquist"
    ]
  },
  { 
    id: 'snowboarding', 
    name: 'Snowboard', 
    icon: <Mountain className="w-5 h-5" />, 
    color: "text-cyan-400",
    options: [
      "Shaun White", "Chloe Kim", "Mark McMorris", "Zoi Sadowski-Synnott", "Ayumu Hirano",
      "Scotty James", "Marcus Kleveland", "Red Gerard", "Anna Gasser", "Su Yiming",
      "Dustin Craven", "Travis Rice", "Jamie Anderson", "Danny Davis", "Ben Ferguson"
    ]
  },
  { 
    id: 'golf', 
    name: 'Golf', 
    icon: <Target className="w-5 h-5" />, 
    color: "text-emerald-400",
    options: [
      "Scottie Scheffler", "Rory McIlroy", "Jon Rahm", "Viktor Hovland", "Ludvig Aberg", 
      "Xander Schauffele", "Wyndham Clark", "Brian Harman", "Max Homa", "Patrick Cantlay", 
      "Collin Morikawa", "Keegan Bradley", "Jordan Spieth", "Justin Thomas", "Brooks Koepka", 
      "Bryson DeChambeau", "Cameron Smith", "Dustin Johnson", "Phil Mickelson", "Tommy Fleetwood", 
      "Matt Fitzpatrick", "Tyrrell Hatton", "Min Woo Lee", "Sahith Theegala", "Tom Kim", 
      "Sungjae Im", "Hideki Matsuyama", "Jason Day", "Adam Scott", "Shane Lowry", 
      "Justin Rose", "Rickie Fowler", "Tony Finau", "Sam Burns", "Cameron Young", 
      "Corey Conners", "Si Woo Kim", "Nicolai Hojgaard", "Matthieu Pavon", "Nick Dunlap",
      "Nelly Korda", "Lilia Vu", "Celine Boutier", "Ruoning Yin", "Minjee Lee", 
      "Jin Young Ko", "Charley Hull", "Rose Zhang", "Brooke Henderson", "Lydia Ko", 
      "Atthaya Thitikul", "Allisen Corpuz", "Megan Khang", "Ayaka Furue", "Hyo Joo Kim", 
      "Linn Grant", "Maja Stark", "Leona Maguire", "Georgia Hall", "Yuka Saso"
    ]
  },
  { 
    id: 'nascar', 
    name: 'NASCAR', 
    icon: <Flag className="w-5 h-5" />, 
    color: "text-red-500",
    options: [
      "Kyle Larson (Hendrick Motorsports)", 
      "Chase Elliott (Hendrick Motorsports)", 
      "William Byron (Hendrick Motorsports)", 
      "Alex Bowman (Hendrick Motorsports)", 
      "Denny Hamlin (Joe Gibbs Racing)", 
      "Christopher Bell (Joe Gibbs Racing)", 
      "Ty Gibbs (Joe Gibbs Racing)", 
      "Martin Truex Jr. (Joe Gibbs Racing)", 
      "Ryan Blaney (Team Penske)", 
      "Joey Logano (Team Penske)", 
      "Austin Cindric (Team Penske)", 
      "Tyler Reddick (23XI Racing)", 
      "Bubba Wallace (23XI Racing)", 
      "Ross Chastain (Trackhouse Racing)", 
      "Daniel Suarez (Trackhouse Racing)", 
      "Kyle Busch (Richard Childress Racing)", 
      "Austin Dillon (Richard Childress Racing)", 
      "Brad Keselowski (RFK Racing)", 
      "Chris Buescher (RFK Racing)", 
      "Michael McDowell (Front Row Motorsports)", 
      "Todd Gilliland (Front Row Motorsports)", 
      "Chase Briscoe (Joe Gibbs Racing)", 
      "Noah Gragson (Stewart-Haas Racing)", 
      "Josh Berry (Stewart-Haas Racing)", 
      "Ryan Preece (Stewart-Haas Racing)", 
      "Erik Jones (Legacy Motor Club)", 
      "John Hunter Nemechek (Legacy Motor Club)", 
      "Ricky Stenhouse Jr. (JTG Daugherty Racing)", 
      "Corey LaJoie (Spire Motorsports)", 
      "Carson Hocevar (Spire Motorsports)", 
      "Zane Smith (Spire Motorsports)", 
      "Justin Haley (Rick Ware Racing)", 
      "Harrison Burton (Wood Brothers Racing)"
    ]
  },
];

const mockFriends = [
  { id: 'f1', name: "Jordan 'Swish' Smith", avatar: "https://picsum.photos/seed/jordan/100/100" },
  { id: 'f2', name: "Sarah 'Quarterback' Jones", avatar: "https://picsum.photos/seed/sarah/100/100" },
  { id: 'f3', name: "Mike 'The Putter' Brown", avatar: "https://picsum.photos/seed/mike/100/100" },
  { id: 'f4', name: "Alex 'Apex' Racer", avatar: "https://picsum.photos/seed/alex/100/100" },
  { id: 'f5', name: "Emma 'Endzone' Miller", avatar: "https://picsum.photos/seed/emma/100/100" },
  { id: 'f6', name: "Chris 'The Wall' Davis", avatar: "https://picsum.photos/seed/chris/100/100" },
];

export default function CreateGamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedPick, setSelectedPick] = useState<string>("");
  const [selectedFriend, setSelectedFriend] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPickQuery, setSearchPickQuery] = useState("");
  const [currency, setCurrency] = useState("gold");
  const [fee, setFee] = useState("1000");

  useEffect(() => {
    const friendId = searchParams.get('friendId');
    if (friendId && mockFriends.some(f => f.id === friendId)) {
      setSelectedFriend(friendId);
    }
  }, [searchParams]);

  const balances = {
    gold: 1250000,
    sweeps: 542.50
  };

  const filteredFriends = mockFriends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSport = sports.find(s => s.id === selectedSport);
  const filteredPicks = currentSport?.options.filter(option =>
    option.toLowerCase().includes(searchPickQuery.toLowerCase())
  ) || [];

  const handleCreate = () => {
    if (!selectedSport) {
      toast({ variant: "destructive", title: "Missing Arena", description: "Please select a sport for your game." });
      return;
    }
    if (!selectedPick) {
      toast({ variant: "destructive", title: "Selection Required", description: "Please pick your winning team or athlete." });
      return;
    }
    if (!selectedFriend) {
      toast({ variant: "destructive", title: "No Challenger", description: "You must pick a friend to challenge for this game to work." });
      return;
    }

    const cost = parseFloat(fee);
    const available = currency === "gold" ? balances.gold : balances.sweeps;

    if (cost > available) {
      toast({ 
        variant: "destructive", 
        title: "Insufficient Funds", 
        description: `You need more ${currency === "gold" ? "Gold Coins" : "Sweeps Coins"} to start this game.` 
      });
      return;
    }

    const challenger = mockFriends.find(f => f.id === selectedFriend)?.name || "Challenger";

    toast({ title: "Game Initialized", description: `You've challenged ${challenger}. Entering Arena...` });
    
    setTimeout(() => {
      const gameId = `game-${Math.floor(Math.random() * 9000) + 1000}`;
      router.push(`/games/${gameId}?sport=${selectedSport}&pick=${encodeURIComponent(selectedPick)}&fee=${fee}&currency=${currency}&challenger=${encodeURIComponent(challenger)}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-background relative overflow-hidden">
      <Navbar />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />

      <main className="mx-auto max-w-3xl px-4 py-12">
        <header className="mb-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-6">
            <Gamepad2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-headline text-4xl font-bold uppercase tracking-tight mb-2">Create <span className="text-accent">Game</span></h1>
          <p className="text-muted-foreground">Select your arena, pick your winner, and challenge a squad member</p>
        </header>

        <div className="grid gap-8">
          <Card className="bg-card/50 backdrop-blur-sm border-white/5 overflow-hidden">
            <CardHeader className="border-b bg-secondary/20">
              <CardTitle className="font-headline text-xl uppercase tracking-tighter">Arena Configuration</CardTitle>
              <CardDescription>Challenges require a winner pick and a squad challenger</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Step 1: Sport Selection */}
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">1. Select Sport</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {sports.map((sport) => (
                    <button
                      key={sport.id}
                      onClick={() => {
                        setSelectedSport(sport.id);
                        setSelectedPick(""); 
                        setSearchPickQuery("");
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                        selectedSport === sport.id 
                          ? 'bg-primary/20 border-primary scale-105 shadow-lg shadow-primary/10' 
                          : 'bg-secondary/30 border-transparent hover:border-white/10'
                      }`}
                    >
                      <div className={`mb-3 ${sport.color}`}>{sport.icon}</div>
                      <span className="text-xs font-bold uppercase tracking-tight">{sport.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Winner Pick Selection with Search */}
              {selectedSport ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    2. Pick Your Winning {['surfing', 'skateboarding', 'bmx', 'snowboarding', 'golf', 'nascar'].includes(selectedSport) ? 'Athlete' : 'Team'}
                  </Label>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder={`Search ${['surfing', 'skateboarding', 'bmx', 'snowboarding', 'golf', 'nascar'].includes(selectedSport) ? 'athletes' : 'teams'}...`} 
                      className="pl-10 h-12 bg-secondary/30 border-white/5 focus:border-accent/50 transition-colors"
                      value={searchPickQuery}
                      onChange={(e) => setSearchPickQuery(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-1 no-scrollbar">
                    {filteredPicks.length > 0 ? (
                      filteredPicks.map((option) => (
                        <button
                          key={option}
                          onClick={() => setSelectedPick(option)}
                          className={`flex items-center justify-between p-4 rounded-xl border text-sm font-bold transition-all ${
                            selectedPick === option
                              ? 'bg-accent/10 border-accent text-accent'
                              : 'bg-secondary/20 border-white/5 hover:border-white/20'
                          }`}
                        >
                          {option}
                          {selectedPick === option && <CheckCircle2 className="h-4 w-4" />}
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full py-6 text-center bg-secondary/10 rounded-xl border border-dashed">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-50">No matches found for "{searchPickQuery}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-secondary/10 rounded-2xl border border-dashed opacity-50">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Select a sport to see winner options</p>
                </div>
              )}

              {/* Step 3: Friend Search & Selection */}
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">3. Invite a Challenger</Label>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search squad members..." 
                    className="pl-10 h-12 bg-secondary/30 border-white/5 focus:border-accent/50 transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 max-h-[250px] overflow-y-auto no-scrollbar pr-1">
                  {filteredFriends.length > 0 ? (
                    filteredFriends.map((friend) => (
                      <button
                        key={friend.id}
                        onClick={() => setSelectedFriend(friend.id)}
                        className={`flex items-center gap-4 p-3 rounded-xl border-2 transition-all ${
                          selectedFriend === friend.id
                            ? 'bg-accent/10 border-accent'
                            : 'bg-secondary/20 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <Avatar className="h-10 w-10 border border-white/10">
                          <AvatarImage src={friend.avatar} />
                          <AvatarFallback>{friend.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <p className="font-bold text-sm">{friend.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Available for Challenge</p>
                        </div>
                        {selectedFriend === friend.id && <CheckCircle2 className="h-5 w-5 text-accent" />}
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-secondary/10 rounded-2xl border border-dashed">
                      <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-muted-foreground">No squad members found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 4: Currency Selection */}
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">4. Set the Stakes ($1 = 100 Coins)</Label>
                <RadioGroup defaultValue="gold" className="grid grid-cols-1 md:grid-cols-2 gap-4" onValueChange={setCurrency}>
                  <div className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${currency === 'gold' ? 'border-primary bg-primary/5' : 'border-white/5 bg-secondary/10'}`}>
                    <RadioGroupItem value="gold" id="gold" className="absolute top-4 right-4" />
                    <Label htmlFor="gold" className="flex items-center gap-3 cursor-pointer">
                      <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <Coins className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="font-bold uppercase text-sm">Gold Coins</p>
                        <p className="text-[10px] text-muted-foreground italic">100 GC = $1.00 Value</p>
                      </div>
                    </Label>
                  </div>
                  <div className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${currency === 'sweeps' ? 'border-accent bg-accent/5' : 'border-white/5 bg-secondary/10'}`}>
                    <RadioGroupItem value="sweeps" id="sweeps" className="absolute top-4 right-4" />
                    <Label htmlFor="sweeps" className="flex items-center gap-3 cursor-pointer">
                      <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Landmark className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-bold uppercase text-sm">Sweeps Coins</p>
                        <p className="text-[10px] text-accent font-bold italic">100 SC = $1.00 Value</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Fee and Settings */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fee" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Entry Fee</Label>
                  <Select value={fee} onValueChange={setFee}>
                    <SelectTrigger id="fee" className="bg-secondary/30 border-white/5 h-12">
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 ($1.00)</SelectItem>
                      <SelectItem value="1000">1,000 ($10.00)</SelectItem>
                      <SelectItem value="5000">5,000 ($50.00)</SelectItem>
                      <SelectItem value="10000">10,000 ($100.00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="players" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Max Players</Label>
                  <Input type="number" id="players" defaultValue="2" disabled className="bg-secondary/30 border-white/5 h-12 opacity-50 cursor-not-allowed" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-secondary/10 border-t p-6 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                Your balance: <span className="font-bold text-white">{currency === 'gold' ? balances.gold.toLocaleString() : balances.sweeps.toFixed(2)} {currency.toUpperCase()}</span>
              </div>
              <Button onClick={handleCreate} className="w-full h-14 font-headline text-xl font-bold uppercase tracking-widest shadow-xl shadow-primary/20">
                Launch Challenge <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
