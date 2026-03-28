'use client';

import { useState, useEffect } from 'react';

const FRIENDS_STORAGE_KEY = 'playmakers_friends_list_v1';

const INITIAL_FRIENDS = [
  { id: 'f1', name: "Jordan 'Swish' Smith", status: "Online", wins: 42, avatar: "https://picsum.photos/seed/jordan/100/100" },
  { id: 'f2', name: "Sarah 'Quarterback' Jones", status: "In Contest", wins: 28, avatar: "https://picsum.photos/seed/sarah/100/100" },
  { id: 'f3', name: "Mike 'The Putter' Brown", status: "Offline", wins: 15, avatar: "https://picsum.photos/seed/mike/100/100" },
  { id: 'f4', name: "Alex 'Apex' Racer", status: "Online", wins: 31, avatar: "https://picsum.photos/seed/alex/100/100" },
  { id: 'f5', name: "Emma 'Endzone' Miller", status: "Offline", wins: 19, avatar: "https://picsum.photos/seed/emma/100/100" },
  { id: 'f6', name: "Chris 'The Wall' Davis", status: "In Contest", wins: 55, avatar: "https://picsum.photos/seed/chris/100/100" },
];

export const HOUSE_ADMIN = { 
  id: 'house-admin', 
  name: "Arena Master (Master Admin)", 
  status: "Online",
  wins: 999,
  avatar: "https://picsum.photos/seed/admin/100/100", 
  isHouse: true 
};

export function useFriendsStore() {
  const [friends, setFriends] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(FRIENDS_STORAGE_KEY);
    if (stored) {
      setFriends(JSON.parse(stored));
    } else {
      setFriends(INITIAL_FRIENDS);
      localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(INITIAL_FRIENDS));
    }
    setIsLoaded(true);
  }, []);

  const removeFriend = (id: string) => {
    const updated = friends.filter(f => f.id !== id);
    setFriends(updated);
    localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(updated));
  };

  return { friends, removeFriend, isLoaded };
}
