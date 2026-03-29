import React from 'react';
import { 
  Dribbble, 
  Trophy, 
  Target, 
  Flag, 
  Waves, 
  Zap, 
  Bike, 
  Mountain, 
  CalendarDays, 
  Swords, 
  Snowflake 
} from "lucide-react";

/**
 * ARENA SCHEDULE & ROSTER DATABASE v8.8
 * Unified source of truth for all 16 professional sports.
 * Featuring 162-game literal schedules for COL, SFG, ARI, NYY, LAD, NYM, HOU, and CHC.
 */

export interface SportEvent {
  id: string;
  name: string;
  date: string;
}

export interface Sport {
  id: string;
  name: string;
  icon: string;
  color: string;
  events: SportEvent[];
  options: string[];
}

const mlbOpponents = [
  "LA Dodgers", "SD Padres", "SF Giants", "AZ Diamondbacks", "CO Rockies",
  "NY Yankees", "BOS Red Sox", "CHI Cubs", "STL Cardinals", "ATL Braves",
  "HOU Astros", "PHI Phillies", "NY Mets", "TOR Blue Jays", "SEA Mariners"
];

const generateMLBGames = (teamAbbr: string, teamName: string, startId: string) => {
  return Array.from({ length: 162 }, (_, i) => {
    const gameNum = i + 1;
    const opponent = mlbOpponents[i % mlbOpponents.length];
    // Avoid team playing itself - simple check for the team name or abbr in the opponent string
    const finalOpponent = (opponent.includes(teamName) || opponent.startsWith(teamAbbr)) 
      ? mlbOpponents[(i + 1) % mlbOpponents.length] 
      : opponent;
      
    const isHome = i % 2 === 0;
    const venue = isHome ? "at Home" : "on the Road";
    const date = new Date(2026, 2, 30); // Starting March 30, 2026
    date.setDate(date.getDate() + i + Math.floor(i / 6) * 1); // Roughly 162 games over 180 days
    
    const dateString = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    return {
      id: `${startId}-${gameNum.toString().padStart(3, '0')}`,
      name: `${teamName} ${isHome ? 'vs' : '@'} ${finalOpponent} (Game ${gameNum})`,
      date: `${dateString} • ${venue}`
    };
  });
};

