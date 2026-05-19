import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const milestones = [
  { year: "1924", label: "Maison Lumiere opens its first atelier." },
  { year: "1968", label: "The house becomes known for bridal heirlooms and fine gold work." },
  { year: "Today", label: "Classic techniques meet modern silhouettes for everyday luxury." },
];

const values = [
  {
    title: "Crafted Slowly",
    body: "Every design is shaped, inspected, and finished with patience so the final piece feels balanced from every angle.",
  },
  {
    title: "Chosen Carefully",
    body: "We select metals and stones for tone, clarity, proportion, and wearability before a piece reaches the collection.",
  },
  {
    title: "Made to Endure",
    body: "Our jewellery is created for real occasions, daily rituals, and the quiet pleasure of being worn for years.",
  },
];

export function About() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <section className="relative min-h-[68vh] w-full overflow-hidden bg-black text-white">
        <img
          src="/images/hero-new.png"
          alt="Diamond ring in the Lumiere atelier"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/50" />

        <div className="container relative z-10 mx-auto flex min-h-[68vh] items-end px-4 pb-16 md:px-6 md:pb-24">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm uppercase tracking-[0.28em] text-white/75">Our Heritage</p>
            <h1 className="mb-6 font-serif text-5xl leading-tight md:text-7xl">
              A century of light, craft, and quiet elegance.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-white/80">
              Since 1924, Lumiere has created jewellery with a simple promise: every piece should feel personal,
              beautifully made, and worthy of becoming part of someone&apos;s story.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1fr] lg:items-start">
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.22em] text-muted-foreground">The Maison</p>
              <h2 className="font-serif text-4xl leading-tight md:text-5xl">Designed with restraint. Finished with devotion.</h2>
            </div>
            <div className="space-y-6 text-lg leading-8 text-muted-foreground">
              <p>
                What began as a small atelier has grown into a house shaped by precision, proportion, and emotion.
                Our work is guided by the belief that luxury is not loud. It lives in the clasp that closes smoothly,
                the stone that catches light at the right moment, and the piece that still feels effortless years later.
              </p>
              <p>
                Each collection brings together traditional goldsmithing, thoughtful stone selection, and contemporary
                forms made for the way jewellery is worn today.
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {milestones.map((milestone) => (
              <div key={milestone.year} className="border border-border px-6 py-8">
                <p className="mb-4 font-serif text-3xl">{milestone.year}</p>
                <p className="leading-7 text-muted-foreground">{milestone.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-20 text-primary-foreground md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="aspect-[4/3] overflow-hidden bg-primary-foreground/10">
              <img
                src="/images/collection-diamond.png"
                alt="Diamond jewellery craftsmanship"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.22em] text-primary-foreground/65">The Atelier</p>
              <h2 className="mb-6 font-serif text-4xl leading-tight md:text-5xl">Mastery in every detail</h2>
              <p className="mb-8 text-lg leading-8 text-primary-foreground/75">
                Our artisans balance hand skill with modern precision, refining every surface, setting, and silhouette
                until the piece carries the calm confidence that defines Lumiere.
              </p>
              <Button className="h-12 rounded-none bg-primary-foreground px-8 text-xs uppercase tracking-widest text-primary hover:bg-primary-foreground/90" asChild>
                <Link href="/shop">
                  Explore Jewellery <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-sm uppercase tracking-[0.22em] text-muted-foreground">Our Standards</p>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">What makes a piece worthy of the name.</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="border-t border-border pt-6">
                <h3 className="mb-4 font-serif text-2xl">{value.title}</h3>
                <p className="leading-7 text-muted-foreground">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
