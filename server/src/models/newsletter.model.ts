import { Schema, model } from "mongoose";
import { nextSequence } from "./counter.model.js";

const newsletterSubscriberSchema = new Schema(
  {
    id: { type: Number, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    source: { type: String, default: "website" },
  },
  { timestamps: true },
);

newsletterSubscriberSchema.pre("save", async function assignId(next) {
  if (this.isNew && this.id == null) {
    this.id = await nextSequence("newsletterSubscribers");
  }
  next();
});

export const NewsletterSubscriber = model("NewsletterSubscriber", newsletterSubscriberSchema);
