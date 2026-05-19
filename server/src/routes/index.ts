import { Router } from "express";
import cartRoutes from "./cart.routes.js";
import categoriesRoutes from "./categories.routes.js";
import collectionsRoutes from "./collections.routes.js";
import inquiriesRoutes from "./inquiries.routes.js";
import newsletterRoutes from "./newsletter.routes.js";
import ordersRoutes from "./orders.routes.js";
import productsRoutes from "./products.routes.js";
import reviewsRoutes from "./reviews.routes.js";
import returnRequestsRoutes from "./return-requests.routes.js";
import wishlistRoutes from "./wishlist.routes.js";

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
