
"use client"

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { adminGenerateProductDescription } from '@/ai/flows/admin-generate-product-description-flow';
import { generateProductImage } from '@/ai/flows/generate-product-image-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Sparkles, ArrowLeft, Plus, X, Loader2, Save, Upload, Wand2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    brand: 'Blubber Baron',
    stockQuantity: '10',
    features: [''],
    imageUrl: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, imageUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIDescription = async () => {
    if (!formData.name) {
      toast({ title: "Product Name Required", variant: "destructive" });
      return;
    }
    setIsGeneratingDesc(true);
    try {
      const result = await adminGenerateProductDescription({
        productName: formData.name,
        keyFeatures: formData.features.filter(f => f.trim() !== '')
      });
      setFormData(prev => ({ ...prev, description: result.description }));
    } catch (e) {
      toast({ title: "AI Generation Failed", variant: "destructive" });
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleAIImage = async () => {
    if (!formData.name) {
      toast({ title: "Product Name Required", variant: "destructive" });
      return;
    }
    setIsGeneratingImg(true);
    try {
      const result = await generateProductImage({
        productName: formData.name,
        description: formData.category + " " + formData.description.substring(0, 100)
      });
      setImagePreview(result.imageUrl);
      setFormData(prev => ({ ...prev, imageUrl: result.imageUrl }));
      toast({ title: "AI Image Generated", description: "The Baron's visual has been manifested." });
    } catch (e) {
      toast({ title: "AI Image Failed", variant: "destructive" });
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    const productsRef = collection(db, 'products');
    const timestamp = new Date().toISOString();
    
    addDocumentNonBlocking(productsRef, {
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      features: formData.features.filter(f => f.trim() !== ''),
      createdAt: timestamp,
      updatedAt: timestamp
    });

    toast({ title: "Manifested", description: "The item has been added to the Baron's inventory." });
    router.push('/admin');
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 max-w-5xl space-y-8">
      <Link href="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Console
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-headline font-bold">Add New Masterpiece</h1>
        <p className="text-muted-foreground">Register a new premium product into the Blubber Baron catalog.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-xl font-bold font-headline">Product Media</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-8 gold-glow text-xs" 
                onClick={handleAIImage}
                disabled={isGeneratingImg}
              >
                {isGeneratingImg ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3 mr-2" />}
                AI Manifest
              </Button>
            </div>
            <div 
              className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-card border-dashed border-2 border-border/50 group cursor-pointer flex flex-col items-center justify-center gap-4"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="text-center px-6 text-muted-foreground">
                  <Upload className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-bold text-sm">Upload or AI Generate</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold font-headline border-b border-border pb-2">Inventory</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="bg-card" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Initial Stock</Label>
                <Input id="stock" type="number" value={formData.stockQuantity} onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })} className="bg-card" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-headline border-b border-border pb-2">Core Details</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-card text-lg h-12"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger className="bg-card h-12">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="hookah">Hookah</SelectItem>
                    <SelectItem value="coal">Charcoal</SelectItem>
                    <SelectItem value="flavor">Flavor</SelectItem>
                    <SelectItem value="accessory">Accessory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (€)</Label>
                <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="bg-card h-12 text-secondary font-bold" required />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Product Narrative</Label>
                <Button type="button" size="sm" variant="secondary" className="gold-glow h-8 text-xs font-bold" onClick={handleAIDescription} disabled={isGeneratingDesc}>
                  {isGeneratingDesc ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 mr-2" />}
                  AI Write
                </Button>
              </div>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="min-h-[200px] bg-card leading-relaxed" required />
            </div>
          </div>

          <div className="pt-8 flex gap-4">
            <Button type="submit" className="flex-1 bg-primary h-14 text-lg font-bold rounded-xl crimson-glow">
              <Save className="mr-2 h-6 w-6" /> Save Item
            </Button>
            <Button type="button" variant="outline" className="h-14 px-8" onClick={() => router.push('/admin')}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
