"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bell, Shield, Wallet, Save, CheckCircle2, Camera, Link as LinkIcon, Upload, Smartphone, ExternalLink, Copy, Check } from "lucide-react";
import { useUser, useFirestore, setDocumentNonBlocking, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { validateTOTP, getOTPAuthUri, getSecretForUser } from "@/lib/2fa";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PRESET_AVATARS = [
  { id: 'guitar', label: 'Classic Pro' },
  { id: 'basketball', label: 'Hoops' },
  { id: 'football', label: 'Gridiron' },
  { id: 'surfing', label: 'Wave Master' },
  { id: 'skate', label: 'Skater' },
  { id: 'snow', label: 'Alpine' },
  { id: 'mma', label: 'Fighter' },
  { id: 'nascar', label: 'Speedster' },
];

export default function SettingsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const userProfileRef = useMemoFirebase(() => (user ? doc(db, "userProfiles", user.uid) : null), [db, user]);
  const { data: profile } = useDoc(userProfileRef);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.username || user?.displayName || "");
      setBio(profile.bio || "");
      setProfilePictureUrl(profile.profilePictureUrl || "");
    }
  }, [user, profile]);

  const handleSaveProfile = () => {
    if (!user || !userProfileRef) return;
    
    setDocumentNonBlocking(userProfileRef, {
      id: user.uid,
      email: user.email,
      username: displayName,
      bio: bio,
      profilePictureUrl: profilePictureUrl,
      role: profile?.role || 'player', 
      updatedAt: new Date().toISOString(),
      createdAt: profile?.createdAt || new Date().toISOString(),
    }, { merge: true });

    toast({
      title: "Profile Updated",
      description: "Your arena nickname and persona have been saved.",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 1MB for optimal performance.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePictureUrl(reader.result as string);
        toast({
          title: "Photo Ready",
          description: "Your custom image is ready to be saved to your profile.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnable2FA = () => {
    if (!user || !userProfileRef) return;

    const isValid = validateTOTP(user.uid, user.email || '', verificationCode);

    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "Please enter the 6-digit code from your authenticator app.",
      });
      return;
    }

    setDocumentNonBlocking(userProfileRef, {
      twoFactorEnabled: true,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    setIs2FADialogOpen(false);
    setVerificationCode("");
    
    toast({
      title: "2FA Enabled",
      description: "Your account is now protected with two-factor authentication.",
    });
  };

  const handleDisable2FA = () => {
    if (!user || !userProfileRef) return;

    setDocumentNonBlocking(userProfileRef, {
      twoFactorEnabled: false,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    toast({
      title: "2FA Disabled",
      description: "Two-factor authentication has been turned off.",
    });
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

  return (
    <div className="min-h-screen pb-24 md:pt-20">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-headline text-3xl font-bold uppercase tracking-tight">Arena <span className="text-accent">Settings</span></h1>
          <p className="text-muted-foreground">Manage your profile, security, and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-card border rounded-2xl">
            <TabsTrigger value="profile" className="py-3 font-headline font-bold uppercase tracking-wider rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
              <User className="mr-2 h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="py-3 font-headline font-bold uppercase tracking-wider rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
              <Bell className="mr-2 h-4 w-4" /> Alerts
            </TabsTrigger>
            <TabsTrigger value="security" className="py-3 font-headline font-bold uppercase tracking-wider rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
              <Shield className="mr-2 h-4 w-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="wallet" className="py-3 font-headline font-bold uppercase tracking-wider rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
              <Wallet className="mr-2 h-4 w-4" /> Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="animate-in fade-in-50 duration-500 space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border shadow-xl overflow-hidden">
              <CardHeader className="bg-secondary/20 border-b">
                <CardTitle className="font-headline text-xl uppercase tracking-tighter">Arena Persona</CardTitle>
                <CardDescription>Upload a custom photo or choose from our elite library</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <Avatar className="h-32 w-32 border-4 border-primary shadow-2xl transition-transform group-hover:scale-105">
                      <AvatarImage src={profilePictureUrl || `https://picsum.photos/seed/guitar/400/400`} />
                      <AvatarFallback className="text-2xl font-bold">{displayName[0] || '?'}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="space-y-4">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Elite Presets</Label>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                        {PRESET_AVATARS.map((avatar) => {
                          const url = `https://picsum.photos/seed/${avatar.id}/400/400`;
                          return (
                            <button
                              key={avatar.id}
                              onClick={() => setProfilePictureUrl(url)}
                              className={cn(
                                "relative h-12 w-12 rounded-lg overflow-hidden border-2 transition-all hover:scale-110",
                                profilePictureUrl === url ? "border-accent ring-2 ring-accent/20" : "border-transparent opacity-60 hover:opacity-100"
                              )}
                            >
                              <img src={url} alt={avatar.label} className="object-cover h-full w-full" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Custom Identity</Label>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileUpload} 
                            className="hidden" 
                            accept="image/*"
                          />
                          <Button 
                            variant="outline" 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-11 font-bold uppercase tracking-wider border-dashed border-white/10 hover:border-accent/50 hover:bg-accent/5"
                          >
                            <Upload className="mr-2 h-4 w-4" /> Upload Custom Photo
                          </Button>
                          <p className="text-[10px] text-muted-foreground mt-2 italic">Maximum size 1MB. Optimized for square aspect ratios.</p>
                        </div>
                        <div className="flex-1">
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              value={profilePictureUrl}
                              onChange={(e) => setProfilePictureUrl(e.target.value)}
                              placeholder="Or paste a link here..."
                              className="pl-10 bg-secondary/30 border-white/5 h-11 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border shadow-xl overflow-hidden">
              <CardHeader className="bg-secondary/20 border-b">
                <CardTitle className="font-headline text-xl uppercase tracking-tighter">Profile Details</CardTitle>
                <CardDescription>Update how you appear in the Playmakers arena</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Arena Nickname</Label>
                  <Input 
                    id="username" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-secondary/30 border-white/5 h-12 text-lg" 
                    placeholder="Arena Nickname"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Profile Bio</Label>
                  <Input 
                    id="bio" 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell the world your playmaker status..." 
                    className="bg-secondary/30 border-white/5 h-12" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                  <Input id="email" value={user?.email || ""} disabled className="bg-secondary/10 opacity-60 h-12" />
                  <p className="text-[10px] text-muted-foreground italic">Email changes require manual support verification for security.</p>
                </div>
              </CardContent>
              <CardFooter className="bg-secondary/10 p-6 border-t flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Manage your identity in the arena.</p>
                <Button onClick={handleSaveProfile} className="font-bold uppercase tracking-wider px-8 h-12 shadow-lg shadow-primary/20">
                  <Save className="mr-2 h-5 w-5" /> Save Profile
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="animate-in fade-in-50 duration-500">
            <Card className="bg-card/50 backdrop-blur-sm border shadow-xl">
              <CardHeader className="bg-secondary/20 border-b">
                <CardTitle className="font-headline text-xl uppercase tracking-tighter">Notification Preferences</CardTitle>
                <CardDescription>Control how we reach you for game updates and rewards</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-white/5">
                  <div className="space-y-1">
                    <Label className="text-base font-bold flex items-center gap-2 uppercase tracking-tight">
                      Contest Invitations
                    </Label>
                    <p className="text-sm text-muted-foreground">Get notified when a friend challenges you to a showdown</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-white/5">
                  <div className="space-y-1">
                    <Label className="text-base font-bold flex items-center gap-2 uppercase tracking-tight">
                      Live Score Updates
                    </Label>
                    <p className="text-sm text-muted-foreground">Real-time alerts when your roster makes a play</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="animate-in fade-in-50 duration-500">
            <Card className="bg-card/50 backdrop-blur-sm border shadow-xl">
              <CardHeader className="bg-secondary/20 border-b">
                <CardTitle className="font-headline text-xl uppercase tracking-tighter">Account Security</CardTitle>
                <CardDescription>Protect your winnings and profile integrity</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="p-6 rounded-2xl bg-secondary/20 border border-white/5 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold uppercase text-sm">Two-Factor Auth</p>
                      {profile?.twoFactorEnabled && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-accent uppercase bg-accent/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Add an extra layer of protection to your account</p>
                  </div>
                  
                  <Dialog open={is2FADialogOpen} onOpenChange={setIs2FADialogOpen}>
                    <DialogTrigger asChild>
                      {profile?.twoFactorEnabled ? (
                        <Button variant="destructive" size="sm" onClick={handleDisable2FA} className="font-bold uppercase text-[10px] tracking-widest">
                          Disable 2FA
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="font-bold uppercase text-[10px] tracking-widest">
                          Enable 2FA
                        </Button>
                      )}
                    </DialogTrigger>
                    {!profile?.twoFactorEnabled && (
                      <DialogContent className="bg-card border-white/10 max-w-md">
                        <DialogHeader>
                          <DialogTitle className="font-headline text-xl uppercase">Enable Two-Factor Auth</DialogTitle>
                          <DialogDescription>
                            Scan the QR or link your app. Manual entry recommended for Google Authenticator on mobile.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col py-4 gap-6">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20">
                              <div className="flex items-center justify-center gap-2">
                                <Smartphone className="h-4 w-4 text-accent" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-accent text-center">Auto-Link Mobile</p>
                              </div>
                              <a href={otpUri} className="w-full">
                                <Button type="button" variant="outline" size="sm" className="w-full h-10 font-bold uppercase text-[10px] tracking-widest border-accent/30 hover:bg-accent/10">
                                  <ExternalLink className="mr-2 h-3.5 w-3.5" /> Auto-Link App
                                </Button>
                              </a>
                              <p className="text-[8px] text-muted-foreground text-center uppercase font-bold leading-relaxed px-4">
                                If native passwords intercept, use manual key below.
                              </p>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-6">
                              <div className="flex justify-center p-2 bg-white rounded-lg shrink-0">
                                {qrCodeUrl && (
                                  <Image 
                                    src={qrCodeUrl} 
                                    alt="2FA QR Code" 
                                    width={140} 
                                    height={140} 
                                    className="rounded-sm"
                                  />
                                )}
                              </div>
                              <div className="flex-1 space-y-3 w-full">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Google Auth Manual Key</Label>
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

                          <div className="w-full space-y-2 pt-4 border-t border-white/5">
                            <Label className="text-xs font-bold uppercase tracking-widest text-center block">Enter 6-Digit Code</Label>
                            <Input 
                              value={verificationCode}
                              inputMode="numeric"
                              autoComplete="one-time-code"
                              pattern="[0-9]*"
                              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              placeholder="000000" 
                              className="text-center text-2xl tracking-[0.5em] font-headline h-14 bg-secondary/50"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleEnable2FA} className="w-full font-bold uppercase tracking-widest h-12 shadow-lg shadow-primary/20">Access Granted</Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                </div>

                <div className="space-y-2 pt-6 border-t border-white/5">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Password</Label>
                  <Input type="password" placeholder="••••••••" className="bg-secondary/30 border-white/5 h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">New Password</Label>
                  <Input type="password" placeholder="Min. 8 characters" className="bg-secondary/30 border-white/5 h-12" />
                </div>
              </CardContent>
              <CardFooter className="bg-secondary/10 p-6 border-t">
                <Button variant="secondary" className="w-full font-bold uppercase tracking-wider h-12">Update Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="animate-in fade-in-50 duration-500">
            <Card className="bg-card/50 backdrop-blur-sm border shadow-xl">
              <CardHeader className="bg-secondary/20 border-b">
                <CardTitle className="font-headline text-xl uppercase tracking-tighter">Wallet & Verification</CardTitle>
                <CardDescription>Manage your funds and identity verification for redemptions</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="p-6 rounded-2xl bg-accent/5 border border-accent/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-headline font-bold text-lg uppercase tracking-tight">Identity Status</p>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">KYC Verification Complete</p>
                    </div>
                  </div>
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-500/30">Verified</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
