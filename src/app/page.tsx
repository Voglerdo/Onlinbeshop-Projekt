"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Loader2, Sparkles, X } from 'lucide-react';

import { PRODUCT_CATEGORIES, ProductCategoryId } from './home.constants';
import { filterProducts } from './home.utils';
import { ProductCard } from '@/components/products/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/use-products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import styles from './page.module.css';
import generatedStyles from './page.styles.module.css';
import { cn } from '@/lib/utils';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategoryId>('all');
  const { products, isLoading } = useProducts();

  const searchQuery = searchParams.get('q') || '';
  const heroImg = PlaceHolderImages.find((img) => img.id === 'hero-shisha');
  const filteredProducts = useMemo(
    () => filterProducts(products, selectedCategory, searchQuery),
    [products, searchQuery, selectedCategory],
  );

  function clearSearch() {
    router.push('/#catalog');
  }

  function resetFilters() {
    setSelectedCategory('all');
    clearSearch();
  }

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <Image
          src={heroImg?.imageUrl || ''}
          alt="Luxus-Shisha-Erlebnis"
          fill
          priority
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <div className={styles.eyebrowLine} />
              <span className={styles.eyebrowText}>Imperialer Standard</span>
              <div className={styles.eyebrowLine} />
            </div>
            <h1 className={styles.heroTitle}>
              EXZELLENZ <br />
              <span className={styles.heroTitleAccent}>ERSCHAFFEN</span>
            </h1>
            <p className={styles.heroText}>
              Erleben Sie den Gipfel der Shisha-Raffinesse. Kuratiert fuer jene
              Wenigen, die bei jedem Zug absolute Perfektion verlangen.
            </p>
          </div>

          <div className={styles.heroActions}>
            <Link href="/#catalog">
              <Button size="lg" className={cn(generatedStyles.actionButton, styles.primaryAction)}>
                Die Schatzkammer erkunden
              </Button>
            </Link>
            <Button
              asChild
              size="lg"
              variant="outline"
              className={styles.secondaryAction}
            >
              <Link href="/story">Die Geschichte</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="catalog" className={styles.catalog}>
        <div className={styles.catalogHeader}>
          <div>
            <div className={styles.sectionEyebrow}>
              <Sparkles size={12} />
              Kuratierte Auswahl
            </div>
            <h2 className={styles.catalogTitle}>Die Kollektion</h2>
            {searchQuery && (
              <div className={styles.searchBadgeWrap}>
                <Badge variant="secondary" className={styles.searchBadge}>
                  Suche: "{searchQuery}"
                  <button
                    type="button"
                    onClick={clearSearch}
                    className={styles.clearSearch}
                    aria-label="Suche entfernen"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              </div>
            )}
          </div>

          <div className={styles.categoryList}>
            {PRODUCT_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
                onClick={() => setSelectedCategory(category.id)}
                className={[
                  styles.categoryButton,
                  selectedCategory === category.id
                    ? `${styles.categoryButtonActive} gold-glow`
                    : styles.categoryButtonInactive,
                ].join(' ')}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loadingState}>
            <Loader2 className={styles.loader} />
            <p className={styles.loadingText}>
              Meisterwerke werden gefiltert...
            </p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={styles.productGrid}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={cn(generatedStyles.homePageContainerPrimary, styles.emptyState)}>
            <div className={styles.emptyContent}>
              <div className={styles.emptyIconWrap}>
                <Filter className={styles.emptyIcon} />
              </div>
              <h3 className={styles.emptyTitle}>Keine Funde</h3>
              <p className={styles.emptyText}>
                {searchQuery
                  ? `Unsere Archive enthalten keine Treffer fuer "${searchQuery}". Versuchen Sie es mit einem anderen Begriff.`
                  : 'Diese spezifische Kollektion befindet sich derzeit in der Kuratierung.'}
              </p>
              <Button
                variant="link"
                onClick={resetFilters}
                className={styles.resetButton}
              >
                Filter zuruecksetzen
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

