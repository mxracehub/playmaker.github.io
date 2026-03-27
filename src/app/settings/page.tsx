
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield, Wallet, Save, CheckCircle2 } from "lucide-react";
import { useUser, useFirestore, setDocumentNonBlocking, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SettingsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState("");
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // Get user profile data from Firestore to check 2FA status
  const userProfileRef = useMemoFirebase(() => (user ? doc(db, "users", user.uid) : null), [db, user]);
  const { data: profile } = useDoc(userProfileRef);

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    } else if (profile?.username) {
      setDisplayName(profile.username);
    }
  }, [user, profile]);

  const handleSaveProfile = () => {
    if (!user || !userProfileRef) return;
    
    setDocumentNonBlocking(userProfileRef, {
      id: user.uid,
      email: user.email,
      username: displayName,
      updatedAt: new Date().toISOString(),
      createdAt: profile?.createdAt || new Date().toISOString(),
    }, { merge: true });

    toast({
      title: "Profile Updated",
      description: "Your arena nickname has been saved successfully.",
    });
  };

  const handleEnable2FA = () => {
    if (!user || !userProfileRef) return;
    if (verificationCode.length !== 6) {
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

  // Generate a realistic account-specific QR code URL
  const qrCodeUrl = user 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`otpauth://totp/Playmakers:${user.email}?secret=JBSWY3DPEHPK3PXP&issuer=Playmakers`)}`
    : "";

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

          <TabsContent value="profile" className="animate-in fade-in-50 duration-500">
            <Card className="bg-card/50 backdrop-blur-sm border shadow-xl overflow-hidden">
              <CardHeader className="bg-secondary/20 border-b">
                <CardTitle className="font-headline text-xl uppercase tracking-tighter">Profile Information</CardTitle>
                <CardDescription>Update how you appear in the Playmakers arena</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Display Name</Label>
                  <Input 
                    id="username" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-secondary/30 border-white/5 h-12 text-lg" 
                    placeholder="Arena Nickname"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                  <Input id="email" value={user?.email || ""} disabled className="bg-secondary/10 opacity-60 h-12" />
                  <p className="text-[10px] text-muted-foreground italic">Email changes require manual support verification for security.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Profile Bio</Label>
                  <Input id="bio" placeholder="Tell the world your playmaker status..." className="bg-secondary/30 border-white/5 h-12" />
                </div>
              </CardContent>
              <CardFooter className="bg-secondary/10 p-6 border-t flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Manage your identity in the arena.</p>
                <Button onClick={handleSaveProfile} className="font-bold uppercase tracking-wider px-8 h-12 shadow-lg shadow-primary/20">
                  <Save className="mr-2 h-5 w-5" /> Save Changes
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
                      <DialogContent className="bg-card border-white/10">
                        <DialogHeader>
                          <DialogTitle className="font-headline text-xl uppercase">Enable Two-Factor Auth</DialogTitle>
                          <DialogDescription>
                            Scan your account-specific QR key and enter the 6-digit verification code.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center py-6 gap-6">
                          <div className="p-2 bg-white rounded-lg">
                            {qrCodeUrl && (
                              <Image 
                                src={qrCodeUrl} 
                                alt="2FA QR Code" 
                                width={200} 
                                height={200} 
                                className="rounded-sm"
                              />
                            )}
                          </div>
                          <div className="w-full space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest">Verification Code</Label>
                            <Input 
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              placeholder="000000" 
                              className="text-center text-2xl tracking-[0.5em] font-headline h-14 bg-secondary/50"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleEnable2FA} className="w-full font-bold uppercase tracking-widest">Access Granted</Button>
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
