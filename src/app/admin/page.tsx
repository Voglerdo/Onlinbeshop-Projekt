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
  ShieldAlert,
  Clock
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { externalApiService } from '@/services/api-client';
import { useAuth } from '@/context/AuthContext';
import styles from './page.styles.module.css';

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
          externalApiService.getProducts().catch(() => []),
          externalApiService.getJobs().catch(() => [])
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
      <div className={styles.adminLayoutPrimary}>
        <Loader2 className={styles.loader2Icon} />
        <p className={styles.imperialeReferenzenWerdenGepruftText}>Imperiale Referenzen werden geprüft...</p>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className={styles.adminLayoutSecondary}>
        <div className={styles.adminPanelPrimary}>
          <ShieldAlert className={styles.shieldalert6} />
        </div>
        <div className={styles.adminContainerPrimary}>
          <h1 className={styles.nichtAutorisierterZugriffTitle}>Nicht autorisierter Zugriff</h1>
          <p className={styles.bodyText}>Diese Konsole ist dem inneren Kreis des Barons vorbehalten.</p>
        </div>
        <Button asChild className={styles.actionButton}>
          <Link href="/profile">Zurück zum Register</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.adminContainerSecondary}>
      <div className={styles.adminLayoutTertiary}>
        <div className={styles.adminContainerTertiary}>
          <h1 className={styles.nichtAutorisierterZugriffTitle}>Imperiale Konsole</h1>
          <p className={styles.bodyText2}>Orchestrieren Sie das Blubber Baron Imperium.</p>
        </div>
      </div>

      <Tabs defaultValue="inventory" className={styles.tabs15}>
        <TabsList className={styles.adminPanelSecondary}>
          <TabsTrigger value="inventory" className={styles.tabstrigger17}>
            <LayoutGrid className={styles.adminIconPrimary} /> Inventar
          </TabsTrigger>
          <TabsTrigger value="careers" className={styles.tabstrigger17}>
            <Briefcase className={styles.adminIconPrimary} /> Karriere
          </TabsTrigger>
          <TabsTrigger value="analytics" className={styles.tabstrigger17}>
            <TrendingUp className={styles.adminIconPrimary} /> Analysen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className={styles.tabscontent19}>
          <div className={styles.adminLayoutQuaternary}>
            <h2 className={styles.luxuskatalogHeading}>Luxuskatalog</h2>
            <Link href="/admin/new">
              <Button className={styles.actionButton2}>
                <Plus className={styles.plusIcon} /> Neuer Artikel
              </Button>
            </Link>
          </div>

          <div className={styles.adminPanelTertiary}>
            {isProductsLoading ? (
              <div className={styles.adminLayoutQuinary}><Loader2 className={styles.adminContainerQuaternary} /></div>
            ) : (
              <Table>
                <TableHeader className={styles.tableheader27}>
                  <TableRow>
                    <TableHead>Produkt</TableHead>
                    <TableHead>Kategorie</TableHead>
                    <TableHead>Preis</TableHead>
                    <TableHead>Lager</TableHead>
                    <TableHead className={styles.tablehead28}>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className={styles.tablecell29}>Keine Produkte im Register gefunden.</TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className={styles.adminLayoutSenary}>
                          <div className={styles.adminContainerQuinary}>
                            <Image src={product.imageUrl} alt={product.name} fill className={styles.adminImage} />
                          </div>
                          <span className={styles.inlineText}>{product.name}</span>
                        </TableCell>
                        <TableCell><Badge variant="outline">{product.category}</Badge></TableCell>
                        <TableCell className={styles.tablecell34}>{product.price.toFixed(2)}€</TableCell>
                        <TableCell>{product.stockQuantity} Einheiten</TableCell>
                        <TableCell className={styles.tablehead28}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreHorizontal className={styles.actionButton3} /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className={styles.dropdownmenucontent36}>
                              <DropdownMenuItem asChild>
                                <Link href={`/products/${product.id}`}><ExternalLink className={styles.adminIconPrimary} /> Ansehen</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className={styles.dropdownmenuitem37} onClick={() => handleDeleteProduct(product.id)}>
                                <Trash2 className={styles.adminIconPrimary} /> Löschen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="careers" className={styles.tabscontent19}>
          <div className={styles.adminLayoutQuaternary}>
            <h2 className={styles.luxuskatalogHeading}>Stellenmarkt</h2>
            <Link href="/admin/jobs/new">
              <Button className={styles.actionButton2}>
                <Plus className={styles.plusIcon} /> Neue Ausschreibung
              </Button>
            </Link>
          </div>

          <div className={styles.adminPanelTertiary}>
            {isJobsLoading ? (
              <div className={styles.adminLayoutQuinary}><Loader2 className={styles.adminContainerQuaternary} /></div>
            ) : (
              <Table>
                <TableHeader className={styles.tableheader27}>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Abteilung</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Erstellt am</TableHead>
                    <TableHead className={styles.tablehead28}>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className={styles.tablecell29}>Keine offenen Positionen registriert.</TableCell>
                    </TableRow>
                  ) : (
                    jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>
                          <div className={styles.adminLayoutSeptenary}>
                            <span className={styles.tablecell34}>{job.title}</span>
                            <span className={styles.inlineText2}><MapPin className={styles.inlineText3} /> {job.location}</span>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className={styles.tablecell41}>{job.department}</Badge></TableCell>
                        <TableCell>{job.type}</TableCell>
                        <TableCell className={styles.adminIconSecondary}><Clock className={styles.tablecell43} /> {new Date(job.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className={styles.tablehead28}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreHorizontal className={styles.actionButton3} /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className={styles.dropdownmenucontent36}>
                              <DropdownMenuItem asChild>
                                <Link href="/careers"><ExternalLink className={styles.adminIconPrimary} /> Zur Karriereseite</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className={styles.dropdownmenuitem37} onClick={() => handleDeleteJob(job.id)}>
                                <Trash2 className={styles.adminIconPrimary} /> Entfernen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className={styles.tabs15}>
           <div className={styles.grid}>
            <Card className={styles.adminCardPrimary}>
              <CardHeader className={styles.adminLayoutOctonary}>
                <CardTitle className={styles.adminIconTertiary}>Wöchentlicher Umsatz</CardTitle>
                <TrendingUp className={styles.adminIconQuaternary} />
              </CardHeader>
              <CardContent>
                <div className={styles.adminTextPrimary}>36.400€</div>
                <p className={styles.bodyText3}>
                  <ArrowUpRight className={styles.arrowUpRightIcon} /> +12.5% zur Vorwoche
                </p>
              </CardContent>
            </Card>
            <Card className={styles.adminCardPrimary}>
              <CardHeader className={styles.adminLayoutOctonary}>
                <CardTitle className={styles.adminIconTertiary}>Aktive Inventarposten</CardTitle>
                <Package className={styles.adminIconQuaternary} />
              </CardHeader>
              <CardContent>
                <div className={styles.adminTextPrimary}>{products.length}</div>
                <p className={styles.kuratierteMeisterwerkeText}>Kuratierte Meisterwerke</p>
              </CardContent>
            </Card>
            <Card className={styles.adminCardPrimary}>
              <CardHeader className={styles.adminLayoutOctonary}>
                <CardTitle className={styles.adminIconTertiary}>Offene Vakanzen</CardTitle>
                <Briefcase className={styles.adminIconQuaternary} />
              </CardHeader>
              <CardContent>
                <div className={styles.adminTextPrimary}>{jobs.length}</div>
                <p className={styles.kuratierteMeisterwerkeText}>Wachsende Elite</p>
              </CardContent>
            </Card>
          </div>

          <Card className={styles.adminCardSecondary}>
            <CardHeader className={styles.cardheader54}>
              <CardTitle className={styles.cardtitle55}>Umsatzverlauf (Simulation)</CardTitle>
            </CardHeader>
            <CardContent className={styles.cardcontent56}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ANALYTICS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#0f0f14', border: '1px solid #1a1a1f', borderRadius: '8px'}}
                    itemStyle={{color: '#d1a347'}}
                  />
                  <Bar dataKey="revenue" fill="#df2030" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

