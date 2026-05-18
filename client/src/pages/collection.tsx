import { useParams, Link } from "wouter";
import { useListProducts, useGetCollectionsSummary } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Loader2 } from "lucide-react";

export function Collection() {
  const { slug } = useParams<{ slug: string }>();

  const { data: collectionsSummary } = useGetCollectionsSummary();
  
  const collection = collectionsSummary?.collections.find(c => c.slug === slug);

  const { data: products, isLoading } = useListProducts({ category: slug });

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative h-[40vh] w-full flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={collection?.imageUrl || `/images/collection-${slug}.png`}
            alt={collection?.name || "Collection"}
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/hero-new.png";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <Link href="/shop" className="text-sm tracking-[0.2em] uppercase text-white/70 hover:text-white mb-4 block">
            Back to Collections
          </Link>
          <h1 className="text-4xl md:text-6xl font-serif mb-4">
            {collection?.name || slug?.replace("-", " ")}
          </h1>
          {collection?.description && (
            <p className="max-w-xl mx-auto text-white/80">{collection.description}</p>
          )}
        </div>
      </section>

      <section className="py-24 container mx-auto px-4 md:px-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-24">
            <h3 className="text-xl font-serif mb-2">Collection empty</h3>
            <p className="text-muted-foreground">There are currently no pieces in this collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
