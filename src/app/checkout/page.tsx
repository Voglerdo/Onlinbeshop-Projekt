
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartProvider';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ArrowLeft, Loader2, CreditCard, Truck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { externalApiService } from '@/services/api-client';

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, totalPrice, clearCart } = useCart();
  const { user, isUserLoading } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'Deutschland',
    paymentMethod: 'Kreditkarte'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Identifizierung erforderlich",
        description: "Bitte melden Sie sich an, um Ihren Erwerb abzuschließen.",
        variant: "destructive"
      });
      router.push('/profile');
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Warenkorb leer",
        description: "Ihre Auswahl enthält keine Artikel.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const timestamp = new Date().toISOString();

    const orderData = {
      userId: user.uid,
      totalAmount: totalPrice,
      status: 'Ausstehend',
      shippingAddress: `${formData.street}, ${formData.zip} ${formData.city}, ${formData.country}`,
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      createdAt: timestamp
    };

    try {
      await externalApiService.syncOrder(orderData);
      toast({
        title: "Erwerb protokolliert",
        description: "Ihre Bestellung wurde erfolgreich an das imperiale Register übermittelt.",
      });
      clearCart();
      router.push('/profile');
    } catch (error) {
      toast({
        title: "Fehler bei der Übermittlung",
        description: "Die Verbindung zum Register konnte nicht hergestellt werden.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 max-w-7xl">
      <div className="flex items-center gap-4 mb-12">
        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Sicherer Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-2">
              <Truck className="h-5 w-5 text-secondary" />
              <h2 className="text-xl font-bold uppercase tracking-widest">Versandziel</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname</Label>
                <Input id="firstName" name="firstName" required className="bg-card" value={formData.firstName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname</Label>
                <Input id="lastName" name="lastName" required className="bg-card" value={formData.lastName} onChange={handleInputChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Straße & Hausnummer</Label>
              <Input id="street" name="street" required className="bg-card" value={formData.street} onChange={handleInputChange} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="city">Stadt</Label>
                <Input id="city" name="city" required className="bg-card" value={formData.city} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">PLZ</Label>
                <Input id="zip" name="zip" required className="bg-card" value={formData.zip} onChange={handleInputChange} />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-2">
              <CreditCard className="h-5 w-5 text-secondary" />
              <h2 className="text-xl font-bold uppercase tracking-widest">Zahlungsmittel</h2>
            </div>
            <Card className="glass-card border-none bg-secondary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between p-4 border border-secondary/30 rounded-xl bg-card">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-secondary" />
                    <div>
                      <p className="font-bold">Baron Kredit</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Gesicherte Transaktion</p>
                    </div>
                  </div>
                  <Badge className="bg-secondary text-background">Standard</Badge>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <div className="lg:col-span-1">
          <Card className="glass-card border-none sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Zusammenfassung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4">
                    <span className="text-sm font-bold line-clamp-1">{item.name} x{item.quantity}</span>
                    <span className="font-bold">{(item.price * item.quantity).toFixed(2)}€</span>
                  </div>
                ))}
              </div>
              <Separator className="bg-border/50" />
              <div className="flex justify-between text-xl font-bold">
                <span>Gesamt</span>
                <span className="text-secondary">{totalPrice.toFixed(2)}€</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary/90 text-lg font-bold crimson-glow" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><ShieldCheck className="mr-2 h-5 w-5" /> Erwerb abschließen</>}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
