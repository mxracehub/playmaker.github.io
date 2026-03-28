
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Gamepad2, 
  CheckCircle2, 
  Dribbble, 
  Target, 
  Flag, 
  Waves, 
  Bike, 
  Mountain, 
  Landmark, 
  CalendarDays, 
  Swords, 
  Snowflake, 
  Zap,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser, addDocumentNonBlocking } from "@/firebase";
import { collection } from "firebase/firestore";
import { useFriendsStore, HOUSE_ADMIN } from "@/hooks/use-friends-store";
import { sendChallengeEmail } from "@/ai/flows/send-challenge-email-flow";

const BaseballIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 1 0 20" />
    <path d="M2 12a10 10 0 0 1 20 0" />
    <path d="M7 7c2 1 3 3 3 5s-1 4-3 5" />
    <path d="M17 7c-2 1-3 3-3 5s1 4 3 5" />
  </svg>
);

const TennisIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 1 0 20" />
    <path d="M2 12a10 10 0 0 1 20 0" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const SoccerIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="m12 12 5-3v6l-5 3-5-3v-6z" />
    <path d="M12 2v5" />
    <path d="M12 17v5" />
    <path d="M2 12h5" />
    <path d="M17 12h5" />
  </svg>
);

const BoxingIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 11h-2a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2Z" />
    <path d="M10 10H8a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2Z" />
    <path d="M18 11V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v5" />
    <path d="M6 14v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" />
  </svg>
);

const sports = [
  { id: 'nba', name: 'NBA', icon: <Dribbble className="w-5 h-5" />, color: "text-orange-500", events: [{ id: 'e1', name: "NBA All-Star Game", date: "Feb 15" }, { id: 'e2', name: "Mavericks @ Suns", date: "Mar 12" }], options: ["Lakers", "Warriors", "Celtics", "Bucks", "Suns", "Nets"] },
  { id: 'nfl', name: 'NFL', icon: <Trophy className="w-5 h-5" />, color: "text-green-500", events: [{ id: 'nfl-e1', name: "Super Bowl LX", date: "Feb 08" }], options: ["Chiefs", "Eagles", "49ers", "Lions", "Cowboys", "Giants"] },
  { id: 'hockey', name: 'NHL', icon: <Snowflake className="w-5 h-5" />, color: "text-cyan-400", events: [{ id: 'h-e1', name: "NHL Winter Classic", date: "Jan 01" }], options: ["Oilers", "Avalanche", "Bruins", "Rangers", "Leafs"] },
  { id: 'soccer', name: 'Soccer', icon: <SoccerIcon className="w-5 h-5" />, color: "text-white", events: [{ id: 'e30', name: "Champions League Final", date: "Jun 10" }], options: ["Real Madrid", "Barcelona", "Man City", "Liverpool", "PSG"] },
  { id: 'ufc', name: 'UFC', icon: <Swords className="w-5 h-5" />, color: "text-red-600", events: [{ id: 'ufc-e1', name: "UFC 300", date: "Apr 13" }], options: ["Jon Jones", "Alex Pereira", "Islam Makhachev", "Leon Edwards"] },
  { id: 'boxing', name: 'Boxing', icon: <BoxingIcon className="w-5 h-5" />, color: "text-yellow-600", events: [{ id: 'box-e1', name: "Heavyweight Title", date: "May 18" }], options: ["Tyson Fury", "Oleksandr Usyk", "Anthony Joshua", "Canelo Alvarez"] },
  { id: 'mlb', name: 'MLB', icon: <BaseballIcon className="w-5 h-5" />, color: "text-blue-500", events: [{ id: 'mlb-e1', name: "World Series Game 1", date: "Oct 25" }], options: ["Dodgers", "Yankees", "Braves", "Astros", "Phillies"] },
  { id: 'tennis', name: 'Tennis', icon: <TennisIcon className="w-5 h-5" />, color: "text-lime-400", events: [{ id: 'ten-e1', name: "Wimbledon Final", date: "Jul 14" }], options: ["Djokovic", "Alcaraz", "Sinner", "Swiatek", "Gauff"] },
  { id: 'surfing', name: 'Surfing', icon: <Waves className="w-5 h-5" />, color: "text-blue-400", events: [{ id: 'surf-e1', name: "Pipe Masters", date: "Dec 08" }], options: ["Kelly Slater", "John John Florence", "Gabriel Medina"] },
  { id: 'skateboarding', name: 'Skate', icon: <Zap className="w-5 h-5" />, color: "text-yellow-400", events: [{ id: 'skate-e1', name: "X Games Vert", date: "Jul 20" }], options: ["Tony Hawk", "Nyjah Huston", "Yuto Horigome"] },
  { id: 'bmx', name: 'BMX', icon: <Bike className="w-5 h-5" />, color: "text-red-400", events: [{ id: 'bmx-e1', name: "BMX Dirt Open", date: "Aug 15" }], options: ["Logan Martin", "Marcus Christopher", "Ryan Williams"] },
  { id: 'snowboarding', name: 'Snowboard', icon: <Mountain className="w-5 h-5" />, color: "text-cyan-400", events: [{ id: 'snow-e1', name: "Burton US Open", date: "Mar 05" }], options: ["Shaun White", "Chloe Kim", "Mark McMorris"] },
  { id: 'nascar', name: 'NASCAR', icon: <Flag className="w-5 h-5" />, color: "text-red-500", events: [{ id: 'nas-e1', name: "Daytona 500", date: "Feb 16" }], options: ["Kyle Larson", "Chase Elliott", "Denny Hamlin", "Ryan Blaney"] },
  { id: 'golf', name: 'Golf', icon: <Target className="h-5 w-5" />, color: "text-emerald-400", events: [{ id: 'golf-e1', name: "The Masters", date: "Apr 10" }], options: ["Scottie Scheffler", "Rory McIlroy", "Jon Rahm", "Tiger Woods"] },
];

function CreateGameForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const { friends, isLoaded: isFriendsLoaded } = useFriendsStore();
  
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [selectedPick, setSelectedPick] = useState<string>("");
  const [selectedFriend, setSelectedFriend] = useState<string>("");
  const [searchFriendQuery, setSearchFriendQuery] = useState("");
  const [searchPickQuery, setSearchPickQuery] = useState("");
  const [currency, setCurrency] = useState("gold");
  const [fee, setFee] = useState("1000");

  const availableFriends = [HOUSE_ADMIN, ...friends];

  useEffect(() => {
    if (!isFriendsLoaded) return;
    
    const friendId = searchParams.get('friendId');
    if (friendId && (availableFriends.some(f => f.id === friendId))) {
      setSelectedFriend(friendId);
    }
    const sportId = searchParams.get('sport');
    if (sportId && sports.some(s => s.id === sportId)) {
      setSelectedSport(sportId);
    }
  }, [searchParams, availableFriends.length, isFriendsLoaded]);

  const balances = { gold: 1250000, sweeps: 542.50 };
  const currentSport = sports.find(s => s.id === selectedSport);
  const filteredPicks = currentSport?.options.filter(option => option.toLowerCase().includes(searchPickQuery.toLowerCase())) || [];
  const filteredFriends = availableFriends.filter(friend => friend.name.toLowerCase().includes(searchFriendQuery.toLowerCase()));

  const handleCreate = () => {
    if (!user) {
      toast({ variant: "destructive", title: "Authentication Required", description: "Sign in to launch an arena challenge." });
      return;
    }

    if (!selectedSport || !selectedEvent || !selectedPick || !selectedFriend) {
      toast({ variant: "destructive", title: "Missing Information", description: "Complete all steps to launch challenge." });
      return;
    }

    const cost = parseFloat(fee);
    const available = currency === "gold" ? balances.gold : balances.sweeps;

    if (cost > available) {
      toast({ variant: "destructive", title: "Insufficient Funds", description: "Check your arena bank balance." });
      return;
    }

    const eventName = currentSport?.events.find(e => e.id === selectedEvent)?.name || "Live Event";
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

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
        toast({ title: "Challenge Launched", description: `Showdown request sent!` });
        const opponent = availableFriends.find(f => f.id === selectedFriend);
        if (opponent) {
          sendChallengeEmail({
            challengerName: user.displayName || user.email || 'A Playmaker',
            opponentEmail: opponent.email || `${opponent.id}@playmakers.arena`,
            sport: currentSport?.name || 'Sports',
            eventName: eventName,
            stakes: `${fee} ${currency.toUpperCase()}`,
            inviteCode: inviteCode,
          });
        }
        router.push(`/games/${docRef?.id}?sport=${selectedSport}&fee=${fee}&currency=${currency}&pick=${selectedPick}`);
      });
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-12 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-6">
          <Gamepad2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold uppercase tracking-tight mb-2">Create <span className="text-accent">Game</span></h1>
        <p className="text-muted-foreground">Select arena, pick your side, and challenge a playmaker</p>
      </header>

      <Card className="bg-card/50 backdrop-blur-sm border-white/5 overflow-hidden">
        <CardHeader className="border-b bg-secondary/20">
          <CardTitle className="font-headline text-xl uppercase tracking-tighter">Arena Configuration</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-10">
          {/* Step 1: Arena */}
          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase tracking-widest">1. Select Arena</Label>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {sports.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => { setSelectedSport(sport.id); setSelectedEvent(""); setSelectedPick(""); }}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${selectedSport === sport.id ? 'bg-primary/20 border-primary' : 'bg-secondary/30 border-transparent hover:bg-secondary/50'}`}
                >
                  <div className={`mb-2 ${sport.color}`}>{sport.icon}</div>
                  <span className="text-[10px] font-bold uppercase truncate w-full text-center">{sport.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Event */}
          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase tracking-widest">2. Select Event</Label>
            {selectedSport ? (
              <div className="grid gap-3">
                {currentSport?.events.map((event) => (
                  <button key={event.id} onClick={() => setSelectedEvent(event.id)} className={`flex items-center justify-between p-4 rounded-xl border-2 ${selectedEvent === event.id ? 'bg-accent/10 border-accent' : 'bg-secondary/20 border-white/5'}`}>
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5" />
                      <div><p className="font-bold text-sm">{event.name}</p><p className="text-[10px] uppercase">{event.date}</p></div>
                    </div>
                    {selectedEvent === event.id && <CheckCircle2 className="h-5 w-5 text-accent" />}
                  </button>
                ))}
              </div>
            ) : <div className="p-6 text-center bg-secondary/10 rounded-xl border border-dashed opacity-50"><p className="text-xs uppercase">Select an Arena first</p></div>}
          </div>

          {/* Step 3: Pick */}
          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase tracking-widest">3. Pick Your Winner</Label>
            {selectedSport ? (
              <div className="space-y-4">
                <div className="relative">
                  <Target className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search roster..." className="bg-secondary/30 border-white/5 pl-10" value={searchPickQuery} onChange={(e) => setSearchPickQuery(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2 no-scrollbar">
                  {filteredPicks.map((option) => (
                    <button key={option} onClick={() => setSelectedPick(option)} className={`flex items-center justify-between p-3 rounded-lg border text-xs font-bold transition-all ${selectedPick === option ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary/20 border-white/5 hover:bg-white/5'}`}>
                      {option}{selectedPick === option && <CheckCircle2 className="h-3 w-3" />}
                    </button>
                  ))}
                </div>
              </div>
            ) : <div className="p-6 text-center bg-secondary/10 rounded-xl border border-dashed opacity-50"><p className="text-xs uppercase">Choose Arena & Event</p></div>}
          </div>

          {/* Step 4: Stakes */}
          <div className="space-y-6 pt-4 border-t border-white/5">
            <Label className="text-xs font-bold uppercase tracking-widest">4. Set the Stakes</Label>
            <RadioGroup value={currency} className="grid grid-cols-2 gap-4" onValueChange={setCurrency}>
              <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${currency === 'gold' ? 'border-primary bg-primary/5' : 'border-white/5'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <RadioGroupItem value="gold" id="gold" />
                  <Label htmlFor="gold" className="uppercase text-xs font-bold">Gold Coins</Label>
                </div>
                <p className="text-[10px] text-muted-foreground">Social Play Only</p>
              </div>
              <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${currency === 'sweeps' ? 'border-accent bg-accent/5' : 'border-white/5'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <RadioGroupItem value="sweeps" id="sweeps" />
                  <Label htmlFor="sweeps" className="uppercase text-xs font-bold text-accent">Sweeps Coins</Label>
                </div>
                <p className="text-[10px] text-muted-foreground">Prize Showdowns</p>
              </div>
            </RadioGroup>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase">Entry Fee</Label>
              <Select value={fee} onValueChange={setFee}>
                <SelectTrigger className="bg-secondary/30 border-white/5 h-12 font-bold"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="1000">1,000</SelectItem>
                  <SelectItem value="5000">5,000</SelectItem>
                  <SelectItem value="10000">10,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Step 5: Opponent */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <Label className="text-xs font-bold uppercase tracking-widest">5. Select Your Opponent</Label>
            <Input placeholder="Search friends..." className="bg-secondary/30 border-white/5 mb-4" value={searchFriendQuery} onChange={(e) => setSearchFriendQuery(e.target.value)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
              {filteredFriends.map((friend) => (
                <button key={friend.id} onClick={() => setSelectedFriend(friend.id)} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${selectedFriend === friend.id ? 'bg-primary/10 border-primary' : 'bg-secondary/20 border-white/5 hover:bg-white/5'}`}>
                  <Avatar className="h-10 w-10 border border-white/10"><AvatarImage src={friend.avatar} /></Avatar>
                  <div className="flex-1 text-left"><p className="font-bold text-xs truncate">{friend.name}</p></div>
                  {selectedFriend === friend.id && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-secondary/10 border-t p-6 flex flex-col gap-4">
          <Button 
            onClick={handleCreate} 
            className="w-full h-14 font-headline text-xl font-bold uppercase tracking-widest shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90"
          >
            Launch Challenge <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

export default function CreateGamePage() {
  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-background relative overflow-hidden">
      <Navbar />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>}>
        <CreateGameForm />
      </Suspense>
    </div>
  );
}
