"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/app/types';
import {
  addProductToCart,
  getCartTotalItems,
  getCartTotalPrice,
  removeProductFromCart,
  updateProductQuantity,
} from './cart.utils';

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

  useEffect(() => {
    const savedCart = localStorage.getItem('blubber_baron_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('blubber_baron_cart', JSON.stringify(items));
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
