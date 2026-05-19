import { Router } from "express";
import { addCartItem, getCart, removeCartItem, updateCartItem } from "../controllers/cart.controller.js";

const router = Router();

router.get("/cart", getCart);
router.post("/cart/items", addCartItem);
router.patch("/cart/items/:id", updateCartItem);
router.delete("/cart/items/:id", removeCartItem);

export default router;
