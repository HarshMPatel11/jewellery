import { Schema, model } from "mongoose";
import { nextSequence } from "./counter.model";

const categorySchema = new Schema(
  {
    id: { type: Number, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: null },
    imageUrl: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

categorySchema.pre("save", async function assignId(next) {
  if (this.isNew && this.id == null) {
    this.id = await nextSequence("categories");
  }
  next();
});

export const Category = model("Category", categorySchema);
