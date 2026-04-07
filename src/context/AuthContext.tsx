
"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  uid: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isUserLoading: boolean;
  login: (email: string, isAdmin?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('blubber_baron_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsUserLoading(false);
  }, []);

  const login = (email: string, isAdmin: boolean = false) => {
    const newUser = { 
      uid: 'baron-' + Math.random().toString(36).substr(2, 9), 
      email, 
      isAdmin,
      firstName: isAdmin ? 'Admin' : 'Baron',
      lastName: 'Elite'
    };
    setUser(newUser);
    localStorage.setItem('blubber_baron_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('blubber_baron_user');
  };

  return (
    <AuthContext.Provider value={{ user, isUserLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
