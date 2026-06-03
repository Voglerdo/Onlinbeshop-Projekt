"use client"

import Link from 'next/link';
import { Search, ShieldCheck, User } from 'lucide-react';

import { CartSheet } from '@/components/cart/CartSheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useNavbarSearch } from '@/hooks/use-navbar-search';
import styles from './Navbar.module.css';

export function Navbar() {
  const { user } = useAuth();
  const {
    handleSearch,
    handleSearchBlur,
    isSearchOpen,
    searchQuery,
    setIsSearchOpen,
    setSearchQuery,
  } = useNavbarSearch();

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <div className={styles.leftCluster}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandText}>Blubber Baron</span>
          </Link>

          <div className={styles.links}>
            <Link href="/#catalog" className={styles.navLink}>
              Kollektion
            </Link>
            <Link href="/story" className={styles.navLink}>
              Geschichte
            </Link>
            <Link href="/careers" className={styles.navLink}>
              Karriere
            </Link>
            {user?.isAdmin && (
              <Link href="/admin" className={styles.adminLink}>
                <ShieldCheck className={styles.adminIcon} />
                Konsole
              </Link>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <form
            onSubmit={handleSearch}
            className={[
              styles.searchForm,
              isSearchOpen ? styles.searchFormOpen : '',
            ].join(' ')}
          >
            <Input
              placeholder="Archive durchsuchen..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className={[
                styles.searchInput,
                isSearchOpen ? styles.searchInputOpen : '',
              ].join(' ')}
              onBlur={handleSearchBlur}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={[
                styles.searchButton,
                isSearchOpen ? styles.searchButtonOpen : '',
              ].join(' ')}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Suche oeffnen"
            >
              <Search className={styles.icon} />
            </Button>
          </form>

          <div className={styles.divider} />

          <CartSheet />

          <Link href="/profile">
            <Button variant="ghost" size="icon" className={styles.profileButton}>
              <User className={styles.icon} />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
