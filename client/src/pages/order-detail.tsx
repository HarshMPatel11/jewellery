import { useParams, Link } from "wouter";
import { useGetOrder } from "@workspace/api-client-react";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id || "0", 10);

  const { data: order, isLoading } = useGetOrder(orderId, {
    query: { enabled: !!orderId, queryKey: ["order", orderId] }
  });

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

  if (!order) {
    return <div className="text-center py-24">Order not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
      <div className="mb-8">
        <Button variant="link" className="px-0 text-muted-foreground hover:text-primary mb-4" asChild>
          <Link href="/orders"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders</Link>
        </Button>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif mb-2">Order #{order.id.toString().padStart(6, '0')}</h1>
            <p className="text-muted-foreground">Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}</p>
          </div>
          <Badge variant="outline" className="capitalize rounded-none text-sm px-4 py-1">
            Status: {order.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2 space-y-6">
          <div className="border border-border p-6 bg-card">
            <h2 className="font-serif text-xl mb-6 border-b pb-4">Items Ordered</h2>
            <div className="space-y-6">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-muted shrink-0"></div>
                    <div>
                      <h3 className="font-serif"><Link href={`/shop/${item.productId}`} className="hover:underline">{item.productName}</Link></h3>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="border border-border p-6 bg-card">
            <h2 className="font-serif text-xl mb-4 border-b pb-4">Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal ?? order.total)}</span>
              </div>
              {(order.discount ?? 0) > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Coupon {order.couponCode ? `(${order.couponCode})` : ""}</span>
                  <span>-{formatPrice(order.discount ?? 0)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{order.shippingCharge ? formatPrice(order.shippingCharge) : "Complimentary"}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax/GST</span>
                <span>{formatPrice(order.tax ?? 0)}</span>
              </div>
            </div>
            <div className="flex justify-between font-medium text-lg border-t pt-4">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="border border-border p-6 bg-muted/30">
            <h2 className="font-serif text-lg mb-4">Delivery Information</h2>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p className="font-medium text-foreground">{order.customerName}</p>
              <p>{order.shippingAddress}</p>
              <p className="pt-2">{order.customerEmail}</p>
              {order.customerPhone && <p>{order.customerPhone}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
