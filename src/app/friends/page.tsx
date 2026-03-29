
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Search, Trophy, Lock, Loader2, Trash2, ShieldAlert, CheckCircle2, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection, updateDocumentNonBlocking } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { HOUSE_ADMIN } from "@/hooks/use-friends-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function FriendsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  // Fetch current user's profile for friendIds
  const userProfileRef = useMemoFirebase(() => (user ? doc(db, "userProfiles", user.uid) : null), [db, user]);
  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  // Fetch all user profiles to enable global search - Guarded by user auth
  const allUsersQuery = useMemoFirebase(() => (user ? collection(db, "userProfiles") : null), [db, user]);
  const { data: allUsers, isLoading: isUsersLoading } = useCollection(allUsersQuery);

  // Global search for "Add Friend" (searching the database)
  const globalSearchResults = useMemo(() => {
    if (!allUsers || !globalSearchQuery) return [];
    return allUsers.filter(u => 
      u.id !== user?.uid && 
      (u.username || "").toLowerCase().includes(globalSearchQuery.toLowerCase()) &&
      !(profile?.friendIds || []).includes(u.id)
    ).slice(0, 5);
  }, [allUsers, globalSearchQuery, user?.uid, profile?.friendIds]);

  // Derive the user's current friends list from Firestore IDs
  const friendsList = useMemo(() => {
    if (!allUsers || !profile) return [HOUSE_ADMIN];
    const userFriends = allUsers.filter(u => (profile.friendIds || []).includes(u.id));
    // Always include the hardcoded Arena Master
    return [HOUSE_ADMIN, ...userFriends];
  }, [allUsers, profile]);

  // Filter the current friends list using the top search bar
  const filteredFriends = friendsList.filter(f => 
    (f.username || f.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChallenge = (friendId: string) => {
    router.push(`/games/create?friendId=${friendId}`);
  };

  const handleAddFriend = (newFriendId: string, name: string) => {
    if (!user || !profile) return;
    const currentFriends = profile.friendIds || [];
    if (currentFriends.includes(newFriendId)) return;

    const updatedFriends = [...currentFriends, newFriendId];
    updateDocumentNonBlocking(doc(db, "userProfiles", user.uid), {
      friendIds: updatedFriends
    });

    toast({
      title: "Friend Recruited",
      description: `${name} has been added to your arena circle.`,
    });
    setGlobalSearchQuery("");
  };

  const handleRemoveFriend = (id: string, name: string) => {
    if (!user || !profile) return;
    const updatedFriends = (profile.friendIds || []).filter((fid: string) => fid !== id);
    
    updateDocumentNonBlocking(doc(db, "userProfiles", user.uid), {
      friendIds: updatedFriends
    });

    toast({
      title: "Friend Removed",
      description: `${name} has been removed from your circle.`,
    });
  };

  const isLoading = isUserLoading || isProfileLoading || (user && isUsersLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="font-headline font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
            Loading Playmakers...
          </p>
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
          <h2 className="font-headline text-2xl font-bold uppercase tracking-tight">Locked Circle</h2>
          <p className="text-muted-foreground">You must be signed in to view your friends and start challenges.</p>
          <Link href="/login" className="block w-full">
            <Button className="w-full h-12 font-bold uppercase tracking-wider shadow-lg shadow-primary/20">Sign In to Connect</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24">
      <Navbar />
      
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-headline text-3xl font-bold uppercase tracking-tight">Your <span className="text-accent">Friends</span></h1>
            <p className="text-muted-foreground">Challenge your circle and dominate the leaderboards</p>
          </div>
          <div className="flex flex-col gap-3 min-w-[280px]">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full h-12 font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                  <UserPlus className="mr-2 h-4 w-4" /> Add Friend
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-headline text-2xl uppercase tracking-tight">Recruit <span className="text-accent">Playmakers</span></DialogTitle>
                  <DialogDescription>Search for players by username to add them to your arena circle.</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search username..." 
                      className="pl-10 bg-secondary/30 border-white/5"
                      value={globalSearchQuery}
                      onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <ScrollArea className="h-[280px] rounded-xl border border-white/5 bg-secondary/10 p-2">
                    <div className="grid gap-2">
                      {globalSearchResults.map((u) => (
                        <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-white/5">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={u.profilePictureUrl} />
                              <AvatarFallback>{(u.username || "P")[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold text-sm text-white uppercase">{u.username || "PLAYMAKER"}</p>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Lvl 12 Player</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="h-8 font-bold uppercase text-[10px]"
                            onClick={() => handleAddFriend(u.id, u.username)}
                          >
                            <Plus className="mr-1 h-3 w-3" /> Add
                          </Button>
                        </div>
                      ))}
                      {globalSearchQuery && globalSearchResults.length === 0 && (
                        <div className="py-10 text-center opacity-40">
                          <p className="text-xs font-bold uppercase">No playmakers found</p>
                        </div>
                      )}
                      {!globalSearchQuery && (
                        <div className="py-10 text-center opacity-40">
                          <p className="text-xs font-bold uppercase italic">Start typing to search...</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Filter current friends..." 
                className="pl-10 w-full bg-card/50 border-white/10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <ScrollArea className="h-[650px] rounded-3xl border border-white/5 bg-card/20 p-6 shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-4">
            {filteredFriends.map((friend) => {
              const name = friend.username || friend.name || "PLAYMAKER";
              const isHouse = friend.isHouse || friend.id === 'house-admin';
              
              return (
                <Card key={friend.id} className={`bg-card/50 border transition-all group relative ${isHouse ? 'border-accent/40 shadow-lg shadow-accent/5' : 'hover:border-accent/30'}`}>
                  {!isHouse && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleRemoveFriend(friend.id, name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className={`h-16 w-16 border-2 ${isHouse ? 'border-accent shadow-lg shadow-accent/20' : 'border-primary/20'}`}>
                        <AvatarImage src={friend.profilePictureUrl || friend.avatar} alt={name} />
                        <AvatarFallback>{name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-headline font-bold text-lg leading-tight truncate ${isHouse ? 'text-accent' : ''}`}>{name}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className={`h-2 w-2 rounded-full ${isHouse ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                          <p className="text-xs font-medium text-muted-foreground">{isHouse ? 'Online' : 'Offline'}</p>
                        </div>
                        {isHouse && (
                          <div className="flex items-center gap-1 mt-1 text-[8px] font-bold uppercase tracking-widest text-accent">
                            <ShieldAlert className="h-2 w-2" /> Arena Master
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 mb-6">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-accent" />
                        <span className="text-sm font-bold uppercase tracking-tighter">Career Wins</span>
                      </div>
                      <span className="font-headline font-bold text-accent">{friend.wins || 0}</span>
                    </div>

                    <Button 
                      variant={isHouse ? "default" : "secondary"}
                      className={`w-full font-bold uppercase text-[10px] tracking-widest h-10 ${isHouse ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
                      onClick={() => handleChallenge(friend.id)}
                    >
                      Challenge
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
            {filteredFriends.length === 0 && (
              <div className="col-span-full py-20 text-center opacity-40">
                <Trophy className="h-12 w-12 mx-auto mb-4" />
                <p className="font-headline font-bold uppercase">No playmakers found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
