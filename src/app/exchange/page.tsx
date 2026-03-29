"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Landmark as BankIcon, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CreditCard, 
  Gift, 
  Info, 
  Loader2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

export default function ExchangePage() {
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const [amount, setAmount] = useState("");

  const userProfileRef = useMemoFirebase(() => (user ? doc(db, "userProfiles", user.uid) : null), [db, user]);
  const { data: profile, isLoading } = useDoc(userProfileRef);

  const scBalance = profile?.sweepstakesCoinsBalance ?? 0;
  const ratio = 100; // 100 SC = $1.00

  const calculatedValue = amount ? (parseFloat(amount) / ratio).toFixed(2) : "0.00";

  const handleExchange = () => {
    const val = parseFloat(amount);
    if (!amount || val <= 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a valid amount of SC to exchange." });
      return;
    }
    if (val > scBalance) {
      toast({ variant: "destructive", title: "Insufficient SC", description: "You don't have enough Sweepstakes Coins for this request." });
      return;
    }
    if (val < 5000) {
      toast({ variant: "destructive", title: "Minimum Requirement", description: "Minimum exchange amount is 5,000 SC ($50.00)." });
      return;
    }

    toast({ title: "Request Submitted", description: `Your request for $${calculatedValue} is being processed by the arena bank.` });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-background relative overflow-hidden">
      <Navbar />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-accent/5 blur-[120px] rounded-full -z-10" />

      <main className="mx-auto max-w-3xl px-4 py-12">
        <header className="mb-12 text-center">
          <Link href="/profile" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-accent mb-6 transition-colors">
            <ArrowLeft className="h-3 w-3" /> Back to Profile
          </Link>
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 mb-6">
            <BankIcon className="h-8 w-8 text-accent" />
          </div>
          <h1 className="font-headline text-4xl font-bold uppercase tracking-tight mb-2">SC <span className="text-accent">Exchange</span></h1>
          <p className="text-muted-foreground">Redeem your bonus winnings for real prizes at the 100:1 arena ratio</p>
        </header>

        <div className="grid gap-8">
          {/* Balance Overview */}
          <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Available to Redeem</p>
                  <p className="text-4xl font-headline font-bold text-accent">{scBalance.toLocaleString()} SC</p>
                </div>
                <div className="h-px w-full md:h-12 md:w-px bg-white/5" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Estimated Value</p>
                  <p className="text-4xl font-headline font-bold text-white">${(scBalance / ratio).toFixed(2)} USD</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchange Form */}
          <Card className="bg-card/50 backdrop-blur-sm border-white/5 overflow-hidden">
            <CardHeader className="bg-secondary/20 border-b">
              <CardTitle className="font-headline text-xl uppercase tracking-tighter">Redemption Request</CardTitle>
              <CardDescription>Minimum redemption is 5,000 SC ($50.00)</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sc-amount" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount to Exchange</Label>
                  <button 
                    onClick={() => setAmount(scBalance.toString())}
                    className="text-[10px] font-bold uppercase text-accent hover:underline"
                  >
                    Max Balance
                  </button>
                </div>
                <div className="relative">
                  <Input 
                    id="sc-amount"
                    type="number"
                    placeholder="Enter SC amount..."
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-16 text-2xl font-headline font-bold bg-secondary/30 border-white/5 focus:border-accent/50 pr-24"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-accent">
                    SC
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">Redemption Value</span>
                  </div>
                  <span className="font-headline font-bold text-xl text-white">${calculatedValue} USD</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Payout Method</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button className="flex items-center gap-4 p-4 rounded-xl border-2 border-accent bg-accent/10 transition-all text-left">
                    <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <BankIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Bank Transfer</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Verified Account Required</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-4 p-4 rounded-xl border-2 border-transparent bg-secondary/20 hover:border-white/10 transition-all text-left">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                      <Gift className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Digital Gift Card</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Instant Delivery Available</p>
                    </div>
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-secondary/10 border-t p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground text-center uppercase font-bold tracking-widest">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                Identity verified via Secure Playmaker Vault
              </div>
              <Button onClick={handleExchange} className="w-full h-14 font-headline text-xl font-bold uppercase tracking-widest bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl shadow-accent/20">
                Process Redemption <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </CardFooter>
          </Card>

          <section className="grid md:grid-cols-2 gap-6 opacity-80">
            <div className="p-6 rounded-2xl bg-secondary/10 border border-dashed text-center space-y-2">
              <CreditCard className="h-6 w-6 mx-auto text-muted-foreground" />
              <h4 className="text-xs font-bold uppercase tracking-widest">Processing Time</h4>
              <p className="text-[10px] text-muted-foreground">Bank transfers typically take 3-5 business days to clear the arena bank.</p>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/10 border border-dashed text-center space-y-2">
              <ShieldCheck className="h-6 w-6 mx-auto text-muted-foreground" />
              <h4 className="text-xs font-bold uppercase tracking-widest">Compliance</h4>
              <p className="text-[10px] text-muted-foreground">All redemptions are subject to the arena's Sweepstakes Rules and KYC check.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
