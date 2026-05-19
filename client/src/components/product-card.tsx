import { Link } from "wouter";
import { GitCompare, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@workspace/api-client-react";
import { useAddCartItem, useAddWishlistItem, useRemoveWishlistItem, useGetWishlist } from "@workspace/api-client-react";
import { getSessionId } from "@/lib/session";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { toggleCompareId } from "@/lib/compare";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const sessionId = getSessionId();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: wishlist } = useGetWishlist(
    { sessionId },
    { query: { enabled: true, queryKey: ["wishlist", sessionId] } }
  );

  const wishlistItem = wishlist?.find((w) => w.productId === product.id);
  const isInWishlist = !!wishlistItem;

  const addToCart = useAddCartItem();
  const addToWishlist = useAddWishlistItem();
  const removeFromWishlist = useRemoveWishlistItem();

  const handleAddToCart = () => {
    addToCart.mutate(
      { data: { productId: product.id, quantity: 1, sessionId } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
          toast({
            title: "Added to Bag",
            description: `${product.name} has been added to your bag.`,
          });
        },
      }
    );
  };

  const toggleWishlist = () => {
    if (isInWishlist && wishlistItem?.id) {
      removeFromWishlist.mutate(
        { id: wishlistItem.id, sessionId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist", sessionId] });
          },
        }
      );
    } else {
      addToWishlist.mutate(
        { data: { productId: product.id, sessionId } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist", sessionId] });
            toast({
              title: "Saved to Wishlist",
              description: `${product.name} has been saved.`,
            });
          },
        }
      );
    }
  };

  const handleCompare = () => {
    const ids = toggleCompareId(product.id);
    toast({
      title: ids.includes(product.id) ? "Added to Compare" : "Removed from Compare",
      description: "Compare up to four pieces side by side.",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group flex flex-col gap-4">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Link href={`/shop/${product.id}`} className="block w-full h-full">
          <img
            src={product.images?.[0] || "/images/placeholder.png"}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNewArrival && <Badge variant="secondary" className="bg-background/90 font-medium rounded-none">New</Badge>}
          {!product.inStock && <Badge variant="destructive" className="rounded-none">Out of Stock</Badge>}
          {product.salePrice && <Badge variant="default" className="bg-primary text-primary-foreground rounded-none">Sale</Badge>}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={toggleWishlist}
            className={`p-2 rounded-full bg-background/80 backdrop-blur shadow-sm transition-colors hover:bg-background ${
              isInWishlist ? "text-destructive" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className="h-4 w-4" fill={isInWishlist ? "currentColor" : "none"} />
            <span className="sr-only">Toggle Wishlist</span>
          </button>
          <button
            onClick={handleCompare}
            className="p-2 rounded-full bg-background/80 backdrop-blur shadow-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <GitCompare className="h-4 w-4" />
            <span className="sr-only">Compare Product</span>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 bg-gradient-to-t from-black/50 to-transparent">
          <Button 
            className="w-full rounded-none font-medium" 
            variant="secondary"
            onClick={handleAddToCart}
            disabled={!product.inStock || addToCart.isPending}
          >
            {addToCart.isPending ? "Adding..." : "Add to Bag"}
          </Button>
        </div>
      </div>

      <div className="space-y-1 text-center">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">{product.categoryName}</div>
        <h3 className="font-serif text-lg text-foreground">
          <Link href={`/shop/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center justify-center gap-2 text-sm">
          {product.salePrice ? (
            <>
              <span className="text-muted-foreground line-through">{formatPrice(product.price)}</span>
              <span className="text-primary font-medium">{formatPrice(product.salePrice)}</span>
            </>
          ) : (
            <span className="text-primary font-medium">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
