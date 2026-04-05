
"use client"

import Link from 'next/link';
import { Search, User, Sparkles, BookOpen, Briefcase, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartSheet } from '@/components/cart/CartSheet';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const db = useFirestore();

  // Check if user is admin
  const adminRoleRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'roles_admin', user.uid);
  }, [db, user]);

  const { data: adminRole } = useDoc(adminRoleRef);
  const isAdmin = !!adminRole;

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      setIsSearchOpen(true);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}#catalog`);
    } else {
      router.push('/#catalog');
    }
  };

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
            <Link href="/story" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <BookOpen className="h-4 w-4" />
              Story
            </Link>
            <Link href="/careers" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Briefcase className="h-4 w-4" />
              Careers
            </Link>
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-1.5 text-secondary hover:text-secondary/80 transition-colors animate-in fade-in slide-in-from-left-2">
                <ShieldCheck className="h-4 w-4" />
                Admin Console
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'w-48 md:w-64' : 'w-10'}`}>
            <Input 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`h-9 bg-muted/50 border-none transition-opacity duration-300 ${isSearchOpen ? 'opacity-100 pl-8' : 'opacity-0 pointer-events-none'}`}
              onBlur={() => {
                if (!searchQuery) setIsSearchOpen(false);
              }}
            />
            <Button 
              type="button"
              variant="ghost" 
              size="icon" 
              className="absolute left-0 text-secondary"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
          
          <CartSheet />
          
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="text-secondary">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
