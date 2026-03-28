"use client";

import { Navbar } from "@/components/navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Scale, AlertTriangle, FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen pb-24 pt-20 bg-background relative overflow-hidden">
      <Navbar />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />

      <main className="mx-auto max-w-4xl px-4 py-12">
        <header className="mb-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/50 border border-white/10 mb-6 shadow-xl">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-headline text-4xl font-bold uppercase tracking-tight mb-4">Terms of <span className="text-accent">Service</span></h1>
          <p className="text-muted-foreground uppercase font-bold tracking-widest text-xs">Version 1.0 • Effective January 21, 2026</p>
        </header>

        <div className="space-y-8 bg-card/30 backdrop-blur-sm border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl">
          {/* Important Notice */}
          <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 space-y-3">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <h2 className="font-bold uppercase tracking-tighter">Important Notice</h2>
            </div>
            <p className="text-sm font-bold leading-relaxed">
              THIS AGREEMENT IS SUBJECT TO BINDING ARBITRATION AND A WAIVER OF CLASS ACTION RIGHTS AS DETAILED IN CLAUSE 26.
            </p>
          </div>

          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-headline font-bold uppercase flex items-center gap-3 mb-4">
                <span className="text-accent">01.</span> Introduction
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                <p>Welcome to Mxracehub.com! Before the fun starts, we need to make sure you know how we operate and what it means when you register an account.</p>
                <div className="bg-secondary/20 p-4 rounded-xl border border-white/5">
                  <p className="font-bold text-white mb-1 uppercase text-xs tracking-widest">Who are we</p>
                  <p>The Platform is provided by MxRaceHub LLC, a company duly incorporated under Colorado law, with the register number 20261266660 and registered office at 807 East Kelly Drive, Loveland, Colorado, 80537. Colorado (hereinafter “MxRaceHub”, “we”, “us” or “our”).</p>
                </div>
                <p>By registering on the Platform, you accept these Terms and Conditions (“Terms”) and enter into a binding agreement with us which applies to your access to, and use of, our Platform and our Games.</p>
                <p className="font-bold text-white italic">PLEASE TAKE THE TIME TO READ THESE TERMS CAREFULLY AND IN THEIR ENTIRETY. BY ACCEPTING THESE TERMS, YOU REPRESENT – AND WE ARE RELYING ON YOUR REPRESENTATION – THAT YOU HAVE DONE SO.</p>
              </div>
            </div>

            <Separator className="bg-white/5" />

            <div>
              <h2 className="text-2xl font-headline font-bold uppercase flex items-center gap-3 mb-4">
                <span className="text-accent">02.</span> MxRaceHub Statement
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                <p className="font-bold text-white">2.1. The following are "Excluded Territories”:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Any country other than the continental United States of America and Hawaii (“US”);</li>
                  <li>Within the US the following States are excluded: WASHINGTON, NEW YORK, NEVADA, IDAHO, KENTUCKY, MICHIGAN, VERMONT, NEW JERSEY, DELAWARE, WEST VIRGINIA, PENNSYLVANIA, RHODE ISLAND, CONNECTICUT, MARYLAND, LOUISIANA, MONTANA, ARIZONA, TENNESSEE, CALIFORNIA.</li>
                </ul>
                <p>2.3. NO PURCHASE OR PAYMENT IS NECESSARY TO PARTICIPATE OR PLAY THE GAMES. A PURCHASE OR PAYMENT OF ANY KIND WILL NOT INCREASE YOUR CHANCES OF WINNING.</p>
                <p>2.4. THE PLATFORM AND GAMES DO NOT OFFER REAL MONEY GAMBLING, AND NO ACTUAL MONEY IS REQUIRED TO PLAY.</p>
              </div>
            </div>

            <Separator className="bg-white/5" />

            <div>
              <h2 className="text-2xl font-headline font-bold uppercase flex items-center gap-3 mb-4">
                <span className="text-accent">03.</span> Definitions
              </h2>
              <div className="grid gap-4 text-sm">
                {[
                  { term: "Collective Action", desc: "Any claim, action, or proceeding asserted or pursued as a class action or group action." },
                  { term: "Gold Coin", desc: "Virtual social gameplay currency with no monetary value." },
                  { term: "Sweeps Coins", desc: "Sweepstakes entries used for Promotional Play." },
                  { term: "Prizes", desc: "Valuable prizes that can be redeemed using Sweeps Coins won through Promotional Play." }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-1 p-3 rounded-lg bg-secondary/10 border border-white/5">
                    <span className="font-bold text-white uppercase text-[10px] tracking-widest">{item.term}</span>
                    <span className="text-muted-foreground">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-white/5" />

            <div>
              <h2 className="text-2xl font-headline font-bold uppercase flex items-center gap-3 mb-4">
                <span className="text-accent">04.</span> Registration & Customer Warranties
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                <p>4.2. Warranties: You declare and warrant that you are over 18 years of age, you do not reside in Excluded Territories, and you use our Platform strictly in your personal capacity for recreational and entertainment purposes.</p>
                <p className="text-destructive font-bold">Any attempt to circumvent location restrictions via VPN or proxy is a material breach of these terms.</p>
              </div>
            </div>

            <Separator className="bg-white/5" />

            <div>
              <h2 className="text-2xl font-headline font-bold uppercase flex items-center gap-3 mb-4">
                <span className="text-accent">06.</span> Your Customer Account
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                <p>6.1. Single Account: You are allowed to have only one Customer Account on the Platform. Creating multiple accounts may result in cancellation of all accounts and forfeiture of any balances.</p>
                <p>6.3. Security: It is your sole responsibility to ensure your login details are kept secure. We strongly recommend enabling Multi-Factor Authentication.</p>
              </div>
            </div>

            <Separator className="bg-white/5" />

            <div>
              <h2 className="text-2xl font-headline font-bold uppercase flex items-center gap-3 mb-4">
                <span className="text-accent">13.</span> Redemption of Prizes
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                <p>13.1. Only Sweeps Coins won through gameplay can be redeemed for Prizes. All Sweeps Coins must be played at least once before redemption eligibility.</p>
                <p>13.4. Redemptions are processed at an implied rate of 100 Sweeps Coins per 1 USD.</p>
                <p>13.6. Verification process may cause delays in payments. We process one redemption request per 24-hour period.</p>
              </div>
            </div>

            <Separator className="bg-white/5" />

            <div className="p-8 rounded-[2rem] bg-accent/5 border border-accent/20">
              <h2 className="text-2xl font-headline font-bold uppercase flex items-center gap-3 mb-6 text-accent">
                <Scale className="h-6 w-6" />
                <span className="text-white">26.</span> Dispute Resolution & Arbitration
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                <p className="font-bold text-white italic">PLEASE READ THIS SECTION CAREFULLY AS IT REQUIRES YOU TO ARBITRATE DISPUTES INDIVIDUALLY.</p>
                <p>By agreeing to these Terms, you and MxRaceHub agree that any and all Disputes shall be referred to and finally resolved by binding arbitration administered by the American Arbitration Association (AAA).</p>
                <p className="font-bold text-white">WAIVER OF COLLECTIVE ACTION: BOTH PARTIES AGREE THAT ANY PROCEEDING TO RESOLVE A DISPUTE WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED OR REPRESENTATIVE ACTION.</p>
                <p>You have the right to opt-out of this arbitration agreement within 30 days of account creation by sending written notice to: MxRaceHub LLC, 123 Racing Ln, Motocross City, USA 12345.</p>
              </div>
            </div>

            <Separator className="bg-white/5" />

            <div>
              <h2 className="text-2xl font-headline font-bold uppercase flex items-center gap-3 mb-4">
                <span className="text-accent">29.</span> Governing Law
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                These Terms and your use of the Platform are governed by and interpreted in accordance with the laws of the State of Colorado, without regard for its choice of conflict of law principles.
              </p>
            </div>
          </section>

          <footer className="pt-12 text-center space-y-4">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Questions or Complaints?</p>
            <div className="flex flex-col items-center gap-2">
              <a href="mailto:mxracehub@proton.me" className="text-accent font-bold hover:underline">mxracehub@proton.me</a>
              <p className="text-[10px] text-muted-foreground">MxRaceHub LLC • 807 E. Kelly Dr., Loveland, USA 80537</p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
