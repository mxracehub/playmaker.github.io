
"use client";

import Link from "next/link";
import { Trophy, Users, ShoppingBag, UserCircle, LayoutDashboard, Coins, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase";

export function Navbar() {
  const { user, isUserLoading } = useUser();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/80 backdrop-blur-md md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="hidden items-center gap-2 md:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight text-white uppercase italic">
            Playmakers
          </span>
        </Link>

        <div className="flex w-full items-center justify-around md:w-auto md:justify-end md:gap-2">
          <NavButton href="/" icon={<LayoutDashboard />} label="Lobby" />
          <NavButton href="/contests" icon={<Trophy />} label="Contests" />
          <NavButton href="/friends" icon={<Users />} label="Friends" />
          <NavButton href="/shop" icon={<ShoppingBag />} label="Shop" />
          
          <div className="hidden h-8 w-px bg-border md:block mx-2" />
          
          <div className="flex items-center gap-3 ml-2">
            {!isUserLoading && user ? (
              <>
                <div className="hidden items-center gap-1.5 rounded-full bg-secondary/50 px-3 py-1 md:flex">
                  <Coins className="h-4 w-4 text-accent" />
                  <span className="text-sm font-bold text-accent">1,250 SC</span>
                </div>
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
                    <UserCircle className="h-6 w-6" />
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="hidden md:block">
                  <Button variant="default" className="font-bold uppercase tracking-wider h-9">
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </Button>
                </Link>
                <div className="md:hidden">
                   <NavButton href="/login" icon={<LogIn />} label="Sign In" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1 px-4 py-1 text-muted-foreground transition-colors hover:text-accent md:flex-row md:gap-2 md:rounded-lg md:hover:bg-secondary">
      <span className="md:[&_svg]:h-5 md:[&_svg]:w-5 [&_svg]:h-6 [&_svg]:w-6">{icon}</span>
      <span className="text-[10px] font-medium md:text-sm">{label}</span>
    </Link>
  );
}
