import { CartItem, Product } from '@/app/types';

export function addProductToCart(items: CartItem[], product: Product) {
  const existing = items.find((item) => item.id === product.id);

  if (existing) {
    return items.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
    );
  }

  return [...items, { ...product, quantity: 1 }];
}

export function removeProductFromCart(items: CartItem[], id: string) {
  return items.filter((item) => item.id !== id);
}

export function updateProductQuantity(
  items: CartItem[],
  id: string,
  delta: number,
) {
  return items.map((item) => {
    if (item.id !== id) {
      return item;
    }

    return { ...item, quantity: Math.max(1, item.quantity + delta) };
  });
}

export function getCartTotalItems(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotalPrice(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
