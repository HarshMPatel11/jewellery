import type { Request, Response } from "express";
import { Review } from "../models/review.model.js";

export async function createReview(req: Request, res: Response) {
  const review = await Review.create(req.body);
  res.status(201).json({
    id: review.id,
    productId: review.productId,
    customerName: review.customerName,
    rating: review.rating,
    comment: review.comment ?? null,
    createdAt: review.createdAt.toISOString(),
  });
}
