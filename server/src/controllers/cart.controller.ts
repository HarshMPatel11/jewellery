import type { Request, Response } from "express";
import { CartItem } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

const DEFAULT_SESSION = "default-session";

function sessionFromQuery(value: unknown) {
  return typeof value === "string" && value.trim() ? value : DEFAULT_SESSION;
}

async function formatCartItem(item: { id?: number | null; productId: number; quantity: number; price: number }) {
  const product = await Product.findOne({ id: item.productId }).lean();
  return {
    id: item.id ?? 0,
    productId: item.productId,
    productName: product?.name ?? "",
    productImage: product?.images?.[0] ?? null,
    quantity: item.quantity,
    price: item.price,
  };
}

export async function getCart(req: Request, res: Response) {
  const sessionId = sessionFromQuery(req.query.sessionId);
  const items = await CartItem.find({ sessionId }).lean();
  const cartItems = await Promise.all(items.map(formatCartItem));
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  res.json({ id: sessionId, items: cartItems, total, itemCount });
}

export async function addCartItem(req: Request, res: Response) {
  const productId = Number(req.body.productId);
  const quantity = Number(req.body.quantity) || 1;
  const sessionId = req.body.sessionId || DEFAULT_SESSION;
  const product = await Product.findOne({ id: productId });

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const existing = await CartItem.findOne({ sessionId, productId });
  const item = existing
    ? await CartItem.findOneAndUpdate(
        { id: existing.id },
        { quantity: existing.quantity + quantity },
        { new: true },
      )
    : await CartItem.create({
        sessionId,
        productId,
        quantity,
        price: product.salePrice ?? product.price,
      });

  res.status(201).json(await formatCartItem(item!));
}

export async function updateCartItem(req: Request, res: Response) {
  const id = Number(req.params.id);
  const quantity = Number(req.body.quantity);
  const item = await CartItem.findOneAndUpdate({ id }, { quantity }, { new: true });

  if (!item) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(await formatCartItem(item));
}

export async function removeCartItem(req: Request, res: Response) {
  await CartItem.deleteOne({ id: Number(req.params.id) });
  res.status(204).send();
}
