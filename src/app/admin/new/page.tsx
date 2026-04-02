"use client"

import { useState } from 'react';
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
import { Sparkles, ArrowLeft, Plus, X, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    brand: 'Crimson Coals',
    stockQuantity: '10',
    features: ['']
  });

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
      imageUrl: `https://picsum.photos/seed/${Math.random()}/600/800`,
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
    <div className="container mx-auto px-4 py-12 lg:px-8 max-w-4xl space-y-8">
      <Link href="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Console
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-headline font-bold">Add New Masterpiece</h1>
        <p className="text-muted-foreground">Register a new premium product into the Crimson Coals catalog.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-headline border-b border-border pb-2">Core Details</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., Crimson Royal Gold Shisha" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-card border-border"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger className="bg-card border-border">
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
                  className="bg-card border-border"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input 
                  id="brand" 
                  placeholder="Crimson Coals" 
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

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-xl font-bold font-headline">Key Features</h3>
              <Button type="button" variant="ghost" size="sm" onClick={addFeature} className="text-secondary hover:text-secondary">
                <Plus className="h-4 w-4 mr-1" /> Add Feature
              </Button>
            </div>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    placeholder={`Feature #${index + 1}`} 
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="bg-card border-border"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)} className="text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-xl font-bold font-headline">Description</h3>
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
            <div className="space-y-2">
              <Label htmlFor="description">Product Narrative</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the essence of this product..." 
                className="h-[300px] bg-card border-border resize-none leading-relaxed"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="pt-8">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-14 text-lg font-bold rounded-xl crimson-glow">
              <Save className="mr-2 h-6 w-6" />
              Save Item to Collection
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
