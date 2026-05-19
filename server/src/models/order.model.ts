import { Schema, model } from "mongoose";
import { nextSequence } from "./counter.model";

const orderItemSchema = new Schema(
  {
    productId: { type: Number, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    id: { type: Number, unique: true, index: true },
    status: { type: String, default: "pending" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, default: null },
    shippingAddress: { type: String, default: null },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingCharge: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String, default: null },
    paymentMethod: { type: String, default: "cod" },
    paymentStatus: { type: String, default: "pending" },
    items: { type: [orderItemSchema], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

orderSchema.pre("save", async function assignId(next) {
  if (this.isNew && this.id == null) {
    this.id = await nextSequence("orders");
  }
  next();
});

export const Order = model("Order", orderSchema);
