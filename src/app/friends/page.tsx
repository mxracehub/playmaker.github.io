"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Search, Trophy, Lock, Loader2, Trash2, ShieldAlert } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { useFriendsStore, HOUSE_ADMIN } from "@/hooks/use-friends-store";

export default function FriendsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const { friends, removeFriend, isLoaded } = useFriendsStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleChallenge = (friendId: string) => {
    router.push(`/games/create?friendId=${friendId}`);
  };

  const handleDeleteFriend = (id: string, name: string) => {
    removeFriend(id);
    toast({
      title: "Friend Removed",
      description: `${name} has been removed from your circle.`,
    });
  };

  const allFriends = [HOUSE_ADMIN, ...friends];
  const filteredFriends = allFriends.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isUserLoading || !isLoaded) {
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
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Find friends..." 
                className="pl-10 w-[240px] bg-card/50" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="font-bold uppercase tracking-wider">
              <UserPlus className="mr-2 h-4 w-4" /> Add Friend
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[650px] rounded-3xl border border-white/5 bg-card/20 p-6 shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-4">
            {filteredFriends.map((friend) => (
              <Card key={friend.id} className={`bg-card/50 border transition-all group relative ${friend.isHouse ? 'border-accent/40 shadow-lg shadow-accent/5' : 'hover:border-accent/30'}`}>
                {!friend.isHouse && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDeleteFriend(friend.id, friend.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className={`h-16 w-16 border-2 ${friend.isHouse ? 'border-accent shadow-lg shadow-accent/20' : 'border-primary/20'}`}>
                      <AvatarImage src={friend.avatar} alt={friend.name} />
                      <AvatarFallback>{friend.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className={`font-headline font-bold text-lg leading-tight ${friend.isHouse ? 'text-accent' : ''}`}>{friend.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className={`h-2 w-2 rounded-full ${friend.status === 'Online' ? 'bg-green-500' : friend.status === 'In Contest' ? 'bg-accent' : 'bg-muted-foreground'}`} />
                        <p className="text-xs font-medium text-muted-foreground">{friend.status}</p>
                      </div>
                      {friend.isHouse && (
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
                    <span className="font-headline font-bold text-accent">{friend.wins}</span>
                  </div>

                  <Button 
                    variant={friend.isHouse ? "default" : "secondary"}
                    className={`w-full font-bold uppercase text-[10px] tracking-widest h-10 ${friend.isHouse ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
                    onClick={() => handleChallenge(friend.id)}
                  >
                    Challenge
                  </Button>
                </CardContent>
              </Card>
            ))}
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
