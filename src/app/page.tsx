"use client"

import Image from 'next/image';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Star, Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Product } from '@/app/types';

export default function Home() {
  const db = useFirestore();
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-shisha');

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
        <Image
          src={heroImg?.imageUrl || ''}
          alt="Luxury Shisha Experience"
          fill
          priority
          className="object-cover opacity-50 scale-105 animate-pulse-slow"
          data-ai-hint="luxury shisha"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        
        <div className="container relative z-10 px-4 text-center space-y-8">
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-secondary animate-in slide-in-from-bottom-4 duration-700">
              <Star className="fill-secondary h-4 w-4" />
              <span className="uppercase tracking-[0.5em] text-sm font-bold">The Ultimate Experience</span>
              <Star className="fill-secondary h-4 w-4" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter leading-none animate-in slide-in-from-bottom-8 duration-1000">
              IGNITE YOUR <span className="text-primary">PASSION</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed animate-in slide-in-from-bottom-12 duration-1000">
              Welcome to the elite world of Crimson Coals. Discover curated premium hookahs and flavors designed for true connoisseurs.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 animate-in slide-in-from-bottom-16 duration-1000 delay-200">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-10 rounded-full crimson-glow">
              Explore Collection
            </Button>
            <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10 h-14 px-10 rounded-full">
              Our Story
            </Button>
          </div>
        </div>
        
        {/* Subtle scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-1 h-12 bg-gradient-to-b from-primary to-transparent rounded-full" />
        </div>
      </section>

      {/* Catalog Section */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-headline font-bold">Our Masterpieces</h2>
            <div className="h-1.5 w-24 bg-primary" />
            <p className="text-muted-foreground font-medium">Handpicked selections for your perfect session.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="text-secondary hover:text-secondary hover:bg-secondary/10">Hookahs</Button>
            <Button variant="ghost" className="text-muted-foreground">Flavors</Button>
            <Button variant="ghost" className="text-muted-foreground">Accessories</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-3xl">
            <p className="text-muted-foreground">No masterpieces found in our current catalog.</p>
          </div>
        )}

        <div className="mt-20 p-12 glass-card rounded-3xl flex flex-col md:flex-row items-center justify-between gap-12 gold-glow border-none">
          <div className="max-w-xl space-y-4">
            <h3 className="text-3xl md:text-4xl font-headline font-bold">Join the Crimson Elite</h3>
            <p className="text-muted-foreground">Subscribe to get early access to limited edition drops, secret flavor blends, and exclusive invitations to shisha lounge events.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-background border-border rounded-lg px-6 h-12 flex-1 md:w-80 outline-none focus:ring-1 focus:ring-secondary transition-all"
            />
            <Button className="h-12 px-8 bg-secondary hover:bg-secondary/90 text-background font-bold">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
