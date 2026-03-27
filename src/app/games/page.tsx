
"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Clock, Users, ArrowRight, Gamepad2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const activeGames = [
  { id: "game-1", title: "Sunday Night Showdown", sport: "NFL", players: 12, entries: 8, pool: "5,000 SC", time: "Starts in 2h 45m" },
  { id: "game-2", title: "Mavericks vs Lakers Pick-em", sport: "NBA", players: 2, entries: 2, pool: "200 SC", time: "Live Now" },
  { id: "game-3", title: "The Masters Elite Pack", sport: "Golf", players: 50, entries: 42, pool: "10,000 SC", time: "Starts tomorrow" },
];

export default function GamesPage() {
  return (
    <div className="min-h-screen pb-24 md:pt-20">
      <Navbar />
      
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-headline text-3xl font-bold uppercase tracking-tight">Your <span className="text-accent">Games</span></h1>
            <p className="text-muted-foreground">Track your plays and arena performance</p>
          </div>
          <Link href="/games/create">
            <Button className="font-bold uppercase tracking-wider bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Start New Game
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full h-14 bg-card border grid grid-cols-2 p-1.5 mb-8">
            <TabsTrigger value="active" className="font-headline font-bold text-base uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white">Active ({activeGames.length})</TabsTrigger>
            <TabsTrigger value="history" className="font-headline font-bold text-base uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {activeGames.map((game) => (
              <Link key={game.id} href={`/games/${game.id}`}>
                <Card className="overflow-hidden bg-card/50 border hover:border-accent/50 transition-all group mb-4">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="flex-1 p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold text-accent uppercase bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">{game.sport}</span>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> {game.time}
                          </div>
                        </div>
                        <h3 className="font-headline text-xl font-bold mb-4">{game.title}</h3>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{game.entries}/{game.players} Players</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-accent" />
                            <span className="text-sm font-bold text-accent">{game.pool} POOL</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 md:border-l flex items-center justify-center bg-secondary/20">
                        <Button variant="ghost" className="h-12 w-12 rounded-full p-0 group-hover:bg-primary group-hover:text-white transition-all">
                          <ArrowRight className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </TabsContent>
          
          <TabsContent value="history" className="text-center py-20 bg-card/20 rounded-3xl border border-dashed">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">No completed games found.</p>
            <p className="text-xs text-muted-foreground mt-2">Finish a match to see your legacy here.</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
