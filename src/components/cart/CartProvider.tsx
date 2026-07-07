"use client"

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CartItem, Product } from '@/app/types';
import {
  addProductToCart,
  getCartTotalItems,
  getCartTotalPrice,
  removeProductFromCart,
  sanitizeCartItems,
  serializeCartItems,
  updateProductQuantity,
} from './cart.utils';
import { useToast } from '@/hooks/use-toast';
import { externalApiService } from '@/services/api-client';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const hasShownStorageWarning = useRef(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('blubber_baron_cart');
    if (savedCart) {
      try {
        setItems(sanitizeCartItems(JSON.parse(savedCart)));
      } catch (e) {
        console.error("Failed to parse cart", e);
        localStorage.removeItem('blubber_baron_cart');
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        'blubber_baron_cart',
        JSON.stringify(serializeCartItems(items))
      );
    } catch (error) {
      localStorage.removeItem('blubber_baron_cart');
      console.error('Failed to persist cart', error);
      if (!hasShownStorageWarning.current) {
        hasShownStorageWarning.current = true;
        toast({
          title: 'Warenkorb konnte nicht gespeichert werden',
          description: 'Zu viele lokale Daten im Browser. Der Warenkorb bleibt nur fuer diese Sitzung erhalten.',
          variant: 'destructive',
        });
      }
    }
  }, [items, toast]);

  useEffect(() => {
    const itemsMissingImages = items.filter((item) => !item.imageUrl);

    if (itemsMissingImages.length === 0) {
      return;
    }

    let isMounted = true;

    async function hydrateCartImages() {
      try {
        const products = await externalApiService.getProducts();
        const imageById = new Map(
          products.map((product: Product) => [product.id, product.imageUrl])
        );

        if (!isMounted) {
          return;
        }

        setItems((currentItems) =>
          currentItems.map((item) => ({
            ...item,
            imageUrl: item.imageUrl || imageById.get(item.id) || undefined,
          }))
        );
      } catch (error) {
        console.warn('Produktbilder fuer Warenkorb konnten nicht geladen werden.');
      }
    }

    hydrateCartImages();

    return () => {
      isMounted = false;
    };
  }, [items]);

  const addItem = (product: Product) => {
    setItems(prev => addProductToCart(prev, product));
  };

  const removeItem = (id: string) => {
    setItems(prev => removeProductFromCart(prev, id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => updateProductQuantity(prev, id, delta));
  };

  const clearCart = () => setItems([]);

  const totalItems = getCartTotalItems(items);
  const totalPrice = getCartTotalPrice(items);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
