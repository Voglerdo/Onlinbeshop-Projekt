"use client"

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShieldCheck, Truck, RefreshCw, Loader2 } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query, limit, where } from 'firebase/firestore';
import { Product } from '@/app/types';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const db = useFirestore();

  const docRef = useMemoFirebase(() => {
    if (!db || !id) return null;
    return doc(db, 'products', id);
  }, [db, id]);

  const { data: product, isLoading, error } = useDoc<Product>(docRef);

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

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Summoning product details...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 space-y-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-3xl glass-card gold-glow border-none">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
              data-ai-hint={product.imageHint}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square relative rounded-lg overflow-hidden glass-card border-none hover:gold-glow transition-all cursor-pointer">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover opacity-60 hover:opacity-100 transition-opacity"
                  data-ai-hint={product.imageHint}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="px-4 py-1 text-xs uppercase tracking-widest font-bold">
              Premium {product.category}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-headline font-bold leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex text-secondary">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-5 w-5 fill-secondary" />)}
              </div>
              <span className="text-sm text-muted-foreground">Premium Collection</span>
            </div>
            <div className="text-4xl font-bold text-secondary">${product.price.toFixed(2)}</div>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {product.description}
          </p>

          {product.features && product.features.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold uppercase tracking-widest text-sm text-primary">Key Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-6 border-t border-border space-y-6">
            <AddToCartButton product={product} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="h-6 w-6 text-secondary" />
                <span className="text-xs font-medium uppercase tracking-tighter">Authentic Product</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="h-6 w-6 text-secondary" />
                <span className="text-xs font-medium uppercase tracking-tighter">Express Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RefreshCw className="h-6 w-6 text-secondary" />
                <span className="text-xs font-medium uppercase tracking-tighter">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-headline font-bold">You May Also Like</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Complete your setup with these complementary products recommended by our experts.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
