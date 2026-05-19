import type { Request, Response } from "express";
import { Product } from "../models/product.model.js";
import { WishlistItem } from "../models/wishlist.model.js";

const DEFAULT_SESSION = "default-session";

async function formatWishlistItem(item: { id?: number | null; productId: number; addedAt?: Date; createdAt?: Date }) {
  const product = await Product.findOne({ id: item.productId }).lean();
  return {
    id: item.id ?? 0,
    productId: item.productId,
    productName: product?.name ?? "",
    productImage: product?.images?.[0] ?? null,
    price: product?.price ?? 0,
    inStock: product?.inStock ?? false,
    addedAt: (item.addedAt ?? item.createdAt ?? new Date()).toISOString(),
  };
}

export async function getWishlist(req: Request, res: Response) {
  const sessionId =
    typeof req.query.sessionId === "string" && req.query.sessionId.trim()
      ? req.query.sessionId
      : DEFAULT_SESSION;
  const items = await WishlistItem.find({ sessionId }).lean();
  res.json(await Promise.all(items.map(formatWishlistItem)));
}

export async function addWishlistItem(req: Request, res: Response) {
  const productId = Number(req.body.productId);
  const sessionId = req.body.sessionId || DEFAULT_SESSION;
  const product = await Product.findOne({ id: productId }).lean();

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const item =
    (await WishlistItem.findOne({ sessionId, productId })) ||
    (await WishlistItem.create({ sessionId, productId }));

  res.status(201).json(await formatWishlistItem(item));
}

export async function removeWishlistItem(req: Request, res: Response) {
  await WishlistItem.deleteOne({ id: Number(req.params.id) });
  res.status(204).send();
}
