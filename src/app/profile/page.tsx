"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Settings, Wallet, History, Star, Gamepad2, Landmark, Coins } from "lucide-react";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();

  // Fetch real-time profile data from Firestore
  const userProfileRef = useMemoFirebase(() => (user ? doc(db, "users", user.uid) : null), [db, user]);
  const { data: profile } = useDoc(userProfileRef);

  // Use Firestore username or fallback to Auth display name or generic title
  const displayName = profile?.username || user?.displayName || 'Elite Playmaker';
  const bio = profile?.bio || "Always playing for the next highlight reel.";

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
                <h1 className="font-headline text-4xl font-bold uppercase tracking-tighter">{displayName}</h1>
                <Badge className="bg-accent text-accent-foreground font-bold px-3 py-1">PRO LEVEL 24</Badge>
              </div>
              <p className="text-muted-foreground mb-6 font-medium italic">"{bio}"</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border">
                  <Star className="h-4 w-4 text-accent fill-accent" />
                  <span className="text-sm font-bold">4.8 Rating</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border">
                  <Gamepad2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold">128 Games Won</span>
                </div>
              </div>
            </div>
            <Link href="/settings">
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/10 hover:bg-white/5 shadow-lg">
                <Settings className="h-6 w-6" />
              </Button>
            </Link>
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
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Gold Coins</p>
                  <Coins className="h-3.5 w-3.5 text-yellow-500" />
                </div>
                <p className="text-2xl font-headline font-bold">1,250,000</p>
              </div>
              <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold text-accent uppercase tracking-widest">Sweeps Coins</p>
                  <Landmark className="h-3.5 w-3.5 text-accent" />
                </div>
                <p className="text-2xl font-headline font-bold text-accent">542.50 SC</p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Link href="/shop" className="block w-full">
                  <Button className="w-full font-bold uppercase tracking-wider bg-accent text-accent-foreground hover:bg-accent/90">
                    <Landmark className="mr-2 h-4 w-4" /> Visit Bank
                  </Button>
                </Link>
                <Link href="/exchange" className="block w-full">
                  <Button variant="outline" className="w-full font-bold uppercase tracking-wider border-accent text-accent hover:bg-accent/10">
                    <Landmark className="mr-2 h-4 w-4" /> Exchange SC
                  </Button>
                </Link>
              </div>
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
                  { action: "Started Game", detail: "NBA Sunday Night Special", value: "-100 GC", time: "2h ago" },
                  { action: "Won Game", detail: "Head-to-Head vs Jaxon", value: "+50 SC", time: "5h ago", positive: true },
                  { action: "Bank Deposit", detail: "Starter Pack", value: "+10,000 GC", time: "1d ago", positive: true },
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
