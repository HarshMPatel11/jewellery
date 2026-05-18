import { Link, useLocation } from "wouter";
import { GitCompare, ShoppingBag, Heart, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSessionId } from "@/lib/session";
import { useGetCart, useGetWishlist } from "@workspace/api-client-react";

export function Navbar() {
  const [location] = useLocation();
  const sessionId = getSessionId();

  const { data: cart } = useGetCart(
    { sessionId },
    { query: { enabled: true, queryKey: ["cart", sessionId] } }
  );

  const { data: wishlist } = useGetWishlist(
    { sessionId },
    { query: { enabled: true, queryKey: ["wishlist", sessionId] } }
  );

  const cartItemsCount = cart?.itemCount || 0;
  const wishlistCount = wishlist?.length || 0;

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/collections/bridal", label: "Bridal" },
    { href: "/offers", label: "Offers" },
    { href: "/about", label: "Our Story" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Mobile Menu */}
          <div className="flex flex-1 md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex flex-1 gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="font-serif text-2xl tracking-widest uppercase">
              LUMIÈRE
            </Link>
          </div>

          {/* Actions */}
          <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="hidden md:inline-flex text-muted-foreground hover:text-primary">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:inline-flex text-muted-foreground hover:text-primary" asChild>
              <Link href="/account">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:inline-flex text-muted-foreground hover:text-primary" asChild>
              <Link href="/compare">
                <GitCompare className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary" asChild>
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute 1 top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary" asChild>
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute 1 top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
