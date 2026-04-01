import { Product } from '../types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Crimson Premium Hookah',
    description: 'A masterpiece of design and performance, featuring high-grade stainless steel and a crimson-tinted crystal base.',
    price: 249.99,
    category: 'hookah',
    imageUrl: PlaceHolderImages.find(img => img.id === 'product-1')?.imageUrl || '',
    imageHint: 'premium hookah',
    features: ['Stainless Steel Construction', 'Crystal Base', 'Quiet Diffuser']
  },
  {
    id: '2',
    name: 'Golden Ember Coal',
    description: 'Long-lasting, low-ash coconut charcoal for the purest smoking experience.',
    price: 19.99,
    category: 'coal',
    imageUrl: PlaceHolderImages.find(img => img.id === 'product-2')?.imageUrl || '',
    imageHint: 'shisha charcoal',
    features: ['100% Coconut', '90 Min Burn Time', 'Low Ash Content']
  },
  {
    id: '3',
    name: 'Ruby Mist Tobacco',
    description: 'A sophisticated blend of dark berries and a hint of cooling menthol.',
    price: 24.50,
    category: 'flavor',
    imageUrl: PlaceHolderImages.find(img => img.id === 'product-3')?.imageUrl || '',
    imageHint: 'shisha flavor',
    features: ['Premium Virginia Leaf', 'Natural Flavoring', 'Dense Smoke']
  },
  {
    id: '4',
    name: 'Obsidian Glass Base',
    description: 'A stunning replacement base crafted from thick obsidian-style glass with gold accents.',
    price: 85.00,
    category: 'accessory',
    imageUrl: PlaceHolderImages.find(img => img.id === 'product-4')?.imageUrl || '',
    imageHint: 'hookah glass',
    features: ['Hand-blown', 'Heavy Base', 'Gold Rim Detail']
  },
  {
    id: '5',
    name: 'Silk Road Hose',
    description: 'A luxurious velvet-covered silicone hose with a weighted gold-plated handle.',
    price: 45.00,
    category: 'accessory',
    imageUrl: PlaceHolderImages.find(img => img.id === 'product-5')?.imageUrl || '',
    imageHint: 'hookah hose',
    features: ['Medical Grade Silicone', 'Velvet Cover', 'Easy Flow']
  },
  {
    id: '6',
    name: 'Royal Gold Bowl',
    description: 'Excellent heat retention and distribution with a gold-leaf glaze.',
    price: 35.00,
    category: 'accessory',
    imageUrl: PlaceHolderImages.find(img => img.id === 'product-6')?.imageUrl || '',
    imageHint: 'shisha bowl',
    features: ['Stoneware Body', 'Gold Glaze', 'Phunnel Design']
  }
];

export function getProduct(id: string): Product | undefined {
  return MOCK_PRODUCTS.find(p => p.id === id);
}