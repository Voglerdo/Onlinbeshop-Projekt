"use client"

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star, Loader2, Sparkles, Filter, X } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Product } from '@/app/types';
import { cn } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation';

const CATEGORIES = [
  { id: 'all', label: 'Full Collection' },
  { id: 'hookah', label: 'Hookahs' },
  { id: 'flavor', label: 'Flavors' },
  { id: 'coal', label: 'Charcoal' },
  { id: 'accessory', label: 'Accessories' },
];

export default function Home() {
  const db = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const searchQuery = searchParams.get('q') || '';
  
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-shisha');

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: allProducts, isLoading } = useCollection<Product>(productsQuery);

  const filteredProducts = allProducts?.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  }) || [];

  const clearSearch = () => {
    router.push('/#catalog');
  };

  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
        <Image
          src={heroImg?.imageUrl || ''}
          alt="Luxury Shisha Experience"
          fill
          priority
          className="object-cover opacity-40 scale-105"
          data-ai-hint="luxury shisha"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="container relative z-10 px-4 text-center space-y-10">
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-secondary animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="h-px w-12 bg-secondary/30" />
              <span className="uppercase tracking-[0.6em] text-[10px] font-black">Imperial Standard</span>
              <div className="h-px w-12 bg-secondary/30" />
            </div>
            <h1 className="text-7xl md:text-9xl font-black font-headline tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
              CRAFTING <br /><span className="text-secondary italic font-serif">EXCELLENCE</span>
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
              Experience the pinnacle of shisha sophistication. Curated for the few who demand absolute perfection in every draw.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000">
            <Link href="/#catalog">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-16 px-12 rounded-full crimson-glow transition-all hover:scale-105">
                Explore The Vault
              </Button>
            </Link>
            <Button asChild size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 h-16 px-12 rounded-full backdrop-blur-sm">
              <Link href="/story">The Narrative</Link>
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <div className="w-[1px] h-16 bg-gradient-to-b from-secondary to-transparent" />
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="container mx-auto px-4 lg:px-8 space-y-16 scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-secondary font-black uppercase tracking-[0.4em] text-[10px]">
              <Sparkles className="h-3 w-3" />
              Curated Selections
            </div>
            <h2 className="text-5xl md:text-6xl font-headline font-bold leading-none">The Collection</h2>
            {searchQuery && (
              <div className="flex items-center gap-2 mt-4">
                <Badge variant="secondary" className="px-4 py-1.5 bg-secondary/10 text-secondary border-secondary/20 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                  Search: "{searchQuery}"
                  <button onClick={clearSearch} className="hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'secondary' : 'ghost'}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "h-12 px-8 rounded-full font-bold text-xs uppercase tracking-widest transition-all",
                  selectedCategory === cat.id 
                    ? "bg-secondary text-background hover:bg-secondary/90 gold-glow" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-40 gap-6">
            <Loader2 className="h-12 w-12 animate-spin text-secondary" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse">Filtering Masterpieces...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 glass-card rounded-[3rem] border-dashed border-2 border-white/5">
            <div className="max-w-md mx-auto space-y-6">
              <div className="p-6 rounded-full bg-white/5 inline-block">
                <Filter className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-2xl font-bold font-headline">No Discoveries Made</h3>
              <p className="text-muted-foreground font-light">
                {searchQuery 
                  ? `Our archives hold no matches for "${searchQuery}". Try a broader term.`
                  : `This specific collection is currently in curation.`
                }
              </p>
              <Button variant="link" onClick={() => { setSelectedCategory('all'); clearSearch(); }} className="text-secondary font-black uppercase tracking-widest text-xs">
                Reset Imperial Filters
              </Button>
            </div>
          </div>
        )}

        {/* Newsletter Section */}
        <div className="mt-32 p-16 lg:p-24 glass-card rounded-[4rem] relative overflow-hidden border-none gold-glow">
          <div className="absolute -top-24 -right-24 p-8 opacity-[0.03]">
            <Sparkles className="h-[30rem] w-[30rem] text-secondary" />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-2xl space-y-8 text-center lg:text-left">
              <Badge className="bg-secondary/10 text-secondary border-secondary/20 px-5 py-1.5 text-[10px] font-black tracking-[0.3em]">THE INNER CIRCLE</Badge>
              <h3 className="text-5xl md:text-7xl font-headline font-bold leading-[0.9] tracking-tighter">Elevate Your Existence</h3>
              <p className="text-xl text-muted-foreground leading-relaxed font-light">
                Join the Baron's elite registry for early access to limited edition drops, exclusive flavor prototypes, and private global events.
              </p>
            </div>
            
            <div className="w-full lg:w-auto space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="The Baron's Email" 
                  className="bg-black/40 border border-white/10 rounded-2xl px-8 h-16 flex-1 md:w-96 outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition-all font-light"
                />
                <Button className="h-16 px-12 bg-secondary hover:bg-secondary/90 text-background font-black text-xs uppercase tracking-widest rounded-2xl transition-transform hover:scale-105">
                  Join Elite
                </Button>
              </div>
              <p className="text-[10px] text-center lg:text-left text-muted-foreground uppercase tracking-[0.3em] font-medium opacity-50">
                Discretion Guaranteed • Strictly Confidential
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}