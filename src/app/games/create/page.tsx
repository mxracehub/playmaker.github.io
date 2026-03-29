
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
      { id: 'nba-26-01', name: "Nuggets @ Thunder", date: "Jan 01, 2026" },
      { id: 'nba-26-02', name: "Heat @ Knicks", date: "Jan 05, 2026" },
      { id: 'nba-26-03', name: "Bucks @ Celtics", date: "Jan 12, 2026" },
      { id: 'nba-26-04', name: "Lakers @ Warriors", date: "Jan 15, 2026" },
      { id: 'nba-26-mlk-1', name: "MLK Day: Grizzlies @ Mavericks", date: "Jan 19, 2026" },
      { id: 'nba-26-mlk-2', name: "MLK Day: Lakers @ Celtics", date: "Jan 19, 2026" },
      { id: 'nba-26-05', name: "76ers @ Suns", date: "Jan 22, 2026" },
      { id: 'nba-26-06', name: "Clippers @ Timberwolves", date: "Jan 28, 2026" },
      { id: 'nba-26-allstar', name: "NBA All-Star Game 2026 (Phoenix)", date: "Feb 15, 2026" },
      { id: 'nba-26-08', name: "Nets @ Knicks (NY Derby)", date: "Feb 20, 2026" },
      { id: 'nba-26-09', name: "Celtics @ Nuggets", date: "Mar 15, 2026" },
      { id: 'nba-26-reg-end', name: "Regular Season Finale: Multi-Game", date: "Apr 12, 2026" },
      { id: 'nba-26-playin', name: "NBA Play-In Tournament", date: "Apr 14-17, 2026" },
      { id: 'nba-26-playoffs', name: "NBA Playoffs Round 1 Begins", date: "Apr 18, 2026" },
      { id: 'nba-26-finals', name: "NBA Finals Game 1", date: "Jun 04, 2026" },
      { id: 'nba-26-tipoff', name: "2026-27 Opening Night: Spurs @ Thunder", date: "Oct 20, 2026" },
      { id: 'nba-26-xmas-1', name: "Xmas: Celtics @ 76ers", date: "Dec 25, 2026" },
      { id: 'nba-26-xmas-2', name: "Xmas: Lakers @ Warriors", date: "Dec 25, 2026" },
      { id: 'nba-26-xmas-3', name: "Xmas: Nuggets @ Mavericks", date: "Dec 25, 2026" },
      { id: 'nba-27-allstar', name: "NBA All-Star 2027", date: "Feb 14, 2027" },
    ], 
    options: ["Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets", "Chicago Bulls", "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets", "Detroit Pistons", "Golden State Warriors", "Houston Rockets", "Indiana Pacers", "LA Clippers", "LA Lakers", "Memphis Grizzlies", "Miami Heat", "Milwaukee Bucks", "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks", "Oklahoma City Thunder", "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns", "Portland Trail Blazers", "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors", "Utah Jazz", "Washington Wizards"] 
  },
  { 
    id: 'nfl', 
    name: 'NFL', 
    icon: <Trophy className="w-5 h-5" />, 
    color: "text-green-500", 
    events: [
      { id: 'nfl-26-w1', name: "Week 1: Ravens @ Chiefs (Kickoff)", date: "Sep 10, 2026" },
      { id: 'nfl-26-w1-phi', name: "Week 1: Packers @ Eagles (Brazil)", date: "Sep 11, 2026" },
      { id: 'nfl-26-w1-dal', name: "Week 1: Cowboys @ Browns", date: "Sep 13, 2026" },
      { id: 'nfl-26-w2', name: "Week 2: Bengals @ Chiefs", date: "Sep 20, 2026" },
      { id: 'nfl-26-w3', name: "Week 3: Jaguars @ Bills", date: "Sep 28, 2026" },
      { id: 'nfl-26-w4', name: "Week 4: Seahawks @ Lions", date: "Oct 05, 2026" },
      { id: 'nfl-26-w5', name: "Week 5: Jets @ Vikings (London)", date: "Oct 11, 2026" },
      { id: 'nfl-26-w6', name: "Week 6: Jaguars @ Bears (London)", date: "Oct 18, 2026" },
      { id: 'nfl-26-w7', name: "Week 7: Chiefs @ 49ers", date: "Oct 25, 2026" },
      { id: 'nfl-26-w8', name: "Week 8: Cowboys @ 49ers", date: "Nov 01, 2026" },
      { id: 'nfl-26-w9', name: "Week 9: Lions @ Packers", date: "Nov 08, 2026" },
      { id: 'nfl-26-w10', name: "Week 10: Giants @ Panthers (Munich)", date: "Nov 15, 2026" },
      { id: 'nfl-26-w11', name: "Week 11: Chiefs @ Bills", date: "Nov 22, 2026" },
      { id: 'nfl-26-w12', name: "Week 12: Ravens @ Chargers", date: "Nov 30, 2026" },
      { id: 'nfl-26-thanks-1', name: "Thanksgiving: Bears @ Lions", date: "Nov 26, 2026" },
      { id: 'nfl-26-thanks-2', name: "Thanksgiving: Giants @ Cowboys", date: "Nov 26, 2026" },
      { id: 'nfl-26-thanks-3', name: "Thanksgiving Night: Dolphins @ Packers", date: "Nov 26, 2026" },
      { id: 'nfl-26-blackfriday', name: "Black Friday: Raiders @ Chiefs", date: "Nov 27, 2026" },
      { id: 'nfl-26-w14', name: "Week 14: Packers @ Lions", date: "Dec 13, 2026" },
      { id: 'nfl-26-w15', name: "Week 15: Cowboys @ Eagles", date: "Dec 20, 2026" },
      { id: 'nfl-26-xmas-1', name: "Xmas: Chiefs @ Steelers", date: "Dec 25, 2026" },
      { id: 'nfl-26-xmas-2', name: "Xmas: Ravens @ Texans", date: "Dec 25, 2026" },
      { id: 'nfl-26-w18', name: "Week 18: Regular Season Finale Slate", date: "Jan 10, 2027" },
      { id: 'nfl-27-wildcard', name: "2027 Wild Card Weekend", date: "Jan 16-18, 2027" },
      { id: 'nfl-27-divisional', name: "2027 Divisional Round", date: "Jan 23-24, 2027" },
      { id: 'nfl-27-conf', name: "2027 Conference Championships", date: "Jan 31, 2027" },
      { id: 'nfl-27-sb', name: "Super Bowl LXI (Inglewood, CA)", date: "Feb 14, 2027" },
    ], 
    options: ["Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills", "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns", "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers", "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs", "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins", "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants", "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers", "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"] 
  },
  { 
    id: 'mlb', 
    name: 'MLB', 
    icon: <Trophy className="w-5 h-5" />, 
    color: "text-blue-500", 
    events: [
      { id: 'mlb-26-open', name: "MLB Opening Day: League Wide Slate", date: "Mar 26, 2026" },
      { id: 'mlb-26-co-01', name: "Rockies Home Opener vs Diamondbacks", date: "Apr 03, 2026" },
      { id: 'mlb-26-ny-01', name: "Yankees @ Red Sox (Fenway Opener)", date: "Apr 10, 2026" },
      { id: 'mlb-26-ca-01', name: "Dodgers vs Giants (Rivalry Series)", date: "Apr 15, 2026" },
      { id: 'mlb-26-jackie', name: "Jackie Robinson Day: League Wide", date: "Apr 15, 2026" },
      { id: 'mlb-26-tx-01', name: "Lone Star Series: Astros vs Rangers", date: "Apr 24, 2026" },
      { id: 'mlb-26-fl-01', name: "Sunshine State: Marlins @ Rays", date: "May 05, 2026" },
      { id: 'mlb-26-co-02', name: "Mile High Series: Rockies vs Dodgers", date: "May 15, 2026" },
      { id: 'mlb-26-il-01', name: "Crosstown Classic: Cubs vs White Sox", date: "May 22, 2026" },
      { id: 'mlb-26-ny-02', name: "Subway Series: Mets vs Yankees", date: "Jun 02, 2026" },
      { id: 'mlb-26-lon', name: "MLB London Series: Mets vs Phillies", date: "Jun 13, 2026" },
      { id: 'mlb-26-co-03', name: "Rockies vs Giants (July 4th Fireworks)", date: "Jul 04, 2026" },
      { id: 'mlb-26-asg', name: "2026 MLB All-Star Game (Atlanta)", date: "Jul 14, 2026" },
      { id: 'mlb-26-co-04', name: "Rockies vs Cubs (Summer Series)", date: "Aug 10, 2026" },
      { id: 'mlb-26-field', name: "MLB at Field of Dreams 2026", date: "Aug 15, 2026" },
      { id: 'mlb-26-sept', name: "Pennant Race: Yankees @ Blue Jays", date: "Sep 12, 2026" },
      { id: 'mlb-26-final', name: "Regular Season Finale Slate", date: "Sep 27, 2026" },
      { id: 'mlb-26-wc', name: "Wild Card Series Begins", date: "Sep 29, 2026" },
      { id: 'mlb-26-ds', name: "Division Series (ALDS/NLDS)", date: "Oct 03, 2026" },
      { id: 'mlb-26-cs', name: "Championship Series (ALCS/NLCS)", date: "Oct 12, 2026" },
      { id: 'mlb-26-ws', name: "2026 World Series: Game 1", date: "Oct 23, 2026" },
      { id: 'mlb-26-ws-7', name: "2026 World Series: Potential Game 7", date: "Oct 31, 2026" },
    ], 
    options: ["Arizona Diamondbacks", "Atlanta Braves", "Baltimore Orioles", "Boston Red Sox", "Chicago Cubs", "Chicago White Sox", "Cincinnati Reds", "Cleveland Guardians", "Colorado Rockies", "Detroit Tigers", "Houston Astros", "Kansas City Royals", "Los Angeles Angels", "Los Angeles Dodgers", "Miami Marlins", "Milwaukee Brewers", "Minnesota Twins", "New York Mets", "New York Yankees", "Oakland Athletics", "Philadelphia Phillies", "Pittsburgh Pirates", "San Diego Padres", "San Francisco Giants", "Seattle Mariners", "St. Louis Cardinals", "Tampa Bay Rays", "Texas Rangers", "Toronto Blue Jays", "Washington Nationals"] 
  },
  { 
    id: 'hockey', 
    name: 'NHL', 
    icon: <Snowflake className="w-5 h-5" />, 
    color: "text-cyan-400", 
    events: [
      { id: 'nhl-26-winter', name: "Winter Classic: Blues vs Blackhawks", date: "Jan 01, 2026" },
      { id: 'nhl-26-asg', name: "NHL All-Star Game 2026", date: "Jan 31, 2026" },
      { id: 'nhl-26-stadium', name: "Stadium Series: Devils vs Rangers", date: "Feb 15, 2026" },
      { id: 'nhl-26-co-01', name: "Avalanche @ Rangers (MSG Clash)", date: "Feb 12, 2026" },
      { id: 'nhl-26-co-02', name: "Avalanche vs Stars (Divisional Battle)", date: "Mar 05, 2026" },
      { id: 'nhl-26-playoffs', name: "Stanley Cup Playoffs Begin", date: "Apr 20, 2026" },
      { id: 'nhl-26-finals', name: "Stanley Cup Final: Game 1", date: "Jun 03, 2026" },
      { id: 'nhl-26-draft', name: "2026 NHL Entry Draft", date: "Jun 26, 2026" },
      { id: 'nhl-26-opening', name: "2026-27 Season Opening Night", date: "Oct 08, 2026" },
      { id: 'nhl-26-rivalry', name: "Maple Leafs @ Canadiens", date: "Oct 15, 2026" },
      { id: 'nhl-26-vegas', name: "Golden Knights @ Oilers", date: "Nov 02, 2026" },
    ], 
    options: ["Anaheim Ducks", "Arizona Coyotes", "Boston Bruins", "Buffalo Sabres", "Calgary Flames", "Carolina Hurricanes", "Chicago Blackhawks", "Colorado Avalanche", "Columbus Blue Jackets", "Dallas Stars", "Detroit Red Wings", "Edmonton Oilers", "Florida Panthers", "Los Angeles Kings", "Minnesota Wild", "Montreal Canadiens", "Nashville Predators", "New Jersey Devils", "New York Islanders", "New York Rangers", "Ottawa Senators", "Philadelphia Flyers", "Pittsburgh Penguins", "San Jose Sharks", "Seattle Kraken", "St. Louis Blues", "Tampa Bay Lightning", "Toronto Maple Leafs", "Vancouver Canucks", "Vegas Golden Knights", "Washington Capitals", "Winnipeg Jets"] 
  },
  { 
    id: 'soccer', 
    name: 'Soccer', 
    icon: <SoccerIcon className="w-5 h-5" />, 
    color: "text-white", 
    events: [
      { id: 's-26-wc-open', name: "World Cup 2026: Opening Match (Mexico City)", date: "Jun 11, 2026" },
      { id: 's-26-wc-la', name: "World Cup: USMNT @ SoFi Stadium (LA)", date: "Jun 12, 2026" },
      { id: 's-26-wc-sea', name: "World Cup: USMNT @ Seattle", date: "Jun 19, 2026" },
      { id: 's-26-wc-la2', name: "World Cup: USMNT @ Los Angeles", date: "Jun 25, 2026" },
      { id: 's-26-wc-32', name: "World Cup: Round of 32 Begins", date: "Jun 28, 2026" },
      { id: 's-26-wc-16', name: "World Cup: Round of 16 Begins", date: "Jul 04, 2026" },
      { id: 's-26-wc-qf', name: "World Cup: Quarter-Finals", date: "Jul 09, 2026" },
      { id: 's-26-wc-sf', name: "World Cup: Semi-Finals (Dallas/ATL)", date: "Jul 14, 2026" },
      { id: 's-26-wc-final', name: "World Cup 2026 Final (MetLife Stadium, NJ)", date: "Jul 19, 2026" },
      { id: 'mls-26-open', name: "MLS Opening Day 2026", date: "Feb 28, 2026" },
      { id: 'mls-26-cup', name: "MLS Cup Final 2026", date: "Dec 05, 2026" },
    ], 
    options: ["USA", "Mexico", "Canada", "Argentina", "Brazil", "England", "France", "Germany", "Spain", "Italy", "Portugal", "Netherlands", "Real Madrid", "Barcelona", "Manchester City", "Liverpool", "Arsenal", "PSG", "Bayern Munich", "Inter Milan", "Juventus", "AC Milan"] 
  },
  { 
    id: 'ufc', 
    name: 'UFC', 
    icon: <Swords className="w-5 h-5" />, 
    color: "text-red-600", 
    events: [
      { id: 'ufc-310', name: "UFC 310: Championship Night (Vegas)", date: "Jan 17, 2026" },
      { id: 'ufc-311', name: "UFC 311: Mega-Fight (NYC, Madison Square Garden)", date: "Feb 21, 2026" },
      { id: 'ufc-312', name: "UFC 312: Clash of Titans (Miami)", date: "Mar 14, 2026" },
      { id: 'ufc-313', name: "UFC 313: International Fight Week", date: "Jul 04, 2026" },
      { id: 'ufc-314', name: "UFC 314: Fall Showdown (Denver)", date: "Oct 10, 2026" },
      { id: 'ufc-315', name: "UFC 315: Year-End Bash (Vegas)", date: "Dec 12, 2026" },
    ], 
    options: ["Jon Jones", "Alex Pereira", "Islam Makhachev", "Leon Edwards", "Sean O'Malley", "Conor McGregor", "Ilia Topuria", "Dustin Poirier", "Max Holloway", "Israel Adesanya", "Tom Aspinall", "Charles Oliveira", "Justin Gaethje", "Alexandre Pantoja", "Dricus Du Plessis", "Sean Strickland", "Khamzat Chimaev"] 
  },
  { 
    id: 'boxing', 
    name: 'Boxing', 
    icon: <BoxingIcon className="w-5 h-5" />, 
    color: "text-yellow-600", 
    events: [
      { id: 'box-26-01', name: "Heavyweight Title Unification (Vegas)", date: "Mar 14, 2026" },
      { id: 'box-26-02', name: "Cinco de Mayo Classic (Canelo)", date: "May 02, 2026" },
      { id: 'box-26-03', name: "Summer Slugfest (Arlington)", date: "Aug 15, 2026" },
      { id: 'box-26-04', name: "The Main Event (NYC)", date: "Dec 12, 2026" },
    ], 
    options: ["Tyson Fury", "Oleksandr Usyk", "Anthony Joshua", "Canelo Alvarez", "Terence Crawford", "Naoya Inoue", "Gervonta Davis", "Shakur Stevenson", "Artur Beterbiev", "Dmitry Bivol", "Devin Haney", "Ryan Garcia"] 
  },
  { 
    id: 'tennis', 
    name: 'Tennis', 
    icon: <Target className="w-5 h-5" />, 
    color: "text-lime-400", 
    events: [
      { id: 'ten-26-01', name: "Australian Open Final (Melbourne)", date: "Jan 25, 2026" },
      { id: 'ten-26-02', name: "Indian Wells Masters (California)", date: "Mar 15, 2026" },
      { id: 'ten-26-03', name: "Miami Open Final (Florida)", date: "Mar 29, 2026" },
      { id: 'ten-26-04', name: "French Open Final (Paris)", date: "Jun 07, 2026" },
      { id: 'ten-26-05', name: "Wimbledon Final (London)", date: "Jul 12, 2026" },
      { id: 'ten-26-06', name: "US Open Final (Queens, NY)", date: "Sep 13, 2026" },
    ], 
    options: ["Novak Djokovic", "Carlos Alcaraz", "Jannik Sinner", "Daniil Medvedev", "Alexander Zverev", "Iga Swiatek", "Aryna Sabalenka", "Coco Gauff", "Elena Rybakina", "Jessica Pegula"] 
  },
  { 
    id: 'nascar', 
    name: 'NASCAR', 
    icon: <Flag className="w-5 h-5" />, 
    color: "text-red-500", 
    events: [
      { id: 'nas-26-daytona', name: "Daytona 500 (Florida)", date: "Feb 15, 2026" },
      { id: 'nas-26-vegas', name: "Las Vegas Spring Race", date: "Mar 01, 2026" },
      { id: 'nas-26-talla', name: "Talladega GEICO 500 (Alabama)", date: "Apr 19, 2026" },
      { id: 'nas-26-clt', name: "Coca-Cola 600 (Charlotte)", date: "May 24, 2026" },
      { id: 'nas-26-chicago', name: "Chicago Street Race", date: "Jul 05, 2026" },
      { id: 'nas-26-indy', name: "Brickyard 400 (Indianapolis)", date: "Jul 26, 2026" },
      { id: 'nas-26-bristol', name: "Night Race at Bristol", date: "Sep 19, 2026" },
      { id: 'nas-26-finale', name: "Cup Series Championship (Phoenix)", date: "Nov 08, 2026" },
    ], 
    options: ["Kyle Larson", "Chase Elliott", "Denny Hamlin", "Ryan Blaney", "William Byron", "Christopher Bell", "Joey Logano", "Martin Truex Jr.", "Tyler Reddick", "Ross Chastain", "Kyle Busch", "Bubba Wallace", "Brad Keselowski", "Ty Gibbs", "Chris Buescher", "Michael McDowell", "Alex Bowman", "Chase Briscoe"] 
  },
  { 
    id: 'golf', 
    name: 'Golf', 
    icon: <Target className="h-5 w-5" />, 
    color: "text-emerald-400", 
    events: [
      { id: 'g-26-masters', name: "The Masters 2026 (Augusta, GA)", date: "Apr 09, 2026" },
      { id: 'g-26-pga', name: "PGA Championship (Aronomink, PA)", date: "May 17, 2026" },
      { id: 'g-26-usopen', name: "U.S. Open (Shinnecock Hills, NY)", date: "Jun 21, 2026" },
      { id: 'g-26-british', name: "The Open Championship (Royal Birkdale)", date: "Jul 19, 2026" },
      { id: 'g-26-fedex', name: "Tour Championship (Atlanta, GA)", date: "Aug 30, 2026" },
      { id: 'g-26-ryder', name: "The 2026 Ryder Cup (Bethpage Black, NY)", date: "Sep 25, 2026" },
    ], 
    options: ["Scottie Scheffler", "Rory McIlroy", "Jon Rahm", "Viktor Hovland", "Xander Schauffele", "Ludvig Åberg", "Brooks Koepka", "Bryson DeChambeau", "Tiger Woods", "Jordan Spieth", "Justin Thomas", "Max Homa", "Wyndham Clark", "Patrick Cantlay", "Collin Morikawa", "Cameron Smith", "Hideki Matsuyama", "Tommy Fleetwood"] 
  },
  { id: 'pickleball', name: 'Pickleball', icon: <Trophy className="w-5 h-5" />, color: "text-yellow-500", events: [{ id: 'pb-26-01', name: "National Championships (Dallas)", date: "Nov 08, 2026" }], options: ["Ben Johns", "Anna Leigh Waters", "Tyson McGuffin"] },
  { id: 'volleyball', name: 'Volleyball', icon: <Trophy className="w-5 h-5" />, color: "text-indigo-400", events: [{ id: 'v-26-01', name: "Nations League Finals (Texas)", date: "Jul 05, 2026" }], options: ["USA", "Poland", "Brazil"] },
  { id: 'surfing', name: 'Surfing', icon: <Waves className="w-5 h-5" />, color: "text-blue-400", events: [{ id: 'surf-26-01', name: "Pipe Masters (Hawaii)", date: "Jan 29, 2026" }], options: ["John John Florence", "Gabriel Medina"] },
  { id: 'skateboarding', name: 'Skateboarding', icon: <Zap className="w-5 h-5" />, color: "text-yellow-400", events: [{ id: 'sk-26-01', name: "Street League (SLS) Tokyo", date: "Feb 15, 2026" }], options: ["Nyjah Huston", "Yuto Horigome"] },
  { id: 'bmx', name: 'BMX', icon: <Bike className="w-5 h-5" />, color: "text-red-400", events: [{ id: 'bmx-26-01', name: "UCI BMX Freestyle World Cup", date: "May 24, 2026" }], options: ["Logan Martin", "Garrett Reynolds"] },
  { id: 'snowboarding', name: 'Snowboarding', icon: <Mountain className="w-5 h-5" />, color: "text-cyan-400", events: [{ id: 'snow-26-01', name: "X-Games Aspen (Colorado)", date: "Jan 23, 2026" }], options: ["Chloe Kim", "Mark McMorris"] },
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
                <div className="bg-accent/5 border border-accent/20 p-3 rounded-xl mb-2">
                  <p className="text-[10px] text-accent font-bold uppercase tracking-widest text-center">Available Slates: {currentSport?.events.length}</p>
                </div>
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
