"use client"

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Star, ShieldCheck, Truck, RefreshCw, Loader2, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query, limit, where } from 'firebase/firestore';
import { Product } from '@/app/types';
import Link from 'next/link';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const db = useFirestore();

  const docRef = useMemoFirebase(() => {
    if (!db || !id) return null;
    return doc(db, 'products', id);
  }, [db, id]);

  const { data: product, isLoading } = useDoc<Product>(docRef);

  const relatedQuery = useMemoFirebase(() => {
    if (!db || !product) return null;
    return query(
      collection(db, 'products'), 
      where('category', '==', product.category),
      limit(5)
    );
  }, [db, product]);

  const { data: relatedProductsRaw } = useCollection<Product>(relatedQuery);
  const relatedProducts = relatedProductsRaw?.filter(p => p.id !== id).slice(0, 4) || [];

  // Show loading state while data is being fetched or while params are initializing
  if (isLoading || !id) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
        </div>
        <p className="text-muted-foreground font-medium animate-pulse">Summoning product details...</p>
      </div>
    );
  }

  // Only trigger 404 if loading is finished and no product was found
  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 space-y-16">
      <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Catalog</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-bold truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-6">
          <div className="aspect-[4/5] relative overflow-hidden rounded-[2rem] glass-card gold-glow border-none group">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
              data-ai-hint={product.imageHint || "shisha hookah"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="aspect-square relative rounded-2xl overflow-hidden glass-card border-none hover:ring-2 hover:ring-secondary transition-all cursor-pointer opacity-70 hover:opacity-100"
              >
                <Image
                  src={product.imageUrl}
                  alt={`${product.name} angle ${i}`}
                  fill
                  className="object-cover"
                  data-ai-hint={product.imageHint || "shisha hookah"}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-bold border-none gold-glow">
                Premium Selection
              </Badge>
              <Badge variant="outline" className="px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-medium border-border">
                {product.category}
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tight leading-[1.1]">{product.name}</h1>
            
            <div className="flex items-center gap-6">
              <div className="flex text-secondary">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-5 w-5 fill-secondary" />)}
              </div>
              <div className="h-4 w-px bg-border" />
              <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Certified Luxury</span>
            </div>

            <div className="flex items-baseline gap-4">
              <div className="text-5xl font-black text-secondary">${product.price.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Incl. VAT</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary">The Narrative</h3>
            <p className="text-xl text-muted-foreground leading-relaxed font-light whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          {product.features && product.features.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-border">
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Key Attributes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rotate-45 bg-secondary shadow-[0_0_8px_rgba(209,163,71,0.8)]" />
                    <span className="text-sm font-medium text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-10 space-y-8">
            <div className="flex flex-col gap-4">
              <AddToCartButton product={product} />
              <p className="text-center text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                Limited Availability • Ships Worldwide
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="p-3 rounded-full bg-muted/30 group-hover:bg-primary/10 transition-colors">
                  <ShieldCheck className="h-6 w-6 text-secondary" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Authentic</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="p-3 rounded-full bg-muted/30 group-hover:bg-primary/10 transition-colors">
                  <Truck className="h-6 w-6 text-secondary" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Priority</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="p-3 rounded-full bg-muted/30 group-hover:bg-primary/10 transition-colors">
                  <RefreshCw className="h-6 w-6 text-secondary" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Premium Care</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="space-y-12 pt-24 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-3">
              <h2 className="text-4xl font-headline font-bold">The Complete Set</h2>
              <div className="h-1 w-20 bg-primary" />
              <p className="text-muted-foreground font-medium">Complementary selections curated for this piece.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
