
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
import { Trophy, Coins, Zap, ShieldCheck, Gamepad2, Users, ArrowRight, Dribbble, Target, Flag, CheckCircle2, Search, Waves, Bike, Mountain, Landmark, CalendarDays, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser, addDocumentNonBlocking } from "@/firebase";
import { collection } from "firebase/firestore";

const sports = [
  { 
    id: 'nba', 
    name: 'Basketball', 
    icon: <Dribbble className="w-5 h-5" />, 
    color: "text-orange-500",
    events: [
      { id: 'e1', name: "Lakers @ Warriors", date: "Tonight 7:30 PM" },
      { id: 'e2', name: "Celtics @ Bucks", date: "Tomorrow 8:00 PM" },
      { id: 'e3', name: "Knicks @ Nets", date: "Friday 7:00 PM" }
    ],
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
    events: [
      { id: 'e4', name: "Chiefs @ Eagles", date: "Sunday 1:00 PM" },
      { id: 'e5', name: "49ers @ Lions", date: "Sunday 4:25 PM" },
      { id: 'e6', name: "Cowboys @ Giants", date: "Monday 8:15 PM" }
    ],
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
    events: [
      { id: 'e7', name: "Pipe Masters - Day 1", date: "Starting Soon" },
      { id: 'e8', name: "Gold Coast Pro", date: "Mar 12, 2024" }
    ],
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
    events: [
      { id: 'e9', name: "SLS Tokyo Qualifier", date: "Mar 15, 2024" },
      { id: 'e10', name: "Tampa Pro Finals", date: "Mar 20, 2024" }
    ],
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
    events: [
      { id: 'e11', name: "X-Games Dirt Qualifiers", date: "Apr 05, 2024" }
    ],
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
    events: [
      { id: 'e12', name: "US Open Halfpipe", date: "Mar 08, 2024" }
    ],
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
    events: [
      { id: 'e13', name: "The Masters - Round 1", date: "Apr 11, 2024" },
      { id: 'e14', name: "Arnold Palmer Invite", date: "Mar 07, 2024" }
    ],
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
    events: [
      { id: 'e15', name: "Daytona 500", date: "Feb 18, 2024" },
      { id: 'e16', name: "Las Vegas 400", date: "Mar 03, 2024" }
    ],
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
  { id: 'house-admin', name: "Arena Master (House Admin)", avatar: "https://picsum.photos/seed/admin/100/100", isHouse: true },
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
  const { user } = useUser();
  const db = useFirestore();
  
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [selectedPick, setSelectedPick] = useState<string>("");
  const [selectedFriend, setSelectedFriend] = useState<string>("");
  const [searchFriendQuery, setSearchFriendQuery] = useState("");
  const [searchPickQuery, setSearchPickQuery] = useState("");
  const [currency, setCurrency] = useState("gold");
  const [fee, setFee] = useState("1000");

  useEffect(() => {
    const friendId = searchParams.get('friendId');
    if (friendId && (mockFriends.some(f => f.id === friendId) || friendId === 'house-admin')) {
      setSelectedFriend(friendId);
    }
    const sportId = searchParams.get('sport');
    if (sportId && sports.some(s => s.id === sportId)) {
      setSelectedSport(sportId);
    }
  }, [searchParams]);

  const balances = {
    gold: 1250000,
    sweeps: 542.50
  };

  const currentSport = sports.find(s => s.id === selectedSport);

  const filteredPicks = currentSport?.options.filter(option =>
    option.toLowerCase().includes(searchPickQuery.toLowerCase())
  ) || [];

  const filteredFriends = mockFriends.filter(friend => 
    friend.name.toLowerCase().includes(searchFriendQuery.toLowerCase())
  );

  const handleCreate = () => {
    if (!user) {
      toast({ variant: "destructive", title: "Sign In Required", description: "You must be logged in to create a game." });
      return;
    }
    if (!selectedSport) {
      toast({ variant: "destructive", title: "Missing Arena", description: "Please select a sport for your game." });
      return;
    }
    if (!selectedEvent) {
      toast({ variant: "destructive", title: "Select Event", description: "Please pick an upcoming game or event." });
      return;
    }
    if (!selectedPick) {
      toast({ variant: "destructive", title: "Selection Required", description: "Please pick your winning team or athlete." });
      return;
    }
    if (!selectedFriend) {
      toast({ variant: "destructive", title: "Opponent Required", description: "Please select a friend or the Arena Master to challenge." });
      return;
    }

    const cost = parseFloat(fee);
    const available = currency === "gold" ? balances.gold : balances.sweeps;

    if (cost > available) {
      toast({ 
        variant: "destructive", 
        title: "Insufficient Funds", 
        description: `You need more ${currency === "gold" ? "Gold Coins" : "Sweeps Coins"}.` 
      });
      return;
    }

    const eventName = currentSport?.events.find(e => e.id === selectedEvent)?.name || "Live Event";
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Persist to Firestore
    const gameData = {
      name: eventName,
      creatorId: user.uid,
      creatorPick: selectedPick,
      sportId: selectedSport,
      currencyType: currency,
      entryFee: cost,
      prizePool: cost * 2,
      status: "Open",
      inviteCode: inviteCode,
      createdAt: new Date().toISOString(),
      opponentId: selectedFriend,
    };

    addDocumentNonBlocking(collection(db, "games"), gameData)
      .then((docRef) => {
        toast({ title: "Challenge Launched", description: `You've sent a showdown request!` });
        router.push(`/games/${docRef?.id}?sport=${selectedSport}&fee=${fee}&currency=${currency}`);
      });
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
          <p className="text-muted-foreground">Select arena, pick your side, and challenge a playmaker</p>
        </header>

        <div className="grid gap-8">
          <Card className="bg-card/50 backdrop-blur-sm border-white/5 overflow-hidden">
            <CardHeader className="border-b bg-secondary/20">
              <CardTitle className="font-headline text-xl uppercase tracking-tighter">Arena Configuration</CardTitle>
              <CardDescription>Follow the steps to launch your official challenge</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-10">
              
              {/* Step 1: Sport Selection */}
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">1. Select Arena</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {sports.map((sport) => (
                    <button
                      key={sport.id}
                      onClick={() => {
                        setSelectedSport(sport.id);
                        setSelectedEvent("");
                        setSelectedPick(""); 
                        setSearchPickQuery("");
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                        selectedSport === sport.id 
                          ? 'bg-primary/20 border-primary scale-105' 
                          : 'bg-secondary/30 border-transparent hover:border-white/10'
                      }`}
                    >
                      <div className={`mb-2 ${sport.color}`}>{sport.icon}</div>
                      <span className="text-[10px] font-bold uppercase tracking-tight">{sport.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Event Selection */}
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">2. Select Upcoming Event</Label>
                {selectedSport ? (
                  <div className="grid gap-3">
                    {currentSport?.events.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => setSelectedEvent(event.id)}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                          selectedEvent === event.id
                            ? 'bg-accent/10 border-accent'
                            : 'bg-secondary/20 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CalendarDays className={`h-5 w-5 ${selectedEvent === event.id ? 'text-accent' : 'text-muted-foreground'}`} />
                          <div>
                            <p className="font-bold text-sm">{event.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-medium">{event.date}</p>
                          </div>
                        </div>
                        {selectedEvent === event.id && <CheckCircle2 className="h-5 w-5 text-accent" />}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-secondary/10 rounded-xl border border-dashed opacity-50">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Select an Arena first</p>
                  </div>
                )}
              </div>

              {/* Step 3: Winner Pick Selection */}
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">3. Pick Your Winner</Label>
                {selectedSport ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search teams or athletes..." 
                        className="pl-10 h-11 bg-secondary/30 border-white/5"
                        value={searchPickQuery}
                        onChange={(e) => setSearchPickQuery(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1 no-scrollbar">
                      {filteredPicks.map((option) => (
                        <button
                          key={option}
                          onClick={() => setSelectedPick(option)}
                          className={`flex items-center justify-between p-3 rounded-lg border text-xs font-bold transition-all ${
                            selectedPick === option
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-secondary/20 border-white/5 hover:border-white/10'
                          }`}
                        >
                          {option}
                          {selectedPick === option && <CheckCircle2 className="h-3 w-3" />}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center bg-secondary/10 rounded-xl border border-dashed opacity-50">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Choose Arena & Event</p>
                  </div>
                )}
              </div>

              {/* Step 4: Currency & Stakes */}
              <div className="space-y-6 pt-4 border-t border-white/5">
                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">4. Set the Stakes</Label>
                  <RadioGroup defaultValue="gold" className="grid grid-cols-2 gap-4" onValueChange={setCurrency}>
                    <div className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${currency === 'gold' ? 'border-primary bg-primary/5' : 'border-white/5 bg-secondary/10'}`}>
                      <RadioGroupItem value="gold" id="gold" className="absolute top-4 right-4" />
                      <Label htmlFor="gold" className="flex flex-col gap-1 cursor-pointer">
                        <span className="font-bold uppercase text-xs">Gold Coins</span>
                        <span className="text-[10px] text-muted-foreground">Casual Play</span>
                      </Label>
                    </div>
                    <div className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${currency === 'sweeps' ? 'border-accent bg-accent/5' : 'border-white/5 bg-secondary/10'}`}>
                      <RadioGroupItem value="sweeps" id="sweeps" className="absolute top-4 right-4" />
                      <Label htmlFor="sweeps" className="flex flex-col gap-1 cursor-pointer">
                        <span className="font-bold uppercase text-xs">Sweeps Coins</span>
                        <span className="text-[10px] text-accent font-bold">Prize Play</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

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
              </div>

              {/* Step 5: Opponent Selection */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">5. Select Your Opponent</Label>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search playmakers..." 
                      className="pl-10 h-11 bg-secondary/30 border-white/5"
                      value={searchFriendQuery}
                      onChange={(e) => setSearchFriendQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredFriends.map((friend) => (
                      <button
                        key={friend.id}
                        onClick={() => setSelectedFriend(friend.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                          selectedFriend === friend.id
                            ? 'bg-primary/10 border-primary'
                            : 'bg-secondary/20 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <Avatar className={`h-10 w-10 border ${friend.isHouse ? 'border-accent shadow-lg shadow-accent/20' : 'border-white/10'}`}>
                          <AvatarImage src={friend.avatar} />
                          <AvatarFallback><Users className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                          <p className={`font-bold text-xs truncate ${friend.isHouse ? 'text-accent' : ''}`}>
                            {friend.name}
                          </p>
                          {friend.isHouse && (
                            <span className="text-[8px] font-bold uppercase tracking-widest text-accent flex items-center gap-1">
                              <ShieldAlert className="h-2 w-2" /> Arena Master
                            </span>
                          )}
                        </div>
                        {selectedFriend === friend.id && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </CardContent>
            <CardFooter className="bg-secondary/10 border-t p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                Balance: <span className="font-bold text-white">{currency === 'gold' ? balances.gold.toLocaleString() : balances.sweeps.toFixed(2)} {currency.toUpperCase()}</span>
              </div>
              <Button onClick={handleCreate} className="w-full h-14 font-headline text-xl font-bold uppercase tracking-widest shadow-xl">
                Launch Challenge <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
