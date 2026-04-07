
"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
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
  CreditCard,
  Key,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { externalApiService } from '@/services/api-client';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isUserLoading, logout, login } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  useEffect(() => {
    async function fetchProfileData() {
      if (!user) return;
      setIsDataLoading(true);
      try {
        const [profileData, ordersData] = await Promise.all([
          externalApiService.getUserProfile(user.uid),
          externalApiService.getOrders(user.uid)
        ]);
        setProfile(profileData);
        setOrders(ordersData);
      } catch (err) {
        console.warn('REST API Profil-Laden fehlgeschlagen, nutze lokale Session-Daten.');
        setProfile(user);
      } finally {
        setIsDataLoading(false);
      }
    }
    fetchProfileData();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      updatedAt: new Date().toISOString(),
    };

    try {
      await externalApiService.updateUserProfile(user.uid, data);
      setProfile({ ...profile, ...data });
      toast({
        title: "Profil aktualisiert",
        description: "Ihre Baron-Referenzen wurden synchronisiert.",
      });
    } catch (err) {
      toast({ title: "Fehler bei der Synchronisation", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBecomeAdmin = async () => {
    if (!user) return;
    setIsPromoting(true);
    try {
      // Simuliere Admin-Promotion via API
      await externalApiService.updateUserProfile(user.uid, { isAdmin: true });
      login(user.email || 'baron@elite.de', true); // Update lokale Session
      toast({
        title: "Admin-Zugang gewährt",
        description: "Sie haben nun Zugriff auf die Imperiale Konsole.",
      });
    } catch (err) {
      toast({ title: "Promotion fehlgeschlagen", variant: "destructive" });
    } finally {
      setIsPromoting(false);
    }
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
      <div className="container mx-auto px-4 py-20 max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-headline font-black uppercase tracking-tighter">Imperiales Register</h1>
          <p className="text-muted-foreground text-lg">Identifizieren Sie sich, um Zugang zum Blubber Baron Ökosystem zu erhalten.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="glass-card border-none hover:gold-glow transition-all p-8 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-secondary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-headline">Kundenzugang</h2>
              <p className="text-sm text-muted-foreground">Verwalten Sie Ihre Kollektion, verfolgen Sie Erwerbe und stöbern Sie im Katalog.</p>
            </div>
            <Button className="w-full h-12 bg-secondary text-background font-bold" onClick={() => login('baron@elite.de')}>
              Als Kunde eintreten
            </Button>
          </Card>

          <Card className="glass-card border-none hover:crimson-glow transition-all p-8 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-headline">Imperiales Personal</h2>
              <p className="text-sm text-muted-foreground">Für Administratoren zur Verwaltung von Inventar und Stellenangeboten.</p>
            </div>
            <Button className="w-full h-12 bg-primary font-bold" onClick={() => login('admin@blubberbaron.de', true)}>
              Admin-Anmeldung
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 max-w-6xl space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-secondary font-bold uppercase tracking-[0.3em] text-xs">
            {user.isAdmin ? <ShieldCheck className="h-3 w-3 text-primary" /> : <User className="h-3 w-3" />}
            {user.isAdmin ? 'Imperiale Administration' : 'Authentifizierter Baron'}
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            Willkommen, {profile?.firstName || 'Baron'}
          </h1>
          <p className="text-muted-foreground">
            {user.isAdmin 
              ? 'Sie haben die volle Aufsicht über das Blubber Baron Imperium.' 
              : `Wir verwalten Ihren Elite-Lifestyle.`
            }
          </p>
        </div>
        
        <div className="flex gap-4">
          {user.isAdmin && (
            <Link href="/admin">
              <Button className="bg-primary crimson-glow font-bold h-12 px-8">
                <Key className="h-4 w-4 mr-2" />
                Admin-Konsole
              </Button>
            </Link>
          )}
          <Button variant="ghost" className="text-destructive h-12 hover:text-destructive hover:bg-destructive/10" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sitzung beenden
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-muted/50 border border-border p-1 h-14 rounded-xl">
          <TabsTrigger value="overview" className="h-full px-8 font-bold rounded-lg data-[state=active]:gold-glow data-[state=active]:bg-card">
            <Package className="h-4 w-4 mr-2" /> Übersicht
          </TabsTrigger>
          <TabsTrigger value="settings" className="h-full px-8 font-bold rounded-lg data-[state=active]:gold-glow data-[state=active]:bg-card">
            <Settings className="h-4 w-4 mr-2" /> Referenzen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card border-none col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Jüngste Akquisitionen</CardTitle>
                <CardDescription>Eine Chronik Ihrer Luxustransaktionen.</CardDescription>
              </CardHeader>
              <CardContent>
                {isDataLoading ? (
                  <div className="py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <p className="text-muted-foreground">Ihre Historie ist noch ein leeres Blatt.</p>
                    <Link href="/#catalog">
                      <Button variant="link" className="text-secondary p-0">Beginnen Sie Ihre erste Session</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-white/5 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-muted text-secondary">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-bold">Bestellung #{order.id.slice(0, 8).toUpperCase()}</div>
                            <div className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="font-bold text-secondary">{order.totalAmount.toFixed(2)}€</div>
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
                  <CardTitle className="text-lg font-bold">Baron-Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Mitgliedschaft</span>
                    <Badge className={user.isAdmin ? "bg-primary text-white font-bold border-none" : "bg-secondary text-background font-bold border-none"}>
                      {user.isAdmin ? 'IMPERIALES PERSONAL' : 'ELITE BARON'}
                    </Badge>
                  </div>
                  <Separator className="bg-border/50" />
                  {!user.isAdmin && (
                    <Button 
                      variant="outline" 
                      className="w-full text-xs border-primary/20 hover:bg-primary/10 text-primary py-6"
                      onClick={handleBecomeAdmin}
                      disabled={isPromoting}
                    >
                      {isPromoting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                      Admin-Zugang beantragen
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Identität</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-sm truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm">Zuletzt aktiv: {new Date().toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="glass-card border-none max-w-2xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Persönliche Referenzen</CardTitle>
              <CardDescription>Aktualisieren Sie Ihre Präsenz im Blubber Baron Register.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Vorname</Label>
                    <Input id="firstName" name="firstName" defaultValue={profile?.firstName || ''} className="bg-background border-border" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nachname</Label>
                    <Input id="lastName" name="lastName" defaultValue={profile?.lastName || ''} className="bg-background border-border" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input id="email" name="email" type="email" defaultValue={profile?.email || ''} className="bg-background border-border" required />
                </div>
                <div className="pt-4">
                  <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 font-bold crimson-glow" disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Referenzen synchronisieren'}
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
