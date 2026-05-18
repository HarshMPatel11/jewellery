import { Schema, model } from "mongoose";
import { nextSequence } from "./counter.model";

const couponSchema = new Schema(
  {
    id: { type: Number, unique: true, index: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
    value: { type: Number, required: true },
    minOrderTotal: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

couponSchema.pre("save", async function assignId(next) {
  if (this.isNew && this.id == null) {
    this.id = await nextSequence("coupons");
  }
  next();
});

export const Coupon = model("Coupon", couponSchema);
