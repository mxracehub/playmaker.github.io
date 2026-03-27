
"use client";

import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Settings, Wallet, History, Star } from "lucide-react";
import { useUser } from "@/firebase";

export default function ProfilePage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen pb-24 md:pt-20">
      <Navbar />
      
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Profile Header */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-card/40 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
            <Avatar className="h-32 w-32 border-4 border-primary shadow-2xl">
              <AvatarImage src={`https://picsum.photos/seed/${user?.uid || 'player'}/400/400`} />
              <AvatarFallback>PM</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                <h1 className="font-headline text-4xl font-bold uppercase tracking-tighter">{user?.displayName || 'Elite Playmaker'}</h1>
                <Badge className="bg-accent text-accent-foreground font-bold px-3 py-1">PRO LEVEL 24</Badge>
              </div>
              <p className="text-muted-foreground mb-6 font-medium italic">"Always playing for the next highlight reel."</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border">
                  <Star className="h-4 w-4 text-accent fill-accent" />
                  <span className="text-sm font-bold">4.8 Rating</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold">128 Contests Won</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/10 hover:bg-white/5">
              <Settings className="h-6 w-6" />
            </Button>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-card/50 border">
            <CardHeader>
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Wallet className="h-5 w-5 text-accent" />
                WALLET BALANCE
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-2xl bg-secondary/30 border border-white/5">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Gold Coins</p>
                <p className="text-2xl font-headline font-bold">1,250,000</p>
              </div>
              <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20">
                <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">Sweeps Coins</p>
                <p className="text-2xl font-headline font-bold text-accent">542.50 SC</p>
              </div>
              <Button className="w-full font-bold uppercase tracking-wider">Top Up</Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-card/50 border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                RECENT ACTIVITY
              </CardTitle>
              <Button variant="link" className="text-accent font-bold uppercase text-xs">Full History</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Entered Contest", detail: "NBA Sunday Night Special", value: "-100 GC", time: "2h ago" },
                  { action: "Won Challenge", detail: "Head-to-Head vs Jaxon", value: "+50 SC", time: "5h ago", positive: true },
                  { action: "Purchase", detail: "Starter Pack", value: "+10,000 GC", time: "1d ago", positive: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-white/5">
                    <div>
                      <p className="font-bold text-sm leading-none mb-1">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.detail} • {item.time}</p>
                    </div>
                    <span className={`font-headline font-bold ${item.positive ? 'text-green-400' : 'text-muted-foreground'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
