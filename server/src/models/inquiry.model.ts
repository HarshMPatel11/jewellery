import { Schema, model } from "mongoose";
import { nextSequence } from "./counter.model.js";

const inquirySchema = new Schema(
  {
    id: { type: Number, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: null },
    productId: { type: Number, default: null },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

inquirySchema.pre("save", async function assignId(next) {
  if (this.isNew && this.id == null) {
    this.id = await nextSequence("inquiries");
  }
  next();
});

export const Inquiry = model("Inquiry", inquirySchema);
