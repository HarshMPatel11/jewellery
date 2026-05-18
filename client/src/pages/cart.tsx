import { useGetCart, useUpdateCartItem, useRemoveCartItem, useCreateOrder } from "@workspace/api-client-react";
import { getSessionId } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function Cart() {
  const sessionId = getSessionId();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  const { data: cart, isLoading } = useGetCart(
    { sessionId },
    { query: { enabled: true, queryKey: ["cart", sessionId] } }
  );
  const tax = Math.round(Math.max((cart?.total || 0) - (appliedCoupon?.discount || 0), 0) * 0.03);
  const shippingCharge = 0;
  const grandTotal = Math.max((cart?.total || 0) - (appliedCoupon?.discount || 0), 0) + tax + shippingCharge;

  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const createOrder = useCreateOrder();

  const handleApplyCoupon = async () => {
    if (!couponCode || !cart) return;

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal: cart.total }),
      });

      if (!response.ok) throw new Error("Invalid coupon");

      const data = await response.json();
      setAppliedCoupon({ code: data.code, discount: data.discount });
      toast({ title: "Coupon Applied", description: `${data.code} saved ${formatPrice(data.discount)}.` });
    } catch {
      setAppliedCoupon(null);
      toast({ title: "Coupon Not Applied", description: "Please check the code and order value." });
    }
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    updateItem.mutate(
      { id, data: { quantity }, sessionId },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart", sessionId] })
      }
    );
  };

  const handleRemove = (id: number) => {
    removeItem.mutate(
      { id, sessionId },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart", sessionId] })
      }
    );
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart?.items || cart.items.length === 0) return;

    createOrder.mutate(
      {
        data: {
          ...formData,
            items: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity
          })),
          couponCode: appliedCoupon?.code
        },
        sessionId
      },
      {
        onSuccess: (order) => {
          queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
          toast({ title: "Order Placed", description: "Your order has been confirmed." });
          setLocation(`/orders/${order.id}`);
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

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-serif mb-6">Your Bag is Empty</h1>
        <p className="text-muted-foreground mb-8">Discover our collections and find exceptional pieces to add to your bag.</p>
        <Button variant="outline" className="rounded-none tracking-widest uppercase text-xs px-8 h-12" asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-4xl font-serif mb-12">Your Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="border-t border-b">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-6 py-6 border-b last:border-0">
                <div className="w-24 aspect-[4/5] bg-muted shrink-0">
                  <img src={item.productImage || "/images/placeholder.png"} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif text-lg">
                        <Link href={`/shop/${item.productId}`} className="hover:underline">{item.productName}</Link>
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1">{formatPrice(item.price)}</p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border">
                      <button 
                        className="px-3 py-1 text-muted-foreground hover:text-foreground"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updateItem.isPending}
                      >-</button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button 
                        className="px-3 py-1 text-muted-foreground hover:text-foreground"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updateItem.isPending}
                      >+</button>
                    </div>
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="text-sm text-muted-foreground hover:text-destructive flex items-center transition-colors"
                      disabled={removeItem.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-muted/30 p-8">
            <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shippingCharge ? formatPrice(shippingCharge) : "Complimentary"}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-primary">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span>-{formatPrice(appliedCoupon.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Tax/GST</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="flex gap-2 mb-8">
              <Input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="rounded-none bg-background"
              />
              <Button type="button" variant="outline" className="rounded-none" onClick={handleApplyCoupon}>
                Apply
              </Button>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <h3 className="font-serif text-lg border-t pt-6 mb-4">Delivery Details</h3>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  required 
                  className="rounded-none bg-background" 
                  value={formData.customerName}
                  onChange={e => setFormData(f => ({ ...f, customerName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  className="rounded-none bg-background"
                  value={formData.customerEmail}
                  onChange={e => setFormData(f => ({ ...f, customerEmail: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  className="rounded-none bg-background"
                  value={formData.customerPhone}
                  onChange={e => setFormData(f => ({ ...f, customerPhone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="address">Shipping Address</Label>
                <Input 
                  id="address" 
                  required 
                  className="rounded-none bg-background"
                  value={formData.shippingAddress}
                  onChange={e => setFormData(f => ({ ...f, shippingAddress: e.target.value }))}
                />
              </div>
              
              <Button type="submit" className="w-full rounded-none tracking-widest uppercase text-xs h-12 mt-6" disabled={createOrder.isPending}>
                {createOrder.isPending ? "Processing..." : "Place Order"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
