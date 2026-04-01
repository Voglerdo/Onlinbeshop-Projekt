"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/app/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Plus } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <Card className="group relative overflow-hidden glass-card transition-all duration-500 hover:gold-glow border-none">
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-[3/4] overflow-hidden relative">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            data-ai-hint={product.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />
        </div>
      </Link>
      
      <CardContent className="p-4 relative">
        <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">{product.category}</div>
        <h3 className="font-headline text-lg group-hover:text-primary transition-colors mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2 min-h-[2.5rem]">{product.description}</p>
        <div className="text-xl font-bold text-secondary">${product.price.toFixed(2)}</div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold group/btn"
          onClick={() => addItem(product)}
        >
          <Plus className="mr-2 h-4 w-4 transition-transform group-hover/btn:rotate-90" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
