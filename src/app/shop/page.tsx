
"use client";

import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Zap, ShieldCheck, Sparkles } from "lucide-react";

const packages = [
  {
    id: "pkg1",
    goldCoins: "10,000",
    sweepsCoins: "10",
    price: "$9.99",
    tag: "Starter",
    popular: false,
    color: "from-blue-500/20 to-blue-600/20"
  },
  {
    id: "pkg2",
    goldCoins: "50,000",
    sweepsCoins: "52",
    price: "$49.99",
    tag: "Best Value",
    popular: true,
    color: "from-primary/20 to-accent/20"
  },
  {
    id: "pkg3",
    goldCoins: "250,000",
    sweepsCoins: "265",
    price: "$249.99",
    tag: "High Roller",
    popular: false,
    color: "from-purple-500/20 to-pink-500/20"
  }
];

export default function ShopPage() {
  return (
    <div className="min-h-screen pb-24 md:pt-20">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full text-accent font-bold text-sm uppercase mb-6 tracking-widest animate-bounce">
            <Sparkles className="h-4 w-4" />
            Limited Time Offer
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 tracking-tight uppercase">
            Currency <span className="text-accent">Forge</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Purchase Gold Coins for recreational gameplay and receive free Sweepstakes Coins as a bonus for cash prize entries.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={`relative overflow-hidden transition-all duration-300 border-2 ${pkg.popular ? 'border-accent scale-105 shadow-2xl shadow-accent/10' : 'border-border hover:border-primary/50'}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${pkg.color} pointer-events-none`} />
              
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-6 py-1.5 rounded-bl-2xl font-bold text-xs uppercase tracking-tighter">
                  MOST POPULAR
                </div>
              )}
              
              <CardHeader className="relative pt-12 text-center">
                <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-2xl bg-secondary mb-4 shadow-inner">
                  <Coins className={`h-10 w-10 ${pkg.popular ? 'text-accent' : 'text-primary'}`} />
                </div>
                <CardTitle className="font-headline text-3xl font-bold uppercase tracking-tight">{pkg.goldCoins}</CardTitle>
                <CardDescription className="font-bold text-white/60">GOLD COINS</CardDescription>
              </CardHeader>
              
              <CardContent className="relative space-y-6 text-center">
                <div className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-background/40 backdrop-blur-sm border border-white/5">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Bonus Reward</span>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    <span className="text-2xl font-headline font-bold text-accent">{pkg.sweepsCoins} SC</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase">FREE SWEEPSTAKES COINS</span>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <span className="text-xs font-medium text-muted-foreground italic">Instant Secure Delivery</span>
                </div>
              </CardContent>
              
              <CardFooter className="relative">
                <Button className="w-full h-14 font-headline text-xl font-bold uppercase tracking-wider shadow-lg">
                  {pkg.price}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Info Grid */}
        <section className="mt-20 grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="font-headline text-2xl font-bold uppercase flex items-center gap-3">
              <div className="h-8 w-1.5 bg-accent rounded-full" />
              How it Works
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Playmakers operates as a social sports sweepstakes. Gold Coins are for entertainment and have no monetary value. Sweepstakes Coins (SC) can be used to enter contests with real prizes.
              </p>
              <ul className="space-y-3">
                {[
                  "No Purchase Necessary to play or win.",
                  "Daily login bonuses grant free SC every 24 hours.",
                  "Mail-in entries accepted for free SC credits.",
                  "Prizes can be redeemed for cash or gift cards."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-card/30 rounded-3xl p-8 border border-white/5 flex flex-col justify-center text-center">
            <h3 className="font-headline text-xl font-bold mb-4 uppercase text-accent">Safe & Secure</h3>
            <p className="text-muted-foreground text-sm mb-8">
              We use bank-grade encryption and partner with industry leaders to ensure your transactions and data are protected 24/7.
            </p>
            <div className="flex justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Replace with real provider logos if needed */}
               <div className="font-bold text-xl tracking-tighter">VISA</div>
               <div className="font-bold text-xl tracking-tighter">AMEX</div>
               <div className="font-bold text-xl tracking-tighter">APPLE PAY</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
