import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t border-primary-foreground/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl tracking-widest uppercase mb-4">LUMIÈRE</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-xs">
              Crafting extraordinary moments through uncompromising quality and timeless design since 1924.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase mb-4">Shop</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link href="/shop" className="hover:text-primary-foreground transition-colors">All Jewellery</Link></li>
              <li><Link href="/collections/bridal" className="hover:text-primary-foreground transition-colors">Bridal Collection</Link></li>
              <li><Link href="/collections/high-jewellery" className="hover:text-primary-foreground transition-colors">High Jewellery</Link></li>
              <li><Link href="/offers" className="hover:text-primary-foreground transition-colors">Offers</Link></li>
              <li><Link href="/shop?category=rings" className="hover:text-primary-foreground transition-colors">Rings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase mb-4">Maison</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link href="/about" className="hover:text-primary-foreground transition-colors">Our Story</Link></li>
              <li><Link href="/gallery" className="hover:text-primary-foreground transition-colors">Gallery</Link></li>
              <li><Link href="/blog" className="hover:text-primary-foreground transition-colors">Journal</Link></li>
              <li><Link href="/contact" className="hover:text-primary-foreground transition-colors">Boutiques</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase mb-4">Client Care</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link href="/contact" className="hover:text-primary-foreground transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-primary-foreground transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/returns" className="hover:text-primary-foreground transition-colors">Return Policy</Link></li>
              <li><Link href="/track-order" className="hover:text-primary-foreground transition-colors">Order Tracking</Link></li>
              <li><Link href="/faq" className="hover:text-primary-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} Lumière Jewels. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
