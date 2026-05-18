import type { Request, Response } from "express";
import { Inquiry } from "../models/inquiry.model";

export async function createInquiry(req: Request, res: Response) {
  const inquiry = await Inquiry.create(req.body);
  res.status(201).json({
    id: inquiry.id,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone ?? null,
    productId: inquiry.productId ?? null,
    message: inquiry.message,
    createdAt: inquiry.createdAt.toISOString(),
  });
}
