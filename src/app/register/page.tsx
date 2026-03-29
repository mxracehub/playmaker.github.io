"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Mail, Lock, ShieldCheck, ArrowLeft, Loader2, LogOut, Smartphone, ExternalLink } from "lucide-react";
import { useAuth, useUser, initiateEmailSignUp, useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { validateTOTP, getOTPAuthUri } from "@/lib/2fa";
import { verifyRecaptchaAction } from "@/app/actions/recaptcha";

declare global {
  interface window {
    grecaptcha: any;
  }
}

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

  const userProfileRef = useMemoFirebase(() => (user ? doc(db, "userProfiles", user.uid) : null), [db, user]);
  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;

    if (user && !isUserLoading && !isProfileLoading) {
      if (passed2FA) {
        hasRedirected.current = true;
        router.push("/profile");
      } else if (!show2FA) {
        setShow2FA(true);
      }
    }
  }, [user, isUserLoading, isProfileLoading, passed2FA, show2FA, router]);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsVerifying(true);

    if (typeof window !== 'undefined' && window.grecaptcha?.enterprise) {
      window.grecaptcha.enterprise.ready(async () => {
        try {
          const token = await window.grecaptcha.enterprise.execute('6LfU-ZssAAAAAFcYu-2NemXNroyLyheF3YzMCh9v', { action: 'SIGNUP' });
          const assessment = await verifyRecaptchaAction(token, 'SIGNUP');
          
          if (assessment.success) {
            initiateEmailSignUp(auth, email, password);
          } else {
            setIsVerifying(false);
            toast({
              variant: "destructive",
              title: "Registration Blocked",
              description: "Automated activity detected. Use a different network or try again later.",
            });
          }
        } catch (error) {
          console.error('reCAPTCHA execution failed:', error);
          initiateEmailSignUp(auth, email, password);
        }
      });
    } else {
      initiateEmailSignUp(auth, email, password);
    }
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const isValid = validateTOTP(user.uid, user.email || '', verificationCode);

    if (isValid) {
      // Initialize profile with 2FA enabled by default
      setDocumentNonBlocking(doc(db, "userProfiles", user.uid), {
        id: user.uid,
        email: user.email,
        username: user.email?.split('@')[0].toUpperCase() || 'PLAYMAKER',
        role: 'player',
        dateJoined: new Date().toISOString(),
        goldCoinsBalance: 0,
        sweepstakesCoinsBalance: 0,
        bio: "Elite Playmaker locked in.",
        profilePictureUrl: `https://picsum.photos/seed/${user.uid}/400/400`,
        twoFactorEnabled: true,
        friendIds: ['house-admin'],
      }, { merge: true });

      setPassed2FA(true);
      toast({
        title: "Registration Complete",
        description: "Welcome to the arena. Your profile is established.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "Invalid security code. Please check your authenticator app.",
      });
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setShow2FA(false);
    setIsVerifying(false);
    setVerificationCode("");
  };

  const otpUri = user ? getOTPAuthUri(user.uid, user.email || '') : "";
  const qrCodeUrl = otpUri ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpUri)}` : "";

  const showLoading = user && (isProfileLoading || isUserLoading || isVerifying) && !show2FA && !passed2FA;

  if (showLoading) {
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
              <CardTitle className="text-2xl font-headline font-bold uppercase tracking-tight">Identity Verification</CardTitle>
              <CardDescription>
                Account creation requires 2FA. Link your authenticator to finalize.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleVerify2FA}>
              <CardContent className="space-y-6 flex flex-col items-center">
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-accent/5 border border-accent/20 w-full">
                    <Smartphone className="h-5 w-5 text-accent" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent text-center">
                      Mobile Quick-Link
                    </p>
                    <a href={otpUri} className="w-full">
                      <Button type="button" variant="outline" size="sm" className="w-full h-10 font-bold uppercase text-[10px] tracking-widest border-accent/30 hover:bg-accent/10">
                        <ExternalLink className="mr-2 h-3.5 w-3.5" /> Setup in App
                      </Button>
                    </a>
                  </div>
                  
                  <div className="flex justify-center p-2 bg-white rounded-lg shadow-inner">
                    {qrCodeUrl && (
                      <Image 
                        src={qrCodeUrl} 
                        alt="2FA QR Code" 
                        width={160} 
                        height={160} 
                        className="rounded-sm"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2 w-full text-center">
                  <Label htmlFor="code" className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">Verification Code</Label>
                  <Input 
                    id="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]*"
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
                  Access Granted
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout} 
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Cancel and sign out
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D1219] px-4 py-20">
      <div className="w-full max-w-md flex-1 flex flex-col justify-center">
        <div className="flex justify-center mb-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/20">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <span className="font-headline text-2xl font-bold tracking-tighter text-white uppercase italic">
              Playmakers
            </span>
          </Link>
        </div>

        <Card className="bg-card/30 backdrop-blur-sm border-white/5 shadow-2xl overflow-hidden mb-12">
          <CardHeader className="space-y-2 text-center pb-8 pt-10">
            <CardTitle className="text-4xl font-headline font-bold uppercase tracking-tight text-white">JOIN THE ELITE</CardTitle>
            <CardDescription className="text-muted-foreground font-medium text-sm">
              Create your profile and start challenging friends
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignUp}>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">EMAIL</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="bradyprice17@gmail.com" 
                    className="pl-12 h-14 bg-secondary/30 border-white/5 text-white text-base rounded-xl" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" id="password-label" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">PASSWORD</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••"
                    className="pl-12 h-14 bg-secondary/30 border-white/5 text-white text-base rounded-xl" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed px-4 text-center italic">
                By signing up, you agree to our Terms of Service and Privacy Policy. Must be 18+ to enter sweepstakes.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-6 pb-12">
              <Button type="submit" disabled={isVerifying} className="w-full h-16 font-headline text-xl font-bold uppercase tracking-[0.15em] bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-xl">
                {isVerifying ? <Loader2 className="animate-spin" /> : <>CREATE ACCOUNT</>}
              </Button>
              <div className="flex items-center justify-center gap-2 text-[9px] text-muted-foreground uppercase font-black tracking-[0.25em]">
                <ShieldCheck className="h-3 w-3 text-accent" /> SECURED BY RECAPTCHA ENTERPRISE
              </div>
              <p className="text-center text-xs text-muted-foreground font-medium">
                Already a Playmaker?{" "}
                <Link href="/login" className="text-accent font-bold hover:underline ml-1">Sign In</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
