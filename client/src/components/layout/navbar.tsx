import { Link, useLocation } from "wouter";
import { GitCompare, ShoppingBag, Heart, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getSessionId } from "@/lib/session";
import { useGetCart, useGetWishlist } from "@workspace/api-client-react";
import { getAuthEventName, getCurrentUser, logoutUser } from "@/lib/auth";
import { useEffect, useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const sessionId = getSessionId();

  useEffect(() => {
    const syncUser = () => setCurrentUser(getCurrentUser());
    window.addEventListener(getAuthEventName(), syncUser);
    return () => window.removeEventListener(getAuthEventName(), syncUser);
  }, []);

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
    { href: "/collections/gold", label: "Gold" },
    { href: "/collections/diamond", label: "Diamond" },
    { href: "/collections/silver", label: "Silver" },
    { href: "/offers", label: "Offers" },
    { href: "/about", label: "Our Story" },
    { href: "/contact", label: "Contact" },
  ];

  const mobileLinks = [
    ...navLinks,
    { href: "/wishlist", label: "Wishlist" },
    { href: "/cart", label: "Cart" },
    { href: "/compare", label: "Compare" },
    { href: "/account", label: currentUser ? "My Account" : "Login / Register" },
    { href: "/track-order", label: "Order Tracking" },
    { href: "/admin", label: "Admin Panel" },
  ];

  const isActive = (href: string) => location === href || location.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Mobile Menu */}
          <div className="flex flex-1 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 max-w-[85vw]">
                <SheetHeader className="text-left">
                  <SheetTitle className="font-serif tracking-widest uppercase">LUMIERE</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col">
                  {mobileLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={`border-b py-4 text-base font-medium transition-colors ${
                          isActive(link.href)
                            ? "border-primary text-primary underline underline-offset-8"
                            : "border-border text-muted-foreground hover:text-primary"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                  {currentUser && (
                    <button
                      type="button"
                      onClick={logoutUser}
                      className="border-b border-border py-4 text-left text-base font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      Logout
                    </button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex flex-1 items-center gap-5 lg:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b-2 py-7 text-sm font-medium whitespace-nowrap transition-colors hover:text-primary ${
                  isActive(link.href)
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="font-serif text-2xl tracking-widest uppercase">
              LUMIERE
            </Link>
          </div>

          {/* Actions */}
          <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="hidden md:inline-flex text-muted-foreground hover:text-primary" asChild>
              <Link href="/shop">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`hidden md:inline-flex border-b-2 rounded-none ${
                isActive("/account") ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-primary"
              }`}
              asChild
            >
              <Link href="/account">
                <User className="h-5 w-5" />
                <span className="sr-only">{currentUser ? "My Account" : "Login"}</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`hidden md:inline-flex border-b-2 rounded-none ${
                isActive("/compare") ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-primary"
              }`}
              asChild
            >
              <Link href="/compare">
                <GitCompare className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`relative border-b-2 rounded-none ${
                isActive("/wishlist") ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-primary"
              }`}
              asChild
            >
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute 1 top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`relative border-b-2 rounded-none ${
                isActive("/cart") || isActive("/checkout")
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-primary"
              }`}
              asChild
            >
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
