"use client"

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, Save, ShieldAlert } from 'lucide-react';

import { Product } from '@/app/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { externalApiService } from '@/services/api-client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import newStyles from '../../../new/page.styles.module.css';
import adminStyles from '../../../page.styles.module.css';

type ProductFormState = {
  name: string;
  category: string;
  price: string;
  description: string;
  brand: string;
  stockQuantity: string;
  features: string;
};

const EMPTY_FORM: ProductFormState = {
  name: '',
  category: '',
  price: '',
  description: '',
  brand: '',
  stockQuantity: '0',
  features: '',
};

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormState>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user?.isAdmin) {
      toast({
        title: "Zugriff eingeschränkt",
        description: "Weiterleitung zum Profil...",
        variant: "destructive"
      });
      router.push('/profile');
    }
  }, [isUserLoading, router, toast, user]);

  useEffect(() => {
    async function fetchProduct() {
      if (!productId || !user?.isAdmin) {
        return;
      }

      setIsLoading(true);
      try {
        const productData = await externalApiService.getProduct(productId);
        setProduct(productData);
        setFormData({
          name: productData.name ?? '',
          category: productData.category ?? '',
          price: productData.price != null ? String(productData.price) : '',
          description: productData.description ?? '',
          brand: productData.brand ?? '',
          stockQuantity: productData.stockQuantity != null ? String(productData.stockQuantity) : '0',
          features: (productData.features ?? []).join('\n'),
        });
      } catch (error) {
        toast({
          title: "Produkt nicht gefunden",
          description: "Der Artikel konnte nicht geladen werden.",
          variant: "destructive"
        });
        router.push('/admin');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [productId, router, toast, user]);

  const parsedFeatures = useMemo(
    () => formData.features.split('\n').map((feature) => feature.trim()).filter(Boolean),
    [formData.features],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) {
      return;
    }

    const price = parseFloat(formData.price);
    const stockQuantity = parseInt(formData.stockQuantity, 10);
    const brand = formData.brand.trim();

    if (!Number.isFinite(price) || price <= 0) {
      toast({
        title: "Ungültiger Preis",
        description: "Bitte geben Sie einen Preis größer als 0 ein.",
        variant: "destructive",
      });
      return;
    }

    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      toast({
        title: "Ungültiger Bestand",
        description: "Der Lagerbestand muss 0 oder größer sein.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await externalApiService.patchProduct(product.id, {
        name: formData.name.trim(),
        category: formData.category,
        price,
        description: formData.description.trim(),
        ...(brand ? { brand } : {}),
        stockQuantity,
        features: parsedFeatures,
      });

      toast({
        title: "Artikel aktualisiert",
        description: "Die Produktdaten wurden erfolgreich gespeichert.",
      });
      router.push('/admin');
    } catch (error) {
      toast({
        title: "Speichern fehlgeschlagen",
        description: "Die Änderungen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isUserLoading || isLoading) {
    return (
      <div className={adminStyles.adminLayoutPrimary}>
        <Loader2 className={adminStyles.loader2Icon} />
        <p className={adminStyles.imperialeReferenzenWerdenGepruftText}>Produktdaten werden vorbereitet...</p>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className={adminStyles.adminLayoutSecondary}>
        <div className={adminStyles.adminPanelPrimary}>
          <ShieldAlert className={adminStyles.shieldalert6} />
        </div>
        <div className={adminStyles.adminContainerPrimary}>
          <h1 className={adminStyles.nichtAutorisierterZugriffTitle}>Nicht autorisierter Zugriff</h1>
          <p className={adminStyles.bodyText}>Diese Bearbeitung ist dem inneren Kreis des Barons vorbehalten.</p>
        </div>
        <Button asChild className={adminStyles.actionButton}>
          <Link href="/profile">Zurück zum Register</Link>
        </Button>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className={newStyles.adminNewContainerPrimary}>
      <Link href="/admin" className={newStyles.adminNewLayoutPrimary}>
        <ArrowLeft className={newStyles.arrowLeftIcon} /> Zurück zur Konsole
      </Link>

      <div className={newStyles.adminNewContainerSecondary}>
        <h1 className={newStyles.neuesMeisterwerkTitle}>Artikel bearbeiten</h1>
        <p className={newStyles.bodyText}>Passen Sie Preis, Bestand und Produktdetails gezielt an.</p>
      </div>

      <form onSubmit={handleSubmit} className={newStyles.form}>
        <div className={newStyles.adminNewContainerTertiary}>
          <div className={newStyles.adminNewContainerTertiary}>
            <h3 className={newStyles.medienHeading}>Aktuelles Cover</h3>
            <div className={newStyles.grid}>
              <div className={newStyles.adminNewPanelPrimary}>
                <Image src={product.imageUrl} alt={product.name} fill className={newStyles.vorschauImage} />
                <Badge className={newStyles.coverBadge}>Cover</Badge>
              </div>
            </div>
            <p className={newStyles.bodyText}>Bildwechsel ist in diesem Bearbeiten-Schritt noch nicht vorgesehen.</p>
          </div>
        </div>

        <div className={newStyles.adminNewContainerQuinary}>
          <div className={newStyles.grid2}>
            <div className={newStyles.adminNewContainerSecondary}>
              <Label htmlFor="name">Produktname</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={newStyles.input23}
                required
              />
            </div>

            <div className={newStyles.grid3}>
              <div className={newStyles.adminNewContainerSecondary}>
                <Label htmlFor="category">Kategorie</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className={newStyles.input23}>
                    <SelectValue placeholder="Wählen..." />
                  </SelectTrigger>
                  <SelectContent className={newStyles.selectcontent25}>
                    <SelectItem value="hookah">Wasserpfeife</SelectItem>
                    <SelectItem value="flavor">Aroma</SelectItem>
                    <SelectItem value="coal">Kohle</SelectItem>
                    <SelectItem value="accessory">Zubehör</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={newStyles.adminNewContainerSecondary}>
                <Label htmlFor="price">Preis (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={newStyles.input23}
                  required
                />
              </div>
            </div>

            <div className={newStyles.grid3}>
              <div className={newStyles.adminNewContainerSecondary}>
                <Label htmlFor="brand">Marke</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className={newStyles.input23}
                />
              </div>

              <div className={newStyles.adminNewContainerSecondary}>
                <Label htmlFor="stockQuantity">Lagerbestand</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  className={newStyles.input23}
                  required
                />
              </div>
            </div>

            <div className={newStyles.adminNewContainerSecondary}>
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={newStyles.textarea26}
                required
              />
            </div>

            <div className={newStyles.adminNewContainerSecondary}>
              <Label htmlFor="features">Features (eine Zeile pro Eintrag)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className={newStyles.textarea26}
              />
            </div>
          </div>

          <Button type="submit" disabled={isSaving} className={newStyles.actionButton}>
            {isSaving ? <Loader2 className={newStyles.loader2Icon} /> : <><Save className={newStyles.loader2Icon2} /> Änderungen speichern</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
