
"use client"

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
import { ArrowLeft, Plus, X, Save, Upload, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { externalApiService } from '@/services/api-client';

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [images, setImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    brand: 'Blubber Baron',
    stockQuantity: '10',
    features: ['']
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast({ title: "Bilder erforderlich", description: "Mindestens ein Cover-Bild ist nötig.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const productData = {
      ...formData,
      imageUrl: images[0],
      imageUrls: images,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      features: formData.features.filter(f => f.trim() !== ''),
      createdAt: new Date().toISOString()
    };

    try {
      await externalApiService.syncProduct(productData);
      toast({ title: "Manifestiert", description: "Das Produkt wurde erfolgreich im Katalog registriert." });
      router.push('/admin');
    } catch (err) {
      toast({ title: "Fehler", description: "Konnte das Produkt nicht speichern. Backend erreichbar?", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 max-w-6xl space-y-8">
      <Link href="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-2">
        <ArrowLeft className="h-4 w-4" /> Zurück zur Konsole
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-headline font-bold">Neues Meisterwerk</h1>
        <p className="text-muted-foreground">Erweitern Sie die imperiale Schatzkammer manuell.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-headline border-b border-border pb-2">Medien</h3>
            <div className="grid grid-cols-2 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden glass-card group">
                  <Image src={img} alt="Vorschau" fill className="object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 p-1 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-3 w-3 text-white" />
                  </button>
                  {idx === 0 && <Badge className="absolute top-2 left-2 bg-secondary text-background">Cover</Badge>}
                </div>
              ))}
              <div 
                className="aspect-square rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Neu</span>
              </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Produktname</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-card h-12" required />
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
                    <SelectItem value="flavor">Aroma</SelectItem>
                    <SelectItem value="coal">Kohle</SelectItem>
                    <SelectItem value="accessory">Zubehör</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preis (€)</Label>
                <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="bg-card h-12" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-card min-h-[150px]" required />
            </div>
          </div>
          <Button type="submit" disabled={isSaving} className="w-full h-14 bg-primary text-lg font-bold crimson-glow">
            {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Save className="mr-2 h-6 w-6" /> Artikel speichern</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
