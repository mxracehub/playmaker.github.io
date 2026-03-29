
"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Trophy, 
  Target, 
  Gamepad2, 
  Zap, 
  Users, 
  Landmark, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Dribbble,
  Coins
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      title: "1. Choose Your Arena",
      description: "Pick your favorite sport from our elite lineup, including NBA, NFL, Golf, and Extreme Sports.",
      icon: <Dribbble className="h-8 w-8 text-orange-500" />,
      color: "bg-orange-500/10"
    },
    {
      title: "2. Scout Your Roster",
      description: "Select the athletes or teams you believe will dominate the competition based on real-time stats.",
      icon: <Target className="h-8 w-8 text-accent" />,
      color: "bg-accent/10"
    },
    {
      title: "3. Launch a Challenge",
      description: "Set your stakes in Gold or Sweeps Coins and challenge a friend or the global community.",
      icon: <Gamepad2 className="h-8 w-8 text-primary" />,
      color: "bg-primary/10"
    },
    {
      title: "4. Track & Win",
      description: "Watch live as your playmaker score updates. The winner takes the arena prize pool in SC!",
      icon: <Trophy className="h-8 w-8 text-yellow-500" />,
      color: "bg-yellow-500/10"
    }
  ];

  return (
    <div className="min-h-screen pb-24 pt-20 bg-background relative overflow-hidden">
      <Navbar />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />

      <main className="mx-auto max-w-5xl px-4 py-12">
        <header className="text-center mb-16">
          <div className="inline-flex items-center rounded-full text-xs font-semibold bg-accent/10 text-accent uppercase tracking-widest mb-4 px-4 py-1 border border-accent/20">The Playmaker Rulebook</div>
          <h1 className="font-headline text-5xl font-bold uppercase tracking-tight mb-4">How it <span className="text-accent">Works</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience the next generation of sports sweepstakes. Friend vs Friend, elite stats, and real-time showdowns.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-8 mb-20">
          {steps.map((step, i) => (
            <Card key={i} className="bg-card/40 backdrop-blur-sm border-white/5 hover:border-accent/30 transition-all group">
              <CardContent className="p-8 flex items-start gap-6">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 ${step.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-headline text-xl font-bold uppercase mb-2 group-hover:text-accent transition-colors">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid lg:grid-cols-2 gap-12 items-center bg-secondary/20 p-8 md:p-12 rounded-[2rem] border border-white/5 mb-20">
          <div className="space-y-6">
            <h2 className="font-headline text-3xl font-bold uppercase leading-tight">Arena <span className="text-primary">Currencies</span></h2>
            <p className="text-muted-foreground">
              Playmakers features a dual-currency system designed for both casual play and competitive prize showdowns at a 100:1 ratio.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-white/5">
                <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Coins className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="font-bold text-sm uppercase">Gold Coins (GC)</p>
                  <p className="text-xs text-muted-foreground">Recreational coins. 100 GC = $1.00 USD value.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-accent/10 border border-accent/20">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Landmark className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-sm uppercase text-accent">Sweeps Coins (SC)</p>
                  <p className="text-xs text-muted-foreground">Prize-eligible coins. 100 SC = $1.00 USD value.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card/40 rounded-3xl p-8 border border-white/10 text-center space-y-6">
            <Zap className="h-12 w-12 text-accent mx-auto animate-pulse" />
            <h3 className="font-headline text-xl font-bold uppercase tracking-widest">100:1 Universal Ratio</h3>
            <p className="text-sm text-muted-foreground italic font-medium leading-relaxed">
              "Both GC and SC maintain a strict 100:1 ratio to the dollar. In the arena, skill is the only variable that changes your balance."
            </p>
            <div className="flex items-center justify-center gap-3">
               <div className="h-1 w-8 bg-accent rounded-full" />
               <div className="h-1 w-8 bg-primary rounded-full" />
               <div className="h-1 w-8 bg-accent rounded-full" />
            </div>
          </div>
        </section>

        <footer className="text-center space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-muted-foreground font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-green-500" /> Identity Verified</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-500" /> Secure Payments</span>
            <span className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> 500k+ Playmakers</span>
          </div>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="font-headline font-bold uppercase tracking-widest px-12 h-14 text-xl">
                JOIN THE ARENA <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
