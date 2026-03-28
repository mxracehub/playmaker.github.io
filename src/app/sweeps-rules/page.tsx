"use client";

import { Navbar } from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trophy, ShieldCheck, AlertCircle, Coins, Landmark, Scale, Info } from "lucide-react";

export default function SweepsRulesPage() {
  return (
    <div className="min-h-screen pb-24 pt-20 bg-background relative overflow-hidden">
      <Navbar />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-accent/5 blur-[120px] rounded-full -z-10" />

      <main className="mx-auto max-w-4xl px-4 py-12">
        <header className="mb-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/50 border border-white/10 mb-6 shadow-xl">
            <Trophy className="h-8 w-8 text-accent" />
          </div>
          <h1 className="font-headline text-4xl font-bold uppercase tracking-tight mb-4">Official <span className="text-accent">Sweeps Rules</span></h1>
          <p className="text-muted-foreground uppercase font-bold tracking-widest text-xs">Version 1.0 • Effective January 21, 2026</p>
        </header>

        <div className="space-y-8 bg-card/30 backdrop-blur-sm border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl">
          
          {/* Universal Notice */}
          <div className="p-6 rounded-2xl bg-accent/10 border border-accent/20 space-y-2 text-center">
            <p className="text-sm font-black uppercase tracking-widest text-accent">No Purchase Necessary to Enter or Win</p>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              A PURCHASE OR PAYMENT OF ANY KIND WILL NOT INCREASE YOUR CHANCES OF WINNING. 
              VOID WHERE PROHIBITED BY LAW.
            </p>
          </div>

          <section className="space-y-10">
            <div>
              <h2 className="text-2xl font-headline font-bold uppercase flex items-center gap-3 mb-4">
                <span className="text-accent">01.</span> Sponsor
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                The Playmakers Arena Sweepstakes (the "Sweepstakes") is sponsored by Playmaker LLC, 807 East Kelly Drive, Loveland, Colorado, 80537 (the "Sponsor").
              </p>
            </div>

            <Separator className="bg-white/5" />

            <div>
              <h2 className="text-2xl font-headline font-bold uppercase flex items-center gap-3 mb-4">
                <span className="text-accent">02.</span> Eligibility
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                <p>The Sweepstakes is open only to legal residents of the continental United States and Hawaii who are at least 18 years of age at the time of entry.</p>
                <div className="bg-destructive/5 p-4 rounded-xl border border-destructive/20">
                  <p className="font-bold text-destructive mb-2 uppercase text-xs tracking-widest flex items-center gap-2">
                    <AlertCircle className="h-3 w-3" /> Excluded Territories
                  </p>
                  <p className="text-xs">Residents of WASHINGTON, NEW YORK, NEVADA, IDAHO, KENTUCKY, MICHIGAN, VERMONT, NEW JERSEY, DELAWARE, WEST VIRGINIA, PENNSYLVANIA, RHODE ISLAND, CONNECTICUT, MARYLAND, LOUISIANA, MONTANA, ARIZONA, TENNESSEE, and CALIFORNIA are not eligible to participate.</p>
                </div>
              </div>
            </div>

            <Separator className="bg-white/5" />

            <div>
              <h2 className="text-2xl font-headline font-bold uppercase flex items-center gap-3 mb-4">
                <span className="text-accent">03.</span> Entry Methods
              </h2>
              <div className="grid gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 p-5 rounded-2xl bg-secondary/20 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-accent font-bold uppercase text-[10px] tracking-widest">
                      <Landmark className="h-3 w-3" /> Monthly Trivia
                    </div>
                    <p className="font-bold text-white text-sm">Trivia Rewards</p>
                    <p className="text-xs text-muted-foreground">Correctly answer arena trivia questions once per month to receive promotional Gold and Sweeps Coins.</p>
                  </div>
                  <div className="flex-1 p-5 rounded-2xl bg-secondary/20 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest">
                      <Coins className="h-3 w-3" /> Social Giveaways
                    </div>
                    <p className="font-bold text-white text-sm">Arena Alerts</p>
                    <p className="text-xs text-muted-foreground">Follow Playmakers on social media for periodic code drops and giveaway entries.</p>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-secondary/20 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-yellow-500 font-bold uppercase text-[10px] tracking-widest">
                    <ShieldCheck className="h-3 w-3" /> Gold Coin Bonuses
                  </div>
                  <p className="font-bold text-white text-sm">Purchase Bonuses</p>
                  <p className="text-xs text-muted-foreground">Receive bonus Sweeps Coins as a free reward with the purchase of select Gold Coin packages used for recreational social play.</p>
                </div>
              </div>
            </div>

            <Separator className="bg-white/5" />

            <div>
              <h2 className="text-2xl font-headline font-bold uppercase flex items-center gap-3 mb-4">
                <span className="text-accent">04.</span> Prize Redemption
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                <p>Sweeps Coins (SC) won through gameplay are eligible for redemption for prizes, including digital gift cards or bank transfers, subject to verification.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-background/50 p-4 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Exchange Ratio</p>
                    <p className="text-lg font-headline font-bold text-accent">100 SC = $1.00</p>
                  </div>
                  <div className="bg-background/50 p-4 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Min Redemption</p>
                    <p className="text-lg font-headline font-bold text-white">5,000 SC</p>
                  </div>
                  <div className="bg-background/50 p-4 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Playthrough</p>
                    <p className="text-lg font-headline font-bold text-white">1x Required</p>
                  </div>
                </div>
                <p className="text-xs italic">Florida Exception: Maximum redemption value is limited to $5,000 USD per day for Florida residents.</p>
              </div>
            </div>

            <Separator className="bg-white/5" />

            <div className="p-8 rounded-[2rem] bg-accent/5 border border-accent/20">
              <h2 className="text-2xl font-headline font-bold uppercase flex items-center gap-3 mb-6 text-accent">
                <Scale className="h-6 w-6" />
                <span className="text-white">Legal</span> Compliance
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                <p>All participants must complete KYC (Know Your Customer) verification prior to any prize redemption. Decisions of the Sponsor regarding the administration and operation of the Sweepstakes are final and binding in all matters.</p>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-background/50 border border-white/5">
                  <Info className="h-5 w-5 text-primary" />
                  <p className="text-xs">Sweepstakes are governed by the laws of the State of Colorado and are subject to all applicable federal, state, and local laws and regulations.</p>
                </div>
              </div>
            </div>
          </section>

          <footer className="pt-12 text-center space-y-4">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Questions about the Arena Rules?</p>
            <div className="flex flex-col items-center gap-2">
              <a href="mailto:support@playmakers.arena" className="text-accent font-bold hover:underline">support@playmakers.arena</a>
              <p className="text-[10px] text-muted-foreground">Playmaker LLC • 807 E. Kelly Dr., Loveland, USA 80537</p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
