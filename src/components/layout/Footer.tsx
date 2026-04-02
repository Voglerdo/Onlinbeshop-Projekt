
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card mt-20">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-headline text-primary uppercase tracking-tighter">BLUBBER BARON</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Exquisite shisha experiences for the discerning enthusiast. Luxury, performance, and sophistication in every puff.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-secondary uppercase tracking-widest text-xs">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#catalog" className="hover:text-primary transition-colors">Hookahs</Link></li>
              <li><Link href="/#catalog" className="hover:text-primary transition-colors">Charcoal</Link></li>
              <li><Link href="/#catalog" className="hover:text-primary transition-colors">Flavors</Link></li>
              <li><Link href="/#catalog" className="hover:text-primary transition-colors">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-secondary uppercase tracking-widest text-xs">Empire</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/story" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/profile" className="hover:text-primary transition-colors">The Registry</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Console</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-secondary uppercase tracking-widest text-xs">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Instagram</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Twitter</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Facebook</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 text-center text-xs text-muted-foreground uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Blubber Baron. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
