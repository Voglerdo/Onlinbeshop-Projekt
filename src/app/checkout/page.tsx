"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartProvider';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, ArrowLeft, Loader2, CreditCard, Truck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, totalPrice, clearCart } = useCart();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    paymentMethod: 'Credit Card'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) {
      toast({
        title: "Access Restricted",
        description: "Please sign in to complete your acquisition.",
        variant: "destructive"
      });
      router.push('/profile');
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Your selection is empty. Please add items to your cart.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    const orderId = doc(collection(db, 'placeholder')).id; // Generate a unique ID
    const orderRef = doc(db, 'users', user.uid, 'orders', orderId);
    const timestamp = new Date().toISOString();

    const orderData = {
      id: orderId,
      userId: user.uid,
      orderDate: timestamp,
      totalAmount: totalPrice,
      status: 'Pending',
      shippingAddressStreet: formData.street,
      shippingAddressCity: formData.city,
      shippingAddressState: formData.state,
      shippingAddressZip: formData.zip,
      shippingAddressCountry: formData.country,
      billingAddressStreet: formData.street, // Simple assumption for demo
      billingAddressCity: formData.city,
      billingAddressZip: formData.zip,
      billingAddressCountry: formData.country,
      paymentMethod: formData.paymentMethod,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    // Save Order
    setDocumentNonBlocking(orderRef, orderData, { merge: true });

    // Save Order Items
    items.forEach(item => {
      const orderItemRef = doc(collection(db, 'users', user.uid, 'orders', orderId, 'orderItems'));
      const orderItemData = {
        id: orderItemRef.id,
        orderId: orderId,
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
        userId: user.uid // Denormalized for security rules
      };
      setDocumentNonBlocking(orderItemRef, orderItemData, { merge: true });
    });

    toast({
      title: "Order Placed",
      description: "Your masterpieces are being prepared for dispatch.",
    });

    setTimeout(() => {
      clearCart();
      router.push('/profile');
    }, 1000);
  };

  if (isUserLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-8">
        <h1 className="text-4xl font-headline font-bold">Secure Your Acquisition</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Please identify yourself at the Baron Registry to proceed with your luxury purchase.
        </p>
        <Button asChild size="lg" className="bg-primary px-10">
          <Link href="/profile">Sign In to Continue</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 max-w-7xl">
      <div className="flex items-center gap-4 mb-12">
        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Secure Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Shipping Information */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-2">
              <Truck className="h-5 w-5 text-secondary" />
              <h2 className="text-xl font-bold uppercase tracking-widest">Shipping Destination</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" name="firstName" required 
                  className="bg-card" value={formData.firstName} onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" name="lastName" required 
                  className="bg-card" value={formData.lastName} onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input 
                id="street" name="street" required 
                className="bg-card" value={formData.street} onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" name="city" required 
                  className="bg-card" value={formData.city} onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state" name="state" required 
                  className="bg-card" value={formData.state} onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input 
                  id="zip" name="zip" required 
                  className="bg-card" value={formData.zip} onChange={handleInputChange}
                />
              </div>
            </div>
          </section>

          {/* Payment Information */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-2">
              <CreditCard className="h-5 w-5 text-secondary" />
              <h2 className="text-xl font-bold uppercase tracking-widest">Payment Credentials</h2>
            </div>
            
            <Card className="glass-card border-none bg-secondary/5">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between p-4 border border-secondary/30 rounded-xl bg-card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded">
                      <CreditCard className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="font-bold">Baron Credit</p>
                      <p className="text-xs text-muted-foreground">Ending in •••• 1234</p>
                    </div>
                  </div>
                  <Badge className="bg-secondary text-background">Primary</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest">
                  Sensitive data is handled by our secure payment vaults
                </p>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="glass-card border-none sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
              <CardDescription>Your curated selection.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded bg-muted overflow-hidden">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Premium Shipping</span>
                  <span className="text-green-500 font-bold">Complimentary</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-4">
                  <span>Total</span>
                  <span className="text-secondary">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full h-14 bg-primary hover:bg-primary/90 text-lg font-bold crimson-glow"
                disabled={isSubmitting || items.length === 0}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    Complete Acquisition
                  </>
                )}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                By completing, you agree to the Baron's Terms of Service
              </p>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
