"use client";

import Link from "next/link";
import { 
  Trophy, 
  Users, 
  LogOut,
  User,
  Settings,
  Gamepad2,
  LayoutDashboard,
  Coins,
  LogIn,
  Landmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-card/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight text-white uppercase italic">
            Playmakers
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-4">
          <div className="hidden items-center gap-1 md:flex">
            <NavButton href="/" icon={<LayoutDashboard />} label="Lobby" />
            <NavButton href="/games" icon={<Gamepad2 />} label="Games" />
            <NavButton href="/friends" icon={<Users />} label="Friends" />
          </div>
          
          <div className="hidden h-8 w-px bg-border md:block mx-1" />
          
          <div className="flex items-center gap-3">
            {!isUserLoading && user ? (
              <>
                <div className="hidden items-center gap-3 lg:flex">
                  <div className="flex items-center gap-1.5 rounded-full bg-secondary/30 px-3 py-1 border border-white/5">
                    <Coins className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="text-xs font-bold text-white tracking-tight">1.25M</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 border border-accent/20">
                    <Landmark className="h-3.5 w-3.5 text-accent" />
                    <span className="text-xs font-bold text-accent tracking-tight">542.50</span>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-transparent focus-visible:ring-0">
                      <Avatar className="h-10 w-10 border-2 border-primary/20 transition-all hover:border-primary">
                        <AvatarImage src={`https://picsum.photos/seed/${user.uid}/100/100`} alt={user.displayName || "User"} />
                        <AvatarFallback className="bg-secondary text-primary font-bold">
                          {user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-xl border-white/10" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-headline font-bold leading-none">{user.displayName || 'Player Arena'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 md:hidden">
                      <Link href="/" className="flex items-center w-full">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Lobby</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 md:hidden">
                      <Link href="/games" className="flex items-center w-full">
                        <Gamepad2 className="mr-2 h-4 w-4" />
                        <span>Games</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 md:hidden">
                      <Link href="/friends" className="flex items-center w-full">
                        <Users className="mr-2 h-4 w-4" />
                        <span>Friends</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5 md:hidden" />
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10">
                      <Link href="/profile" className="flex items-center w-full">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10">
                      <Link href="/settings" className="flex items-center w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/login">
                <Button variant="default" className="font-bold uppercase tracking-wider h-10 px-6 shadow-lg shadow-primary/20">
                  <LogIn className="mr-2 h-4 w-4" /> Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground transition-colors hover:text-accent hover:bg-secondary">
      <span className="[&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      <span className="text-sm font-bold uppercase tracking-wide">{label}</span>
    </Link>
  );
}