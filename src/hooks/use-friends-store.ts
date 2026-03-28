'use client';

import { useState, useEffect } from 'react';

const FRIENDS_STORAGE_KEY = 'playmakers_friends_list_v1';

// Default to an empty list so new accounts only see the hardcoded Admin
const INITIAL_FRIENDS: any[] = [];

export const HOUSE_ADMIN = { 
  id: 'house-admin', 
  name: "Arena Master (Admin)", 
  status: "Online",
  wins: 999,
  avatar: "https://picsum.photos/seed/admin/100/100", 
  isHouse: true,
  email: "admin@playmakers.arena"
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

  const addFriend = (friend: any) => {
    const updated = [...friends, friend];
    setFriends(updated);
    localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(updated));
  };

  return { friends, removeFriend, addFriend, isLoaded };
}
