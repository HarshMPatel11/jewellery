import { Router } from "express";
import { createOrder, getOrder, listOrders, validateCoupon } from "../controllers/order.controller";

const router = Router();

router.get("/orders", listOrders);
router.post("/orders", createOrder);
router.post("/coupons/validate", validateCoupon);
router.get("/orders/:id", getOrder);

export default router;
