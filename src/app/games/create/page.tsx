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
  { 
    id: 'nba', 
    name: 'NBA', 
    icon: <Dribbble className="w-5 h-5" />, 
    color: "text-orange-500", 
    events: [
      { id: 'nba-2026-001', name: "Nuggets @ Thunder", date: "Jan 01, 2026" },
      { id: 'nba-2026-002', name: "Heat @ Knicks", date: "Jan 05, 2026" },
      { id: 'nba-2026-003', name: "Bucks @ Celtics", date: "Jan 12, 2026" },
      { id: 'nba-2026-004', name: "Lakers @ Warriors", date: "Jan 15, 2026" },
      { id: 'nba-2026-005', name: "MLK Day: Grizzlies @ Mavericks", date: "Jan 19, 2026" },
      { id: 'nba-2026-006', name: "MLK Day: Lakers @ Celtics", date: "Jan 19, 2026" },
      { id: 'nba-2026-007', name: "MLK Day: Sixers @ Hawks", date: "Jan 19, 2026" },
      { id: 'nba-2026-008', name: "Clippers @ Suns", date: "Jan 25, 2026" },
      { id: 'nba-2026-009', name: "Timberwolves @ Nuggets", date: "Feb 02, 2026" },
      { id: 'nba-2026-010', name: "Cavaliers @ Knicks", date: "Feb 08, 2026" },
      { id: 'nba-2026-allstar', name: "NBA All-Star Game 2026", date: "Feb 15, 2026" },
      { id: 'nba-2026-011', name: "Warriors @ Lakers", date: "Mar 10, 2026" },
      { id: 'nba-2026-012', name: "Celtics @ Nuggets", date: "Mar 15, 2026" },
      { id: 'nba-2026-013', name: "Thunder @ Spurs", date: "Mar 22, 2026" },
      { id: 'nba-2026-014', name: "Mavericks @ Kings", date: "Apr 01, 2026" },
      { id: 'nba-2026-reg-end', name: "Regular Season Finale: Multi-Game", date: "Apr 12, 2026" },
      { id: 'nba-2026-playin', name: "NBA Play-In Tournament", date: "Apr 14, 2026" },
      { id: 'nba-2026-playoffs', name: "NBA Playoffs Round 1 Begins", date: "Apr 18, 2026" },
      { id: 'nba-2026-semis', name: "Conference Semifinals", date: "May 04, 2026" },
      { id: 'nba-2026-finals-begin', name: "NBA Finals Game 1", date: "Jun 04, 2026" },
      { id: 'nba-2026-finals-mid', name: "NBA Finals Game 4", date: "Jun 11, 2026" },
      { id: 'nba-2026-finals-end', name: "NBA Finals Game 7 (Potential)", date: "Jun 18, 2026" },
      { id: 'nba-2026-tipoff-1', name: "Opening Night: Spurs @ Thunder", date: "Oct 20, 2026" },
      { id: 'nba-2026-tipoff-2', name: "Opening Night: Knicks @ Celtics", date: "Oct 20, 2026" },
      { id: 'nba-2026-xmas-1', name: "Xmas: Celtics @ Sixers", date: "Dec 25, 2026" },
      { id: 'nba-2026-xmas-2', name: "Xmas: Lakers @ Warriors", date: "Dec 25, 2026" },
      { id: 'nba-2026-xmas-3', name: "Xmas: Nuggets @ Mavericks", date: "Dec 25, 2026" },
      { id: 'nba-2026-xmas-4', name: "Xmas: Bucks @ Knicks", date: "Dec 25, 2026" },
      { id: 'nba-2026-xmas-5', name: "Xmas: Suns @ Suns", date: "Dec 25, 2026" },
    ], 
    options: ["Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets", "Chicago Bulls", "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets", "Detroit Pistons", "Golden State Warriors", "Houston Rockets", "Indiana Pacers", "LA Clippers", "LA Lakers", "Memphis Grizzlies", "Miami Heat", "Milwaukee Bucks", "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks", "Oklahoma City Thunder", "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns", "Portland Trail Blazers", "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors", "Utah Jazz", "Washington Wizards"] 
  },
  { 
    id: 'nfl', 
    name: 'NFL', 
    icon: <Trophy className="w-5 h-5" />, 
    color: "text-green-500", 
    events: [
      { id: 'nfl-2026-wildcard-1', name: "Wild Card Weekend: Sat/Sun Slate", date: "Jan 10-11, 2026" },
      { id: 'nfl-2026-wildcard-2', name: "Wild Card Monday Night Finale", date: "Jan 12, 2026" },
      { id: 'nfl-2026-divisional-1', name: "Divisional Round: AFC Showdowns", date: "Jan 17, 2026" },
      { id: 'nfl-2026-divisional-2', name: "Divisional Round: NFC Showdowns", date: "Jan 18, 2026" },
      { id: 'nfl-2026-conference-afc', name: "AFC Championship Game", date: "Jan 25, 2026" },
      { id: 'nfl-2026-conference-nfc', name: "NFC Championship Game", date: "Jan 25, 2026" },
      { id: 'nfl-2026-probowl', name: "The Pro Bowl Games 2026", date: "Feb 01, 2026" },
      { id: 'nfl-sb-lx', name: "Super Bowl LX (New Orleans, LA)", date: "Feb 08, 2026" },
      { id: 'nfl-2026-draft', name: "2026 NFL Draft Day 1", date: "Apr 23, 2026" },
      { id: 'nfl-2026-hof', name: "Hall of Fame Game (Canton, OH)", date: "Aug 06, 2026" },
      { id: 'nfl-2026-kickoff', name: "NFL Season Opener (KC Chiefs Hosted)", date: "Sep 10, 2026" },
      { id: 'nfl-2026-week1-sun', name: "Week 1 Sunday Ticket Slate", date: "Sep 13, 2026" },
      { id: 'nfl-2026-week1-mon', name: "Week 1 Monday Night Football", date: "Sep 14, 2026" },
      { id: 'nfl-2026-intl-london', name: "London Games Series 2026", date: "Oct 18, 2026" },
      { id: 'nfl-2026-intl-germany', name: "Germany Games Series 2026", date: "Nov 08, 2026" },
      { id: 'nfl-2026-thanksgiving-1', name: "Thanksgiving: Lions Hosted Match", date: "Nov 26, 2026" },
      { id: 'nfl-2026-thanksgiving-2', name: "Thanksgiving: Cowboys Hosted Match", date: "Nov 26, 2026" },
      { id: 'nfl-2026-thanksgiving-3', name: "Thanksgiving: Night Showdown", date: "Nov 26, 2026" },
      { id: 'nfl-2026-xmas-fri', name: "Christmas Day: Friday Football Slate", date: "Dec 25, 2026" },
    ], 
    options: ["Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills", "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns", "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers", "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs", "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins", "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants", "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers", "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"] 
  },
  { id: 'hockey', name: 'NHL', icon: <Snowflake className="w-5 h-5" />, color: "text-cyan-400", events: [{ id: 'h-1', name: "NHL Winter Classic", date: "Jan 01, 2026" }], options: ["Anaheim Ducks", "Arizona Coyotes", "Boston Bruins", "Buffalo Sabres", "Calgary Flames", "Carolina Hurricanes", "Chicago Blackhawks", "Colorado Avalanche", "Columbus Blue Jackets", "Dallas Stars", "Detroit Red Wings", "Edmonton Oilers", "Florida Panthers", "Los Angeles Kings", "Minnesota Wild", "Montreal Canadiens", "Nashville Predators", "New Jersey Devils", "New York Islanders", "New York Rangers", "Ottawa Senators", "Philadelphia Flyers", "Pittsburgh Penguins", "San Jose Sharks", "Seattle Kraken", "St. Louis Blues", "Tampa Bay Lightning", "Toronto Maple Leafs", "Vancouver Canucks", "Vegas Golden Knights", "Washington Capitals", "Winnipeg Jets"] },
  { id: 'soccer', name: 'Soccer', icon: <SoccerIcon className="w-5 h-5" />, color: "text-white", events: [{ id: 's-4', name: "World Cup 2026: Opening Match", date: "Jun 11, 2026" }], options: ["USA", "Mexico", "Canada", "Argentina", "Brazil", "England", "France", "Germany", "Spain", "Italy", "Portugal", "Netherlands", "Real Madrid", "Barcelona", "Manchester City", "Liverpool", "Arsenal", "PSG", "Bayern Munich", "Inter Milan", "Juventus", "AC Milan"] },
  { id: 'ufc', name: 'UFC', icon: <Swords className="w-5 h-5" />, color: "text-red-600", events: [{ id: 'ufc-300', name: "UFC 300: Global Championship", date: "Apr 11, 2026" }], options: ["Jon Jones", "Alex Pereira", "Islam Makhachev", "Leon Edwards", "Sean O'Malley", "Conor McGregor", "Ilia Topuria", "Dustin Poirier", "Max Holloway", "Israel Adesanya", "Tom Aspinall", "Charles Oliveira", "Justin Gaethje", "Alexandre Pantoja", "Dricus Du Plessis", "Sean Strickland", "Khamzat Chimaev"] },
  { id: 'boxing', name: 'Boxing', icon: <BoxingIcon className="w-5 h-5" />, color: "text-yellow-600", events: [{ id: 'box-1', name: "Heavyweight Title Unification", date: "Mar 14, 2026" }], options: ["Tyson Fury", "Oleksandr Usyk", "Anthony Joshua", "Canelo Alvarez", "Terence Crawford", "Naoya Inoue", "Gervonta Davis", "Shakur Stevenson", "Artur Beterbiev", "Dmitry Bivol", "Devin Haney", "Ryan Garcia"] },
  { id: 'mlb', name: 'MLB', icon: <Trophy className="w-5 h-5" />, color: "text-blue-500", events: [{ id: 'm-1', name: "MLB Opening Day 2026", date: "Mar 26, 2026" }], options: ["Arizona Diamondbacks", "Atlanta Braves", "Baltimore Orioles", "Boston Red Sox", "Chicago Cubs", "Chicago White Sox", "Cincinnati Reds", "Cleveland Guardians", "Colorado Rockies", "Detroit Tigers", "Houston Astros", "Kansas City Royals", "Los Angeles Angels", "Los Angeles Dodgers", "Miami Marlins", "Milwaukee Brewers", "Minnesota Twins", "New York Mets", "New York Yankees", "Oakland Athletics", "Philadelphia Phillies", "Pittsburgh Pirates", "San Diego Padres", "San Francisco Giants", "Seattle Mariners", "St. Louis Cardinals", "Tampa Bay Rays", "Texas Rangers", "Toronto Blue Jays", "Washington Nationals"] },
  { id: 'tennis', name: 'Tennis', icon: <Target className="w-5 h-5" />, color: "text-lime-400", events: [{ id: 'ten-1', name: "Australian Open Final", date: "Jan 25, 2026" }], options: ["Novak Djokovic", "Carlos Alcaraz", "Jannik Sinner", "Daniil Medvedev", "Alexander Zverev", "Iga Swiatek", "Aryna Sabalenka", "Coco Gauff", "Elena Rybakina", "Jessica Pegula"] },
  { id: 'pickleball', name: 'Pickleball', icon: <Trophy className="w-5 h-5" />, color: "text-yellow-500", events: [{ id: 'pb-1', name: "PPA Masters", date: "Jan 15, 2026" }], options: ["Ben Johns", "Anna Leigh Waters", "Tyson McGuffin", "Lea Jansen", "Riley Newman", "Catherine Parenteau", "JW Johnson", "Dylan Frazier", "Anna Bright"] },
  { id: 'volleyball', name: 'Volleyball', icon: <Trophy className="w-5 h-5" />, color: "text-indigo-400", events: [{ id: 'v-1', name: "Nations League Finals", date: "Jul 05, 2026" }], options: ["USA", "Poland", "Brazil", "Turkey", "Italy", "Japan", "Serbia", "China", "France", "Slovenia"] },
  { id: 'surfing', name: 'Surfing', icon: <Waves className="w-5 h-5" />, color: "text-blue-400", events: [{ id: 'surf-1', name: "Pipe Masters (Oahu)", date: "Jan 29, 2026" }], options: ["John John Florence", "Gabriel Medina", "Filipe Toledo", "Italo Ferreira", "Jack Robinson", "Carissa Moore", "Caroline Marks", "Tyler Wright", "Stephanie Gilmore", "Molly Picklum"] },
  { id: 'skateboarding', name: 'Skateboarding', icon: <Zap className="w-5 h-5" />, color: "text-yellow-400", events: [{ id: 'sk-1', name: "X-Games Summer (CA)", date: "Jul 20, 2026" }], options: ["Nyjah Huston", "Yuto Horigome", "Sky Brown", "Rayssa Leal", "Kelvin Hoefler", "Leticia Bufoni", "Shane O'Neill", "Aurelien Giraud", "Chloe Covell"] },
  { id: 'bmx', name: 'BMX', icon: <Bike className="w-5 h-5" />, color: "text-red-400", events: [{ id: 'bmx-1', name: "UCI World Cup Final", date: "May 24, 2026" }], options: ["Logan Martin", "Garrett Reynolds", "Hannah Roberts", "Charlotte Worthington", "Rim Nakamura", "Anthony Jeanjean", "Declan Brooks", "Nikita Ducarroz"] },
  { id: 'snowboarding', name: 'Snowboarding', icon: <Mountain className="w-5 h-5" />, color: "text-cyan-400", events: [{ id: 'snow-1', name: "X-Games Aspen", date: "Jan 23, 2026" }], options: ["Chloe Kim", "Mark McMorris", "Shaun White (Ret.)", "Ayumu Hirano", "Anna Gasser", "Red Gerard", "Su Yiming", "Zoi Sadowski-Synnott", "Valentino Guseli"] },
  { id: 'nascar', name: 'NASCAR', icon: <Flag className="w-5 h-5" />, color: "text-red-500", events: [{ id: 'nas-1', name: "Daytona 500", date: "Feb 15, 2026" }], options: ["Kyle Larson", "Chase Elliott", "Denny Hamlin", "Ryan Blaney", "William Byron", "Christopher Bell", "Joey Logano", "Martin Truex Jr.", "Tyler Reddick", "Ross Chastain", "Kyle Busch", "Bubba Wallace", "Brad Keselowski", "Ty Gibbs", "Chris Buescher", "Michael McDowell", "Alex Bowman", "Chase Briscoe"] },
  { id: 'golf', name: 'Golf', icon: <Target className="h-5 w-5" />, color: "text-emerald-400", events: [{ id: 'g-4', name: "The Masters 2026", date: "Apr 09, 2026" }], options: ["Scottie Scheffler", "Rory McIlroy", "Jon Rahm", "Viktor Hovland", "Xander Schauffele", "Ludvig Åberg", "Brooks Koepka", "Bryson DeChambeau", "Tiger Woods", "Jordan Spieth", "Justin Thomas", "Max Homa", "Wyndham Clark", "Patrick Cantlay", "Collin Morikawa", "Cameron Smith", "Hideki Matsuyama", "Tommy Fleetwood"] },
];

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
    if (sportId && !selectedSport && sports.some(s => s.id === sportId)) {
      setSelectedSport(sportId);
    }
  }, [searchParams, availableFriends.length, isProfileLoading, isUsersLoading, selectedFriend, selectedSport]);

  const currentSport = sports.find(s => s.id === selectedSport);
  const filteredPicks = currentSport?.options.filter(option => option.toLowerCase().includes(searchPickQuery.toLowerCase())) || [];
  const filteredFriends = availableFriends.filter(friend => (friend.username || friend.name || "").toLowerCase().includes(searchFriendQuery.toLowerCase()));

  const entryAmount = parseFloat(fee) || 0;
  // Standardizing 100:1 ratio - GC matching provides SC prize
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

          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase tracking-widest">2. Select Event</Label>
            {selectedSport ? (
              <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                {currentSport?.events.map((event) => (
                  <button key={event.id} onClick={() => setSelectedEvent(event.id)} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedEvent === event.id ? 'bg-accent/10 border-accent' : 'bg-secondary/20 border-white/5 hover:border-white/10'}`}>
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5" />
                      <div><p className="font-bold text-sm">{event.name}</p><p className="text-[10px] uppercase text-muted-foreground">{event.date}</p></div>
                    </div>
                    {selectedEvent === event.id && <CheckCircle2 className="h-5 w-5 text-accent" />}
                  </button>
                ))}
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
            
            <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 flex items-center gap-4 mb-2">
              <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Unified Ratio: 100 Coins = $1.00</p>
                <p className="text-xs text-white/80 leading-relaxed">
                  Stakes and prizes follow the 100:1 ratio. Win prize-eligible Sweeps Coins through social or competitive play.
                </p>
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
