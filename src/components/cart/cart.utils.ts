import { CartItem, Product } from '@/app/types';

function getPersistableImageUrl(imageUrl: string) {
  if (!imageUrl) {
    return undefined;
  }

  if (imageUrl.startsWith('data:')) {
    return undefined;
  }

  if (imageUrl.length > 2000) {
    return undefined;
  }

  return imageUrl;
}

export function addProductToCart(items: CartItem[], product: Product) {
  const existing = items.find((item) => item.id === product.id);

  if (existing) {
    return items.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
    );
  }

  return [
    ...items,
    {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: getPersistableImageUrl(product.imageUrl),
      quantity: 1,
    },
  ];
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

export function serializeCartItems(items: CartItem[]) {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));
}

export function sanitizeCartItems(items: unknown): CartItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const candidate = item as Record<string, unknown>;
      const id = typeof candidate.id === 'string' ? candidate.id : '';
      const name = typeof candidate.name === 'string' ? candidate.name : '';
      const imageUrl =
        typeof candidate.imageUrl === 'string' ? candidate.imageUrl : undefined;
      const price =
        typeof candidate.price === 'number'
          ? candidate.price
          : Number(candidate.price);
      const quantity =
        typeof candidate.quantity === 'number'
          ? candidate.quantity
          : Number(candidate.quantity);

      if (!id || !name || Number.isNaN(price) || Number.isNaN(quantity)) {
        return null;
      }

      return {
        id,
        name,
        price,
        imageUrl,
        quantity: Math.max(1, Math.floor(quantity)),
      };
    })
    .filter((item): item is CartItem => item !== null);
}
