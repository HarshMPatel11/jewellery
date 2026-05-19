import { Schema, model } from "mongoose";
import { nextSequence } from "./counter.model.js";

const returnRequestSchema = new Schema(
  {
    id: { type: Number, unique: true, index: true },
    orderId: { type: Number, required: true, index: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true },
    reason: { type: String, required: true, trim: true },
    status: { type: String, default: "requested" },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

returnRequestSchema.pre("save", async function assignId(next) {
  if (this.isNew && this.id == null) {
    this.id = await nextSequence("returnRequests");
  }
  next();
});

export const ReturnRequest = model("ReturnRequest", returnRequestSchema);
