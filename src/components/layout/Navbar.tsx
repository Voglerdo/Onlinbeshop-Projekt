"use client"

import Link from 'next/link';
import { Search, ShoppingBag, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartSheet } from '@/components/cart/CartSheet';
import { useState } from 'react';

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tighter text-primary group-hover:text-primary/80 transition-colors font-headline uppercase">
              Blubber Baron
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/#catalog" className="hover:text-primary transition-colors">Catalog</Link>
            <Link href="/admin" className="flex items-center gap-1.5 text-secondary hover:text-secondary/80 transition-colors">
              <Sparkles className="h-4 w-4" />
              Admin
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'w-48 md:w-64' : 'w-10'}`}>
            <Input 
              placeholder="Search products..." 
              className={`h-9 bg-muted/50 border-none transition-opacity duration-300 ${isSearchOpen ? 'opacity-100 pl-8' : 'opacity-0'}`}
              onBlur={() => setIsSearchOpen(false)}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-0 text-secondary"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
          
          <CartSheet />
          
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="text-secondary hidden sm:flex">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
