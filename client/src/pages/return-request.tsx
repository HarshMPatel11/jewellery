import { useState } from "react";
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
  const [formData, setFormData] = useState({
    orderId,
    customerName: "",
    customerEmail: "",
    reason: "",
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
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
            onChange={(event) => setFormData((current) => ({ ...current, orderId: event.target.value }))}
            placeholder="000001"
            className="rounded-none bg-background"
          />
        </div>
        <div>
          <Label htmlFor="customerName">Full Name</Label>
          <Input
            id="customerName"
            required
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
