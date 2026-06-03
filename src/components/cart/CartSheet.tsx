"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCart } from './CartProvider';
import styles from './CartSheet.module.css';

export function CartSheet() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity } = useCart();
  const hasItems = items.length > 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={styles.triggerButton}>
          <ShoppingBag className={styles.triggerIcon} />
          {totalItems > 0 && (
            <Badge variant="destructive" className={styles.badge}>
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className={styles.content}>
        <SheetHeader className={styles.header}>
          <SheetTitle className={styles.title}>
            <ShoppingBag className={styles.titleIcon} />
            Ihre Auswahl
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className={styles.scrollArea}>
          {!hasItems ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrap}>
                <ShoppingBag className={styles.emptyIcon} />
              </div>
              <p className={styles.emptyText}>
                Ihr Warenkorb ist derzeit leer.
              </p>
              <Button variant="link" asChild className={styles.emptyLink}>
                <Link href="/#catalog">Weiter einkaufen</Link>
              </Button>
            </div>
          ) : (
            <div className={styles.itemList}>
              {items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemImageWrap}>
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className={styles.itemImage}
                    />
                  </div>

                  <div className={styles.itemBody}>
                    <div className={styles.itemTop}>
                      <h4 className={styles.itemName}>{item.name}</h4>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className={styles.removeButton}
                        aria-label={`${item.name} entfernen`}
                      >
                        <Trash2 className={styles.removeIcon} />
                      </button>
                    </div>

                    <div className={styles.itemPrice}>
                      {item.price.toFixed(2)} EUR
                    </div>

                    <div className={styles.quantityControls}>
                      <Button
                        variant="outline"
                        size="icon"
                        className={styles.quantityButton}
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label={`${item.name} Menge reduzieren`}
                      >
                        <Minus className={styles.quantityIcon} />
                      </Button>
                      <span className={styles.quantityValue}>
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className={styles.quantityButton}
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label={`${item.name} Menge erhoehen`}
                      >
                        <Plus className={styles.quantityIcon} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {hasItems && (
          <SheetFooter className={styles.footer}>
            <div className={styles.footerInner}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Gesamtsumme</span>
                <span className={styles.totalPrice}>
                  {totalPrice.toFixed(2)} EUR
                </span>
              </div>
              <Separator />
              <Button asChild className={styles.checkoutButton}>
                <Link href="/checkout">Zur Kasse gehen</Link>
              </Button>
              <p className={styles.checkoutHint}>
                Sicherer Checkout durch Blubber Baron
              </p>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
