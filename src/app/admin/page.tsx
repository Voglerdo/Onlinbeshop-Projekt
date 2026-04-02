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
  Loader2
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Product } from '@/app/types';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const db = useFirestore();
  const { toast } = useToast();

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const handleDelete = (productId: string) => {
    if (!db) return;
    const docRef = doc(db, 'products', productId);
    deleteDocumentNonBlocking(docRef);
    toast({
      title: "Item Deleted",
      description: "The product has been removed from the catalog.",
      variant: "destructive"
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
            Admin Console
            <Badge variant="secondary" className="text-[10px] h-5">STABLE</Badge>
          </h1>
          <p className="text-muted-foreground">Manage your luxury inventory and catalog items.</p>
        </div>
        <Link href="/admin/new">
          <Button className="bg-primary hover:bg-primary/90 h-12 px-6 font-bold shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-5 w-5" />
            Add New Item
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border-none space-y-2">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Total Inventory</div>
          <div className="text-4xl font-bold text-secondary">{products?.length || 0} Items</div>
        </div>
        <div className="glass-card p-6 rounded-2xl border-none space-y-2">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Stock Health</div>
          <div className="text-4xl font-bold text-green-500">Active</div>
        </div>
        <div className="glass-card p-6 rounded-2xl border-none space-y-2">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Recent Activity</div>
          <div className="text-4xl font-bold text-primary">{isLoading ? "..." : "Live"}</div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border-none border-border/50">
        <div className="p-4 border-b border-border bg-card/50 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search inventory..." 
              className="pl-10 h-10 bg-background border-border"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-10 w-10">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-card">
              <TableRow className="hover:bg-transparent border-border">
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
                <TableRow key={product.id} className="group hover:bg-white/5 transition-colors border-border">
                  <TableCell>
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize text-secondary border-secondary/30">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold">${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${product.stockQuantity > 0 ? 'bg-green-500' : 'bg-destructive'}`} />
                      <span className="text-sm font-medium">{product.stockQuantity} units</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem className="gap-2">
                          <Edit3 className="h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Sparkles className="h-4 w-4 text-secondary" /> Regenerate AI Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 text-destructive focus:text-destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" /> Delete Item
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {(!products || products.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No products in inventory.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
