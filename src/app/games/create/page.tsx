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
  Loader2,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser, addDocumentNonBlocking, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
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

const PickleballIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 8l8 8" />
    <path d="M16 8l-8 8" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const VolleyballIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 1 0 20" />
    <path d="M2 12a10 10 0 0 1 20 0" />
    <path d="M7 7c2 1 3 3 3 5s-1 4-3 5" />
    <path d="M17 7c-2 1-3 3-3 5s1 4 3 5" />
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
  { 
    id: 'nba', 
    name: 'NBA Arena', 
    icon: <Dribbble className="w-5 h-5" />, 
    color: "text-orange-500", 
    events: [
      { id: 'nba-1', name: "Knicks @ Celtics", date: "Jan 12, 2026" },
      { id: 'nba-2', name: "Lakers @ Warriors", date: "Jan 15, 2026" },
      { id: 'nba-3', name: "Bucks @ 76ers", date: "Jan 18, 2026" },
      { id: 'nba-ny', name: "Nets @ Knicks (NY)", date: "Jan 20, 2026" },
      { id: 'nba-as', name: "All-Star Game 2026", date: "Feb 15, 2026" },
      { id: 'nba-f1', name: "NBA Finals Game 1", date: "Jun 04, 2026" },
    ], 
    options: [
      "Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets", "Chicago Bulls", 
      "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets", "Detroit Pistons", "Golden State Warriors", 
      "Houston Rockets", "Indiana Pacers", "LA Clippers", "LA Lakers", "Memphis Grizzlies", 
      "Miami Heat", "Milwaukee Bucks", "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks", 
      "Oklahoma City Thunder", "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns", "Portland Trail Blazers", 
      "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors", "Utah Jazz", "Washington Wizards"
    ] 
  },
  { 
    id: 'nfl', 
    name: 'NFL Arena', 
    icon: <Trophy className="w-5 h-5" />, 
    color: "text-green-500", 
    events: [
      { id: 'nfl-p1', name: "NFL Wild Card Round", date: "Jan 10, 2026" },
      { id: 'nfl-p2', name: "Divisional Round", date: "Jan 17, 2026" },
      { id: 'nfl-p3', name: "Championship Sunday", date: "Jan 25, 2026" },
      { id: 'nfl-sb', name: "Super Bowl LX (New Orleans)", date: "Feb 08, 2026" },
      { id: 'nfl-w1', name: "Season Opener 2026", date: "Sep 10, 2026" },
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
    id: 'hockey', 
    name: 'NHL Arena', 
    icon: <Snowflake className="w-5 h-5" />, 
    color: "text-cyan-400", 
    events: [
      { id: 'h-1', name: "NHL Winter Classic", date: "Jan 01, 2026" },
      { id: 'h-2', name: "Rangers @ Islanders", date: "Jan 15, 2026" },
      { id: 'h-p', name: "Stanley Cup Playoffs G1", date: "Apr 18, 2026" },
      { id: 'h-f', name: "Stanley Cup Finals G1", date: "Jun 08, 2026" },
    ], 
    options: [
      "Anaheim Ducks", "Arizona Coyotes", "Boston Bruins", "Buffalo Sabres", "Calgary Flames", 
      "Carolina Hurricanes", "Chicago Blackhawks", "Colorado Avalanche", "Columbus Blue Jackets", "Dallas Stars", 
      "Detroit Red Wings", "Edmonton Oilers", "Florida Panthers", "Los Angeles Kings", "Minnesota Wild", 
      "Montreal Canadiens", "Nashville Predators", "New Jersey Devils", "New York Islanders", "New York Rangers", 
      "Ottawa Senators", "Philadelphia Flyers", "Pittsburgh Penguins", "San Jose Sharks", "Seattle Kraken", 
      "St. Louis Blues", "Tampa Bay Lightning", "Toronto Maple Leafs", "Vancouver Canucks", "Vegas Golden Knights", 
      "Washington Capitals", "Winnipeg Jets"
    ] 
  },
  { 
    id: 'soccer', 
    name: 'Soccer Arena', 
    icon: <SoccerIcon className="w-5 h-5" />, 
    color: "text-white", 
    events: [
      { id: 's-1', name: "El Clásico: Madrid vs Barca", date: "Mar 01, 2026" },
      { id: 's-3', name: "Champions League Final", date: "May 30, 2026" },
      { id: 's-4', name: "World Cup 2026: Opening Match", date: "Jun 11, 2026" },
      { id: 's-8', name: "World Cup 2026: Grand Final", date: "Jul 19, 2026" },
    ], 
    options: [
      "USA", "Mexico", "Canada", "Argentina", "Brazil", "England", "France", "Germany", "Spain", "Italy", 
      "Portugal", "Netherlands", "Real Madrid", "Barcelona", "Manchester City", "Liverpool", "Arsenal", 
      "PSG", "Bayern Munich", "Inter Milan", "Juventus", "AC Milan"
    ] 
  },
  { 
    id: 'mlb', 
    name: 'MLB Arena', 
    icon: <BaseballIcon className="w-5 h-5" />, 
    color: "text-blue-500", 
    events: [
      { id: 'm-1', name: "MLB Opening Day 2026", date: "Mar 26, 2026" },
      { id: 'm-4', name: "MLB All-Star Game", date: "Jul 14, 2026" },
      { id: 'm-14', name: "World Series Game 1", date: "Oct 23, 2026" },
    ], 
    options: [
      "Arizona Diamondbacks", "Atlanta Braves", "Baltimore Orioles", "Boston Red Sox", "Chicago Cubs", 
      "Chicago White Sox", "Cincinnati Reds", "Cleveland Guardians", "Colorado Rockies", "Detroit Tigers", 
      "Houston Astros", "Kansas City Royals", "Los Angeles Angels", "Los Angeles Dodgers", "Miami Marlins", 
      "Milwaukee Brewers", "Minnesota Twins", "New York Mets", "New York Yankees", "Oakland Athletics", 
      "Philadelphia Phillies", "Pittsburgh Pirates", "San Diego Padres", "San Francisco Giants", "Seattle Mariners", 
      "St. Louis Cardinals", "Tampa Bay Rays", "Texas Rangers", "Toronto Blue Jays", "Washington Nationals"
    ] 
  },
  { 
    id: 'nascar', 
    name: 'NASCAR Arena', 
    icon: <Flag className="w-5 h-5" />, 
    color: "text-red-500", 
    events: [
      { id: 'nas-1', name: "Daytona 500", date: "Feb 15, 2026" },
      { id: 'nas-6', name: "Talladega Superspeedway", date: "Apr 19, 2026" },
      { id: 'nas-10', name: "Coca-Cola 600", date: "May 24, 2026" },
      { id: 'nas-20', name: "Phoenix Championship", date: "Nov 08, 2026" },
    ], 
    options: [
      "Kyle Larson", "Chase Elliott", "Denny Hamlin", "Ryan Blaney", "William Byron", "Christopher Bell", 
      "Joey Logano", "Martin Truex Jr.", "Tyler Reddick", "Ross Chastain", "Kyle Busch", "Bubba Wallace", 
      "Brad Keselowski", "Ty Gibbs", "Chris Buescher", "Michael McDowell", "Alex Bowman", "Chase Briscoe"
    ] 
  },
  { 
    id: 'golf', 
    name: 'Golf Arena', 
    icon: <Target className="h-5 w-5" />, 
    color: "text-emerald-400", 
    events: [
      { id: 'g-4', name: "The Masters 2026", date: "Apr 09, 2026" },
      { id: 'g-5', name: "PGA Championship", date: "May 14, 2026" },
      { id: 'g-7', name: "U.S. Open 2026", date: "Jun 18, 2026" },
      { id: 'g-10', name: "Ryder Cup 2026 (Ireland)", date: "Sep 25, 2026" },
    ], 
    options: [
      "Scottie Scheffler", "Rory McIlroy", "Jon Rahm", "Viktor Hovland", "Xander Schauffele", "Ludvig Åberg", 
      "Brooks Koepka", "Bryson DeChambeau", "Tiger Woods", "Jordan Spieth", "Justin Thomas", "Max Homa", 
      "Wyndham Clark", "Patrick Cantlay", "Collin Morikawa", "Cameron Smith", "Hideki Matsuyama", "Tommy Fleetwood"
    ] 
  },
  { 
    id: 'ufc', 
    name: 'UFC Arena', 
    icon: <Swords className="w-5 h-5" />, 
    color: "text-red-600", 
    events: [
      { id: 'ufc-300', name: "UFC 300: Global Championship", date: "Apr 11, 2026" },
      { id: 'ufc-302', name: "International Fight Week", date: "Jun 27, 2026" },
      { id: 'ufc-308', name: "Year End Carnage", date: "Dec 12, 2026" },
    ], 
    options: [
      "Jon Jones", "Alex Pereira", "Islam Makhachev", "Leon Edwards", "Sean O'Malley", "Conor McGregor", 
      "Ilia Topuria", "Dustin Poirier", "Max Holloway", "Israel Adesanya", "Tom Aspinall", "Charles Oliveira", 
      "Justin Gaethje", "Alexandre Pantoja", "Dricus Du Plessis", "Sean Strickland", "Khamzat Chimaev"
    ] 
  },
  { 
    id: 'boxing', 
    name: 'Boxing', 
    icon: <BoxingIcon className="w-5 h-5" />, 
    color: "text-yellow-600", 
    events: [
      { id: 'box-1', name: "Fury vs Usyk III", date: "Feb 21, 2026" },
      { id: 'box-2', name: "Canelo vs Benavidez", date: "May 02, 2026" },
      { id: 'box-3', name: "Davis vs Garcia II", date: "Jul 11, 2026" },
    ], 
    options: [
      "Tyson Fury", "Oleksandr Usyk", "Canelo Alvarez", "Gervonta Davis", "Terence Crawford", "Naoya Inoue", 
      "Anthony Joshua", "Ryan Garcia", "Shakur Stevenson", "Devin Haney", "Artur Beterbiev", "Dmitry Bivol", 
      "Jaron Ennis", "Vergil Ortiz Jr.", "Jesse Rodriguez", "Isaac Cruz"
    ] 
  },
  { 
    id: 'pickleball', 
    name: 'Pickleball', 
    icon: <PickleballIcon className="w-5 h-5" />, 
    color: "text-yellow-500", 
    events: [
      { id: 'pb-1', name: "PPA Florida Open", date: "Feb 12, 2026" },
      { id: 'pb-2', name: "US Open Pickleball Championship", date: "Apr 18, 2026" },
      { id: 'pb-4', name: "PPA World Finals", date: "Dec 05, 2026" },
    ], 
    options: [
      "Ben Johns", "Anna Leigh Waters", "Tyson McGuffin", "Lea Jansen", "Catherine Parenteau", "Riley Newman", 
      "JW Johnson", "Dylan Frazier", "Federico Staksrud", "Mary Brascia", "Christian Alshon", "Lucy Kovalova"
    ] 
  },
  { 
    id: 'volleyball', 
    name: 'Volleyball', 
    icon: <VolleyballIcon className="w-5 h-5" />, 
    color: "text-indigo-400", 
    events: [
      { id: 'vb-1', name: "Nations League Finals", date: "Jul 08, 2026" },
      { id: 'vb-2', name: "World Beach Tour: Gstaad", date: "Aug 15, 2026" },
      { id: 'vb-4', name: "Club World Championship", date: "Dec 14, 2026" },
    ], 
    options: [
      "USA", "Poland", "Brazil", "Turkey", "Italy", "Japan", "Serbia", "China", "France", "Slovenia", 
      "Netherlands", "Dominican Republic", "Germany", "Canada", "Argentina"
    ] 
  },
  { 
    id: 'surfing', 
    name: 'Surfing', 
    icon: <Waves className="w-5 h-5" />, 
    color: "text-blue-400", 
    events: [
      { id: 'surf-1', name: "WSL: Pipeline Pro", date: "Jan 29, 2026" },
      { id: 'surf-3', name: "WSL: Tahiti Pro", date: "Aug 20, 2026" },
      { id: 'surf-4', name: "WSL Finals: Lower Trestles", date: "Sep 15, 2026" },
    ], 
    options: [
      "John John Florence", "Gabriel Medina", "Carissa Moore", "Caroline Marks", "Griffin Colapinto", 
      "Italo Ferreira", "Filipe Toledo", "Jack Robinson", "Ethan Ewing", "Molly Picklum", "Caitlin Simmers", 
      "Tyler Wright", "Brisa Hennessy", "Tatiana Weston-Webb"
    ] 
  },
  { 
    id: 'skateboarding', 
    name: 'Skate', 
    icon: <Zap className="w-5 h-5" />, 
    color: "text-yellow-400", 
    events: [
      { id: 'skate-1', name: "X Games Japan: Street Finals", date: "May 15, 2026" },
      { id: 'skate-2', name: "Street League: Chicago", date: "Jul 22, 2026" },
      { id: 'skate-3', name: "X Games California: Vert", date: "Sep 10, 2026" },
    ], 
    options: [
      "Nyjah Huston", "Yuto Horigome", "Rayssa Leal", "Sky Brown", "Tony Hawk (Legend)", "Leticia Bufoni", 
      "Jagger Eaton", "Ginwoo Onodera", "Chloe Covell", "Arisa Trew", "Kelvin Hoefler", "Aurélien Giraud"
    ] 
  },
  { 
    id: 'bmx', 
    name: 'BMX', 
    icon: <Bike className="w-5 h-5" />, 
    color: "text-red-400", 
    events: [
      { id: 'bmx-1', name: "UCI Freestyle World Cup", date: "Jun 04, 2026" },
      { id: 'bmx-2', name: "BMX Dirt Open: Austin", date: "Aug 22, 2026" },
      { id: 'bmx-3', name: "X Games: BMX Park Finals", date: "Sep 12, 2026" },
    ], 
    options: [
      "Logan Martin", "Marcus Christopher", "Hannah Roberts", "Ryan Williams", "Kieran Reilly", "Jose Torres", 
      "Anthony Jeanjean", "Marin Rantes", "Natalya Diehm", "Rim Nakamura", "Justin Dowell", "Declan Brooks"
    ] 
  },
  { 
    id: 'snowboarding', 
    name: 'Snowboard', 
    icon: <Mountain className="w-5 h-5" />, 
    color: "text-cyan-400", 
    events: [
      { id: 'snow-1', name: "Burton US Open", date: "Mar 05, 2026" },
      { id: 'snow-2', name: "X Games Aspen: Slopestyle", date: "Jan 23, 2026" },
    ], 
    options: [
      "Shaun White", "Chloe Kim", "Mark McMorris", "Zoi Sadowski-Synnott", "Marcus Kleveland", "Ayumu Hirano", 
      "Valentino Guseli", "Red Gerard", "Su Yiming", "Anna Gasser", "Dusty Henricksen", "Mons Roisland"
    ] 
  },
];

function CreateGameForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const { friends, isLoaded: isFriendsLoaded } = useFriendsStore();
  
  const userProfileRef = useMemoFirebase(() => (user ? doc(db, "userProfiles", user.uid) : null), [db, user]);
  const { data: profile } = useDoc(userProfileRef);

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
    const available = currency === "gold" ? (profile?.goldCoinsBalance ?? 0) : (profile?.sweepstakesCoinsBalance ?? 0);

    if (cost > available) {
      toast({ variant: "destructive", title: "Insufficient Funds", description: "Check your arena bank balance. You need more coins to enter." });
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
            ) : <div className="p-6 text-center bg-secondary/10 rounded-xl border border-dashed opacity-50"><p className="text-xs uppercase">Select an Arena first</p></div>}
          </div>

          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase tracking-widest">3. Pick Your Winner</Label>
            {selectedSport ? (
              <div className="space-y-4">
                <div className="relative">
                  <Target className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search roster (e.g. Lakers, Jon Jones...)" className="bg-secondary/30 border-white/5 pl-10 h-12" value={searchPickQuery} onChange={(e) => setSearchPickQuery(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                  {filteredPicks.map((option) => (
                    <button key={option} onClick={() => setSelectedPick(option)} className={`flex items-center justify-between p-4 rounded-lg border text-xs font-bold transition-all ${selectedPick === option ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary/20 border-white/5 hover:bg-white/5'}`}>
                      {option}{selectedPick === option && <CheckCircle2 className="h-3 w-3" />}
                    </button>
                  ))}
                  {filteredPicks.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground italic">No results found for "{searchPickQuery}"</div>
                  )}
                </div>
              </div>
            ) : <div className="p-6 text-center bg-secondary/10 rounded-xl border border-dashed opacity-50"><p className="text-xs uppercase">Choose Arena & Event</p></div>}
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

          <div className="space-y-4 pt-4 border-t border-white/5">
            <Label className="text-xs font-bold uppercase tracking-widest">5. Select Your Opponent</Label>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search friends..." className="bg-secondary/30 border-white/5 pl-10 h-12" value={searchFriendQuery} onChange={(e) => setSearchFriendQuery(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
              {filteredFriends.map((friend) => (
                <button key={friend.id} onClick={() => setSelectedFriend(friend.id)} className={`flex items-center justify-3 p-3 rounded-xl border-2 transition-all ${selectedFriend === friend.id ? 'bg-primary/10 border-primary' : 'bg-secondary/20 border-white/5 hover:bg-white/5'}`}>
                  <Avatar className="h-10 w-10 border border-white/10"><AvatarImage src={friend.avatar} /></Avatar>
                  <div className="flex-1 text-left ml-3"><p className="font-bold text-xs truncate">{friend.name}</p></div>
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