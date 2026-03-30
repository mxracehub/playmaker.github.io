"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, ArrowRight, Mail, Lock, ShieldCheck, Loader2, LogOut, Smartphone, ExternalLink, Copy, Check } from "lucide-react";
import { useAuth, useUser, initiateEmailSignIn, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { validateTOTP, getOTPAuthUri, getSecretForUser } from "@/lib/2fa";
import { verifyRecaptchaAction } from "@/app/actions/recaptcha";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [passed2FA, setPassed2FA] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

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

    if (user && !isUserLoading && !isProfileLoading && profile) {
      const is2FAEnabled = profile.twoFactorEnabled !== false; 

      if (!is2FAEnabled || passed2FA) {
        hasRedirected.current = true;
        router.push("/profile");
      } else {
        setShow2FA(true);
      }
    }
  }, [user, isUserLoading, isProfileLoading, profile, passed2FA, router]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsVerifying(true);

    if (typeof window !== 'undefined' && window.grecaptcha?.enterprise) {
      window.grecaptcha.enterprise.ready(async () => {
        try {
          const token = await window.grecaptcha.enterprise.execute('6LfU-ZssAAAAAFcYu-2NemXNroyLyheF3YzMCh9v', { action: 'LOGIN' });
          const assessment = await verifyRecaptchaAction(token, 'LOGIN');
          
          if (assessment.success) {
            initiateEmailSignIn(auth, email, password);
          } else {
            setIsVerifying(false);
            toast({
              variant: "destructive",
              title: "Security Shield Triggered",
              description: "Automated activity detected. Please try again later.",
            });
          }
        } catch (error) {
          console.error('reCAPTCHA execution failed:', error);
          initiateEmailSignIn(auth, email, password);
        }
      });
    } else {
      initiateEmailSignIn(auth, email, password);
    }
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const isValid = validateTOTP(user.uid, user.email || '', verificationCode);

    if (isValid) {
      setPassed2FA(true);
      toast({
        title: "Access Granted",
        description: "Identity verified successfully.",
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

  const handleCopySecret = () => {
    if (!user) return;
    const secret = getSecretForUser(user.uid);
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Key Copied", description: "Secret copied to clipboard for manual setup." });
  };

  const otpUri = user ? getOTPAuthUri(user.uid, user.email || '') : "";
  const qrCodeUrl = otpUri ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpUri)}` : "";
  const secretKey = user ? getSecretForUser(user.uid) : "";

  const showLoading = user && (isProfileLoading || isUserLoading || isVerifying) && !show2FA && !passed2FA;

  if (showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="font-headline font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
            Verifying Arena Access...
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
              <CardTitle className="text-2xl font-headline font-bold uppercase tracking-tight">2FA Required</CardTitle>
              <CardDescription>
                Your account is secured. Enter your 6-digit arena key to enter.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleVerify2FA}>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Smartphone className="h-4 w-4 text-accent" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Mobile Arena Link</p>
                    </div>
                    <a href={otpUri} className="w-full">
                      <Button type="button" variant="outline" size="sm" className="w-full h-10 font-bold uppercase text-[10px] tracking-widest border-accent/30 hover:bg-accent/10">
                        <ExternalLink className="mr-2 h-3.5 w-3.5" /> Auto-Link App
                      </Button>
                    </a>
                    <p className="text-[8px] text-muted-foreground text-center uppercase font-bold px-2 leading-relaxed">
                      OS system might default to native passwords. Use manual entry below for Google Authenticator.
                    </p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex justify-center p-2 bg-white rounded-lg shadow-inner shrink-0">
                      {qrCodeUrl && (
                        <Image 
                          src={qrCodeUrl} 
                          alt="2FA QR Code" 
                          width={120} 
                          height={120} 
                          className="rounded-sm"
                        />
                      )}
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Manual Setup Key</Label>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-secondary/50 rounded-lg h-10 flex items-center px-3 font-mono text-xs text-white border border-white/5 truncate">
                          {secretKey}
                        </div>
                        <Button 
                          type="button" 
                          variant="secondary" 
                          size="icon" 
                          className="h-10 w-10 shrink-0"
                          onClick={handleCopySecret}
                        >
                          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 w-full text-center pt-4 border-t border-white/5">
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
                  <LogOut className="mr-2 h-4 w-4" /> Sign out of current account
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
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
      
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
            <CardTitle className="text-3xl font-headline font-bold uppercase tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your arena to continue the streak
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignIn}>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-accent hover:underline">Forgot password?</Link>
                </div>
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
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" disabled={isVerifying} className="w-full h-12 font-bold uppercase tracking-wider text-lg">
                {isVerifying ? <Loader2 className="animate-spin" /> : <>Enter Arena <ArrowRight className="ml-2 h-5 w-5" /></>}
              </Button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                <ShieldCheck className="h-3 w-3 text-accent" /> Secured by reCAPTCHA Enterprise
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-accent font-bold hover:underline">Create one</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
