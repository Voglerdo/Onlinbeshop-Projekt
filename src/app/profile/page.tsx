"use client"

import { useState } from 'react';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Settings, 
  Package, 
  LogOut, 
  ChevronRight, 
  Loader2, 
  ShieldCheck,
  Mail,
  Calendar,
  CreditCard
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { getAuth, signOut } from 'firebase/auth';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const auth = getAuth();
  const { toast } = useToast();
  
  const [isSaving, setIsSaving] = useState(false);

  // Fetch User Profile
  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  // Fetch Orders
  const ordersQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users', user.uid, 'orders'), orderBy('createdAt', 'desc'), limit(5));
  }, [db, user]);

  const { data: orders, isLoading: isOrdersLoading } = useCollection(ordersQuery);

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profileRef || !user) return;

    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      id: user.uid,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: user.email || (formData.get('email') as string),
      updatedAt: new Date().toISOString(),
      createdAt: profile?.createdAt || new Date().toISOString(),
    };

    setDocumentNonBlocking(profileRef, data, { merge: true });
    
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile Updated",
        description: "Your Baron credentials have been synchronized.",
      });
    }, 500);
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      toast({
        title: "Signed Out",
        description: "Until next time, Baron.",
      });
    });
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
      <div className="container mx-auto px-4 py-20 max-w-md text-center space-y-8">
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-headline font-bold">Baron Access</h1>
          <p className="text-muted-foreground">Sign in to manage your premium collection and track your masterpieces.</p>
        </div>
        
        <div className="grid gap-4">
          <Button 
            variant="outline" 
            className="h-12 border-secondary text-secondary hover:bg-secondary/10"
            onClick={() => initiateAnonymousSignIn(auth)}
          >
            Enter Anonymously
          </Button>
          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-background px-2 text-xs text-muted-foreground uppercase">Coming Soon</span>
          </div>
          <Button disabled className="h-12 bg-primary/50 cursor-not-allowed">Email Authentication</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 max-w-6xl space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-secondary font-bold uppercase tracking-[0.3em] text-xs">
            <ShieldCheck className="h-3 w-3" />
            Authenticated Baron
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            Welcome, {profile?.firstName || 'The Baron'}
          </h1>
          <p className="text-muted-foreground">Managing your elite shisha lifestyle since {profile?.createdAt ? new Date(profile.createdAt).getFullYear() : 'today'}.</p>
        </div>
        
        <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          End Session
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-muted/50 border border-border p-1 h-14 rounded-xl">
          <TabsTrigger value="overview" className="h-full px-8 font-bold rounded-lg data-[state=active]:gold-glow data-[state=active]:bg-card">
            <Package className="h-4 w-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="settings" className="h-full px-8 font-bold rounded-lg data-[state=active]:gold-glow data-[state=active]:bg-card">
            <Settings className="h-4 w-4 mr-2" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card border-none col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Recent Orders</CardTitle>
                <CardDescription>A chronicle of your luxury acquisitions.</CardDescription>
              </CardHeader>
              <CardContent>
                {isOrdersLoading ? (
                  <div className="py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : !orders || orders.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <p className="text-muted-foreground">Your history is a blank canvas.</p>
                    <Button variant="link" className="text-secondary p-0">Begin your first session</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-white/5 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-muted text-secondary">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-bold">Order #{order.id.slice(0, 8).toUpperCase()}</div>
                            <div className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="font-bold text-secondary">${order.totalAmount.toFixed(2)}</div>
                            <Badge variant="outline" className="text-[10px] uppercase border-secondary/30 text-secondary">{order.status}</Badge>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="glass-card border-none bg-secondary/5">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Baron Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Membership</span>
                    <Badge className="bg-secondary text-background font-bold border-none">ELITE</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Joined</span>
                    <span className="text-sm font-medium">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <Separator className="bg-border/50" />
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    "The Blubber Baron remembers every preference, ensuring your sessions are nothing short of legendary."
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Identity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-sm truncate">{user.email || 'Anonymous Session'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm">Last active: {new Date().toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="glass-card border-none max-w-2xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Personal Credentials</CardTitle>
              <CardDescription>Update your presence in the Blubber Baron registry.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      defaultValue={profile?.firstName || ''} 
                      className="bg-background border-border" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      defaultValue={profile?.lastName || ''} 
                      className="bg-background border-border" 
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Preferred Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    defaultValue={user.email || profile?.email || ''} 
                    className="bg-background border-border" 
                    disabled={!!user.email}
                  />
                  {user.email && <p className="text-[10px] text-muted-foreground italic">Email managed via authentication provider.</p>}
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-primary hover:bg-primary/90 font-bold crimson-glow"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      'Synchronize Credentials'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