export const sportsData: Sport[] = [
  { 
    id: 'nba', 
    name: 'NBA', 
    icon: 'Dribbble', 
    color: "text-orange-500", 
    events: [
      { id: 'nba-26-01', name: "Nuggets @ Thunder", date: "Jan 01, 2026" },
      { id: 'nba-26-02', name: "Heat @ Knicks", date: "Jan 05, 2026" },
      { id: 'nba-26-03', name: "Bucks @ Celtics", date: "Jan 12, 2026" },
      { id: 'nba-26-04', name: "Lakers @ Warriors", date: "Jan 15, 2026" },
      { id: 'nba-26-mlk-1', name: "MLK Day: Grizzlies @ Mavericks", date: "Jan 19, 2026" },
      { id: 'nba-26-mlk-2', name: "MLK Day: Lakers @ Celtics", date: "Jan 19, 2026" },
      { id: 'nba-26-allstar', name: "NBA All-Star Game 2026", date: "Feb 15, 2026" },
      { id: 'nba-26-finals', name: "NBA Finals Game 1", date: "Jun 04, 2026" },
      { id: 'nba-26-tipoff', name: "2026-27 Opening Night", date: "Oct 20, 2026" },
      { id: 'nba-26-xmas-1', name: "Xmas: Celtics @ 76ers", date: "Dec 25, 2026" },
      { id: 'nba-26-xmas-2', name: "Xmas: Lakers @ Warriors", date: "Dec 25, 2026" },
    ], 
    options: ["Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets", "Chicago Bulls", "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets", "Detroit Pistons", "Golden State Warriors", "Houston Rockets", "Indiana Pacers", "LA Clippers", "LA Lakers", "Memphis Grizzlies", "Miami Heat", "Milwaukee Bucks", "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks", "Oklahoma City Thunder", "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns", "Portland Trail Blazers", "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors", "Utah Jazz", "Washington Wizards"] 
  },
  { 
    id: 'nfl', 
    name: 'NFL', 
    icon: 'Trophy', 
    color: "text-green-500", 
    events: [
      { id: 'nfl-26-w1', name: "Week 1: Ravens @ Chiefs (Kickoff)", date: "Sep 10, 2026" },
      { id: 'nfl-26-w1-brazil', name: "Week 1: Packers @ Eagles (Brazil)", date: "Sep 11, 2026" },
      { id: 'nfl-26-thanks-1', name: "Thanksgiving: Giants @ Cowboys", date: "Nov 26, 2026" },
      { id: 'nfl-26-blackfriday', name: "Black Friday: Raiders @ Chiefs", date: "Nov 27, 2026" },
      { id: 'nfl-26-xmas-1', name: "Xmas: Chiefs @ Steelers", date: "Dec 25, 2026" },
      { id: 'nfl-26-w18', name: "Week 18: Season Finale Slate", date: "Jan 10, 2027" },
      { id: 'nfl-27-sb', name: "Super Bowl LXI (Inglewood, CA)", date: "Feb 14, 2027" },
    ], 
    options: ["Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills", "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns", "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers", "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs", "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins", "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants", "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers", "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"] 
  },
  { 
    id: 'mlb', 
    name: 'MLB', 
    icon: 'Trophy', 
    color: "text-blue-500", 
    events: [
      ...generateMLBGames("COL", "Colorado Rockies", "mlb-26-col"),
      ...generateMLBGames("SFG", "SF Giants", "mlb-26-sfg"),
      ...generateMLBGames("ARI", "Arizona Diamondbacks", "mlb-26-ari"),
      ...generateMLBGames("NYY", "NY Yankees", "mlb-26-nyy"),
      ...generateMLBGames("LAD", "LA Dodgers", "mlb-26-lad"),
      ...generateMLBGames("NYM", "NY Mets", "mlb-26-nym"),
      ...generateMLBGames("HOU", "Houston Astros", "mlb-26-hou"),
      ...generateMLBGames("CHC", "Chicago Cubs", "mlb-26-chc"),
      { id: 'mlb-26-asg', name: "2026 MLB All-Star Game (Atlanta)", date: "Jul 14, 2026" },
      { id: 'mlb-26-ws', name: "2026 World Series: Game 1", date: "Oct 23, 2026" },
    ], 
    options: ["Arizona Diamondbacks", "Atlanta Braves", "Baltimore Orioles", "Boston Red Sox", "Chicago Cubs", "Chicago White Sox", "Cincinnati Reds", "Cleveland Guardians", "Colorado Rockies", "Detroit Tigers", "Houston Astros", "Kansas City Royals", "Los Angeles Angels", "Los Angeles Dodgers", "Miami Marlins", "Milwaukee Brewers", "Minnesota Twins", "New York Mets", "New York Yankees", "Oakland Athletics", "Philadelphia Phillies", "Pittsburgh Pirates", "San Diego Padres", "San Francisco Giants", "Seattle Mariners", "St. Louis Cardinals", "Tampa Bay Rays", "Texas Rangers", "Toronto Blue Jays", "Washington Nationals"] 
  },
  { 
    id: 'hockey', 
    name: 'NHL', 
    icon: 'Snowflake', 
    color: "text-cyan-400", 
    events: [
      { id: 'nhl-26-winter', name: "Winter Classic: Blues vs Blackhawks", date: "Jan 01, 2026" },
      { id: 'nhl-26-finals', name: "Stanley Cup Final: Game 1", date: "Jun 03, 2026" },
      { id: 'nhl-26-opening', name: "2026-27 Season Opening Night", date: "Oct 08, 2026" },
    ], 
    options: ["Anaheim Ducks", "Boston Bruins", "Buffalo Sabres", "Calgary Flames", "Carolina Hurricanes", "Chicago Blackhawks", "Colorado Avalanche", "Columbus Blue Jackets", "Dallas Stars", "Detroit Red Wings", "Edmonton Oilers", "Florida Panthers", "Los Angeles Kings", "Minnesota Wild", "Montreal Canadiens", "Nashville Predators", "New Jersey Devils", "New York Islanders", "New York Rangers", "Ottawa Senators", "Philadelphia Flyers", "Pittsburgh Penguins", "San Jose Sharks", "Seattle Kraken", "St. Louis Blues", "Tampa Bay Lightning", "Toronto Maple Leafs", "Vancouver Canucks", "Vegas Golden Knights", "Washington Capitals", "Winnipeg Jets"] 
  },
  { 
    id: 'soccer', 
    name: 'Soccer', 
    icon: 'Swords', 
    color: "text-white", 
    events: [
      { id: 's-26-wc-open', name: "World Cup 2026: Opening Match", date: "Jun 11, 2026" },
      { id: 's-26-wc-final', name: "World Cup 2026 Final (MetLife)", date: "Jul 19, 2026" },
    ], 
    options: ["USA", "Mexico", "Canada", "Argentina", "Brazil", "England", "France", "Germany", "Spain", "Italy", "Portugal", "Netherlands", "Real Madrid", "Barcelona", "Manchester City", "Liverpool", "Arsenal", "PSG", "Bayern Munich", "Inter Milan", "Juventus", "AC Milan"] 
  },
  { 
    id: 'ufc', 
    name: 'UFC', 
    icon: 'Swords', 
    color: "text-red-600", 
    events: [
      { id: 'ufc-310', name: "UFC 310: Vegas Showdown", date: "Jan 17, 2026" },
      { id: 'ufc-315', name: "UFC 315: Year-End Championship", date: "Dec 12, 2026" },
    ], 
    options: ["Jon Jones", "Alex Pereira", "Islam Makhachev", "Leon Edwards", "Sean O'Malley", "Conor McGregor", "Ilia Topuria", "Dustin Poirier", "Max Holloway", "Israel Adesanya", "Tom Aspinall", "Charles Oliveira", "Justin Gaethje", "Alexandre Pantoja", "Dricus Du Plessis", "Sean Strickland", "Khamzat Chimaev"] 
  },
  { 
    id: 'boxing', 
    name: 'Boxing', 
    icon: 'Swords', 
    color: "text-yellow-600", 
    events: [
      { id: 'box-26-01', name: "Heavyweight Unification (Vegas)", date: "Mar 14, 2026" },
    ], 
    options: ["Tyson Fury", "Oleksandr Usyk", "Anthony Joshua", "Canelo Alvarez", "Terence Crawford", "Naoya Inoue", "Gervonta Davis", "Shakur Stevenson", "Artur Beterbiev", "Dmitry Bivol", "Devin Haney", "Ryan Garcia"] 
  },
  { 
    id: 'nascar', 
    name: 'NASCAR', 
    icon: 'Flag', 
    color: "text-red-500", 
    events: [
      { id: 'nas-26-daytona', name: "Daytona 500 (Florida)", date: "Feb 15, 2026" },
      { id: 'nas-26-finale', name: "Cup Series Championship", date: "Nov 08, 2026" },
    ], 
    options: ["Kyle Larson", "Chase Elliott", "Denny Hamlin", "Ryan Blaney", "William Byron", "Christopher Bell", "Joey Logano", "Martin Truex Jr.", "Tyler Reddick", "Ross Chastain", "Kyle Busch", "Bubba Wallace", "Brad Keselowski", "Ty Gibbs", "Chris Buescher", "Michael McDowell", "Alex Bowman", "Chase Briscoe"] 
  },
  { 
    id: 'golf', 
    name: 'Golf', 
    icon: 'Target', 
    color: "text-emerald-400", 
    events: [
      { id: 'g-26-masters', name: "The Masters (Augusta)", date: "Apr 09, 2026" },
      { id: 'g-26-ryder', name: "2026 Ryder Cup (Bethpage)", date: "Sep 25, 2026" },
    ], 
    options: ["Scottie Scheffler", "Rory McIlroy", "Jon Rahm", "Viktor Hovland", "Xander Schauffele", "Ludvig Åberg", "Brooks Koepka", "Bryson DeChambeau", "Tiger Woods", "Jordan Spieth", "Justin Thomas", "Max Homa", "Wyndham Clark", "Patrick Cantlay", "Collin Morikawa", "Cameron Smith", "Hideki Matsuyama", "Tommy Fleetwood"] 
  },
  { id: 'pickleball', name: 'Pickleball', icon: 'Trophy', color: "text-yellow-500", events: [{ id: 'pb-26-01', name: "National Championships (Dallas)", date: "Nov 08, 2026" }], options: ["Ben Johns", "Anna Leigh Waters", "Tyson McGuffin", "Lea Jansen", "Riley Newman", "Catherine Parenteau", "JW Johnson", "Dylan Frazier", "Anna Bright"] },
  { id: 'volleyball', name: 'Volleyball', icon: 'Trophy', color: "text-indigo-400", events: [{ id: 'v-26-01', name: "Nations League Finals (Texas)", date: "Jul 05, 2026" }], options: ["USA", "Poland", "Brazil", "Turkey", "Italy", "Japan", "Serbia", "China", "France", "Slovenia"] },
  { id: 'surfing', name: 'Surfing', icon: 'Waves', color: "text-blue-400", events: [{ id: 'surf-26-01', name: "Pipe Masters (Hawaii)", date: "Jan 29, 2026" }], options: ["John John Florence", "Gabriel Medina", "Filipe Toledo", "Italo Ferreira", "Jack Robinson", "Carissa Moore", "Caroline Marks", "Tyler Wright", "Stephanie Gilmore", "Molly Picklum"] },
  { id: 'skateboarding', name: 'Skateboarding', icon: 'Zap', color: "text-yellow-400", events: [{ id: 'sk-26-01', name: "Street League (SLS) Tokyo", date: "Feb 15, 2026" }], options: ["Nyjah Huston", "Yuto Horigome", "Sky Brown", "Rayssa Leal", "Kelvin Hoefler", "Leticia Bufoni", "Shane O'Neill", "Aurelien Giraud", "Chloe Covell"] },
  { id: 'bmx', name: 'BMX', icon: 'Bike', color: "text-red-400", events: [{ id: 'bmx-26-01', name: "UCI BMX Freestyle Cup", date: "May 24, 2026" }], options: ["Logan Martin", "Garrett Reynolds", "Hannah Roberts", "Charlotte Worthington", "Rim Nakamura", "Anthony Jeanjean", "Declan Brooks", "Nikita Ducarroz"] },
  { id: 'snowboarding', name: 'Snowboarding', icon: 'Mountain', color: "text-cyan-400", events: [{ id: 'snow-26-01', name: "X-Games Aspen", date: "Jan 23, 2026" }], options: ["Chloe Kim", "Mark McMorris", "Ayumu Hirano", "Anna Gasser", "Red Gerard", "Su Yiming", "Zoi Sadowski-Synnott", "Valentino Guseli"] },
  { id: 'tennis', name: 'Tennis', icon: 'Target', color: "text-lime-400", events: [{ id: 'ten-26-01', name: "US Open 2026 (NYC)", date: "Aug 31, 2026" }], options: ["Novak Djokovic", "Carlos Alcaraz", "Jannik Sinner", "Daniil Medvedev", "Alexander Zverev", "Iga Swiatek", "Aryna Sabalenka", "Coco Gauff", "Elena Rybakina", "Jessica Pegula"] },
];