"use client"

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { adminGenerateProductDescription } from '@/ai/flows/admin-generate-product-description-flow';
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
import { Sparkles, ArrowLeft, Plus, X, Loader2, Save, Upload } from 'lucide-react';
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
  
  const [isGenerating, setIsGenerating] = useState(false);
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
      if (file.size > 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 1MB for optimal performance.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, imageUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures.length ? newFeatures : [''] });
  };

  const generateAIDescription = async () => {
    if (!formData.name || formData.features.every(f => !f)) {
      toast({
        title: "Missing Information",
        description: "Please provide a product name and at least one feature to generate a description.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await adminGenerateProductDescription({
        productName: formData.name,
        keyFeatures: formData.features.filter(f => f.trim() !== '')
      });
      setFormData({ ...formData, description: result.description });
      toast({
        title: "AI Description Generated",
        description: "Your product description has been successfully crafted.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating the description. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!db) return;

    if (!formData.imageUrl) {
      toast({
        title: "Image Required",
        description: "Please upload a product image before saving.",
        variant: "destructive"
      });
      return;
    }

    const productsRef = collection(db, 'products');
    const timestamp = new Date().toISOString();
    
    const newProduct = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      description: formData.description,
      brand: formData.brand,
      stockQuantity: parseInt(formData.stockQuantity),
      features: formData.features.filter(f => f.trim() !== ''),
      imageUrl: formData.imageUrl,
      imageHint: `${formData.category} shisha`,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    addDocumentNonBlocking(productsRef, newProduct);

    toast({
      title: "Success",
      description: "Item saved to inventory and shop catalog.",
    });
    
    router.push('/admin');
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 max-w-5xl space-y-8">
      <Link href="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Console
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-headline font-bold">Add New Masterpiece</h1>
        <p className="text-muted-foreground">Register a new premium product into the Blubber Baron catalog.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-headline border-b border-border pb-2">Product Media</h3>
            <div 
              className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-card border-dashed border-2 border-border/50 group cursor-pointer hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-4"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <Image 
                  src={imagePreview} 
                  alt="Preview" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <>
                  <div className="p-4 rounded-full bg-muted/50 text-muted-foreground group-hover:text-primary transition-colors">
                    <Upload className="h-8 w-8" />
                  </div>
                  <div className="text-center px-6">
                    <p className="font-bold text-sm">Click to upload image</p>
                    <p className="text-xs text-muted-foreground mt-1">Recommended size: 600x800px</p>
                  </div>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button type="button" variant="secondary" size="sm" className="font-bold">
                    Change Image
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold font-headline border-b border-border pb-2">Inventory</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input 
                  id="brand" 
                  placeholder="Blubber Baron" 
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="bg-card border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Initial Stock</Label>
                <Input 
                  id="stock" 
                  type="number" 
                  placeholder="10" 
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  className="bg-card border-border"
                />
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
                placeholder="e.g., Baron Royal Gold Shisha" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-card border-border text-lg h-12"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger className="bg-card border-border h-12">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="hookah">Hookah</SelectItem>
                    <SelectItem value="coal">Charcoal</SelectItem>
                    <SelectItem value="flavor">Flavor</SelectItem>
                    <SelectItem value="accessory">Accessory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  step="0.01"
                  placeholder="249.99" 
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-card border-border h-12 font-bold text-secondary"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Key Features</Label>
                <Button type="button" variant="ghost" size="sm" onClick={addFeature} className="text-secondary hover:text-secondary h-8">
                  <Plus className="h-4 w-4 mr-1" /> Add Feature
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      placeholder={`Feature #${index + 1}`} 
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="bg-card border-border h-9"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)} className="h-9 w-9 text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="description" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Product Narrative</Label>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="secondary" 
                  className="gold-glow border-none h-8 text-xs font-bold"
                  onClick={generateAIDescription}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3 mr-2" />
                  )}
                  AI Write Assistant
                </Button>
              </div>
              <Textarea 
                id="description" 
                placeholder="Describe the essence of this product..." 
                className="min-h-[250px] bg-card border-border resize-none leading-relaxed text-base"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="pt-8 flex gap-4">
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90 h-14 text-lg font-bold rounded-xl crimson-glow"
            >
              <Save className="mr-2 h-6 w-6" />
              Save Item to Collection
            </Button>
            <Button 
              type="button" 
              variant="outline"
              className="h-14 px-8 border-border hover:bg-muted"
              onClick={() => router.push('/admin')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
