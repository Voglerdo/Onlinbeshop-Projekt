
"use client"

import { Product } from '@/app/types';
import { useCart } from '@/components/cart/CartProvider';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import styles from './AddToCartButton.styles.module.css';

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAdd = () => {
    addItem(product);
    toast({
      title: "Hinzugefügt",
      description: `${product.name} wurde Ihrer Auswahl hinzugefügt.`,
    });
  };

  return (
    <Button 
      size="lg" 
      className={styles.productsAddtocartbuttonTextPrimary}
      onClick={handleAdd}
    >
      <ShoppingBag className={styles.shoppingbag2} />
      Sicherer Erwerb
    </Button>
  );
}
