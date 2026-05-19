import { Router } from "express";
import { createOrder, getOrder, listOrders, updateOrder, validateCoupon } from "../controllers/order.controller";

const router = Router();

router.get("/orders", listOrders);
router.post("/orders", createOrder);
router.post("/coupons/validate", validateCoupon);
router.get("/orders/:id", getOrder);
router.patch("/orders/:id", updateOrder);

export default router;
