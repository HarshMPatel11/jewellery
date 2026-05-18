import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const pageContent = {
  offers: {
    title: "Offers",
    intro: "Seasonal jewellery privileges and private collection offers.",
    sections: [
      ["Bridal Preview", "Book a bridal consultation and receive complimentary styling support for your trousseau selection."],
      ["New Arrival Access", "Newsletter members receive early previews of limited pieces and curated collections."],
      ["Fine Jewellery Care", "Select high jewellery orders include a complimentary annual inspection."],
    ],
  },
  gallery: {
    title: "Gallery",
    intro: "A visual journal of our collections, details, and bridal moments.",
    sections: [],
  },
  blog: {
    title: "Journal",
    intro: "Guides and stories from the atelier.",
    sections: [
      ["Choosing Bridal Jewellery", "Balance heirloom character with pieces that feel natural through the full celebration."],
      ["Gold Purity Guide", "Understand karat, finish, and daily-wear durability before selecting a piece."],
      ["Diamond Details", "Cut, clarity, color, and setting style all shape the brilliance of a finished jewel."],
    ],
  },
  faq: {
    title: "FAQ",
    intro: "Answers to common questions about orders, care, and appointments.",
    sections: [
      ["Do you support guest checkout?", "Yes. Customers can place orders without creating an account."],
      ["Can I inquire before ordering?", "Yes. Product detail pages include inquiry and WhatsApp contact options."],
      ["Are returns available?", "Eligible unworn pieces can be returned according to the return policy."],
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro: "We collect only the information needed to manage inquiries, orders, newsletter subscriptions, and customer support.",
    sections: [
      ["Customer Data", "Order and inquiry details are used to fulfil purchases and respond to service requests."],
      ["Newsletter", "Newsletter emails are stored for collection updates and can be removed on request."],
      ["Security", "Production deployments should use SSL and protected database credentials."],
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro: "Website usage and orders are subject to availability, pricing confirmation, and order acceptance.",
    sections: [
      ["Product Details", "Weights, stones, and making charges may vary slightly for handcrafted pieces."],
      ["Orders", "Orders are confirmed after customer details and stock availability are verified."],
      ["Custom Pieces", "Custom or engraved jewellery may be final sale."],
    ],
  },
  shipping: {
    title: "Shipping Policy",
    intro: "Orders are shipped through secure courier partners with delivery tracking where available.",
    sections: [
      ["Secure Delivery", "High-value jewellery should be shipped insured and delivered with signature confirmation."],
      ["Processing", "Processing time depends on stock status and customization requirements."],
      ["Charges", "Shipping charges can be configured from backend environment settings."],
    ],
  },
  returns: {
    title: "Return & Refund Policy",
    intro: "Eligible products can be reviewed for return or exchange when unworn and returned with original packaging.",
    sections: [
      ["Return Window", "Return requests should be raised promptly after delivery."],
      ["Inspection", "Returned pieces are inspected before refund or exchange confirmation."],
      ["Exclusions", "Customized, resized, engraved, or damaged pieces may not qualify."],
    ],
  },
  account: {
    title: "My Account",
    intro: "A lightweight customer dashboard for order access and support links.",
    sections: [
      ["Order History", "View placed orders and status updates from the order history page."],
      ["Wishlist", "Save pieces to revisit before placing an order."],
      ["Support", "Use contact and product inquiry forms for account or order help."],
    ],
  },
} as const;

type StaticPageKey = keyof typeof pageContent;

export function StaticPage({ page }: { page: StaticPageKey }) {
  const content = pageContent[page];
  const isGallery = page === "gallery";

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl font-serif mb-4">{content.title}</h1>
        <p className="text-muted-foreground text-lg">{content.intro}</p>
      </div>

      {isGallery ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {["hero.png", "hero-new.png", "gold-ring.png", "diamond-earrings.png", "collection-gold.png", "collection-diamond.png", "collection-silver.png", "collection-bridal.png"].map((image) => (
            <div key={image} className="aspect-[4/5] overflow-hidden bg-muted">
              <img src={`/images/${image}`} alt="Jewellery gallery" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.sections.map(([title, body]) => (
            <div key={title} className="border p-6 bg-card">
              <h2 className="font-serif text-xl mb-3">{title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      )}

      {page === "account" && (
        <div className="mt-10 flex flex-wrap gap-3">
          <Button className="rounded-none" asChild>
            <Link href="/orders">Order History</Link>
          </Button>
          <Button variant="outline" className="rounded-none" asChild>
            <Link href="/wishlist">Wishlist</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
