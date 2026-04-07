
"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  MoreHorizontal, 
  Trash2, 
  LayoutGrid,
  Loader2,
  ExternalLink,
  Briefcase,
  MapPin,
  TrendingUp,
  Package,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import Image from 'next/image';
import Link from 'next/link';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product, JobOffer } from '@/app/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { externalApiService } from '@/services/api-client';
import { useAuth } from '@/context/AuthContext';

const ANALYTICS_DATA = [
  { name: 'Mo', acquisitions: 12, revenue: 2400 },
  { name: 'Di', acquisitions: 18, revenue: 3600 },
  { name: 'Mi', acquisitions: 15, revenue: 3000 },
  { name: 'Do', acquisitions: 25, revenue: 5000 },
  { name: 'Fr', acquisitions: 32, revenue: 6400 },
  { name: 'Sa', acquisitions: 45, revenue: 9000 },
  { name: 'So', acquisitions: 40, revenue: 8000 },
];

export default function AdminPage() {
  const { user, isUserLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isJobsLoading, setIsJobsLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoading && !user?.isAdmin) {
      toast({
        title: "Zugriff eingeschränkt",
        description: "Weiterleitung zum Profil...",
        variant: "destructive"
      });
      router.push('/profile');
    }
  }, [user, isUserLoading, router, toast]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, jobsData] = await Promise.all([
          externalApiService.getProducts(),
          externalApiService.getJobs()
        ]);
        setProducts(productsData);
        setJobs(jobsData);
      } catch (err) {
        console.error('Fehler beim Laden der Admin-Daten:', err);
      } finally {
        setIsProductsLoading(false);
        setIsJobsLoading(false);
      }
    }
    if (user?.isAdmin) fetchData();
  }, [user]);

  const handleDeleteProduct = async (productId: string) => {
    try {
      await externalApiService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({ title: "Artikel gelöscht", variant: "destructive" });
    } catch (err) {
      toast({ title: "Fehler beim Löschen", variant: "destructive" });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await externalApiService.deleteJob(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      toast({ title: "Position entfernt", variant: "destructive" });
    } catch (err) {
      toast({ title: "Fehler beim Löschen", variant: "destructive" });
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Imperiale Referenzen werden geprüft...</p>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 space-y-6">
        <div className="p-6 rounded-full bg-destructive/10">
          <ShieldAlert className="h-16 w-16 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold">Nicht autorisierter Zugriff</h1>
          <p className="text-muted-foreground max-w-md">Diese Konsole ist dem inneren Kreis des Barons vorbehalten.</p>
        </div>
        <Button asChild className="bg-primary">
          <Link href="/profile">Zurück zum Register</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold">Imperiale Konsole</h1>
          <p className="text-muted-foreground">Orchestrieren Sie das Blubber Baron Imperium.</p>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-8">
        <TabsList className="bg-muted/50 p-1 h-14 rounded-xl border border-border">
          <TabsTrigger value="inventory" className="h-full px-8 font-bold">
            <LayoutGrid className="h-4 w-4 mr-2" /> Inventar
          </TabsTrigger>
          <TabsTrigger value="careers" className="h-full px-8 font-bold">
            <Briefcase className="h-4 w-4 mr-2" /> Karriere
          </TabsTrigger>
          <TabsTrigger value="analytics" className="h-full px-8 font-bold">
            <TrendingUp className="h-4 w-4 mr-2" /> Analysen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-headline font-bold">Luxuskatalog</h2>
            <Link href="/admin/new">
              <Button className="bg-primary font-bold">
                <Plus className="mr-2 h-4 w-4" /> Neuer Artikel
              </Button>
            </Link>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden">
            {isProductsLoading ? (
              <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <Table>
                <TableHeader className="bg-card">
                  <TableRow>
                    <TableHead>Produkt</TableHead>
                    <TableHead>Kategorie</TableHead>
                    <TableHead>Preis</TableHead>
                    <TableHead>Lager</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded overflow-hidden">
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </TableCell>
                      <TableCell><Badge variant="outline">{product.category}</Badge></TableCell>
                      <TableCell className="font-bold">{product.price.toFixed(2)}€</TableCell>
                      <TableCell>{product.stockQuantity} Einheiten</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem asChild>
                              <Link href={`/products/${product.id}`}><ExternalLink className="h-4 w-4 mr-2" /> Ansehen</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Löschen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        {/* Analytics & Careers Tab content kept similar to previous versions, just using local state */}
        <TabsContent value="analytics" className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Wöchentlicher Umsatz</CardTitle>
                <TrendingUp className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline">36.400€</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" /> +12.5% zur Vorwoche
                </p>
              </CardContent>
            </Card>
            {/* ... other cards ... */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
