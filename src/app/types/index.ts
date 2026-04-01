export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'hookah' | 'coal' | 'flavor' | 'accessory';
  imageUrl: string;
  imageHint: string;
  features: string[];
}

export interface CartItem extends Product {
  quantity: number;
}