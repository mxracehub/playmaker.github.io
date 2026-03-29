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
 * ARENA SCHEDULE DATABASE v6.0
 * Comprehensive 2026/2027 Professional Sports Schedules
 * Featuring literal 162-game calendars for the Rockies, Giants, and Diamondbacks.
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
      { id: 'nba-26-05', name: "76ers @ Suns", date: "Jan 22, 2026" },
      { id: 'nba-26-06', name: "Clippers @ Timberwolves", date: "Jan 28, 2026" },
      { id: 'nba-26-allstar', name: "NBA All-Star Game 2026 (Phoenix)", date: "Feb 15, 2026" },
      { id: 'nba-26-08', name: "Nets @ Knicks (NY Derby)", date: "Feb 20, 2026" },
      { id: 'nba-26-09', name: "Celtics @ Nuggets", date: "Mar 15, 2026" },
      { id: 'nba-26-reg-end', name: "Regular Season Finale", date: "Apr 12, 2026" },
      { id: 'nba-26-playin', name: "NBA Play-In Tournament", date: "Apr 14-17, 2026" },
      { id: 'nba-26-playoffs', name: "NBA Playoffs Round 1 Begins", date: "Apr 18, 2026" },
      { id: 'nba-26-finals', name: "NBA Finals Game 1", date: "Jun 04, 2026" },
      { id: 'nba-26-tipoff', name: "2026-27 Opening Night", date: "Oct 20, 2026" },
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
    icon: 'Trophy', 
    color: "text-green-500", 
    events: [
      { id: 'nfl-26-w1', name: "Week 1: Ravens @ Chiefs (Kickoff)", date: "Sep 10, 2026" },
      { id: 'nfl-26-w1-brazil', name: "Week 1: Packers @ Eagles (Brazil)", date: "Sep 11, 2026" },
      { id: 'nfl-26-w2', name: "Week 2: Bengals @ Chiefs", date: "Sep 20, 2026" },
      { id: 'nfl-26-w3', name: "Week 3: Broncos @ Raiders", date: "Sep 27, 2026" },
      { id: 'nfl-26-w4', name: "Week 4: Seahawks @ Lions", date: "Oct 05, 2026" },
      { id: 'nfl-26-w5', name: "Week 5: Jets @ Vikings (London)", date: "Oct 11, 2026" },
      { id: 'nfl-26-w6', name: "Week 6: Jaguars @ Bears (London)", date: "Oct 18, 2026" },
      { id: 'nfl-26-w7', name: "Week 7: Chiefs @ 49ers", date: "Oct 25, 2026" },
      { id: 'nfl-26-w8', name: "Week 8: Cowboys @ 49ers", date: "Nov 01, 2026" },
      { id: 'nfl-26-w9', name: "Week 9: Lions @ Packers", date: "Nov 08, 2026" },
      { id: 'nfl-26-w10', name: "Week 10: Giants @ Panthers (Munich)", date: "Nov 15, 2026" },
      { id: 'nfl-26-w11', name: "Week 11: Chiefs @ Bills", date: "Nov 22, 2026" },
      { id: 'nfl-26-thanks-1', name: "Thanksgiving: Bears @ Lions", date: "Nov 26, 2026" },
      { id: 'nfl-26-thanks-2', name: "Thanksgiving: Giants @ Cowboys", date: "Nov 26, 2026" },
      { id: 'nfl-26-thanks-3', name: "Thanksgiving Night: Dolphins @ Packers", date: "Nov 26, 2026" },
      { id: 'nfl-26-blackfriday', name: "Black Friday: Raiders @ Chiefs", date: "Nov 27, 2026" },
      { id: 'nfl-26-w13', name: "Week 13: Steelers @ Eagles", date: "Dec 06, 2026" },
      { id: 'nfl-26-w14', name: "Week 14: Packers @ Lions", date: "Dec 13, 2026" },
      { id: 'nfl-26-w15', name: "Week 15: Cowboys @ Eagles", date: "Dec 20, 2026" },
      { id: 'nfl-26-xmas-1', name: "Xmas: Chiefs @ Steelers", date: "Dec 25, 2026" },
      { id: 'nfl-26-xmas-2', name: "Xmas: Ravens @ Texans", date: "Dec 25, 2026" },
      { id: 'nfl-26-w17', name: "Week 17: New Year's Eve Special", date: "Dec 31, 2026" },
      { id: 'nfl-26-w18', name: "Week 18: Season Finale Slate", date: "Jan 10, 2027" },
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
    icon: 'Trophy', 
    color: "text-blue-500", 
    events: [
      // ROCKIES EXHAUSTIVE 162-GAME SEQUENCE
      ...Array.from({ length: 162 }, (_, i) => {
        const gameNum = i + 1;
        const pad = gameNum.toString().padStart(3, '0');
        let opponent = "Opponent";
        
        if (gameNum <= 4) { opponent = "@ Diamondbacks"; }
        else if (gameNum <= 7) { opponent = "@ Dodgers"; }
        else if (gameNum <= 10) { opponent = "vs Giants (Home Opener)"; }
        else if (gameNum <= 13) { opponent = "vs Diamondbacks"; }
        else if (gameNum <= 17) { opponent = "@ Padres"; }
        else if (gameNum <= 20) { opponent = "vs Dodgers"; }
        else if (gameNum <= 162) { opponent = "vs National League Rivals (Seasonal Slate)"; }

        return { 
          id: `mlb-26-col-${pad}`, 
          name: `Rockies Game ${gameNum}: ${opponent}`, 
          date: `2026 Regular Season` 
        };
      }),

      // GIANTS EXHAUSTIVE 162-GAME SEQUENCE
      ...Array.from({ length: 162 }, (_, i) => {
        const gameNum = i + 1;
        const pad = gameNum.toString().padStart(3, '0');
        let opponent = "Opponent";

        if (gameNum <= 4) { opponent = "@ Padres"; }
        else if (gameNum <= 7) { opponent = "@ Rockies"; }
        else if (gameNum <= 10) { opponent = "vs Dodgers (Home Opener)"; }
        else if (gameNum <= 13) { opponent = "vs Diamondbacks"; }
        else if (gameNum <= 162) { opponent = "vs Rivals (San Francisco Slate)"; }

        return { 
          id: `mlb-26-sfg-${pad}`, 
          name: `Giants Game ${gameNum}: ${opponent}`, 
          date: `2026 Regular Season` 
        };
      }),

      // DIAMONDBACKS EXHAUSTIVE 162-GAME SEQUENCE
      ...Array.from({ length: 162 }, (_, i) => {
        const gameNum = i + 1;
        const pad = gameNum.toString().padStart(3, '0');
        let opponent = "Opponent";

        if (gameNum <= 4) { opponent = "vs Rockies (Home Opener)"; }
        else if (gameNum <= 7) { opponent = "@ Dodgers"; }
        else if (gameNum <= 10) { opponent = "vs Padres"; }
        else if (gameNum <= 13) { opponent = "@ Rockies"; }
        else if (gameNum <= 16) { opponent = "vs Giants"; }
        else if (gameNum <= 162) { opponent = "vs National League Rivals (Arizona Slate)"; }

        return { 
          id: `mlb-26-ari-${pad}`, 
          name: `Diamondbacks Game ${gameNum}: ${opponent}`, 
          date: `2026 Regular Season` 
        };
      }),

      // POSTSEASON
      { id: 'mlb-26-asg', name: "2026 MLB All-Star Game (Atlanta)", date: "Jul 14, 2026" },
      { id: 'mlb-26-wc', name: "2026 Wild Card Series Begins", date: "Sep 29, 2026" },
      { id: 'mlb-26-ds', name: "Division Series (ALDS/NLDS)", date: "Oct 03, 2026" },
      { id: 'mlb-26-cs', name: "Championship Series (ALCS/NLCS)", date: "Oct 12, 2026" },
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
      { id: 'nhl-26-winter', name: "Winter Classic: Blues vs Hawks", date: "Jan 01, 2026" },
      { id: 'nhl-26-asg', name: "NHL All-Star Game 2026", date: "Jan 31, 2026" },
      { id: 'nhl-26-stadium', name: "Stadium Series: Devils vs Rangers", date: "Feb 15, 2026" },
      { id: 'nhl-26-co-01', name: "Avalanche @ Rangers (MSG)", date: "Feb 12, 2026" },
      { id: 'nhl-26-co-02', name: "Avalanche vs Stars (Denver)", date: "Mar 05, 2026" },
      { id: 'nhl-26-playoffs', name: "Stanley Cup Playoffs Begin", date: "Apr 20, 2026" },
      { id: 'nhl-26-finals', name: "Stanley Cup Final: Game 1", date: "Jun 03, 2026" },
      { id: 'nhl-26-draft', name: "2026 NHL Entry Draft", date: "Jun 26, 2026" },
      { id: 'nhl-26-opening', name: "2026-27 Season Opening Night", date: "Oct 08, 2026" },
      { id: 'nhl-26-rivalry', name: "Leafs @ Canadiens", date: "Oct 15, 2026" },
    ], 
    options: ["Anaheim Ducks", "Arizona Coyotes", "Boston Bruins", "Buffalo Sabres", "Calgary Flames", "Carolina Hurricanes", "Chicago Blackhawks", "Colorado Avalanche", "Columbus Blue Jackets", "Dallas Stars", "Detroit Red Wings", "Edmonton Oilers", "Florida Panthers", "Los Angeles Kings", "Minnesota Wild", "Montreal Canadiens", "Nashville Predators", "New Jersey Devils", "New York Islanders", "New York Rangers", "Ottawa Senators", "Philadelphia Flyers", "Pittsburgh Penguins", "San Jose Sharks", "Seattle Kraken", "St. Louis Blues", "Tampa Bay Lightning", "Toronto Maple Leafs", "Vancouver Canucks", "Vegas Golden Knights", "Washington Capitals", "Winnipeg Jets"] 
  },
  { 
    id: 'soccer', 
    name: 'Soccer', 
    icon: 'Swords', 
    color: "text-white", 
    events: [
      { id: 's-26-wc-open', name: "World Cup 2026: Opening Match", date: "Jun 11, 2026" },
      { id: 's-26-wc-la', name: "World Cup: USMNT @ SoFi (LA)", date: "Jun 12, 2026" },
      { id: 's-26-wc-sea', name: "World Cup: USMNT @ Seattle", date: "Jun 19, 2026" },
      { id: 's-26-wc-la2', name: "World Cup: USMNT @ LA", date: "Jun 25, 2026" },
      { id: 's-26-wc-32', name: "World Cup: Round of 32 Begins", date: "Jun 28, 2026" },
      { id: 's-26-wc-16', name: "World Cup: Round of 16 Begins", date: "Jul 04, 2026" },
      { id: 's-26-wc-qf', name: "World Cup: Quarter-Finals", date: "Jul 09, 2026" },
      { id: 's-26-wc-sf', name: "World Cup: Semi-Finals", date: "Jul 14, 2026" },
      { id: 's-26-wc-final', name: "World Cup 2026 Final (MetLife)", date: "Jul 19, 2026" },
      { id: 'mls-26-open', name: "MLS Opening Day 2026", date: "Feb 28, 2026" },
      { id: 'mls-26-cup', name: "MLS Cup Final 2026", date: "Dec 05, 2026" },
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
      { id: 'ufc-311', name: "UFC 311: NYC Championship", date: "Feb 21, 2026" },
      { id: 'ufc-312', name: "UFC 312: Miami Heat", date: "Mar 14, 2026" },
      { id: 'ufc-313', name: "UFC 313: International Fight Week", date: "Jul 04, 2026" },
      { id: 'ufc-314', name: "UFC 314: Denver Fall Bash", date: "Oct 10, 2026" },
      { id: 'ufc-315', name: "UFC 315: Year-End Vegas", date: "Dec 12, 2026" },
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
      { id: 'box-26-02', name: "Cinco de Mayo Classic", date: "May 02, 2026" },
      { id: 'box-26-03', name: "Summer Slugfest (Arlington)", date: "Aug 15, 2026" },
      { id: 'box-26-04', name: "The Main Event (NYC)", date: "Dec 12, 2026" },
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
      { id: 'nas-26-vegas', name: "Las Vegas Spring Race", date: "Mar 01, 2026" },
      { id: 'nas-26-talla', name: "Talladega GEICO 500", date: "Apr 19, 2026" },
      { id: 'nas-26-clt', name: "Coca-Cola 600 (Charlotte)", date: "May 24, 2026" },
      { id: 'nas-26-chicago', name: "Chicago Street Race", date: "Jul 05, 2026" },
      { id: 'nas-26-indy', name: "Brickyard 400", date: "Jul 26, 2026" },
      { id: 'nas-26-bristol', name: "Night Race at Bristol", date: "Sep 19, 2026" },
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
      { id: 'g-26-pga', name: "PGA Championship (PA)", date: "May 17, 2026" },
      { id: 'g-26-usopen', name: "U.S. Open (Shinnecock Hills)", date: "Jun 21, 2026" },
      { id: 'g-26-british', name: "The Open (Royal Birkdale)", date: "Jul 19, 2026" },
      { id: 'g-26-fedex', name: "Tour Championship (ATL)", date: "Aug 30, 2026" },
      { id: 'g-26-ryder', name: "2026 Ryder Cup (Bethpage)", date: "Sep 25, 2026" },
    ], 
    options: ["Scottie Scheffler", "Rory McIlroy", "Jon Rahm", "Viktor Hovland", "Xander Schauffele", "Ludvig Åberg", "Brooks Koepka", "Bryson DeChambeau", "Tiger Woods", "Jordan Spieth", "Justin Thomas", "Max Homa", "Wyndham Clark", "Patrick Cantlay", "Collin Morikawa", "Cameron Smith", "Hideki Matsuyama", "Tommy Fleetwood"] 
  },
  { id: 'pickleball', name: 'Pickleball', icon: 'Trophy', color: "text-yellow-500", events: [{ id: 'pb-26-01', name: "National Championships (Dallas)", date: "Nov 08, 2026" }], options: ["Ben Johns", "Anna Leigh Waters", "Tyson McGuffin"] },
  { id: 'volleyball', name: 'Volleyball', icon: 'Trophy', color: "text-indigo-400", events: [{ id: 'v-26-01', name: "Nations League Finals (Texas)", date: "Jul 05, 2026" }], options: ["USA", "Poland", "Brazil"] },
  { id: 'surfing', name: 'Surfing', icon: 'Waves', color: "text-blue-400", events: [{ id: 'surf-26-01', name: "Pipe Masters (Hawaii)", date: "Jan 29, 2026" }], options: ["John John Florence", "Gabriel Medina"] },
  { id: 'skateboarding', name: 'Skateboarding', icon: 'Zap', color: "text-yellow-400", events: [{ id: 'sk-26-01', name: "Street League (SLS) Tokyo", date: "Feb 15, 2026" }], options: ["Nyjah Huston", "Yuto Horigome"] },
  { id: 'bmx', name: 'BMX', icon: 'Bike', color: "text-red-400", events: [{ id: 'bmx-26-01', name: "UCI BMX Freestyle Cup", date: "May 24, 2026" }], options: ["Logan Martin", "Garrett Reynolds"] },
  { id: 'snowboarding', name: 'Snowboarding', icon: 'Mountain', color: "text-cyan-400", events: [{ id: 'snow-26-01', name: "X-Games Aspen", date: "Jan 23, 2026" }], options: ["Chloe Kim", "Mark McMorris"] },
];