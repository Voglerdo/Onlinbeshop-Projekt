
"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Star, ShieldCheck, Truck, RefreshCw, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { ReviewSystem } from '@/components/products/ReviewSystem';
import { Product } from '@/app/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { externalApiService } from '@/services/api-client';
import styles from './page.styles.module.css';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setIsLoading(true);
      try {
        const productData = await externalApiService.getProduct(id);
        setProduct(productData);
        
        // Verwandte Produkte laden
        const allProducts = await externalApiService.getProducts();
        const related = allProducts
          .filter(p => p.category === productData.category && p.id !== id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        console.error('Fehler beim Laden des Produkts:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.productsLayoutPrimary}>
        <div className={styles.productsContainerPrimary}>
          <Loader2 className={styles.loader2Icon} />
          <div className={styles.overlay} />
        </div>
        <p className={styles.produktdatenWerdenBeschworenText}>Produktdaten werden beschworen...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const gallery = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls 
    : [product.imageUrl];

  return (
    <div className={styles.productsContainerSecondary}>
      <div className={styles.productsContainerPrimary}>
        <nav className={styles.productsLayoutSecondary}>
          <Link href="/" className={styles.link9}>Katalog</Link>
          <ChevronRight className={styles.chevronright10} />
          <span className={styles.inlineText}>{product.name}</span>
        </nav>

        <div className={styles.grid}>
          <div className={styles.productsContainerTertiary}>
            <div className={styles.productsPanelPrimary}>
              <Image
                src={gallery[activeImageIdx]}
                alt={product.name}
                fill
                className={styles.productsUtilityPrimary}
                priority
                data-ai-hint={product.imageHint || "shisha hookah"}
              />
              <div className={styles.overlay2} />
              
              {gallery.length > 1 && (
                <div className={styles.overlay3}>
                  <button 
                    onClick={() => setActiveImageIdx(prev => (prev - 1 + gallery.length) % gallery.length)}
                    className={styles.productsPanelSecondary}
                  >
                    <ChevronLeft className={styles.chevronleft19} />
                  </button>
                  <button 
                    onClick={() => setActiveImageIdx(prev => (prev + 1) % gallery.length)}
                    className={styles.productsPanelSecondary}
                  >
                    <ChevronRight className={styles.chevronleft19} />
                  </button>
                </div>
              )}
            </div>
            
            {gallery.length > 1 && (
              <div className={styles.productsLayoutTertiary}>
                {gallery.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImageIdx(idx)}
                    className={cn(
                      styles.productsPanelQuaternary,
                      activeImageIdx === idx ? styles.productsUtilitySecondary : styles.productsUtilityTertiary
                    )}
                  >
                    <Image src={img} alt={`Vorschau ${idx + 1}`} fill className={styles.productsImage} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.productsContainerQuinary}>
            <div className={styles.productsContainerTertiary}>
              <div className={styles.productsLayoutQuaternary}>
                <Badge variant="secondary" className={styles.statusBadge}>
                  Premium Auswahl
                </Badge>
                <Badge variant="outline" className={styles.statusBadge2}>
                  {product.category}
                </Badge>
              </div>
              
              <h1 className={styles.productsTitle}>{product.name}</h1>
              
              <div className={styles.productsLayoutQuinary}>
                <div className={styles.productsLayoutSenary}>
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={styles.starIcon} />)}
                </div>
                <div className={styles.productsIconPrimary} />
                <span className={styles.zertifizierterLuxusText}>Zertifizierter Luxus</span>
              </div>

              <div className={styles.productsLayoutSeptenary}>
                <div className={styles.productsTextPrimary}>{product.price.toFixed(2)}€</div>
                <div className={styles.productsIconSecondary}>Inkl. MwSt.</div>
              </div>
            </div>

            <div className={styles.productsContainerSenary}>
              <h3 className={styles.dasNarrativHeading}>Das Narrativ</h3>
              <p className={styles.bodyText}>
                {product.description}
              </p>
            </div>

            {product.features && product.features.length > 0 && (
              <div className={styles.productsContainerSeptenary}>
                <h3 className={styles.dasNarrativHeading}>Hauptmerkmale</h3>
                <div className={styles.grid2}>
                  {product.features.map((feature, index) => (
                    <div key={index} className={styles.productsLayoutQuaternary}>
                      <div className={styles.productsContainerOctonary} />
                      <span className={styles.inlineText2}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.productsContainerNonary}>
              <div className={styles.productsLayoutOctonary}>
                <AddToCartButton product={product} />
                <p className={styles.bodyText2}>
                  Limitierte Verfügbarkeit • Weltweiter Versand
                </p>
              </div>
              
              <div className={styles.grid3}>
                <div className={styles.productsLayoutNonary}>
                  <div className={styles.productsPanelTertiary}>
                    <ShieldCheck className={styles.shieldcheck48} />
                  </div>
                  <span className={styles.authentischText}>Authentisch</span>
                </div>
                <div className={styles.productsLayoutNonary}>
                  <div className={styles.productsPanelTertiary}>
                    <Truck className={styles.shieldcheck48} />
                  </div>
                  <span className={styles.authentischText}>Priorität</span>
                </div>
                <div className={styles.productsLayoutNonary}>
                  <div className={styles.productsPanelTertiary}>
                    <RefreshCw className={styles.shieldcheck48} />
                  </div>
                  <span className={styles.authentischText}>Premium Pflege</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewSystem productId={id} />

      {relatedProducts.length > 0 && (
        <section className={styles.productsSection}>
          <div className={styles.productsLayoutDenary}>
            <div className={styles.productsContainerDenary}>
              <h2 className={styles.dasKompletteSetHeading}>Das komplette Set</h2>
              <div className={styles.productsContainerEleventh} />
              <p className={styles.bodyText3}>Ergänzende Auswahlen, kuratiert für dieses Stück.</p>
            </div>
          </div>
          <div className={styles.grid4}>
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
