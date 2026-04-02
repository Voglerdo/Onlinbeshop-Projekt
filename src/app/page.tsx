"use client"

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star, Loader2, Sparkles, Filter } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Product } from '@/app/types';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'all', label: 'All Collection' },
  { id: 'hookah', label: 'Hookahs' },
  { id: 'flavor', label: 'Flavors' },
  { id: 'coal', label: 'Charcoal' },
  { id: 'accessory', label: 'Accessories' },
];

export default function Home() {
  const db = useFirestore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-shisha');

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: allProducts, isLoading } = useCollection<Product>(productsQuery);

  // Client-side filtering to avoid complex composite index requirements during development
  const filteredProducts = allProducts?.filter(product => 
    selectedCategory === 'all' || product.category === selectedCategory
  ) || [];

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
        <Image
          src={heroImg?.imageUrl || ''}
          alt="Luxury Shisha Experience"
          fill
          priority
          className="object-cover opacity-50 scale-105"
          data-ai-hint="luxury shisha"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        
        <div className="container relative z-10 px-4 text-center space-y-8">
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-secondary animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Star className="fill-secondary h-4 w-4" />
              <span className="uppercase tracking-[0.5em] text-sm font-bold">The Ultimate Experience</span>
              <Star className="fill-secondary h-4 w-4" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000">
              IGNITE YOUR <span className="text-primary">PASSION</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
              Welcome to the elite world of Crimson Coals. Discover curated premium hookahs and flavors designed for true connoisseurs.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000">
            <Link href="/#catalog">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-10 rounded-full crimson-glow">
                Explore Collection
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10 h-14 px-10 rounded-full">
              Our Story
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-1 h-12 bg-gradient-to-b from-primary to-transparent rounded-full" />
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="container mx-auto px-4 lg:px-8 space-y-12 scroll-mt-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-border pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.3em] text-xs">
              <Sparkles className="h-3 w-3" />
              Curated Selection
            </div>
            <h2 className="text-4xl md:text-5xl font-headline font-bold">Our Masterpieces</h2>
            <p className="text-muted-foreground font-medium">Handpicked selections for your perfect session.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'secondary' : 'ghost'}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "h-10 px-6 rounded-full font-bold transition-all",
                  selectedCategory === cat.id ? "gold-glow" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-32 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Filtering Catalog...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 glass-card rounded-[2rem] border-dashed border-2 border-border/50">
            <div className="max-w-md mx-auto space-y-4">
              <div className="p-4 rounded-full bg-muted/30 inline-block">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold font-headline">No Matches Found</h3>
              <p className="text-muted-foreground">We couldn't find any masterpieces in the "{CATEGORIES.find(c => c.id === selectedCategory)?.label}" category currently. Try exploring our other selections.</p>
              <Button variant="link" onClick={() => setSelectedCategory('all')} className="text-secondary font-bold">
                View All Products
              </Button>
            </div>
          </div>
        )}

        {/* Brand Newsletter Section */}
        <div className="mt-24 p-12 lg:p-20 glass-card rounded-[3rem] relative overflow-hidden gold-glow border-none">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="h-64 w-64 text-secondary" />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl space-y-6 text-center lg:text-left">
              <Badge className="bg-secondary/20 text-secondary border-none px-4 py-1">CRIMSON ELITE</Badge>
              <h3 className="text-4xl md:text-5xl font-headline font-black leading-tight">Elevate Your Lifestyle</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Subscribe to the Crimson Elite circle for early access to limited edition drops, secret flavor blends, and exclusive invitations to global shisha lounge events.
              </p>
            </div>
            
            <div className="w-full lg:w-auto space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="The Gentleman's Email" 
                  className="bg-background border border-border rounded-xl px-6 h-14 flex-1 md:w-80 outline-none focus:ring-2 focus:ring-secondary transition-all"
                />
                <Button className="h-14 px-10 bg-secondary hover:bg-secondary/90 text-background font-black text-lg rounded-xl">
                  Join Elite
                </Button>
              </div>
              <p className="text-[10px] text-center lg:text-left text-muted-foreground uppercase tracking-[0.2em] font-bold">
                Privacy Guaranteed • Opt-out anytime
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
