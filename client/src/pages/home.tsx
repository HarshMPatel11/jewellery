import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { useGetFeaturedProducts, useGetNewArrivals, useGetCollectionsSummary } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { NewsletterSignup } from "@/components/newsletter-signup";

export function Home() {
  const { data: featuredProducts } = useGetFeaturedProducts();
  const { data: newArrivals } = useGetNewArrivals();
  const { data: collections } = useGetCollectionsSummary();

  const displayCollections = collections?.collections.slice(0, 4) || [
    { name: "High Jewellery", slug: "high-jewellery", imageUrl: "/images/collection-diamond.png" },
    { name: "Fine Gold", slug: "fine-gold", imageUrl: "/images/collection-gold.png" },
    { name: "Silver Elegance", slug: "silver", imageUrl: "/images/collection-silver.png" },
    { name: "Bridal", slug: "bridal", imageUrl: "/images/collection-bridal.png" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-new.png"
            alt="Lumière Jewels Hero"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 text-center max-w-3xl px-4"
        >
          <p className="text-sm md:text-base tracking-[0.3em] uppercase mb-4 text-white/80">
            The Art of Adornment
          </p>
          <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
            Elegance <br className="hidden md:block" />
            <span className="italic">Redefined</span>
          </h1>
          <Button size="lg" variant="outline" className="text-black bg-white hover:bg-white/90 rounded-none px-8 font-medium tracking-wide uppercase text-sm border-none" asChild>
            <Link href="/shop">Discover the Collection</Link>
          </Button>
        </motion.div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif mb-3 text-foreground">Curated Collections</h2>
              <p className="text-muted-foreground max-w-md">Discover our meticulously crafted categories, designed for those who appreciate the extraordinary.</p>
            </div>
            <Link href="/shop" className="hidden md:inline-flex items-center text-sm font-medium tracking-wider uppercase hover:text-primary/70 transition-colors mt-4 md:mt-0">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCollections.map((collection, i) => (
              <motion.div 
                key={collection.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative aspect-[3/4] overflow-hidden bg-muted cursor-pointer"
              >
                <Link href={`/collections/${collection.slug}`} className="absolute inset-0 z-10">
                  <span className="sr-only">View {collection.name}</span>
                </Link>
                <img
                  src={collection.imageUrl || `/images/collection-${collection.slug}.png`}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/hero-new.png";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl font-serif">{collection.name}</h3>
                  <div className="h-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:h-6 group-hover:opacity-100 group-hover:mt-2">
                    <span className="text-white/80 text-sm tracking-wider uppercase flex items-center">
                      Explore <ArrowRight className="ml-2 h-3 w-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      {newArrivals && newArrivals.length > 0 && (
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif mb-4">Latest Additions</h2>
              <p className="text-muted-foreground mx-auto max-w-xl text-center">
                The newest expressions of our craftsmanship, capturing contemporary elegance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals.slice(0, 4).map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Button variant="outline" className="rounded-none tracking-widest uppercase text-xs px-8 h-12" asChild>
                <Link href="/shop?sort=new">View All New Arrivals</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Editorial Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] bg-muted/20 relative overflow-hidden">
              <img 
                src="/images/collection-bridal.png" 
                alt="Craftsmanship" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/hero-new.png";
                }}
              />
            </div>
            <div className="max-w-xl">
              <span className="text-sm tracking-[0.2em] uppercase text-primary-foreground/70 mb-4 block">The Atelier</span>
              <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">Mastery in Every Detail</h2>
              <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
                Since 1924, Lumière has been synonymous with uncompromising quality. Every piece that leaves our atelier represents hundreds of hours of meticulous craftsmanship, blending traditional techniques with contemporary vision.
              </p>
              <Button variant="outline" className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary rounded-none tracking-widest uppercase text-xs px-8 h-12" asChild>
                <Link href="/about">Discover Our Heritage</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif mb-4">Exceptional Pieces</h2>
              <p className="text-muted-foreground mx-auto max-w-xl text-center">
                A selection of our most iconic designs, celebrated for their brilliance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {featuredProducts.slice(0, 3).map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-serif mb-4">Private Previews & Offers</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Receive new arrival previews, bridal collection notes, and seasonal offer updates.
          </p>
          <NewsletterSignup />
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">From Our Instagram</h2>
            <p className="text-muted-foreground mx-auto max-w-xl text-center">
              A glimpse into bridal styling, atelier details, and everyday heirlooms.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["hero.png", "gold-ring.png", "diamond-earrings.png", "collection-bridal.png"].map((image) => (
              <Link key={image} href="/gallery" className="aspect-square overflow-hidden bg-muted">
                <img src={`/images/${image}`} alt="Jewellery gallery preview" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
