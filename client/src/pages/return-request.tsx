import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function ReturnRequest() {
  const { toast } = useToast();
  const search = useSearch();
  const orderId = new URLSearchParams(search).get("orderId") ?? "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingOrder, setIsFetchingOrder] = useState(false);
  const [orderFound, setOrderFound] = useState(false);
  const [formData, setFormData] = useState({
    orderId,
    customerName: "",
    customerEmail: "",
    reason: "",
  });

  async function fetchOrder(value = formData.orderId) {
    const numericOrderId = value.replace(/\D/g, "");
    if (!numericOrderId) {
      setOrderFound(false);
      return;
    }

    setIsFetchingOrder(true);
    try {
      const response = await fetch(`/api/orders/${numericOrderId}`);
      if (!response.ok) throw new Error("Order not found");
      const order = await response.json();
      setOrderFound(true);
      setFormData((current) => ({
        ...current,
        orderId: String(order.id),
        customerName: order.customerName ?? current.customerName,
        customerEmail: order.customerEmail ?? current.customerEmail,
      }));
    } catch {
      setOrderFound(false);
      toast({ title: "Order Not Found", description: "Please enter a valid order number before submitting." });
    } finally {
      setIsFetchingOrder(false);
    }
  }

  useEffect(() => {
    if (orderId) void fetchOrder(orderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!orderFound) {
      toast({ title: "Order Required", description: "Please fetch a valid order before creating a return request." });
      return;
    }
    if (!formData.customerName.trim() || !formData.customerEmail.trim() || !formData.reason.trim()) {
      toast({ title: "Missing Details", description: "Please complete all return request fields." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/return-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          orderId: Number(formData.orderId.replace(/\D/g, "")),
        }),
      });

      if (!response.ok) throw new Error("Unable to create return request");

      setFormData({ orderId: "", customerName: "", customerEmail: "", reason: "" });
      setOrderFound(false);
      toast({ title: "Return Request Sent", description: "Our team will review it and contact you shortly." });
    } catch {
      toast({ title: "Request Failed", description: "Please check the order details and try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-2xl">
      <Button variant="link" className="px-0 text-muted-foreground" asChild>
        <Link href="/returns">View Return Policy</Link>
      </Button>
      <h1 className="text-4xl font-serif mb-4">Return Request</h1>
      <p className="text-muted-foreground mb-8">
        Submit your order details and reason. The team can review requests from the admin panel.
      </p>

      <form onSubmit={handleSubmit} className="grid gap-4 bg-muted/30 p-8">
        <div>
          <Label htmlFor="orderId">Order Number</Label>
          <Input
            id="orderId"
            required
            value={formData.orderId}
            inputMode="numeric"
            pattern="[0-9]+"
            onBlur={() => fetchOrder()}
            onChange={(event) => {
              setOrderFound(false);
              setFormData((current) => ({ ...current, orderId: event.target.value.replace(/\D/g, "") }));
            }}
            placeholder="000001"
            className="rounded-none bg-background"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {isFetchingOrder ? "Fetching order..." : orderFound ? "Order found. Customer details filled from backend." : "Enter an existing order number."}
          </p>
        </div>
        <div>
          <Label htmlFor="customerName">Full Name</Label>
          <Input
            id="customerName"
            required
            minLength={2}
            value={formData.customerName}
            onChange={(event) => setFormData((current) => ({ ...current, customerName: event.target.value }))}
            className="rounded-none bg-background"
          />
        </div>
        <div>
          <Label htmlFor="customerEmail">Email</Label>
          <Input
            id="customerEmail"
            type="email"
            required
            value={formData.customerEmail}
            onChange={(event) => setFormData((current) => ({ ...current, customerEmail: event.target.value }))}
            className="rounded-none bg-background"
          />
        </div>
        <div>
          <Label htmlFor="reason">Reason</Label>
          <Textarea
            id="reason"
            required
            rows={5}
            value={formData.reason}
            onChange={(event) => setFormData((current) => ({ ...current, reason: event.target.value }))}
            className="rounded-none bg-background"
          />
        </div>
        <Button type="submit" className="rounded-none tracking-widest uppercase text-xs" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </div>
  );
}
