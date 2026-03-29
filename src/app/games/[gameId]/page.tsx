
"use client";

import { useRef, use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Users, Zap, Clock, Camera, Target, Dribbble, Flag, CheckCircle2, Waves, Bike, Mountain, Swords, Snowflake, Lock, Loader2, Info, UserCheck, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import html2canvas from 'html2canvas';

const SoccerIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="m12 12 5-3v6l-5 3-5-3v-6z" />
    <path d="M12 2v5" />
    <path d="M12 17v5" />
    <path d="M2 12h5" />
    <path d="M17 12h5" />
  </svg>
);

const BoxingIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 11h-2a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2Z" />
    <path d="M10 10H8a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2Z" />
    <path d="M18 11V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v5" />
    <path d="M6 14v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" />
  </svg>
);

function ArenaContent({ gameId }: { gameId: string }) {
  const { toast } = useToast();
  const arenaRef = useRef<HTMLDivElement>(null);
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const gameRef = useMemoFirebase(() => doc(db, "games", gameId), [db, gameId]);
  const { data: game, isLoading: isGameLoading } = useDoc(gameRef);

  const sportId = game?.sportId || 'nba';
  const fee = game?.entryFee || 0;
  const currency = game?.currencyType || 'gold';
  const status = game?.status || 'Open';
  const prizePool = game?.prizePool || 0;

  const isCreator = user?.uid === game?.creatorId;
  const myPick = isCreator ? game?.creatorPick : game?.opponentPick;
  const opponentPick = isCreator ? game?.opponentPick : game?.creatorPick;

  const themes = {
    nba: { color: "from-orange-600/20 to-orange-900/40", accent: "text-orange-500", bg: "bg-orange-500/10", icon: <Dribbble className="h-8 w-8 md:h-10 md:w-10" />, label: "NBA Arena" },
    nfl: { color: "from-green-600/20 to-green-900/40", accent: "text-green-500", bg: "bg-green-500/10", icon: <Trophy className="h-8 w-8 md:h-10 md:w-10" />, label: "NFL Gridiron" },
    hockey: { color: "from-cyan-600/20 to-cyan-900/40", accent: "text-cyan-400", bg: "bg-cyan-400/10", icon: <Snowflake className="h-8 w-8 md:h-10 md:w-10" />, label: "Frozen Fortress" },
    soccer: { color: "from-slate-600/20 to-slate-900/40", accent: "text-white", bg: "bg-white/10", icon: <SoccerIcon className="h-8 w-8 md:h-10 md:w-10" />, label: "Pitch Battle" },
    ufc: { color: "from-red-600/20 to-red-900/40", accent: "text-red-500", bg: "bg-red-500/10", icon: <Swords className="h-8 w-8 md:h-10 md:w-10" />, label: "The Octagon" },
    boxing: { color: "from-yellow-600/20 to-yellow-900/40", accent: "text-yellow-500", bg: "bg-yellow-500/10", icon: <BoxingIcon className="h-8 w-8 md:h-10 md:w-10" />, label: "Main Event" },
    mlb: { color: "from-blue-600/20 to-blue-900/40", accent: "text-blue-500", bg: "bg-blue-500/10", icon: <Trophy className="h-8 w-8 md:h-10 md:w-10" />, label: "Diamond Duel" },
    tennis: { color: "from-lime-600/20 to-lime-900/40", accent: "text-lime-400", bg: "bg-lime-400/10", icon: <Target className="h-8 w-8 md:h-10 md:w-10" />, label: "Grand Slam" },
    pickleball: { color: "from-yellow-600/20 to-yellow-900/40", accent: "text-yellow-500", bg: "bg-yellow-500/10", icon: <Trophy className="h-8 w-8 md:h-10 md:w-10" />, label: "Kitchen Combat" },
    volleyball: { color: "from-indigo-600/20 to-indigo-900/40", accent: "text-indigo-400", bg: "bg-indigo-400/10", icon: <Trophy className="h-8 w-8 md:h-10 md:w-10" />, label: "The Net Zone" },
    golf: { color: "from-emerald-600/20 to-emerald-900/40", accent: "text-emerald-400", bg: "bg-emerald-400/10", icon: <Target className="h-8 w-8 md:h-10 md:w-10" />, label: "Masters Green" },
    nascar: { color: "from-red-600/20 to-red-900/40", accent: "text-red-500", bg: "bg-red-500/10", icon: <Flag className="h-8 w-8 md:h-10 md:w-10" />, label: "Victory Lane" },
    surfing: { color: "from-blue-600/20 to-blue-400/40", accent: "text-blue-400", bg: "bg-blue-400/10", icon: <Waves className="h-8 w-8 md:h-10 md:w-10" />, label: "Pipe Masters" },
    skateboarding: { color: "from-yellow-600/20 to-yellow-400/40", accent: "text-yellow-400", bg: "bg-yellow-400/10", icon: <Zap className="h-8 w-8 md:h-10 md:w-10" />, label: "Skate Park" },
    bmx: { color: "from-red-600/20 to-red-400/40", accent: "text-red-400", bg: "bg-red-400/10", icon: <Bike className="h-8 w-8 md:h-10 md:w-10" />, label: "BMX Dirt" },
    snowboarding: { color: "from-cyan-600/20 to-cyan-400/40", accent: "text-cyan-400", bg: "bg-cyan-400/10", icon: <Mountain className="h-8 w-8 md:h-10 md:w-10" />, label: "Halfpipe" }
  };

  const theme = themes[sportId as keyof typeof themes] || themes.nba;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Arena Link Archived", description: "Coordinate link saved to clipboard." });
    } catch (err) { console.error("Failed to copy link", err); }

    if (!arenaRef.current) return;
    toast({ title: "Capturing Arena...", description: "Preparing your playmaker highlight." });

    try {
      const canvas = await html2canvas(arenaRef.current, { useCORS: true, backgroundColor: "#0D1219", scale: 2, logging: false });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `playmakers-showdown-${gameId}.png`;
      link.click();
      toast({ title: "Arena Captured!", description: "Showdown highlight downloaded to your device." });
    } catch (error) {
      toast({ variant: "destructive", title: "Capture Failed", description: "Could not generate screenshot for sharing." });
    }
  };

  if (isUserLoading || isGameLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="font-headline font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Accessing Arena Coordinates...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center p-4">
        <Navbar />
        <Card className="max-w-md w-full text-center p-8 space-y-6 bg-card/50 backdrop-blur-xl border-white/5">
          <Lock className="h-16 w-16 text-muted-foreground mx-auto opacity-20" />
          <h2 className="font-headline text-2xl font-bold uppercase tracking-tight">Locked Arena</h2>
          <p className="text-muted-foreground">You must be signed in to view live showdowns and standings.</p>
          <Link href="/login" className="block w-full">
            <Button className="w-full h-12 font-bold uppercase tracking-wider shadow-lg shadow-primary/20">Sign In to Enter</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-24 md:pt-20 bg-background relative overflow-hidden">
      <Navbar />
      <div className={`absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b ${theme.color} to-transparent -z-10 opacity-40`} />

      <main ref={arenaRef} className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="flex flex-col gap-6 md:gap-10">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="h-14 w-14 md:h-20 md:w-20 rounded-xl md:rounded-2xl bg-card border border-white/10 flex items-center justify-center shadow-2xl shrink-0">
                <div className={theme.accent}>{theme.icon}</div>
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <Badge className="bg-white/10 text-white font-bold uppercase text-[9px] md:text-[10px] tracking-widest py-0.5 md:py-1 border-none">{theme.label}</Badge>
                <h1 className="font-headline text-xl sm:text-3xl md:text-5xl font-bold uppercase tracking-tighter text-white break-all leading-tight">{game?.name || "LIVE EVENT"}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] md:text-[11px] text-muted-foreground font-bold uppercase tracking-widest pt-1 md:pt-2">
                  <span className={cn("flex items-center gap-1.5", status === 'Live' ? 'text-accent' : 'text-muted-foreground')}>
                    <Clock className={cn("h-3 w-3 md:h-3.5 md:w-3.5", status === 'Live' && 'animate-pulse')} /> 
                    {status === 'Live' ? 'LIVE SHOWDOWN' : 'WAITING FOR OPPONENT'}
                  </span>
                  <span className="flex items-center gap-1.5"><Users className="h-3 w-3 md:h-3.5 md:w-3.5" /> STAKES: {fee} {currency.toUpperCase()}</span>
                  <span className={cn("flex items-center gap-1.5 font-bold", theme.accent)}>
                    <Zap className="h-3.5 w-3.5 md:h-4 md:w-4 fill-current" />
                    {prizePool.toLocaleString()} SC PRIZE
                  </span>
                </div>
              </div>
            </div>
            <Button onClick={handleShare} className="w-full md:w-auto font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 h-12 px-6 shadow-xl">
              <Camera className="mr-2 h-4 w-4" /> Share Game
            </Button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-[#0D1219] border-[#1F2937] border-2 overflow-hidden rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                        <UserCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">You (Challenger)</p>
                        <h3 className="font-headline text-lg font-bold text-white uppercase">{myPick || "ELITE PICK"}</h3>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold uppercase text-[8px] tracking-widest w-fit">
                      LOCKED IN
                    </div>
                  </CardContent>
                </Card>

                <Card className={cn("border-2 overflow-hidden rounded-xl transition-all", status === 'Live' ? 'bg-[#0D1219] border-[#1F2937]' : 'bg-[#0D1219]/40 border-white/5 opacity-60')}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={cn("h-10 w-10 rounded-full flex items-center justify-center border", status === 'Live' ? 'bg-accent/20 border-accent/30' : 'bg-secondary/40 border-white/10')}>
                        {status === 'Live' ? <UserCheck className="h-5 w-5 text-accent" /> : <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />}
                      </div>
                      <div>
                        <p className={cn("text-[10px] font-black uppercase tracking-widest", status === 'Live' ? 'text-accent' : 'text-muted-foreground')}>Opponent</p>
                        <h3 className="font-headline text-lg font-bold text-white uppercase italic">{status === 'Live' ? (opponentPick || "ELITE PICK") : "Awaiting Entry..."}</h3>
                      </div>
                    </div>
                    <div className={cn("px-3 py-1 rounded-full font-bold uppercase text-[8px] tracking-widest w-fit border", status === 'Live' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-secondary/20 border-white/10 text-muted-foreground')}>
                      {status === 'Live' ? 'LOCKED IN' : 'INVITE SENT'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <aside className="space-y-6">
              <Card className="bg-[#1A232E]/60 border border-white/5 p-5 md:p-6 rounded-2xl">
                <h4 className="font-headline font-bold uppercase tracking-widest text-[9px] md:text-[10px] text-muted-foreground mb-4 md:mb-6">Arena Intel</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">Invite Code</span>
                    <span className="font-mono font-bold text-accent">{game?.inviteCode || "------"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">Entry Stake</span>
                    <span className="font-bold text-white uppercase text-[10px]">{fee} {currency.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">Prize Type</span>
                    <span className="font-bold text-accent uppercase text-[10px]">Sweeps Coins (SC)</span>
                  </div>
                  <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/60">Elite Reward Pool</span>
                    <div className={cn("flex items-center gap-2 font-bold", theme.accent)}>
                      <Zap className="h-4 w-4 md:h-5 md:w-5 fill-current" />
                      <span className="font-headline text-xl md:text-2xl">{prizePool.toLocaleString()} SC POOL</span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="p-5 md:p-6 rounded-2xl bg-secondary/10 border border-dashed border-white/10 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className={`h-4 w-4 ${theme.accent}`} />
                  <h5 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-white">Elite Sweepstakes Policy</h5>
                </div>
                <ul className="space-y-3 text-[10px] md:text-[11px] text-muted-foreground font-medium leading-relaxed">
                  <li className="flex gap-2"><span>•</span> <span>Gold Coin (GC) entries are social stakes that reward bonus Sweeps Coins (SC).</span></li>
                  <li className="flex gap-2"><span>•</span> <span>Sweeps Coin (SC) entries are prize stakes that reward redeemable Sweeps Coins (SC).</span></li>
                  <li className="flex gap-2"><span>•</span> <span>Winnings are automatically deposited into your Arena Vault upon official verification.</span></li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function GameArenaPage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = use(params);
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}>
      <ArenaContent gameId={gameId} />
    </Suspense>
  );
}
