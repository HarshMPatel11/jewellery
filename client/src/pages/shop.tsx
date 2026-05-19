import { useState } from "react";
import { Link, useSearch } from "wouter";
import { ProductCard } from "@/components/product-card";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function Shop() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  
  const [category, setCategory] = useState<string>(searchParams.get("category") || "");
  const [search, setSearch] = useState<string>(searchParams.get("search") || "");
  const [inStock, setInStock] = useState<boolean>(searchParams.get("inStock") === "true");
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);

  const { data: categories } = useListCategories();
  
  const params = {
    category: (category && category !== "__all") ? category : undefined,
    search: search || undefined,
    inStock: inStock ? true : undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 100000 ? priceRange[1] : undefined,
  };

  const { data: products, isLoading } = useListProducts(params);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-serif mb-4">The Collection</h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore our complete range of exquisite jewellery. Each piece is crafted to perfection, embodying our legacy of elegance and artistry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="md:col-span-1 space-y-8">
          <div>
            <h3 className="font-serif text-lg mb-4">Search</h3>
            <Input 
              type="text" 
              placeholder="Search pieces..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-none border-border focus-visible:ring-primary"
            />
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4">Category</h3>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="rounded-none">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4">Price Range</h3>
            <Slider
              defaultValue={[0, 100000]}
              max={100000}
              step={1000}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mb-4"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1] === 100000 ? '100k+' : priceRange[1]}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="in-stock" 
              checked={inStock}
              onCheckedChange={setInStock}
            />
            <Label htmlFor="in-stock">In Stock Only</Label>
          </div>

          <Button 
            variant="outline" 
            className="w-full rounded-none"
            onClick={() => {
              setCategory("");
              setSearch("");
              setInStock(false);
              setPriceRange([0, 100000]);
            }}
          >
            Clear Filters
          </Button>
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-24 bg-muted/30">
              <h3 className="text-xl font-serif mb-2">No pieces found</h3>
              <p className="text-muted-foreground">We couldn't find any jewellery matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
