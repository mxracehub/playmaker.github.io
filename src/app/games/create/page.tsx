"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Coins, Zap, ShieldCheck, Gamepad2, Users, ArrowRight, Dribbble, Target, Flag, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const sports = [
  { 
    id: 'nba', 
    name: 'Basketball', 
    icon: <Dribbble className="w-5 h-5" />, 
    color: "text-orange-500",
    options: ["Lakers", "Celtics", "Warriors", "Mavericks", "Nuggets"]
  },
  { 
    id: 'nfl', 
    name: 'Football', 
    icon: <Trophy className="w-5 h-5" />, 
    color: "text-green-500",
    options: ["Chiefs", "Eagles", "49ers", "Cowboys", "Ravens"]
  },
  { 
    id: 'golf', 
    name: 'Golf', 
    icon: <Target className="w-5 h-5" />, 
    color: "text-emerald-400",
    options: ["Scottie Scheffler", "Rory McIlroy", "Jon Rahm", "Tiger Woods", "Brooks Koepka"]
  },
  { 
    id: 'nascar', 
    name: 'NASCAR', 
    icon: <Flag className="w-5 h-5" />, 
    color: "text-red-500",
    options: ["Kyle Larson", "Chase Elliott", "Denny Hamlin", "William Byron", "Joey Logano"]
  },
];

export default function CreateGamePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedPick, setSelectedPick] = useState<string>("");
  const [currency, setCurrency] = useState("gold");
  const [fee, setFee] = useState("1000");

  const balances = {
    gold: 1250000,
    sweeps: 542.50
  };

  const handleCreate = () => {
    if (!selectedSport) {
      toast({ variant: "destructive", title: "Missing Arena", description: "Please select a sport for your game." });
      return;
    }
    if (!selectedPick) {
      toast({ variant: "destructive", title: "Selection Required", description: "Please pick your winning team or athlete." });
      return;
    }

    const cost = parseFloat(fee);
    const available = currency === "gold" ? balances.gold : balances.sweeps;

    if (cost > available) {
      toast({ 
        variant: "destructive", 
        title: "Insufficient Funds", 
        description: `You need more ${currency === "gold" ? "Gold Coins" : "Sweeps Coins"} to start this game.` 
      });
      return;
    }

    toast({ title: "Game Initialized", description: `You've locked in ${selectedPick}. Entering Arena...` });
    
    setTimeout(() => {
      const gameId = `game-${Math.floor(Math.random() * 9000) + 1000}`;
      router.push(`/games/${gameId}?sport=${selectedSport}&pick=${encodeURIComponent(selectedPick)}&fee=${fee}&currency=${currency}`);
    }, 1200);
  };

  const currentSport = sports.find(s => s.id === selectedSport);

  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-background relative overflow-hidden">
      <Navbar />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />

      <main className="mx-auto max-w-3xl px-4 py-12">
        <header className="mb-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-6">
            <Gamepad2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-headline text-4xl font-bold uppercase tracking-tight mb-2">Create <span className="text-accent">Game</span></h1>
          <p className="text-muted-foreground">Select your arena, set the stakes, and pick your winner</p>
        </header>

        <div className="grid gap-8">
          <Card className="bg-card/50 backdrop-blur-sm border-white/5 overflow-hidden">
            <CardHeader className="border-b bg-secondary/20">
              <CardTitle className="font-headline text-xl uppercase tracking-tighter">Arena Configuration</CardTitle>
              <CardDescription>Lock in your choice for the victory podium</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Sport Selection */}
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Sport</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {sports.map((sport) => (
                    <button
                      key={sport.id}
                      onClick={() => {
                        setSelectedSport(sport.id);
                        setSelectedPick(""); // Reset pick when sport changes
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                        selectedSport === sport.id 
                          ? 'bg-primary/20 border-primary scale-105 shadow-lg shadow-primary/10' 
                          : 'bg-secondary/30 border-transparent hover:border-white/10'
                      }`}
                    >
                      <div className={`mb-3 ${sport.color}`}>{sport.icon}</div>
                      <span className="text-xs font-bold uppercase tracking-tight">{sport.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Winner Pick Selection */}
              {selectedSport && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Pick Your Winning {selectedSport === 'golf' || selectedSport === 'nascar' ? 'Athlete' : 'Team'}
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentSport?.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => setSelectedPick(option)}
                        className={`flex items-center justify-between p-4 rounded-xl border text-sm font-bold transition-all ${
                          selectedPick === option
                            ? 'bg-accent/10 border-accent text-accent'
                            : 'bg-secondary/20 border-white/5 hover:border-white/20'
                        }`}
                      >
                        {option}
                        {selectedPick === option && <CheckCircle2 className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Currency Selection */}
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Currency Stakes ($1 = 100 Coins)</Label>
                <RadioGroup defaultValue="gold" className="grid grid-cols-1 md:grid-cols-2 gap-4" onValueChange={setCurrency}>
                  <div className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${currency === 'gold' ? 'border-primary bg-primary/5' : 'border-white/5 bg-secondary/10'}`}>
                    <RadioGroupItem value="gold" id="gold" className="absolute top-4 right-4" />
                    <Label htmlFor="gold" className="flex items-center gap-3 cursor-pointer">
                      <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <Coins className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="font-bold uppercase text-sm">Gold Coins</p>
                        <p className="text-[10px] text-muted-foreground italic">100 GC = $1.00 Value</p>
                      </div>
                    </Label>
                  </div>
                  <div className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${currency === 'sweeps' ? 'border-accent bg-accent/5' : 'border-white/5 bg-secondary/10'}`}>
                    <RadioGroupItem value="sweeps" id="sweeps" className="absolute top-4 right-4" />
                    <Label htmlFor="sweeps" className="flex items-center gap-3 cursor-pointer">
                      <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-bold uppercase text-sm">Sweeps Coins</p>
                        <p className="text-[10px] text-accent font-bold italic">100 SC = $1.00 Value</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Fee and Settings */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fee" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Entry Fee</Label>
                  <Select value={fee} onValueChange={setFee}>
                    <SelectTrigger id="fee" className="bg-secondary/30 border-white/5 h-12">
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 ($1.00)</SelectItem>
                      <SelectItem value="1000">1,000 ($10.00)</SelectItem>
                      <SelectItem value="5000">5,000 ($50.00)</SelectItem>
                      <SelectItem value="10000">10,000 ($100.00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="players" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Max Players</Label>
                  <Input type="number" id="players" defaultValue="2" className="bg-secondary/30 border-white/5 h-12" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-secondary/10 border-t p-6 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                Your balance: <span className="font-bold text-white">{currency === 'gold' ? balances.gold.toLocaleString() : balances.sweeps.toFixed(2)} {currency.toUpperCase()}</span>
              </div>
              <Button onClick={handleCreate} className="w-full h-14 font-headline text-xl font-bold uppercase tracking-widest shadow-xl shadow-primary/20">
                Forge Game Arena <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-primary/5 border-primary/20 border-dashed">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg uppercase leading-tight mb-1">Challenge a Friend</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Once you've locked in your winner, invite your squad to see if they can beat your pick. Prizes are distributed automatically based on live performance results.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
