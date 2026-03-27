
"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { SportsFilter } from "@/components/sports-filter";
import { AthleteCard } from "@/components/athlete-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight, Zap, Target, Users } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const mockAthletes = [
  {
    id: "1",
    name: "Luka Doncic",
    team: "Dallas Mavericks",
    sport: "NBA",
    avatar: "https://picsum.photos/seed/luka/400/400",
    stats: [
      { label: "Points/G", value: "33.9" },
      { label: "Rebounds/G", value: "9.2" }
    ]
  },
  {
    id: "2",
    name: "Patrick Mahomes",
    team: "KC Chiefs",
    sport: "NFL",
    avatar: "https://picsum.photos/seed/mahomes/400/400",
    stats: [
      { label: "Pass Yds", value: "4,183" },
      { label: "TDs", value: "27" }
    ]
  },
  {
    id: "3",
    name: "Kyle Larson",
    team: "Hendrick Motors",
    sport: "NASCAR",
    avatar: "https://picsum.photos/seed/larson/400/400",
    stats: [
      { label: "Top 5s", value: "15" },
      { label: "Wins", value: "4" }
    ]
  },
  {
    id: "4",
    name: "Scottie Scheffler",
    team: "PGA Tour",
    sport: "Golf",
    avatar: "https://picsum.photos/seed/scottie/400/400",
    stats: [
      { label: "Avg Score", value: "68.2" },
      { label: "Top 10s", value: "12" }
    ]
  }
];

export default function Home() {
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);

  const toggleAthlete = (id: string) => {
    setSelectedAthletes(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const filteredAthletes = selectedSport === "all" 
    ? mockAthletes 
    : mockAthletes.filter(a => a.sport.toLowerCase() === selectedSport);

  return (
    <div className="min-h-screen pb-24 md:pt-20">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Hero Section */}
        <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent/20 p-8 text-white relative shadow-2xl">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight uppercase italic">
                The Ultimate <br/><span className="text-accent">Playmaker</span> Arena
              </h1>
              <p className="text-lg text-white/80 mb-6 font-medium leading-relaxed">
                Challenge your friends in the next generation of sports sweepstakes. Pick your elite roster, track live scores, and win big.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold uppercase tracking-wider">
                  Create Contest <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold uppercase tracking-wider backdrop-blur-sm">
                  How it Works
                </Button>
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-4">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
                <Zap className="h-6 w-6 text-accent" />
                <div>
                  <p className="text-xs text-white/60 font-bold uppercase">Active Contests</p>
                  <p className="text-xl font-headline font-bold">142,509</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
                <Target className="h-6 w-6 text-accent" />
                <div>
                  <p className="text-xs text-white/60 font-bold uppercase">Winners Today</p>
                  <p className="text-xl font-headline font-bold">4,120</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lobby Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="font-headline text-2xl font-bold text-white flex items-center gap-2">
              <div className="h-2 w-8 bg-accent rounded-full" />
              PLAYER POOL
            </h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground bg-card/50 px-4 py-2 rounded-full border border-border">
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> 12k Active</span>
              <span className="flex items-center gap-1.5"><Trophy className="h-4 w-4" /> $1.2M Pool</span>
            </div>
          </div>
          <SportsFilter selected={selectedSport} onSelect={setSelectedSport} />
        </div>

        {/* Athlete Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredAthletes.map((athlete) => (
            <AthleteCard 
              key={athlete.id} 
              {...athlete} 
              isSelected={selectedAthletes.includes(athlete.id)}
              onSelect={() => toggleAthlete(athlete.id)}
            />
          ))}
        </div>

        {/* Quick Stats / Rankings */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-card/30 border-dashed border-2">
            <CardHeader>
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" />
                GLOBAL TOP PLAYMAKERS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50">
                    <div className="flex items-center gap-3">
                      <span className="font-headline font-bold text-muted-foreground">#0{i}</span>
                      <div className="h-8 w-8 rounded-full bg-secondary" />
                      <span className="font-medium">User_{i}99</span>
                    </div>
                    <span className="font-headline font-bold text-accent">9.2k SC</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/30 border-dashed border-2 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                LIVE CONTEST UPDATES
              </CardTitle>
              <Button variant="link" className="text-accent text-xs">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Dallas Mavs vs Denver Nuggets contest started!",
                  "User_Jaxon just won 500 SC in a Head-to-Head challenge!",
                  "NFL Playmaker Sunday series is now open for entries."
                ].map((msg, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground p-3 rounded-xl bg-card/50">
                    <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    {msg}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Floating Selection Bar */}
      {selectedAthletes.length > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl md:bottom-6 animate-in slide-in-from-bottom-10">
          <div className="bg-primary/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {selectedAthletes.map((id) => (
                  <div key={id} className="h-10 w-10 rounded-full border-2 border-primary bg-secondary overflow-hidden ring-2 ring-background">
                    <img 
                      src={`https://picsum.photos/seed/${id}/400/400`} 
                      alt="athlete"
                      className="object-cover h-full w-full"
                    />
                  </div>
                ))}
              </div>
              <div>
                <p className="font-headline font-bold text-white text-lg leading-none">
                  {selectedAthletes.length} Selected
                </p>
                <p className="text-white/60 text-xs mt-1 uppercase font-bold tracking-widest">Contest Lineup</p>
              </div>
            </div>
            <Button size="lg" className="bg-accent text-accent-foreground font-bold uppercase tracking-wider px-8 hover:bg-white shadow-xl">
              ENTER CONTEST
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
