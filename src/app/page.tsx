
"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star, Loader2, Sparkles, Filter, X } from 'lucide-react';
import { Product } from '@/app/types';
import { cn } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation';
import { externalApiService } from '@/services/api-client';

const CATEGORIES = [
  { id: 'all', label: 'Gesamte Kollektion' },
  { id: 'hookah', label: 'Wasserpfeifen' },
  { id: 'flavor', label: 'Aromen' },
  { id: 'coal', label: 'Kohle' },
  { id: 'accessory', label: 'Zubehör' },
];

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const searchQuery = searchParams.get('q') || '';
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-shisha');

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const data = await externalApiService.getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Fehler beim Laden der Produkte:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const clearSearch = () => {
    router.push('/#catalog');
  };

  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
        <Image
          src={heroImg?.imageUrl || ''}
          alt="Luxus-Shisha-Erlebnis"
          fill
          priority
          className="object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        
        <div className="container relative z-10 px-4 text-center space-y-10">
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-secondary">
              <div className="h-px w-12 bg-secondary/30" />
              <span className="uppercase tracking-[0.6em] text-[10px] font-black">Imperialer Standard</span>
              <div className="h-px w-12 bg-secondary/30" />
            </div>
            <h1 className="text-7xl md:text-9xl font-black font-headline tracking-tighter leading-[0.9]">
              EXZELLENZ <br /><span className="text-secondary italic font-serif">ERSCHAFFEN</span>
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Erleben Sie den Gipfel der Shisha-Raffinesse. Kuratiert für jene Wenigen, die bei jedem Zug absolute Perfektion verlangen.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/#catalog">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-16 px-12 rounded-full crimson-glow transition-all hover:scale-105">
                Die Schatzkammer erkunden
              </Button>
            </Link>
            <Button asChild size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 h-16 px-12 rounded-full backdrop-blur-sm">
              <Link href="/story">Die Geschichte</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="container mx-auto px-4 lg:px-8 space-y-16 scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-secondary font-black uppercase tracking-[0.4em] text-[10px]">
              <Sparkles className="h-3 w-3" />
              Kuratierte Auswahl
            </div>
            <h2 className="text-5xl md:text-6xl font-headline font-bold leading-none">Die Kollektion</h2>
            {searchQuery && (
              <div className="flex items-center gap-2 mt-4">
                <Badge variant="secondary" className="px-4 py-1.5 bg-secondary/10 text-secondary border-secondary/20 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                  Suche: "{searchQuery}"
                  <button onClick={clearSearch} className="hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'secondary' : 'ghost'}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "h-12 px-8 rounded-full font-bold text-xs uppercase tracking-widest transition-all",
                  selectedCategory === cat.id 
                    ? "bg-secondary text-background hover:bg-secondary/90 gold-glow" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-40 gap-6">
            <Loader2 className="h-12 w-12 animate-spin text-secondary" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse">Meisterwerke werden gefiltert...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 glass-card rounded-[3rem] border-dashed border-2 border-white/5">
            <div className="max-w-md mx-auto space-y-6">
              <div className="p-6 rounded-full bg-white/5 inline-block">
                <Filter className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-2xl font-bold font-headline">Keine Funde</h3>
              <p className="text-muted-foreground font-light">
                {searchQuery 
                  ? `Unsere Archive enthalten keine Treffer für "${searchQuery}". Versuchen Sie es mit einem anderen Begriff.`
                  : `Diese spezifische Kollektion befindet sich derzeit in der Kuratierung.`
                }
              </p>
              <Button variant="link" onClick={() => { setSelectedCategory('all'); clearSearch(); }} className="text-secondary font-black uppercase tracking-widest text-xs">
                Filter zurücksetzen
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
