import { Schema, model } from "mongoose";
import { nextSequence } from "./counter.model.js";

const cartItemSchema = new Schema(
  {
    id: { type: Number, unique: true, index: true },
    sessionId: { type: String, required: true, index: true },
    productId: { type: Number, required: true, index: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

cartItemSchema.index({ sessionId: 1, productId: 1 }, { unique: true });

cartItemSchema.pre("save", async function assignId(next) {
  if (this.isNew && this.id == null) {
    this.id = await nextSequence("cartItems");
  }
  next();
});

export const CartItem = model("CartItem", cartItemSchema);
