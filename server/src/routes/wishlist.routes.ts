import { Router } from "express";
import { addWishlistItem, getWishlist, removeWishlistItem } from "../controllers/wishlist.controller.js";

const router = Router();

router.get("/wishlist", getWishlist);
router.post("/wishlist/items", addWishlistItem);
router.delete("/wishlist/items/:id", removeWishlistItem);

export default router;
