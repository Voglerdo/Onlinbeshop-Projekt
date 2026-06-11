"use client"

import { useEffect, useState } from 'react';
import { Product } from '@/app/types';
import { externalApiService } from '@/services/api-client';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      setIsLoading(true);

      try {
        const data = await externalApiService.getProducts();

        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Fehler beim Laden der Produkte:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, isLoading };
}
