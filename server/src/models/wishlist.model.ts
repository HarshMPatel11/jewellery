import { Schema, model } from "mongoose";
import { nextSequence } from "./counter.model.js";

const wishlistItemSchema = new Schema(
  {
    id: { type: Number, unique: true, index: true },
    sessionId: { type: String, required: true, index: true },
    productId: { type: Number, required: true, index: true },
  },
  { timestamps: { createdAt: "addedAt", updatedAt: true } },
);

wishlistItemSchema.index({ sessionId: 1, productId: 1 }, { unique: true });

wishlistItemSchema.pre("save", async function assignId(next) {
  if (this.isNew && this.id == null) {
    this.id = await nextSequence("wishlistItems");
  }
  next();
});

export const WishlistItem = model("WishlistItem", wishlistItemSchema);
