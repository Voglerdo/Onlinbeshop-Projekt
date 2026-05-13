import { Product } from '@/app/types';
import { ProductCategoryId } from './home.constants';

export function filterProducts(
  products: Product[],
  selectedCategory: ProductCategoryId,
  searchQuery: string,
) {
  const normalizedSearch = searchQuery.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    const matchesSearch =
      !normalizedSearch ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.description.toLowerCase().includes(normalizedSearch) ||
      product.category.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });
}
