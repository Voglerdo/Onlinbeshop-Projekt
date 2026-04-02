export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'hookah' | 'coal' | 'flavor' | 'accessory' | string;
  imageUrl: string;
  imageHint: string;
  brand: string;
  stockQuantity: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}
