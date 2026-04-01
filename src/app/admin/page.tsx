"use client"

import { MOCK_PRODUCTS } from '@/app/lib/products';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Edit3, 
  Sparkles,
  LayoutGrid,
  List
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

export default function AdminPage() {
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
          <div className="text-4xl font-bold text-secondary">42 Items</div>
        </div>
        <div className="glass-card p-6 rounded-2xl border-none space-y-2">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Out of Stock</div>
          <div className="text-4xl font-bold text-primary">3 Items</div>
        </div>
        <div className="glass-card p-6 rounded-2xl border-none space-y-2">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Total Orders (M)</div>
          <div className="text-4xl font-bold text-green-500">1,284</div>
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

        <Table>
          <TableHeader className="bg-card">
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_PRODUCTS.map((product) => (
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
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium">In Stock</span>
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
                      <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                        <Trash2 className="h-4 w-4" /> Delete Item
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
