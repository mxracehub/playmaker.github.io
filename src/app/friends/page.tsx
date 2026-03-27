
"use client";

import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Search, MessageSquare, Trophy } from "lucide-react";

const friends = [
  { id: 1, name: "Jordan 'Swish' Smith", status: "Online", wins: 42, avatar: "https://picsum.photos/seed/jordan/100/100" },
  { id: 2, name: "Sarah 'Quarterback' Jones", status: "In Contest", wins: 28, avatar: "https://picsum.photos/seed/sarah/100/100" },
  { id: 3, name: "Mike 'The Putter' Brown", status: "Offline", wins: 15, avatar: "https://picsum.photos/seed/mike/100/100" },
];

export default function FriendsPage() {
  return (
    <div className="min-h-screen pb-24 md:pt-20">
      <Navbar />
      
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-headline text-3xl font-bold uppercase tracking-tight">Your <span className="text-accent">Squad</span></h1>
            <p className="text-muted-foreground">Challenge your friends and dominate the leaderboards</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Find friends..." className="pl-10 w-[240px] bg-card/50" />
            </div>
            <Button className="font-bold uppercase tracking-wider">
              <UserPlus className="mr-2 h-4 w-4" /> Add Friend
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {friends.map((friend) => (
            <Card key={friend.id} className="bg-card/50 border hover:border-accent/30 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-headline font-bold text-lg leading-tight">{friend.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className={`h-2 w-2 rounded-full ${friend.status === 'Online' ? 'bg-green-500' : friend.status === 'In Contest' ? 'bg-accent' : 'bg-muted-foreground'}`} />
                      <p className="text-xs font-medium text-muted-foreground">{friend.status}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 mb-6">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-accent" />
                    <span className="text-sm font-bold uppercase tracking-tighter">Career Wins</span>
                  </div>
                  <span className="font-headline font-bold text-accent">{friend.wins}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="font-bold uppercase text-[10px] tracking-widest">
                    <MessageSquare className="mr-2 h-3 w-3" /> Chat
                  </Button>
                  <Button variant="secondary" size="sm" className="font-bold uppercase text-[10px] tracking-widest">
                    Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
