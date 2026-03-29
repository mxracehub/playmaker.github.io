
"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
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
  Loader2,
  Search,
  Timer,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser, addDocumentNonBlocking, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { HOUSE_ADMIN } from "@/hooks/use-friends-store";
import { sendChallengeEmail } from "@/ai/flows/send-challenge-email-flow";
import { sportsData } from "@/app/lib/schedules";

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

// Map icon names from the library to components
const IconMap: Record<string, React.ReactNode> = {
  Dribbble: <Dribbble className="w-5 h-5" />,
  Trophy: <Trophy className="w-5 h-5" />,
  Snowflake: <Snowflake className="w-5 h-5" />,
  Swords: <Swords className="w-5 h-5" />,
  Flag: <Flag className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  Waves: <Waves className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Bike: <Bike className="w-5 h-5" />,
  Mountain: <Mountain className="w-5 h-5" />,
};

function CreateGameForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  
  const userProfileRef = useMemoFirebase(() => (user ? doc(db, "userProfiles", user.uid) : null), [db, user]);
  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const allUsersQuery = useMemoFirebase(() => collection(db, "userProfiles"), [db]);
  const { data: allUsers, isLoading: isUsersLoading } = useCollection(allUsersQuery);

  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [selectedPick, setSelectedPick] = useState<string>("");
  const [selectedFriend, setSelectedFriend] = useState<string>("");
  const [searchFriendQuery, setSearchFriendQuery] = useState("");
  const [searchPickQuery, setSearchPickQuery] = useState("");
  const [searchEventQuery, setSearchEventQuery] = useState("");
  const [currency, setCurrency] = useState("gold");
  const [fee, setFee] = useState("1000");

  const availableFriends = useMemo(() => {
    if (!allUsers || !profile) return [HOUSE_ADMIN];
    const userFriends = allUsers.filter(u => (profile.friendIds || []).includes(u.id));
    return [HOUSE_ADMIN, ...userFriends];
  }, [allUsers, profile]);

  useEffect(() => {
    if (isProfileLoading || isUsersLoading) return;
    const friendId = searchParams.get('friendId');
    if (friendId && !selectedFriend && (availableFriends.some(f => f.id === friendId))) {
      setSelectedFriend(friendId);
    }
    const sportId = searchParams.get('sport');
    if (sportId && !selectedSport && sportsData.some(s => s.id === sportId)) {
      setSelectedSport(sportId);
    }
  }, [searchParams, availableFriends.length, isProfileLoading, isUsersLoading, selectedFriend, selectedSport]);

  const currentSport = sportsData.find(s => s.id === selectedSport);
  const filteredPicks = currentSport?.options.filter(option => option.toLowerCase().includes(searchPickQuery.toLowerCase())) || [];
  const filteredFriends = availableFriends.filter(friend => (friend.username || friend.name || "").toLowerCase().includes(searchFriendQuery.toLowerCase()));
  const filteredEvents = currentSport?.events.filter(event => event.name.toLowerCase().includes(searchEventQuery.toLowerCase())) || [];

  const entryAmount = parseFloat(fee) || 0;
  const prizeInCoins = entryAmount * 2;
  const prizeInUSD = (prizeInCoins / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const handleCreate = () => {
    if (!user) {
      toast({ variant: "destructive", title: "Authentication Required", description: "Sign in to launch a challenge." });
      return;
    }

    if (!selectedSport || !selectedEvent || !selectedPick || !selectedFriend) {
      toast({ variant: "destructive", title: "Missing Information", description: "Complete all steps to launch challenge." });
      return;
    }

    const cost = parseFloat(fee);
    const available = currency === "gold" ? (profile?.goldCoinsBalance ?? 0) : (profile?.sweepstakesCoinsBalance ?? 0);

    if (cost > available) {
      toast({ variant: "destructive", title: "Insufficient Funds", description: "Check your vault balance. You need more coins to enter." });
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
      prizePool: prizeInCoins,
      prizeCurrency: "sweeps", 
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
            challengerName: profile?.username || user.displayName || user.email || 'A Playmaker',
            opponentEmail: opponent.email || `${opponent.id}@playmakers.arena`,
            sport: currentSport?.name || 'Sports',
            eventName: eventName,
            stakes: `${fee} ${currency.toUpperCase()}`,
            inviteCode: inviteCode,
          });
        }
        router.push(`/games/${docRef?.id}`);
      });
  };

  if (isProfileLoading || isUsersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-12 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-6">
          <Gamepad2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold uppercase tracking-tight mb-2">Create <span className="text-accent">Game</span></h1>
        <p className="text-muted-foreground">Select sport, pick your side, and challenge a playmaker</p>
      </header>

      <Card className="bg-card/50 backdrop-blur-sm border-white/5 overflow-hidden">
        <CardHeader className="border-b bg-secondary/20">
          <CardTitle className="font-headline text-xl uppercase tracking-tighter">Configuration</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-10">
          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase tracking-widest">1. Select Sport</Label>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {sportsData.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => { setSelectedSport(sport.id); setSelectedEvent(""); setSelectedPick(""); setSelectedPick(""); setSearchEventQuery(""); }}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${selectedSport === sport.id ? 'bg-primary/20 border-primary' : 'bg-secondary/30 border-transparent hover:bg-secondary/50'}`}
                >
                  <div className={`mb-2 ${sport.color}`}>
                    {IconMap[sport.icon] || <Trophy className="w-5 h-5" />}
                  </div>
                  <span className="text-[10px] font-bold uppercase truncate w-full text-center">{sport.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase tracking-widest">2. Select Event</Label>
            {selectedSport ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search events (e.g. Broncos, Week 1, Rockies)..." 
                    className="bg-secondary/30 border-white/5 pl-10 h-12" 
                    value={searchEventQuery} 
                    onChange={(e) => setSearchEventQuery(e.target.value)} 
                  />
                </div>
                
                <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                  <div className="bg-accent/5 border border-accent/20 p-3 rounded-xl mb-2">
                    <p className="text-[10px] text-accent font-bold uppercase tracking-widest text-center">Available Slates: {filteredEvents.length}</p>
                  </div>
                  {filteredEvents.map((event) => (
                    <button key={event.id} onClick={() => setSelectedEvent(event.id)} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedEvent === event.id ? 'bg-accent/10 border-accent' : 'bg-secondary/20 border-white/5 hover:border-white/10'}`}>
                      <div className="flex items-center gap-3">
                        <CalendarDays className="h-5 w-5" />
                        <div className="text-left">
                          <p className="font-bold text-sm">{event.name}</p>
                          <p className="text-[10px] uppercase text-muted-foreground">{event.date}</p>
                        </div>
                      </div>
                      {selectedEvent === event.id && <CheckCircle2 className="h-5 w-5 text-accent" />}
                    </button>
                  ))}
                  {filteredEvents.length === 0 && (
                    <div className="py-10 text-center opacity-40">
                      <p className="text-xs font-bold uppercase italic">No events matching your search</p>
                    </div>
                  )}
                </div>
              </div>
            ) : <div className="p-6 text-center bg-secondary/10 rounded-xl border border-dashed opacity-50"><p className="text-xs uppercase">Select a Sport first</p></div>}
          </div>

          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase tracking-widest">3. Pick Your Winner</Label>
            {selectedSport ? (
              <div className="space-y-4">
                <div className="relative">
                  <Target className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search roster..." className="bg-secondary/30 border-white/5 pl-10 h-12" value={searchPickQuery} onChange={(e) => setSearchPickQuery(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                  {filteredPicks.map((option) => (
                    <button key={option} onClick={() => setSelectedPick(option)} className={`flex items-center justify-between p-4 rounded-lg border text-xs font-bold transition-all ${selectedPick === option ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary/20 border-white/5 hover:bg-white/5'}`}>
                      {option}{selectedPick === option && <CheckCircle2 className="h-3 w-3" />}
                    </button>
                  ))}
                </div>
              </div>
            ) : <div className="p-6 text-center bg-secondary/10 rounded-xl border border-dashed opacity-50"><p className="text-xs uppercase">Choose Sport & Event</p></div>}
          </div>

          <div className="space-y-6 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-widest">4. Set the Stakes</Label>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">
                Available: <span className="text-white">{currency === 'gold' ? (profile?.goldCoinsBalance ?? 0).toLocaleString() : (profile?.sweepstakesCoinsBalance ?? 0).toFixed(2)}</span>
              </div>
            </div>
            
            <RadioGroup value={currency} className="grid grid-cols-2 gap-4" onValueChange={setCurrency}>
              <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${currency === 'gold' ? 'border-primary bg-primary/5' : 'border-white/5'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <RadioGroupItem value="gold" id="gold" />
                  <Label htmlFor="gold" className="uppercase text-xs font-bold">Gold Coins</Label>
                </div>
                <p className="text-[10px] text-muted-foreground">Social Stakes • $1 = 100 GC</p>
              </div>
              <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${currency === 'sweeps' ? 'border-accent bg-accent/5' : 'border-white/5'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <RadioGroupItem value="sweeps" id="sweeps" />
                  <Label htmlFor="sweeps" className="uppercase text-xs font-bold text-accent">Sweeps Coins</Label>
                </div>
                <p className="text-[10px] text-muted-foreground">Prize Stakes • $1 = 100 SC</p>
              </div>
            </RadioGroup>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase">Entry Fee (Per Player)</Label>
                <Select value={fee} onValueChange={setFee}>
                  <SelectTrigger className="bg-secondary/30 border-white/5 h-12 font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {currency === 'gold' ? (
                      <>
                        <SelectItem value="1000">1,000 GC ($10.00)</SelectItem>
                        <SelectItem value="5000">5,000 GC ($50.00)</SelectItem>
                        <SelectItem value="10000">10,000 GC ($100.00)</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="1000">1,000 SC ($10.00)</SelectItem>
                        <SelectItem value="5000">5,000 SC ($50.00)</SelectItem>
                        <SelectItem value="10000">10,000 SC ($100.00)</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-4 rounded-xl bg-secondary/20 border border-white/5 text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Reward Pool</p>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 text-accent font-headline font-bold text-2xl">
                    <Trophy className="h-5 w-5" />
                    {prizeInCoins.toLocaleString()} SC
                  </div>
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-tighter">Value: {prizeInUSD}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <Label className="text-xs font-bold uppercase tracking-widest">5. Select Your Opponent</Label>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search friends..." className="bg-secondary/30 border-white/5 pl-10 h-12" value={searchFriendQuery} onChange={(e) => setSearchFriendQuery(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
              {filteredFriends.map((friend) => (
                <button key={friend.id} onClick={() => setSelectedFriend(friend.id)} className={`flex items-center justify-3 p-3 rounded-xl border-2 transition-all ${selectedFriend === friend.id ? 'bg-primary/10 border-primary' : 'bg-secondary/20 border-white/5 hover:bg-white/5'}`}>
                  <Avatar className="h-10 w-10 border border-white/10"><AvatarImage src={friend.profilePictureUrl || friend.avatar} /></Avatar>
                  <div className="flex-1 text-left ml-3"><p className="font-bold text-xs truncate">{friend.username || friend.name}</p></div>
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
