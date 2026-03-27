
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, ArrowRight, Mail, Lock, UserCircle } from "lucide-react";
import { useAuth, useUser, initiateEmailSignUp } from "@/firebase";
import { useEffect } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push("/profile");
    }
  }, [user, isUserLoading, router]);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    initiateEmailSignUp(auth, email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-md z-10">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/20">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <span className="font-headline text-2xl font-bold tracking-tighter text-white uppercase italic">
              Playmakers
            </span>
          </Link>
        </div>

        <Card className="bg-card/50 backdrop-blur-xl border-white/5 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-headline font-bold uppercase tracking-tight">Join the Elite</CardTitle>
            <CardDescription className="text-muted-foreground">
              Create your profile and start challenging friends
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignUp}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-10 bg-secondary/30 border-white/5" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-10 bg-secondary/30 border-white/5" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight px-1">
                By signing up, you agree to our Terms of Service and Privacy Policy. Must be 18+ to enter sweepstakes.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full h-12 font-bold uppercase tracking-wider text-lg">
                Create Account <UserCircle className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already a Playmaker?{" "}
                <Link href="/login" className="text-accent font-bold hover:underline">Sign In</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
