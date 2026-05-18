import { useListOrders } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function Orders() {
  const { data: orders, isLoading } = useListOrders();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped": return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-4xl font-serif mb-12">Order History</h1>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-24 bg-muted/30">
          <h3 className="text-xl font-serif mb-2">No orders found</h3>
          <p className="text-muted-foreground mb-8">You haven't placed any orders yet.</p>
          <Button variant="outline" className="rounded-none tracking-widest uppercase text-xs px-8" asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border bg-card">
              <div className="flex flex-wrap items-center justify-between p-6 border-b bg-muted/30 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Order Placed</div>
                  <div className="font-medium">{format(new Date(order.createdAt), "MMM d, yyyy")}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total</div>
                  <div className="font-medium">{formatPrice(order.total)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Order Number</div>
                  <div className="font-medium">#{order.id.toString().padStart(6, '0')}</div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className={`capitalize rounded-none ${getStatusColor(order.status)}`}>
                    {order.status}
                  </Badge>
                  <Button variant="outline" className="rounded-none text-xs uppercase tracking-wider" asChild>
                    <Link href={`/orders/${order.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm text-muted-foreground">
                  {order.items?.length || 0} item(s) • Shipped to: {order.shippingAddress}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
