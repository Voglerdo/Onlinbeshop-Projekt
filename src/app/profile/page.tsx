"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { externalApiService } from "@/services/api-client";
import Link from "next/link";
import styles from "./page.styles.module.css";

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
        const [profileResult, ordersResult] = await Promise.allSettled([
          externalApiService.getUserProfile(user.uid),
          externalApiService.getOrders(user.uid),
        ]);

        if (profileResult.status === "fulfilled" && profileResult.value) {
          setProfile(profileResult.value);
        } else {
          setProfile(user);
        }

        if (ordersResult.status === "fulfilled" && ordersResult.value) {
          setOrders(ordersResult.value);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.warn(
          "REST API Profil-Laden fehlgeschlagen, nutze lokale Session-Daten.",
        );
        setProfile(user);
        setOrders([]);
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
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
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
      toast({
        title: "Fehler bei der Synchronisation",
        variant: "destructive",
      });
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
      login(user.email || "baron@elite.de", true); // Update lokale Session
      toast({
        title: "Admin-Zugang gewährt",
        description: "Sie haben nun Zugriff auf die Adminstrationskonsole.",
      });
    } catch (err) {
      toast({ title: "Promotion fehlgeschlagen", variant: "destructive" });
    } finally {
      setIsPromoting(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className={styles.profileLayoutPrimary}>
        <Loader2 className={styles.loader2Icon} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.profileContainerPrimary}>
        <div className={styles.profileContainerSecondary}>
          <h1 className={styles.imperialesRegisterTitle}>
            {" "}
            Zugang zum Blubber Baron
          </h1>
          <p className={styles.bodyText}>
            Melde dich an, um Zugang zum Blubber Baron Ökosystem zu erhalten.
          </p>
        </div>

        <div className={styles.grid}>
          <Card className={styles.profileLayoutSecondary}>
            <div className={styles.profileLayoutTertiary}>
              <User className={styles.user10} />
            </div>
            <div className={styles.profileContainerSecondary}>
              <h2 className={styles.kundenzugangHeading}>Kundenbereich</h2>
              <p className={styles.bodyText2}></p>
            </div>
            <Button
              className={styles.actionButton}
              onClick={() => login("baron@elite.de")}
            >
              Jetzt anmelden
            </Button>
          </Card>

          <Card className={styles.profileLayoutQuaternary}>
            <div className={styles.profileLayoutQuinary}>
              <ShieldCheck className={styles.shieldcheck17} />
            </div>
            <div className={styles.profileContainerSecondary}>
              <h2 className={styles.kundenzugangHeading}>Adminbereich</h2>
              <p className={styles.bodyText2}></p>
            </div>
            <Button
              className={styles.actionButton2}
              onClick={() => login("admin@blubberbaron.de", true)}
            >
              Jetzt anmelden
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainerQuaternary}>
      <div className={styles.profileLayoutSenary}>
        <div className={styles.profileContainerQuinary}>
          <div className={styles.profileLayoutSeptenary}>
            {user.isAdmin ? (
              <ShieldCheck className={styles.shieldcheck23} />
            ) : (
              <User className={styles.shieldcheck24} />
            )}
            {user.isAdmin ? "Adminkonto" : "Kundenkonto"}
          </div>
          <h1 className={styles.profileTitle}>
            Willkommen, {profile?.firstName || "Baron"}!
          </h1>
          <p className={styles.bodyText3}>{user.isAdmin ? "" : ``}</p>
        </div>

        <div className={styles.profileLayoutOctonary}>
          {user.isAdmin && (
            <Link href="/admin">
              <Button className={styles.actionButton3}>
                <Key className={styles.profileIconPrimary} />
                Adminstrationskonsole
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            className={styles.actionButton4}
            onClick={logout}
          >
            <LogOut className={styles.profileIconPrimary} />
            abmelden
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className={styles.tabs31}>
        <TabsList className={styles.profilePanelPrimary}>
          <TabsTrigger value="overview" className={styles.tabstrigger33}>
            <Package className={styles.profileIconPrimary} /> Übersicht
          </TabsTrigger>
          <TabsTrigger value="settings" className={styles.tabstrigger33}>
            <Settings className={styles.profileIconPrimary} /> Kontodaten
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className={styles.tabs31}>
          <div className={styles.grid2}>
            <Card className={styles.profileCardPrimary}>
              <CardHeader>
                <CardTitle className={styles.cardtitle36}>
                  Bestellungen
                </CardTitle>
                <CardDescription>Übersicht Deiner Bestellungen</CardDescription>
              </CardHeader>
              <CardContent>
                {isDataLoading ? (
                  <div className={styles.profileLayoutNonary}>
                    <Loader2 className={styles.profileContainerSeptenary} />
                  </div>
                ) : orders.length === 0 ? (
                  <div className={styles.profileContainerSeptenary}>
                    <p className={styles.bodyText3}>
                      Dein Bestellverlauf ist noch leer.
                    </p>
                    <Link href="/#catalog">
                      <Button
                        variant="link"
                        className={styles.beginnenSieIhreErsteSessionButton}
                      >
                        Lass dich inspirieren!
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className={styles.profileContainerOctonary}>
                    {orders.map((order: any) => (
                      <div
                        key={order.id}
                        className={styles.profileLayoutDenary}
                      >
                        <div className={styles.profileLayoutEleventh}>
                          <div className={styles.profilePanelSecondary}>
                            <CreditCard
                              className={styles.profileIconSecondary}
                            />
                          </div>
                          <div>
                            <div className={styles.profileContainerNonary}>
                              Bestellung #{order.id.slice(0, 8).toUpperCase()}
                            </div>
                            <div className={styles.bodyText2}>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className={styles.profileLayoutTwelfth}>
                          <div className={styles.profileContainerDenary}>
                            <div className={styles.profileContainerEleventh}>
                              {order.totalAmount.toFixed(2)}€
                            </div>
                            <Badge
                              variant="outline"
                              className={styles.statusBadge}
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <ChevronRight
                            className={styles.profileIconTertiary}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className={styles.tabs31}>
              <Card className={styles.profileCardSecondary}>
                <CardHeader>
                  <CardTitle className={styles.profileTextPrimary}>
                    Baron-Status
                  </CardTitle>
                </CardHeader>
                <CardContent className={styles.profileContainerOctonary}>
                  <div className={styles.profileLayoutThirteenth}>
                    <span className={styles.bodyText2}>Mitgliedsstatus</span>
                    <Badge
                      className={
                        user.isAdmin
                          ? "bg-primary adminTextPrimary-white font-bold border-none"
                          : "bg-secondary adminTextPrimary-background font-bold border-none"
                      }
                    >
                      {user.isAdmin ? "BARON ADMIN" : "BARON MITGLIED"}
                    </Badge>
                  </div>
                  <Separator className={styles.separator55} />
                  {!user.isAdmin && (
                    <Button
                      variant="outline"
                      className={styles.profileIconQuaternary}
                      onClick={handleBecomeAdmin}
                      disabled={isPromoting}
                    >
                      {isPromoting ? (
                        <Loader2 className={styles.loader2Icon2} />
                      ) : (
                        <ShieldCheck className={styles.profileIconPrimary} />
                      )}
                      Admin-Zugang beantragen
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className={styles.profileCardTertiary}>
                <CardHeader>
                  <CardTitle className={styles.profileTextPrimary}>
                    Profil
                  </CardTitle>
                </CardHeader>
                <CardContent className={styles.profileContainerOctonary}>
                  <div className={styles.profileLayoutFourteenth}>
                    <Mail className={styles.profileIconQuinary} />
                    <span className={styles.inlineText}>{user.email}</span>
                  </div>
                  <div className={styles.profileLayoutFourteenth}>
                    <Calendar className={styles.profileIconQuinary} />
                    <span className={styles.inlineText2}>
                      Letzte Anmeldung: {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card className={styles.profileCardQuaternary}>
            <CardHeader>
              <CardTitle className={styles.cardtitle36}>
                Persönliche Daten
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className={styles.form}>
                <div className={styles.grid3}>
                  <div className={styles.profileContainerSecondary}>
                    <Label htmlFor="firstName">Vorname</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      defaultValue={profile?.firstName || ""}
                      className={styles.input66}
                      required
                    />
                  </div>
                  <div className={styles.profileContainerSecondary}>
                    <Label htmlFor="lastName">Nachname</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      defaultValue={profile?.lastName || ""}
                      className={styles.input66}
                      required
                    />
                  </div>
                </div>
                <div className={styles.profileContainerSecondary}>
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={profile?.email || ""}
                    className={styles.input66}
                    required
                  />
                </div>
                <div className={styles.profileContainerTwelfth}>
                  <Button
                    type="submit"
                    className={styles.actionButton5}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className={styles.loader2Icon2} />
                    ) : (
                      "Änderungen speichern"
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
