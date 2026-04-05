
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
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const db = useFirestore();

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
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-2xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tighter text-secondary group-hover:text-primary transition-all duration-500 font-headline uppercase">
              Blubber Baron
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em]">
            <Link href="/#catalog" className="hover:text-secondary transition-colors opacity-70 hover:opacity-100">Kollektion</Link>
            <Link href="/story" className="flex items-center gap-2 hover:text-secondary transition-colors opacity-70 hover:opacity-100">
              Geschichte
            </Link>
            <Link href="/careers" className="flex items-center gap-2 hover:text-secondary transition-colors opacity-70 hover:opacity-100">
              Karriere
            </Link>
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-all animate-in fade-in slide-in-from-left-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                Konsole
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className={`relative flex items-center transition-all duration-500 ${isSearchOpen ? 'w-56 md:w-80' : 'w-10'}`}>
            <Input 
              placeholder="Archive durchsuchen..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`h-10 bg-white/5 border-none rounded-full transition-opacity duration-500 text-xs tracking-wider ${isSearchOpen ? 'opacity-100 pl-10' : 'opacity-0 pointer-events-none'}`}
              onBlur={() => {
                if (!searchQuery) setIsSearchOpen(false);
              }}
            />
            <Button 
              type="button"
              variant="ghost" 
              size="icon" 
              className={cn(
                "absolute left-0 transition-colors duration-500",
                isSearchOpen ? "text-secondary" : "text-white/50 hover:text-white"
              )}
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
          
          <div className="h-6 w-[1px] bg-white/10 mx-2 hidden sm:block" />
          
          <CartSheet />
          
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="text-white/50 hover:text-white transition-colors">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
