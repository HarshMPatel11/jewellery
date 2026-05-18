import type { Request, Response } from "express";
import { NewsletterSubscriber } from "../models/newsletter.model";

export async function subscribeNewsletter(req: Request, res: Response) {
  const email = String(req.body.email ?? "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    res.status(400).json({ error: "A valid email is required" });
    return;
  }

  const subscriber = await NewsletterSubscriber.findOneAndUpdate(
    { email },
    { email, source: req.body.source || "website" },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  res.status(201).json({
    id: subscriber.id,
    email: subscriber.email,
    message: "Subscribed",
  });
}
