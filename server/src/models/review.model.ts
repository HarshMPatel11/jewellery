import { Schema, model } from "mongoose";
import { nextSequence } from "./counter.model";

const reviewSchema = new Schema(
  {
    id: { type: Number, unique: true, index: true },
    productId: { type: Number, required: true, index: true },
    customerName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

reviewSchema.pre("save", async function assignId(next) {
  if (this.isNew && this.id == null) {
    this.id = await nextSequence("reviews");
  }
  next();
});

export const Review = model("Review", reviewSchema);
