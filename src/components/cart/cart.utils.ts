import { CartItem, Product } from '@/app/types';

export function toCartItem(product: Product): CartItem {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    quantity: 1,
  };
}

export function addProductToCart(items: CartItem[], product: Product) {
  const existing = items.find((item) => item.id === product.id);

  if (existing) {
    return items.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
    );
  }

  return [...items, toCartItem(product)];
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

export function sanitizeCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (
      !item ||
      typeof item !== 'object' ||
      typeof item.id !== 'string' ||
      typeof item.name !== 'string' ||
      typeof item.price !== 'number' ||
      typeof item.imageUrl !== 'string'
    ) {
      return [];
    }

    const quantity =
      typeof item.quantity === 'number' && Number.isFinite(item.quantity)
        ? Math.max(1, Math.floor(item.quantity))
        : 1;

    return [
      {
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity,
      },
    ];
  });
}
