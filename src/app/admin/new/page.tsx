
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
import styles from './page.styles.module.css';

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
    <div className={styles.adminNewContainerPrimary}>
      <Link href="/admin" className={styles.adminNewLayoutPrimary}>
        <ArrowLeft className={styles.arrowLeftIcon} /> Zurück zur Konsole
      </Link>

      <div className={styles.adminNewContainerSecondary}>
        <h1 className={styles.neuesMeisterwerkTitle}>Neues Meisterwerk</h1>
        <p className={styles.bodyText}>Erweitern Sie die imperiale Schatzkammer manuell.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.adminNewContainerTertiary}>
          <div className={styles.adminNewContainerTertiary}>
            <h3 className={styles.medienHeading}>Medien</h3>
            <div className={styles.grid}>
              {images.map((img, idx) => (
                <div key={idx} className={styles.adminNewPanelPrimary}>
                  <Image src={img} alt="Vorschau" fill className={styles.vorschauImage} />
                  <button type="button" onClick={() => removeImage(idx)} className={styles.adminNewPanelSecondary}>
                    <Trash2 className={styles.trash215} />
                  </button>
                  {idx === 0 && <Badge className={styles.coverBadge}>Cover</Badge>}
                </div>
              ))}
              <div 
                className={styles.adminNewLayoutSecondary}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className={styles.upload18} />
                <span className={styles.neuText}>Neu</span>
              </div>
            </div>
            <input type="file" ref={fileInputRef} className={styles.input20} accept="image/*" onChange={handleImageChange} />
          </div>
        </div>

        <div className={styles.adminNewContainerQuinary}>
          <div className={styles.grid2}>
            <div className={styles.adminNewContainerSecondary}>
              <Label htmlFor="name">Produktname</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={styles.input23} required />
            </div>
            <div className={styles.grid3}>
              <div className={styles.adminNewContainerSecondary}>
                <Label htmlFor="category">Kategorie</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger className={styles.input23}>
                    <SelectValue placeholder="Wählen..." />
                  </SelectTrigger>
                  <SelectContent className={styles.selectcontent25}>
                    <SelectItem value="hookah">Wasserpfeife</SelectItem>
                    <SelectItem value="flavor">Aroma</SelectItem>
                    <SelectItem value="coal">Kohle</SelectItem>
                    <SelectItem value="accessory">Zubehör</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={styles.adminNewContainerSecondary}>
                <Label htmlFor="price">Preis (€)</Label>
                <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className={styles.input23} required />
              </div>
            </div>
            <div className={styles.adminNewContainerSecondary}>
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={styles.textarea26} required />
            </div>
          </div>
          <Button type="submit" disabled={isSaving} className={styles.actionButton}>
            {isSaving ? <Loader2 className={styles.loader2Icon} /> : <><Save className={styles.loader2Icon2} /> Artikel speichern</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
