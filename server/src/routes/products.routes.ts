import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductReviews,
  listFlaggedProducts,
  listProducts,
  updateProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/products", listProducts);
router.post("/products", createProduct);
router.get("/products/featured", (req, res) => listFlaggedProducts("isFeatured", req, res));
router.get("/products/new-arrivals", (req, res) => listFlaggedProducts("isNewArrival", req, res));
router.get("/products/best-sellers", (req, res) => listFlaggedProducts("isBestSeller", req, res));
router.get("/products/trending", (req, res) => listFlaggedProducts("isTrending", req, res));
router.get("/products/:id", getProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/products/:id/reviews", getProductReviews);

export default router;
