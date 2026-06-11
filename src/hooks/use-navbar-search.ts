"use client"

import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useNavbarSearch() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.get('q');

    if (query) {
      setSearchQuery(query);
      setIsSearchOpen(true);
    }
  }, [searchParams]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();

    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery) {
      router.push(`/?q=${encodeURIComponent(trimmedQuery)}#catalog`);
      return;
    }

    router.push('/#catalog');
  }

  function handleSearchBlur() {
    if (!searchQuery) {
      setIsSearchOpen(false);
    }
  }

  return {
    handleSearch,
    handleSearchBlur,
    isSearchOpen,
    searchQuery,
    setIsSearchOpen,
    setSearchQuery,
  };
}
