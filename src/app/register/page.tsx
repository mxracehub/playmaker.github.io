"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Mail, Lock, UserCircle, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth, useUser, initiateEmailSignUp, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [passed2FA, setPassed2FA] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const userProfileRef = useMemoFirebase(() => (user ? doc(db, "users", user.uid) : null), [db, user]);
  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  useEffect(() => {
    // Only proceed with redirect logic if a user is logged in and all profile state is settled
    if (user && !isUserLoading && !isProfileLoading) {
      if (profile?.twoFactorEnabled) {
        if (passed2FA) {
          router.push("/profile");
        } else {
          setShow2FA(true);
        }
      } else {
        // Safe to proceed to profile
        router.push("/profile");
      }
    }
  }, [user, isUserLoading, isProfileLoading, profile, passed2FA, router]);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsVerifying(true);
    initiateEmailSignUp(auth, email, password);
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length === 6) {
      setPassed2FA(true);
      toast({
        title: "Registration Complete",
        description: "Welcome to the arena.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "Please enter a valid 6-digit code.",
      });
    }
  };

  if (user && (isProfileLoading || isUserLoading || isVerifying) && !show2FA && !passed2FA) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="font-headline font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
            Setting up Arena Access...
          </p>
        </div>
      </div>
    );
  }

  if (show2FA && !passed2FA) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="w-full max-w-md z-10">
          <Card className="bg-card/50 backdrop-blur-xl border-white/5 shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-2xl font-headline font-bold uppercase tracking-tight">Security Verification</CardTitle>
              <CardDescription>
                Two-factor authentication is required to secure your new account.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleVerify2FA}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center block">Verification Code</Label>
                  <Input 
                    id="code"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000" 
                    className="text-center text-3xl tracking-[0.5em] font-headline h-16 bg-secondary/30 border-white/5"
                    autoFocus
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full h-12 font-bold uppercase tracking-wider">
                  Complete Registration
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShow2FA(false);
                    setIsVerifying(false);
                  }} 
                  className="text-muted-foreground"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Go back
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
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
              <Button type="submit" disabled={isVerifying} className="w-full h-12 font-bold uppercase tracking-wider text-lg">
                {isVerifying ? <Loader2 className="animate-spin" /> : <>Create Account <UserCircle className="ml-2 h-5 w-5" /></>}
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
