import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

import { Home } from "@/pages/home";
import { Shop } from "@/pages/shop";
import { ProductDetail } from "@/pages/product-detail";
import { Collection } from "@/pages/collection";
import { Cart } from "@/pages/cart";
import { Wishlist } from "@/pages/wishlist";
import { Orders } from "@/pages/orders";
import { OrderDetail } from "@/pages/order-detail";
import { About } from "@/pages/about";
import { Contact } from "@/pages/contact";
import { Compare } from "@/pages/compare";
import { OrderTracking } from "@/pages/order-tracking";
import { StaticPage } from "@/pages/static-page";
import { ReturnRequest } from "@/pages/return-request";
import { Admin } from "@/pages/admin";
import { Account } from "@/pages/account";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/shop/:id" component={ProductDetail} />
          <Route path="/collections/:slug" component={Collection} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Cart} />
          <Route path="/wishlist" component={Wishlist} />
          <Route path="/orders" component={Orders} />
          <Route path="/orders/:id" component={OrderDetail} />
          <Route path="/track-order" component={OrderTracking} />
          <Route path="/compare" component={Compare} />
          <Route path="/offers">{() => <StaticPage page="offers" />}</Route>
          <Route path="/gallery">{() => <StaticPage page="gallery" />}</Route>
          <Route path="/blog">{() => <StaticPage page="blog" />}</Route>
          <Route path="/faq">{() => <StaticPage page="faq" />}</Route>
          <Route path="/privacy">{() => <StaticPage page="privacy" />}</Route>
          <Route path="/terms">{() => <StaticPage page="terms" />}</Route>
          <Route path="/shipping">{() => <StaticPage page="shipping" />}</Route>
          <Route path="/returns">{() => <StaticPage page="returns" />}</Route>
          <Route path="/return-request" component={ReturnRequest} />
          <Route path="/account" component={Account} />
          <Route path="/admin" component={Admin} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
