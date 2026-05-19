import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Product = {
  id: number;
  name: string;
  sku?: string | null;
  price: number;
  salePrice?: number | null;
  categoryName?: string | null;
  stockCount?: number | null;
  inStock: boolean;
};

type Category = { id: number; name: string; slug: string; productCount: number };
type Order = { id: number; status: string; total: number; customerName?: string; createdAt: string };
type Inquiry = { id: number; name: string; email: string; productId?: number | null; message: string; createdAt: string };
type ReturnRequest = { id: number; orderId: number; customerName: string; status: string; reason: string; createdAt: string };

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load ${url}`);
  return response.json();
}

export function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productForm, setProductForm] = useState({
    name: "",
    sku: "",
    price: "",
    categoryId: "",
    image: "",
    stockCount: "10",
    shortDescription: "",
  });
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "", description: "" });

  const revenue = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders]);

  async function refresh() {
    setIsLoading(true);
    const [nextProducts, nextCategories, nextOrders, nextInquiries, nextReturnRequests] = await Promise.all([
      getJson<Product[]>("/api/products?limit=100"),
      getJson<Category[]>("/api/categories"),
      getJson<Order[]>("/api/orders"),
      getJson<Inquiry[]>("/api/inquiries"),
      getJson<ReturnRequest[]>("/api/return-requests"),
    ]);
    setProducts(nextProducts);
    setCategories(nextCategories);
    setOrders(nextOrders);
    setInquiries(nextInquiries);
    setReturnRequests(nextReturnRequests);
    setIsLoading(false);
  }

  useEffect(() => {
    refresh().catch(() => setIsLoading(false));
  }, []);

  async function createCategory(event: React.FormEvent) {
    event.preventDefault();
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryForm),
    });
    setCategoryForm({ name: "", slug: "", description: "" });
    refresh();
  }

  async function createProduct(event: React.FormEvent) {
    event.preventDefault();
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: productForm.name,
        sku: productForm.sku,
        price: Number(productForm.price),
        categoryId: Number(productForm.categoryId),
        images: productForm.image ? [productForm.image] : [],
        stockCount: Number(productForm.stockCount),
        inStock: Number(productForm.stockCount) > 0,
        shortDescription: productForm.shortDescription,
        isNewArrival: true,
      }),
    });
    setProductForm({ name: "", sku: "", price: "", categoryId: "", image: "", stockCount: "10", shortDescription: "" });
    refresh();
  }

  async function updateOrderStatus(orderId: number, status: string) {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    refresh();
  }

  async function updateReturnStatus(requestId: number, status: string) {
    await fetch(`/api/return-requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    refresh();
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage products, categories, orders, inquiries, returns, stock, and sales snapshots.</p>
        </div>
        <Button variant="outline" className="rounded-none" asChild>
          <Link href="/shop">View Store</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          ["Products", products.length],
          ["Categories", categories.length],
          ["Orders", orders.length],
          ["Inquiries", inquiries.length],
          ["Sales", formatPrice(revenue)],
        ].map(([label, value]) => (
          <div key={label} className="border bg-card p-4">
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="mt-1 text-2xl font-medium">{value}</div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">Loading admin data...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <section className="xl:col-span-2 space-y-8">
            <div>
              <h2 className="font-serif text-2xl mb-4">Orders</h2>
              <div className="border divide-y">
                {orders.map((order) => (
                  <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <Link href={`/orders/${order.id}`} className="font-medium hover:underline">Order #{String(order.id).padStart(6, "0")}</Link>
                      <div className="text-sm text-muted-foreground">{order.customerName || "Guest"} · {formatPrice(order.total)}</div>
                    </div>
                    <select value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value)} className="h-9 border bg-background px-2 text-sm">
                      {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                ))}
                {orders.length === 0 && <div className="p-6 text-muted-foreground">No orders yet.</div>}
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl mb-4">Products & Inventory</h2>
              <div className="border divide-y">
                {products.map((product) => (
                  <div key={product.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 p-4">
                    <div>
                      <Link href={`/shop/${product.id}`} className="font-medium hover:underline">{product.name}</Link>
                      <div className="text-sm text-muted-foreground">
                        {product.sku || "No SKU"} · {product.categoryName || "Uncategorized"} · {formatPrice(product.salePrice ?? product.price)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={product.inStock ? "outline" : "destructive"} className="rounded-none">
                        {product.inStock ? `${product.stockCount ?? 0} in stock` : "Out of stock"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="font-serif text-2xl mb-4">Customer Inquiries</h2>
                <div className="border divide-y">
                  {inquiries.slice(0, 6).map((inquiry) => (
                    <div key={inquiry.id} className="p-4">
                      <div className="font-medium">{inquiry.name}</div>
                      <div className="text-sm text-muted-foreground">{inquiry.email}{inquiry.productId ? ` · Product #${inquiry.productId}` : ""}</div>
                      <p className="mt-2 text-sm">{inquiry.message}</p>
                    </div>
                  ))}
                  {inquiries.length === 0 && <div className="p-6 text-muted-foreground">No inquiries yet.</div>}
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl mb-4">Return Requests</h2>
                <div className="border divide-y">
                  {returnRequests.map((request) => (
                    <div key={request.id} className="p-4 space-y-3">
                      <div className="flex justify-between gap-3">
                        <div>
                          <div className="font-medium">Order #{String(request.orderId).padStart(6, "0")}</div>
                          <div className="text-sm text-muted-foreground">{request.customerName}</div>
                        </div>
                        <select value={request.status} onChange={(event) => updateReturnStatus(request.id, event.target.value)} className="h-9 border bg-background px-2 text-sm">
                          {["requested", "reviewing", "approved", "rejected", "completed"].map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </div>
                      <p className="text-sm text-muted-foreground">{request.reason}</p>
                    </div>
                  ))}
                  {returnRequests.length === 0 && <div className="p-6 text-muted-foreground">No return requests yet.</div>}
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-8">
            <form onSubmit={createProduct} className="border bg-muted/30 p-6 space-y-4">
              <h2 className="font-serif text-2xl">Add Product</h2>
              <div>
                <Label htmlFor="product-name">Name</Label>
                <Input id="product-name" required value={productForm.name} onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))} className="rounded-none bg-background" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" value={productForm.sku} onChange={(event) => setProductForm((current) => ({ ...current, sku: event.target.value }))} className="rounded-none bg-background" />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" required type="number" value={productForm.price} onChange={(event) => setProductForm((current) => ({ ...current, price: event.target.value }))} className="rounded-none bg-background" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select id="category" required value={productForm.categoryId} onChange={(event) => setProductForm((current) => ({ ...current, categoryId: event.target.value }))} className="h-10 w-full border border-input bg-background px-3 text-sm">
                    <option value="">Select</option>
                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" value={productForm.stockCount} onChange={(event) => setProductForm((current) => ({ ...current, stockCount: event.target.value }))} className="rounded-none bg-background" />
                </div>
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" value={productForm.image} onChange={(event) => setProductForm((current) => ({ ...current, image: event.target.value }))} placeholder="/images/gold-ring.png" className="rounded-none bg-background" />
              </div>
              <div>
                <Label htmlFor="short-description">Short Description</Label>
                <Textarea id="short-description" value={productForm.shortDescription} onChange={(event) => setProductForm((current) => ({ ...current, shortDescription: event.target.value }))} className="rounded-none bg-background" />
              </div>
              <Button type="submit" className="w-full rounded-none">Create Product</Button>
            </form>

            <form onSubmit={createCategory} className="border bg-muted/30 p-6 space-y-4">
              <h2 className="font-serif text-2xl">Add Category</h2>
              <div>
                <Label htmlFor="category-name">Name</Label>
                <Input id="category-name" required value={categoryForm.name} onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))} className="rounded-none bg-background" />
              </div>
              <div>
                <Label htmlFor="category-slug">Slug</Label>
                <Input id="category-slug" required value={categoryForm.slug} onChange={(event) => setCategoryForm((current) => ({ ...current, slug: event.target.value }))} className="rounded-none bg-background" />
              </div>
              <div>
                <Label htmlFor="category-description">Description</Label>
                <Textarea id="category-description" value={categoryForm.description} onChange={(event) => setCategoryForm((current) => ({ ...current, description: event.target.value }))} className="rounded-none bg-background" />
              </div>
              <Button type="submit" variant="outline" className="w-full rounded-none">Create Category</Button>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}
