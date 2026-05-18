import { useLocation, useParams } from "wouter";
import { useGetProduct, useGetProductReviews, useAddCartItem, useAddWishlistItem, useCreateReview, useCreateInquiry, useListProducts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { GitCompare, Loader2, Heart, MessageCircle, Send } from "lucide-react";
import { getSessionId } from "@/lib/session";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toggleCompareId } from "@/lib/compare";
import { ProductCard } from "@/components/product-card";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0", 10);
  const sessionId = getSessionId();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [quantity, setQuantity] = useState(1);
  
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewComment, setReviewComment] = useState("");
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");

  const { data: product, isLoading } = useGetProduct(productId, { 
    query: { enabled: !!productId, queryKey: ["product", productId] } 
  });

  const { data: reviews } = useGetProductReviews(productId, {
    query: { enabled: !!productId, queryKey: ["reviews", productId] }
  });

  const { data: relatedProducts } = useListProducts(
    { category: product?.categoryName?.toLowerCase().replace(/\s+/g, "-"), limit: 4 },
    { query: { enabled: !!product?.categoryName, queryKey: ["related-products", product?.categoryName] } }
  );

  const addToCart = useAddCartItem();
  const addToWishlist = useAddWishlistItem();
  const submitReview = useCreateReview();
  const submitInquiry = useCreateInquiry();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart.mutate(
      { data: { productId, quantity, sessionId } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
          toast({
            title: "Added to Bag",
            description: `${product?.name} has been added to your bag.`,
          });
        },
      }
    );
  };

  const handleBuyNow = () => {
    addToCart.mutate(
      { data: { productId, quantity, sessionId } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
          setLocation("/cart");
        },
      }
    );
  };

  const handleCompare = () => {
    const ids = toggleCompareId(productId);
    toast({
      title: ids.includes(productId) ? "Added to Compare" : "Removed from Compare",
      description: "You can compare saved pieces from the compare page.",
    });
  };

  const handleAddToWishlist = () => {
    addToWishlist.mutate(
      { data: { productId, sessionId } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["wishlist", sessionId] });
          toast({
            title: "Saved to Wishlist",
            description: `${product?.name} has been saved.`,
          });
        },
      }
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview.mutate(
      { data: { productId, customerName: reviewName, rating: parseInt(reviewRating, 10), comment: reviewComment } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
          toast({
            title: "Review Submitted",
            description: "Thank you for your feedback.",
          });
          setReviewName("");
          setReviewComment("");
          setReviewRating("5");
        }
      }
    );
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInquiry.mutate(
      {
        data: {
          name: inquiryName,
          email: inquiryEmail,
          phone: inquiryPhone,
          productId,
          message: inquiryMessage || `I would like to know more about ${product?.name}.`,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Inquiry Sent", description: "Our team will contact you shortly." });
          setInquiryName("");
          setInquiryEmail("");
          setInquiryPhone("");
          setInquiryMessage("");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-24">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-muted relative overflow-hidden">
            <img 
              src={product.images?.[0] || "/images/placeholder.png"} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNewArrival && <Badge variant="secondary" className="bg-background/90 rounded-none">New</Badge>}
              {!product.inStock && <Badge variant="destructive" className="rounded-none">Out of Stock</Badge>}
            </div>
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="aspect-square bg-muted">
                  <img src={img} alt={`${product.name} ${i+2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="mb-2 text-sm text-muted-foreground uppercase tracking-wider">{product.categoryName}</div>
          <h1 className="text-4xl font-serif mb-4">{product.name}</h1>
          <div className="text-2xl mb-6">
            {product.salePrice ? (
              <div className="flex gap-4 items-center">
                <span className="text-muted-foreground line-through">{formatPrice(product.price)}</span>
                <span className="text-primary font-medium">{formatPrice(product.salePrice)}</span>
              </div>
            ) : (
              <span>{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="prose prose-sm text-muted-foreground mb-8">
            <p>{product.shortDescription || product.description}</p>
          </div>

          <div className="space-y-6 mb-8">
            {product.sku && (
              <div className="flex justify-between border-b pb-2 text-sm">
                <span className="text-muted-foreground">SKU</span>
                <span className="font-medium">{product.sku}</span>
              </div>
            )}
            {product.material && (
              <div className="flex justify-between border-b pb-2 text-sm">
                <span className="text-muted-foreground">Material</span>
                <span className="font-medium">{product.material}</span>
              </div>
            )}
            {product.goldPurity && (
              <div className="flex justify-between border-b pb-2 text-sm">
                <span className="text-muted-foreground">Gold Purity</span>
                <span className="font-medium">{product.goldPurity}</span>
              </div>
            )}
            {product.stoneType && (
              <div className="flex justify-between border-b pb-2 text-sm">
                <span className="text-muted-foreground">Stone</span>
                <span className="font-medium">{product.stoneType}</span>
              </div>
            )}
            {product.diamondDetails && (
              <div className="flex justify-between border-b pb-2 text-sm">
                <span className="text-muted-foreground">Diamond Details</span>
                <span className="font-medium text-right">{product.diamondDetails}</span>
              </div>
            )}
            {product.makingCharges != null && (
              <div className="flex justify-between border-b pb-2 text-sm">
                <span className="text-muted-foreground">Making Charges</span>
                <span className="font-medium">{formatPrice(product.makingCharges)}</span>
              </div>
            )}
            {product.hallmark && (
              <div className="flex justify-between border-b pb-2 text-sm">
                <span className="text-muted-foreground">Hallmark</span>
                <span className="font-medium">{product.hallmark}</span>
              </div>
            )}
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="mb-8">
              <h3 className="font-serif text-lg mb-3">Available Variants</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.variants.map((variant, index) => (
                  <div key={index} className="border p-3 text-sm">
                    {variant.size && <div>Size: {variant.size}</div>}
                    {variant.weight != null && <div>Weight: {variant.weight}g</div>}
                    {variant.color && <div>Color: {variant.color}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 mb-8">
            <div className="w-24">
              <Select value={quantity.toString()} onValueChange={(v) => setQuantity(parseInt(v, 10))}>
                <SelectTrigger className="rounded-none h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(n => (
                    <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="flex-1 rounded-none h-12 text-sm tracking-wider uppercase font-medium" 
              onClick={handleAddToCart}
              disabled={!product.inStock || addToCart.isPending}
            >
              {addToCart.isPending ? "Adding..." : "Add to Bag"}
            </Button>
            <Button 
              variant="outline"
              className="flex-1 rounded-none h-12 text-sm tracking-wider uppercase font-medium" 
              onClick={handleBuyNow}
              disabled={!product.inStock || addToCart.isPending}
            >
              Buy Now
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-none"
              onClick={handleAddToWishlist}
              disabled={addToWishlist.isPending}
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-none"
              onClick={handleCompare}
            >
              <GitCompare className="h-5 w-5" />
            </Button>
          </div>

          <div className="pt-8 mt-auto border-t">
            <Button variant="link" className="px-0 text-muted-foreground hover:text-primary h-auto font-normal" asChild>
              <a href={`https://wa.me/1234567890?text=I'm interested in the ${product.name} (SKU: ${product.sku})`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-2" />
                Inquire via WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="max-w-4xl mx-auto">
        <TabsList className="w-full justify-start rounded-none border-b h-auto p-0 bg-transparent mb-8">
          <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-4 pt-2">Product Details</TabsTrigger>
          <TabsTrigger value="shipping" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-4 pt-2">Shipping & Returns</TabsTrigger>
          <TabsTrigger value="inquiry" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-4 pt-2">Inquiry</TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-4 pt-2">Reviews ({product.reviewCount || 0})</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4 text-muted-foreground">
          <p>Every piece of Lumière jewellery is an expression of extraordinary craftsmanship. Our master jewelers spend hundreds of hours perfecting the intricate details, ensuring that each creation not only meets but exceeds the highest standards of luxury.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Handcrafted in our Paris atelier</li>
            <li>Ethically sourced materials</li>
            <li>Includes certificate of authenticity</li>
            <li>Presented in signature Lumière packaging</li>
          </ul>
        </TabsContent>
        <TabsContent value="shipping" className="space-y-4 text-muted-foreground">
          <p><strong>Complimentary Secure Delivery</strong></p>
          <p>All orders are shipped via secure, insured courier service. A signature is required upon delivery to ensure your exceptional piece arrives safely.</p>
          <p><strong>Returns & Exchanges</strong></p>
          <p>We accept returns or exchanges within 30 days of delivery, provided the piece is in its original, unworn condition with all documentation and packaging intact. Custom and engraved pieces are final sale.</p>
        </TabsContent>
        <TabsContent value="inquiry">
          <form onSubmit={handleInquirySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-8">
            <div>
              <Label htmlFor="inquiry-name">Name</Label>
              <Input id="inquiry-name" required value={inquiryName} onChange={(event) => setInquiryName(event.target.value)} className="rounded-none bg-background" />
            </div>
            <div>
              <Label htmlFor="inquiry-email">Email</Label>
              <Input id="inquiry-email" type="email" required value={inquiryEmail} onChange={(event) => setInquiryEmail(event.target.value)} className="rounded-none bg-background" />
            </div>
            <div>
              <Label htmlFor="inquiry-phone">Phone</Label>
              <Input id="inquiry-phone" value={inquiryPhone} onChange={(event) => setInquiryPhone(event.target.value)} className="rounded-none bg-background" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="inquiry-message">Message</Label>
              <Textarea id="inquiry-message" value={inquiryMessage} onChange={(event) => setInquiryMessage(event.target.value)} className="rounded-none bg-background" rows={4} />
            </div>
            <Button type="submit" className="md:col-span-2 rounded-none tracking-widest uppercase text-xs" disabled={submitInquiry.isPending}>
              {submitInquiry.isPending ? "Sending..." : "Send Inquiry"} <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="reviews">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-serif text-2xl mb-6">Customer Reviews</h3>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-primary">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < review.rating ? "text-primary" : "text-muted"}>★</span>
                          ))}
                        </div>
                        <span className="font-medium text-sm">{review.customerName}</span>
                      </div>
                      {review.comment && <p className="text-muted-foreground text-sm">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet for this piece.</p>
              )}
            </div>
            
            <div className="bg-muted/30 p-8">
              <h3 className="font-serif text-xl mb-6">Leave a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" required value={reviewName} onChange={(e) => setReviewName(e.target.value)} className="rounded-none bg-background" />
                </div>
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Select value={reviewRating} onValueChange={setReviewRating}>
                    <SelectTrigger className="rounded-none bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Stars - Exceptional</SelectItem>
                      <SelectItem value="4">4 Stars - Very Good</SelectItem>
                      <SelectItem value="3">3 Stars - Good</SelectItem>
                      <SelectItem value="2">2 Stars - Fair</SelectItem>
                      <SelectItem value="1">1 Star - Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="comment">Review (Optional)</Label>
                  <Textarea id="comment" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} className="rounded-none bg-background" rows={4} />
                </div>
                <Button type="submit" className="w-full rounded-none tracking-widest uppercase text-xs" disabled={submitReview.isPending}>
                  {submitReview.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {relatedProducts && relatedProducts.filter((item) => item.id !== product.id).length > 0 && (
        <section className="mt-24">
          <h2 className="text-3xl font-serif mb-8 text-center">Related Pieces</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.filter((item) => item.id !== product.id).slice(0, 4).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
