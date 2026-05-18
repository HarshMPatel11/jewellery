import { useGetWishlist, useRemoveWishlistItem, useAddCartItem } from "@workspace/api-client-react";
import { getSessionId } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function Wishlist() {
  const sessionId = getSessionId();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: wishlist, isLoading } = useGetWishlist(
    { sessionId },
    { query: { enabled: true, queryKey: ["wishlist", sessionId] } }
  );

  const removeItem = useRemoveWishlistItem();
  const addToCart = useAddCartItem();

  const handleRemove = (id: number) => {
    removeItem.mutate(
      { id, sessionId },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist", sessionId] })
      }
    );
  };

  const handleMoveToCart = (item: any) => {
    addToCart.mutate(
      { data: { productId: item.productId, quantity: 1, sessionId } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
          toast({ title: "Added to Bag", description: `${item.productName} moved to your bag.` });
          handleRemove(item.id);
        }
      }
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-serif mb-6">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-8">Curate a collection of your favorite pieces.</p>
        <Button variant="outline" className="rounded-none tracking-widest uppercase text-xs px-8 h-12" asChild>
          <Link href="/shop">Discover Pieces</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-4xl font-serif mb-12">Saved Pieces</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {wishlist.map((item) => (
          <div key={item.id} className="group flex flex-col gap-4">
            <div className="relative aspect-[4/5] bg-muted overflow-hidden">
              <Link href={`/shop/${item.productId}`} className="block w-full h-full">
                <img 
                  src={item.productImage || "/images/placeholder.png"} 
                  alt={item.productName} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
              
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur shadow-sm text-muted-foreground hover:text-destructive transition-colors"
                disabled={removeItem.isPending}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </button>
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="font-serif text-lg">
                <Link href={`/shop/${item.productId}`} className="hover:underline">
                  {item.productName}
                </Link>
              </h3>
              {item.price && (
                <div className="text-primary font-medium">{formatPrice(item.price)}</div>
              )}
              
              <Button 
                variant="outline" 
                className="w-full rounded-none mt-2 text-xs tracking-wider uppercase"
                onClick={() => handleMoveToCart(item)}
                disabled={addToCart.isPending || !item.inStock}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {item.inStock ? "Move to Bag" : "Out of Stock"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
