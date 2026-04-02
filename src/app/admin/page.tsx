
"use client"

import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Edit3, 
  Sparkles,
  LayoutGrid,
  List,
  Loader2,
  ExternalLink,
  Briefcase,
  MapPin
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Product, JobOffer } from '@/app/types';
import { deleteDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function AdminPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

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
    const docRef = doc(db, 'products', productId);
    deleteDocumentNonBlocking(docRef);
    toast({
      title: "Item Deleted",
      description: "The product has been removed from the catalog.",
      variant: "destructive"
    });
  };

  const handleDeleteJob = (jobId: string) => {
    if (!db) return;
    const docRef = doc(db, 'jobs', jobId);
    deleteDocumentNonBlocking(docRef);
    toast({
      title: "Position Removed",
      description: "The career opportunity has been withdrawn.",
      variant: "destructive"
    });
  };

  const seedSampleJobs = () => {
    if (!db) return;
    setIsSeeding(true);
    
    const jobsRef = collection(db, 'jobs');
    const timestamp = new Date().toISOString();

    const sampleJobs = [
      {
        title: "Master Shisha Tester",
        department: "Sensory Research",
        location: "Global / Remote",
        type: "Full-time",
        description: "Join the Baron's inner circle to evaluate premium tobacco blends, airflow dynamics, and heat distribution.",
        requirements: ["5+ years experience", "Exceptional palate", "Deep coal knowledge"],
        createdAt: timestamp
      }
    ];

    sampleJobs.forEach(job => {
      addDocumentNonBlocking(jobsRef, job);
    });

    setTimeout(() => {
      setIsSeeding(false);
      toast({
        title: "Sample Seeded",
        description: "Standard positions have been added to your registry.",
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
            Admin Console
            <Badge variant="secondary" className="text-[10px] h-5">CENTRAL</Badge>
          </h1>
          <p className="text-muted-foreground">Orchestrate your empire's inventory and human capital.</p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={seedSampleJobs} 
            disabled={isSeeding}
            className="border-secondary text-secondary hover:bg-secondary/10 h-12 px-6 font-bold"
          >
            {isSeeding ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
            Seed Samples
          </Button>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-8">
        <TabsList className="bg-muted/50 border border-border p-1 h-14 rounded-xl">
          <TabsTrigger value="inventory" className="h-full px-8 font-bold rounded-lg data-[state=active]:gold-glow data-[state=active]:bg-card">
            <LayoutGrid className="h-4 w-4 mr-2" /> Luxury Inventory
          </TabsTrigger>
          <TabsTrigger value="careers" className="h-full px-8 font-bold rounded-lg data-[state=active]:gold-glow data-[state=active]:bg-card">
            <Briefcase className="h-4 w-4 mr-2" /> Elite Careers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-headline font-bold">Catalog Management</h2>
            <Link href="/admin/new">
              <Button className="bg-primary hover:bg-primary/90 font-bold">
                <Plus className="mr-2 h-4 w-4" /> Add New Item
              </Button>
            </Link>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden border-none">
            {isProductsLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-card">
                  <TableRow className="border-border">
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((product) => (
                    <TableRow key={product.id} className="group hover:bg-white/5 border-border">
                      <TableCell>
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize text-secondary border-secondary/30">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold">${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.stockQuantity} units</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem asChild>
                              <Link href={`/products/${product.id}`} className="flex items-center gap-2">
                                <ExternalLink className="h-4 w-4" /> View Page
                              </Link>
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

        <TabsContent value="careers" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-headline font-bold">Open Engagements</h2>
            <Link href="/admin/jobs/new">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold">
                <Plus className="mr-2 h-4 w-4" /> Add New Position
              </Button>
            </Link>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden border-none">
            {isJobsLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-card">
                  <TableRow className="border-border">
                    <TableHead>Role Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs?.map((job) => (
                    <TableRow key={job.id} className="group hover:bg-white/5 border-border">
                      <TableCell className="font-bold">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{job.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem asChild>
                              <Link href="/careers" className="flex items-center gap-2">
                                <ExternalLink className="h-4 w-4" /> View Listings
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteJob(job.id)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Remove Position
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!jobs || jobs.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        No active engagements. The Baron's council is currently full.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
