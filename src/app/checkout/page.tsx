
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
import styles from './page.styles.module.css';

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
      <div className={styles.checkoutLayoutPrimary}>
        <Loader2 className={styles.loader2Icon} />
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainerPrimary}>
      <div className={styles.checkoutLayoutSecondary}>
        <Link href="/" className={styles.link5}>
          <ArrowLeft className={styles.arrowLeftIcon} />
        </Link>
        <h1 className={styles.sichererCheckoutTitle}>Sicherer Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.checkoutContainerTertiary}>
          <section className={styles.checkoutSection}>
            <div className={styles.checkoutLayoutTertiary}>
              <Truck className={styles.checkoutIconPrimary} />
              <h2 className={styles.versandzielHeading}>Versandziel</h2>
            </div>
            
            <div className={styles.grid}>
              <div className={styles.checkoutContainerTertiary}>
                <Label htmlFor="firstName">Vorname</Label>
                <Input id="firstName" name="firstName" required className={styles.input16} value={formData.firstName} onChange={handleInputChange} />
              </div>
              <div className={styles.checkoutContainerTertiary}>
                <Label htmlFor="lastName">Nachname</Label>
                <Input id="lastName" name="lastName" required className={styles.input16} value={formData.lastName} onChange={handleInputChange} />
              </div>
            </div>

            <div className={styles.checkoutContainerTertiary}>
              <Label htmlFor="street">Straße & Hausnummer</Label>
              <Input id="street" name="street" required className={styles.input16} value={formData.street} onChange={handleInputChange} />
            </div>

            <div className={styles.grid2}>
              <div className={styles.checkoutContainerQuaternary}>
                <Label htmlFor="city">Stadt</Label>
                <Input id="city" name="city" required className={styles.input16} value={formData.city} onChange={handleInputChange} />
              </div>
              <div className={styles.checkoutContainerTertiary}>
                <Label htmlFor="zip">PLZ</Label>
                <Input id="zip" name="zip" required className={styles.input16} value={formData.zip} onChange={handleInputChange} />
              </div>
            </div>
          </section>

          <section className={styles.checkoutSection}>
            <div className={styles.checkoutLayoutTertiary}>
              <CreditCard className={styles.checkoutIconPrimary} />
              <h2 className={styles.versandzielHeading}>Zahlungsmittel</h2>
            </div>
            <Card className={styles.checkoutCardPrimary}>
              <CardContent className={styles.cardcontent20}>
                <div className={styles.checkoutLayoutQuaternary}>
                  <div className={styles.checkoutLayoutQuinary}>
                    <CreditCard className={styles.creditcard23} />
                    <div>
                      <p className={styles.baronKreditText}>Baron Kredit</p>
                      <p className={styles.gesicherteTransaktionText}>Gesicherte Transaktion</p>
                    </div>
                  </div>
                  <Badge className={styles.standardBadge}>Standard</Badge>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <div className={styles.checkoutContainerQuinary}>
          <Card className={styles.checkoutCardSecondary}>
            <CardHeader>
              <CardTitle className={styles.cardtitle29}>Zusammenfassung</CardTitle>
            </CardHeader>
            <CardContent className={styles.checkoutSection}>
              <div className={styles.checkoutContainerSenary}>
                {items.map((item) => (
                  <div key={item.id} className={styles.checkoutLayoutSenary}>
                    <span className={styles.inlineText}>{item.name} x{item.quantity}</span>
                    <span className={styles.baronKreditText}>{(item.price * item.quantity).toFixed(2)}€</span>
                  </div>
                ))}
              </div>
              <Separator className={styles.separator33} />
              <div className={styles.checkoutLayoutSeptenary}>
                <span>Gesamt</span>
                <span className={styles.inlineText2}>{totalPrice.toFixed(2)}€</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className={styles.actionButton} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className={styles.loader2Icon2} /> : <><ShieldCheck className={styles.loader2Icon3} /> Erwerb abschließen</>}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
