import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuthEventName, getCurrentUser, loginUser, logoutUser, registerUser, type AuthUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export function Account() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser());
    window.addEventListener(getAuthEventName(), syncUser);
    return () => window.removeEventListener(getAuthEventName(), syncUser);
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      if (mode === "register") {
        if (formData.name.trim().length < 2) {
          throw new Error("Please enter your full name.");
        }
        registerUser(formData.name, formData.email, formData.password);
        toast({ title: "Account Created", description: "You can now add pieces to your bag." });
      } else {
        loginUser(formData.email, formData.password);
        toast({ title: "Logged In", description: "Welcome back to Lumiere." });
      }

      setUser(getCurrentUser());
      setFormData({ name: "", email: "", password: "" });
      setLocation("/shop");
    } catch (error) {
      toast({
        title: mode === "register" ? "Registration Failed" : "Login Failed",
        description: error instanceof Error ? error.message : "Please check your details.",
      });
    }
  }

  function handleLogout() {
    logoutUser();
    setUser(null);
    toast({ title: "Logged Out", description: "You have been signed out." });
  }

  if (user) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 md:px-6">
        <h1 className="mb-4 font-serif text-4xl">My Account</h1>
        <div className="bg-muted/30 p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Signed in as</p>
          <h2 className="mt-3 font-serif text-2xl">{user.name}</h2>
          <p className="mt-1 text-muted-foreground">{user.email}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button className="rounded-none" asChild>
              <Link href="/orders">Order History</Link>
            </Button>
            <Button variant="outline" className="rounded-none" asChild>
              <Link href="/cart">Go to Bag</Link>
            </Button>
            <Button type="button" variant="outline" className="rounded-none" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-xl px-4 py-16 md:px-6">
      <h1 className="mb-4 font-serif text-4xl">{mode === "register" ? "Create Account" : "Login"}</h1>
      <p className="mb-8 text-muted-foreground">
        Login is required before adding jewellery to your bag.
      </p>

      <form onSubmit={handleSubmit} className="grid gap-5 bg-muted/30 p-8">
        {mode === "register" && (
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              required
              minLength={2}
              value={formData.name}
              onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
              className="rounded-none bg-background"
            />
          </div>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
            className="rounded-none bg-background"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            value={formData.password}
            onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
            className="rounded-none bg-background"
          />
        </div>
        <Button type="submit" className="rounded-none tracking-widest uppercase text-xs">
          {mode === "register" ? "Register" : "Login"}
        </Button>
      </form>

      <Button
        type="button"
        variant="link"
        className="mt-4 px-0"
        onClick={() => setMode((current) => (current === "login" ? "register" : "login"))}
      >
        {mode === "login" ? "Create a new account" : "Already have an account? Login"}
      </Button>
    </div>
  );
}
