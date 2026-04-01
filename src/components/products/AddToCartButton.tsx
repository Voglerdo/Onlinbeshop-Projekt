"use client"

import { Product } from '@/app/types';
import { useCart } from '@/components/cart/CartProvider';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAdd = () => {
    addItem(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your selection.`,
    });
  };

  return (
    <Button 
      size="lg" 
      className="w-full bg-primary hover:bg-primary/90 h-14 text-xl font-bold rounded-xl crimson-glow"
      onClick={handleAdd}
    >
      <ShoppingBag className="mr-3 h-6 w-6" />
      Secure Purchase
    </Button>
  );
}
