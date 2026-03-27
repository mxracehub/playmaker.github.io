"use client";

import Link from "next/link";
import { Trophy, Github, Twitter, Instagram, Youtube, ShieldCheck } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-card/30 border-t border-white/5 pt-16 pb-32 md:pb-16 mt-auto">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <span className="font-headline text-2xl font-bold tracking-tighter text-white uppercase italic">
                Playmakers
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              The premier destination for friend-to-friend sports showdowns. 
              Compete in elite arenas across Basketball, Football, Golf, and Extreme Sports.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Link href="#" className="hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-accent transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-accent transition-colors">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-headline font-bold uppercase tracking-widest text-xs text-white mb-6">LINKS</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-accent transition-colors">Lobby</Link></li>
              <li><Link href="/games" className="hover:text-accent transition-colors">Your Games</Link></li>
              <li><Link href="/friends" className="hover:text-accent transition-colors">Friends</Link></li>
            </ul>
          </div>

          {/* Legal/Support */}
          <div>
            <h4 className="font-headline font-bold uppercase tracking-widest text-xs text-white mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Sweeps Rules</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Help Center</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-green-500" />
              100% Secure Transactions
            </div>
            <div className="text-[10px] font-bold uppercase tracking-tighter text-destructive border border-destructive/30 px-3 py-1 rounded-full">
              Must be 18+ to Play
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
            © {currentYear} Playmakers Arena. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
