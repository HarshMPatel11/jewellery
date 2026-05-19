import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateInquiry } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, MapPin, Phone, Mail } from "lucide-react";

export function Contact() {
  const { toast } = useToast();
  const createInquiry = useCreateInquiry();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.trim() && !/^\d{10,15}$/.test(formData.phone.trim())) {
      toast({ title: "Invalid Phone", description: "Phone number must contain only 10 to 15 digits." });
      return;
    }

    createInquiry.mutate(
      { data: formData },
      {
        onSuccess: () => {
          toast({
            title: "Inquiry Sent",
            description: "A member of our concierge team will contact you shortly.",
          });
          setFormData({ name: "", email: "", phone: "", message: "" });
        }
      }
    );
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-24 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif mb-4">Contact the Atelier</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Whether you wish to arrange a private viewing, inquire about a specific piece, or discuss a bespoke commission, our dedicated concierge team is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-serif mb-8">Send an Inquiry</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  required 
                  className="rounded-none border-border"
                  value={formData.name}
                  onChange={e => setFormData(f => ({...f, name: e.target.value}))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  className="rounded-none border-border"
                  value={formData.email}
                  onChange={e => setFormData(f => ({...f, email: e.target.value}))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input 
                id="phone" 
                inputMode="numeric"
                pattern="[0-9]{10,15}"
                className="rounded-none border-border"
                value={formData.phone}
                onChange={e => setFormData(f => ({...f, phone: e.target.value.replace(/\D/g, "")}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea 
                id="message" 
                required 
                rows={6} 
                className="rounded-none border-border"
                value={formData.message}
                onChange={e => setFormData(f => ({...f, message: e.target.value}))}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full rounded-none tracking-widest uppercase text-xs h-12"
              disabled={createInquiry.isPending}
            >
              {createInquiry.isPending ? "Sending..." : "Submit Inquiry"}
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t">
            <Button variant="outline" className="w-full rounded-none tracking-widest uppercase text-xs h-12 flex items-center justify-center border-primary text-primary" asChild>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-2" /> Message via WhatsApp
              </a>
            </Button>
          </div>
        </div>

        <div className="bg-muted/30 p-8 md:p-12">
          <h2 className="text-2xl font-serif mb-8">Boutique Information</h2>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <MapPin className="h-6 w-6 text-muted-foreground shrink-0" />
              <div>
                <h3 className="font-serif text-lg mb-2">Paris Flagship</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  15 Place Vendôme<br />
                  75001 Paris, France
                </p>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Monday - Saturday: 10:30 - 19:00</p>
                  <p>Sunday: By Appointment</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="h-6 w-6 text-muted-foreground shrink-0" />
              <div>
                <h3 className="font-serif text-lg mb-2">Telephone</h3>
                <p className="text-muted-foreground text-sm">
                  +33 1 23 45 67 89
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Mail className="h-6 w-6 text-muted-foreground shrink-0" />
              <div>
                <h3 className="font-serif text-lg mb-2">Email</h3>
                <p className="text-muted-foreground text-sm">
                  concierge@lumierejewels.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
