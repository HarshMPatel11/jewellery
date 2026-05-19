import { Router } from "express";
import cartRoutes from "./cart.routes";
import categoriesRoutes from "./categories.routes";
import collectionsRoutes from "./collections.routes";
import inquiriesRoutes from "./inquiries.routes";
import newsletterRoutes from "./newsletter.routes";
import ordersRoutes from "./orders.routes";
import productsRoutes from "./products.routes";
import reviewsRoutes from "./reviews.routes";
import returnRequestsRoutes from "./return-requests.routes";
import wishlistRoutes from "./wishlist.routes";

const router = Router();

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

router.use(productsRoutes);
router.use(categoriesRoutes);
router.use(cartRoutes);
router.use(wishlistRoutes);
router.use(ordersRoutes);
router.use(reviewsRoutes);
router.use(inquiriesRoutes);
router.use(returnRequestsRoutes);
router.use(newsletterRoutes);
router.use(collectionsRoutes);

export default router;
