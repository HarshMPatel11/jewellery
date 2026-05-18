import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage" }),
      });

      if (!response.ok) throw new Error("Unable to subscribe");

      setEmail("");
      toast({ title: "Subscribed", description: "You will receive collection updates and private offers." });
    } catch {
      toast({ title: "Subscription failed", description: "Please try again with a valid email." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
      <Input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email address"
        className="rounded-none bg-background"
      />
      <Button type="submit" className="rounded-none tracking-widest uppercase text-xs px-8" disabled={isSubmitting}>
        {isSubmitting ? "Joining..." : "Join"}
      </Button>
    </form>
  );
}
