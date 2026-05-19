import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { clearCompareIds, getCompareIds } from "@/lib/compare";

export function Compare() {
  const [compareIds, setCompareIds] = useState<number[]>(getCompareIds());
  const { data: products } = useListProducts({ limit: 100 });

  useEffect(() => {
    const update = () => setCompareIds(getCompareIds());
    window.addEventListener("compare-products-updated", update);
    return () => window.removeEventListener("compare-products-updated", update);
  }, []);

  const comparedProducts = products?.filter((product) => compareIds.includes(product.id)) ?? [];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(price);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-wrap justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-serif mb-4">Compare Products</h1>
          <p className="text-muted-foreground max-w-2xl">Review materials, purity, weight, stones, stock, and price across saved pieces.</p>
        </div>
        {comparedProducts.length > 0 && (
          <Button variant="outline" className="rounded-none" onClick={clearCompareIds}>
            Clear Compare
          </Button>
        )}
      </div>

      {comparedProducts.length === 0 ? (
        <div className="text-center py-20 bg-muted/30">
          <h2 className="font-serif text-2xl mb-3">No products selected</h2>
          <p className="text-muted-foreground mb-8">Add pieces from the collection to compare them here.</p>
          <Button variant="outline" className="rounded-none" asChild>
            <Link href="/shop">Browse Collection</Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border">
            <thead>
              <tr className="bg-muted/30">
                <th className="p-4 text-left font-serif">Detail</th>
                {comparedProducts.map((product) => (
                  <th key={product.id} className="p-4 text-left font-serif">{product.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                ["Price", (p: any) => formatPrice(p.salePrice ?? p.price)],
                ["Category", (p: any) => p.categoryName ?? "-"],
                ["Material", (p: any) => p.material ?? "-"],
                ["Gold Purity", (p: any) => p.goldPurity ?? "-"],
                ["Weight", (p: any) => p.weight ? `${p.weight}g` : "-"],
                ["Stone", (p: any) => p.stoneType ?? "-"],
                ["Hallmark", (p: any) => p.hallmark ?? "-"],
                ["Stock", (p: any) => p.inStock ? "In stock" : "Out of stock"],
              ].map(([label, getValue]) => (
                <tr key={label as string} className="border-t">
                  <td className="p-4 font-medium">{label as string}</td>
                  {comparedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-muted-foreground">{(getValue as (product: any) => string)(product)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
