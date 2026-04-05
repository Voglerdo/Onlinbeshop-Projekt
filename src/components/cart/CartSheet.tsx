
"use client"

import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from './CartProvider';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export function CartSheet() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-secondary">
          <ShoppingBag className="h-6 w-6" />
          {totalItems > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full text-[10px] animate-in zoom-in">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-card border-l-border flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="font-headline text-2xl flex items-center gap-2">
            <ShoppingBag className="text-primary" />
            Ihre Auswahl
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-20">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">Ihr Warenkorb ist derzeit leer.</p>
              <Button variant="link" asChild className="text-secondary">
                <Link href="/#catalog">Weiter einkaufen</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium line-clamp-1">{item.name}</h4>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-sm text-secondary font-bold">
                      {item.price.toFixed(2)}€
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <Button variant="outline" size="icon" className="h-7 w-7 rounded-sm" onClick={() => updateQuantity(item.id, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-4 text-center">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7 rounded-sm" onClick={() => updateQuantity(item.id, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <SheetFooter className="p-6 border-t border-border bg-background/50 backdrop-blur-sm">
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="text-muted-foreground">Gesamtsumme</span>
                <span className="font-bold text-secondary text-2xl">{totalPrice.toFixed(2)}€</span>
              </div>
              <Separator />
              <Button asChild className="w-full bg-primary hover:bg-primary/90 h-12 text-lg font-bold">
                <Link href="/checkout">Zur Kasse gehen</Link>
              </Button>
              <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest">
                Sicherer Checkout durch Blubber Baron
              </p>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
