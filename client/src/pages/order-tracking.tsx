import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [, setLocation] = useLocation();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const normalized = Number(orderId.replace(/\D/g, ""));
    if (normalized) setLocation(`/orders/${normalized}`);
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-xl">
      <h1 className="text-4xl font-serif mb-4">Order Tracking</h1>
      <p className="text-muted-foreground mb-8">Enter your order number to view the latest status and order details.</p>
      <form onSubmit={handleSubmit} className="space-y-4 bg-muted/30 p-8">
        <div>
          <Label htmlFor="order-id">Order Number</Label>
          <Input id="order-id" value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="000001" className="rounded-none bg-background" />
        </div>
        <Button type="submit" className="w-full rounded-none tracking-widest uppercase text-xs">
          Track Order
        </Button>
      </form>
    </div>
  );
}
