
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
import { Sparkles, ArrowLeft, Plus, X, Loader2, Save, Upload, Wand2, Trash2, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { cn } from '@/lib/utils';

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    brand: 'Blubber Baron',
    stockQuantity: '10',
    features: [''],
    imageUrl: '' // We will set the first image as the primary one
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImages(prev => [...prev, base64String]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAIDescription = async () => {
    if (!formData.name) {
      toast({ title: "Produktname erforderlich", variant: "destructive" });
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
      toast({ title: "KI-Generierung fehlgeschlagen", variant: "destructive" });
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleAIImage = async () => {
    if (!formData.name) {
      toast({ title: "Produktname erforderlich", variant: "destructive" });
      return;
    }
    setIsGeneratingImg(true);
    try {
      const result = await generateProductImage({
        productName: formData.name,
        description: formData.category + " " + formData.description.substring(0, 100)
      });
      setImages(prev => [...prev, result.imageUrl]);
      toast({ title: "KI-Bild manifestiert", description: "Das visuelle Abbild des Barons wurde erstellt." });
    } catch (e) {
      toast({ title: "KI-Bild fehlgeschlagen", variant: "destructive" });
    } finally {
      setIsGeneratingImg(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    
    if (images.length === 0) {
      toast({ title: "Mindestens ein Bild erforderlich", variant: "destructive" });
      return;
    }

    const productsRef = collection(db, 'products');
    const timestamp = new Date().toISOString();
    
    addDocumentNonBlocking(productsRef, {
      ...formData,
      imageUrl: images[0], // Primary image
      imageUrls: images,    // Full gallery
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      features: formData.features.filter(f => f.trim() !== ''),
      createdAt: timestamp,
      updatedAt: timestamp
    });

    toast({ title: "Manifestiert", description: "Der Artikel wurde dem Inventar des Barons hinzugefügt." });
    router.push('/admin');
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 max-w-6xl space-y-8">
      <Link href="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-2">
        <ArrowLeft className="h-4 w-4" /> Zurück zur Konsole
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-headline font-bold">Neues Meisterwerk hinzufügen</h1>
        <p className="text-muted-foreground">Registrieren Sie ein neues Premium-Produkt mit vollständiger Galerie.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-xl font-bold font-headline">Produkt-Medien</h3>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" className="h-8 gold-glow text-xs" onClick={handleAIImage} disabled={isGeneratingImg}>
                  {isGeneratingImg ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3 mr-2" />}
                  KI-Generieren
                </Button>
                <Button type="button" variant="secondary" size="sm" className="h-8 text-xs" onClick={() => fileInputRef.current?.click()}>
                  <Plus className="h-3 w-3 mr-2" /> Hinzufügen
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden glass-card group">
                  <Image src={img} alt={`Bild ${idx + 1}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button type="button" variant="destructive" size="icon" className="h-8 w-8" onClick={() => removeImage(idx)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {idx === 0 && <Badge className="absolute top-2 left-2 bg-secondary text-background">Cover</Badge>}
                  </div>
                </div>
              ))}
              <div 
                className="aspect-square rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Bild hinzufügen</span>
              </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold font-headline border-b border-border pb-2">Markendetails</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Marke</Label>
                <Input id="brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="bg-card" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Bestand</Label>
                <Input id="stock" type="number" value={formData.stockQuantity} onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })} className="bg-card" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-headline border-b border-border pb-2">Kerndaten</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Produktname</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-card text-lg h-12" required />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Kategorie</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger className="bg-card h-12">
                    <SelectValue placeholder="Wählen..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="hookah">Wasserpfeife</SelectItem>
                    <SelectItem value="coal">Kohle</SelectItem>
                    <SelectItem value="flavor">Aroma</SelectItem>
                    <SelectItem value="accessory">Zubehör</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preis (€)</Label>
                <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="bg-card h-12 text-secondary font-bold" required />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Produkt-Narrativ</Label>
                <Button type="button" size="sm" variant="secondary" className="gold-glow h-8 text-xs font-bold" onClick={handleAIDescription} disabled={isGeneratingDesc}>
                  {isGeneratingDesc ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 mr-2" />}
                  KI-Beschreibung
                </Button>
              </div>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="min-h-[150px] bg-card leading-relaxed" required />
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Besonderheiten</Label>
                <Button type="button" variant="ghost" size="sm" onClick={addFeature} className="text-secondary h-8">
                  <Plus className="h-4 w-4 mr-1" /> Merkmal hinzufügen
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.features.map((feat, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input value={feat} onChange={(e) => handleFeatureChange(idx, e.target.value)} className="bg-card h-10" placeholder={`Besonderheit #${idx + 1}`} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(idx)} className="h-10 w-10 text-muted-foreground hover:text-destructive shrink-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 flex gap-4">
            <Button type="submit" className="flex-1 bg-primary h-14 text-lg font-bold rounded-xl crimson-glow">
              <Save className="mr-2 h-6 w-6" /> Artikel speichern
            </Button>
            <Button type="button" variant="outline" className="h-14 px-8" onClick={() => router.push('/admin')}>
              Abbrechen
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
