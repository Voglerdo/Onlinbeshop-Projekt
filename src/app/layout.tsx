
import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/components/cart/CartProvider';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Blubber Baron | Premium Shisha Experience',
  description: 'Entdecken Sie Luxus-Shishas, Premium-Kohle und raffinierte Aromen bei Blubber Baron.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <div className="app-shell">
              <Navbar />
              <main className="app-main">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
