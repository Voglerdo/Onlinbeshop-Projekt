"use client"

import Image from 'next/image';
import Link from 'next/link';
import { MouseEvent } from 'react';
import { Eye, Plus } from 'lucide-react';

import { Product } from '@/app/types';
import { useCart } from '@/components/cart/CartProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  function handleAddToCart(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    addItem(product);
  }

  return (
    <Card className={`glass-card ${styles.card}`}>
      <Link href={`/products/${product.id}`} className={styles.link}>
        <div className={styles.imageFrame}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className={styles.image}
            data-ai-hint={product.imageHint}
          />
          <div className={styles.imageOverlay} />

          <div className={styles.hoverOverlay}>
            <div className={styles.viewIconWrap}>
              <Eye className={styles.viewIcon} />
            </div>
          </div>
        </div>

        <CardContent className={styles.content}>
          <div className={styles.category}>{product.category}</div>
          <h3 className={styles.title}>{product.name}</h3>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.price}>{product.price.toFixed(2)} EUR</div>
        </CardContent>
      </Link>

      <CardFooter className={styles.footer}>
        <Button className={styles.addButton} onClick={handleAddToCart}>
          <Plus className={styles.addIcon} />
          In den Warenkorb
        </Button>
      </CardFooter>
    </Card>
  );
}
