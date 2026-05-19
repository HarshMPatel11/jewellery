import { Link } from "wouter";

export function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-new.png"
            alt="Atelier"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 text-center max-w-2xl px-4">
          <p className="text-sm tracking-[0.3em] uppercase mb-4 text-white/80">Maison Lumière</p>
          <h1 className="text-5xl md:text-6xl font-serif mb-6">Our Heritage</h1>
        </div>
      </section>

      <section className="py-24 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-serif mb-6">A Century of Brilliance</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Founded in 1924 by master jeweler Alexandre Dubois in the heart of Paris, Lumière Jewels was born from a singular vision: to create pieces that transcend time, capturing the ephemeral beauty of light in eternal forms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-12">
            <div className="aspect-square bg-muted">
              <img src="/images/collection-diamond.png" alt="Craftsmanship" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-2xl font-serif mb-4">The Art of the Craft</h3>
              <p className="text-muted-foreground leading-relaxed">
                We believe that true luxury lies in the details unseen. Every piece that leaves our atelier is the culmination of hundreds of hours of painstaking work. Our artisans employ techniques passed down through generations, marrying traditional expertise with contemporary innovation to achieve unparalleled precision.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-12 flex-row-reverse">
            <div className="md:order-2 aspect-square bg-muted">
              <img src="/images/collection-gold.png" alt="Materials" className="w-full h-full object-cover" />
            </div>
            <div className="md:order-1">
              <h3 className="text-2xl font-serif mb-4">Uncompromising Quality</h3>
              <p className="text-muted-foreground leading-relaxed">
                We traverse the globe to source only the most exceptional gemstones and the purest metals. Our gemologists inspect thousands of stones, selecting only a fraction of a percent that meet our rigorous standards for color, clarity, cut, and character. We are committed to ethical sourcing, ensuring our supply chain respects both people and the planet.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
