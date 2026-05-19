import { Schema, model } from "mongoose";
import { nextSequence } from "./counter.model.js";

const productSchema = new Schema(
  {
    id: { type: Number, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    price: { type: Number, required: true },
    salePrice: { type: Number, default: null },
    categoryId: { type: Number, default: null, index: true },
    images: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    material: { type: String, default: null },
    goldPurity: { type: String, default: null },
    weight: { type: Number, default: null },
    variants: {
      type: [
        {
          size: { type: String, default: null },
          weight: { type: Number, default: null },
          color: { type: String, default: null },
        },
      ],
      default: [],
    },
    stoneType: { type: String, default: null },
    diamondDetails: { type: String, default: null },
    makingCharges: { type: Number, default: null },
    hallmark: { type: String, default: null },
    sku: { type: String, default: null },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: null },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    shortDescription: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

productSchema.pre("save", async function assignId(next) {
  if (this.isNew && this.id == null) {
    this.id = await nextSequence("products");
  }
  next();
});

export const Product = model("Product", productSchema);
