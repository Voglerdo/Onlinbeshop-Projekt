
"use client"

import { Button } from '@/components/ui/button';
import { 
  Plus, 
  MoreHorizontal, 
  Trash2, 
  Sparkles,
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
import { useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Product, JobOffer } from '@/app/types';
import { deleteDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
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

const ANALYTICS_DATA = [
  { name: 'Mon', acquisitions: 12, revenue: 2400 },
  { name: 'Tue', acquisitions: 18, revenue: 3600 },
  { name: 'Wed', acquisitions: 15, revenue: 3000 },
  { name: 'Thu', acquisitions: 25, revenue: 5000 },
  { name: 'Fri', acquisitions: 32, revenue: 6400 },
  { name: 'Sat', acquisitions: 45, revenue: 9000 },
  { name: 'Sun', acquisitions: 40, revenue: 8000 },
];

export default function AdminPage() {
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [isSeeding, setIsSeeding] = useState(false);

  // Admin Check
  const adminRoleRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'roles_admin', user.uid);
  }, [db, user]);

  const { data: adminRole, isLoading: isAdminChecking } = useDoc(adminRoleRef);
  const isAdmin = !!adminRole;

  useEffect(() => {
    if (!isUserLoading && !isAdminChecking && !isAdmin) {
      toast({
        title: "Access Restricted",
        description: "Redirecting to your authorized profile.",
        variant: "destructive"
      });
      router.push('/profile');
    }
  }, [isAdmin, isUserLoading, isAdminChecking, router, toast]);

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }, [db]);

  const jobsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: products, isLoading: isProductsLoading } = useCollection<Product>(productsQuery);
  const { data: jobs, isLoading: isJobsLoading } = useCollection<JobOffer>(jobsQuery);

  const handleDeleteProduct = (productId: string) => {
    if (!db) return;
    deleteDocumentNonBlocking(doc(db, 'products', productId));
    toast({ title: "Item Deleted", variant: "destructive" });
  };

  const seedSampleJobs = () => {
    if (!db) return;
    setIsSeeding(true);
    const jobsRef = collection(db, 'jobs');
    addDocumentNonBlocking(jobsRef, {
      title: "Master Shisha Tester",
      department: "Sensory Research",
      location: "Dubai / Global",
      type: "Full-time",
      description: "Evaluate ultra-premium blends and airflow dynamics in the Baron's private lab.",
      requirements: ["5+ years experience", "Exceptional palate"],
      createdAt: new Date().toISOString()
    });
    setTimeout(() => setIsSeeding(false), 500);
  };

  if (isUserLoading || isAdminChecking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Verifying Imperial Credentials...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 space-y-6">
        <div className="p-6 rounded-full bg-destructive/10">
          <ShieldAlert className="h-16 w-16 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold">Unauthorized Access</h1>
          <p className="text-muted-foreground max-w-md">This console is reserved for the Baron's inner circle. Please return to your registry.</p>
        </div>
        <Button asChild className="bg-primary">
          <Link href="/profile">Back to Registry</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold">Imperial Console</h1>
          <p className="text-muted-foreground">Orchestrate the Blubber Baron empire.</p>
        </div>
        <Button variant="outline" onClick={seedSampleJobs} disabled={isSeeding} className="border-secondary text-secondary">
          {isSeeding ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
          Seed Elite Roles
        </Button>
      </div>

      <Tabs defaultValue="inventory" className="space-y-8">
        <TabsList className="bg-muted/50 p-1 h-14 rounded-xl border border-border">
          <TabsTrigger value="inventory" className="h-full px-8 font-bold data-[state=active]:gold-glow">
            <LayoutGrid className="h-4 w-4 mr-2" /> Inventory
          </TabsTrigger>
          <TabsTrigger value="careers" className="h-full px-8 font-bold data-[state=active]:gold-glow">
            <Briefcase className="h-4 w-4 mr-2" /> Careers
          </TabsTrigger>
          <TabsTrigger value="analytics" className="h-full px-8 font-bold data-[state=active]:gold-glow">
            <TrendingUp className="h-4 w-4 mr-2" /> Empire Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-headline font-bold">Luxury Catalog</h2>
            <Link href="/admin/new">
              <Button className="bg-primary font-bold">
                <Plus className="mr-2 h-4 w-4" /> New Item
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
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded overflow-hidden">
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </TableCell>
                      <TableCell><Badge variant="outline">{product.category}</Badge></TableCell>
                      <TableCell className="font-bold">${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.stockQuantity} units</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem asChild>
                              <Link href={`/products/${product.id}`}><ExternalLink className="h-4 w-4 mr-2" /> View</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
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

        <TabsContent value="analytics" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline">$36,400</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" /> +12.5% from last week
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Acquisitions</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline">182</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" /> +18 new Barons today
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Catalog Reach</CardTitle>
                <LayoutGrid className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline">{products?.length || 0} Items</div>
                <p className="text-xs text-muted-foreground">Curated premium selection</p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card border-none p-6">
            <CardHeader>
              <CardTitle className="font-headline">Acquisition Trends</CardTitle>
              <CardDescription>Weekly flow of luxury transactions</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ANALYTICS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1d1616', border: '1px solid rgba(209,163,71,0.2)', borderRadius: '12px' }}
                    itemStyle={{ color: '#d1a347' }}
                  />
                  <Bar dataKey="acquisitions" radius={[4, 4, 0, 0]}>
                    {ANALYTICS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index > 4 ? '#df2030' : '#d1a347'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="careers" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-headline font-bold">Open Positions</h2>
            <Link href="/admin/jobs/new">
              <Button className="bg-secondary text-background font-bold">
                <Plus className="mr-2 h-4 w-4" /> New Position
              </Button>
            </Link>
          </div>
          <div className="glass-card rounded-2xl overflow-hidden">
            {isJobsLoading ? (
              <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <Table>
                <TableHeader className="bg-card">
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs?.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-bold">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell><MapPin className="h-3 w-3 inline mr-1" />{job.location}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => deleteDocumentNonBlocking(doc(db, 'jobs', job.id))}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
