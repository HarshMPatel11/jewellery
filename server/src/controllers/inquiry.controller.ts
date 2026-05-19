import type { Request, Response } from "express";
import { Inquiry } from "../models/inquiry.model";

function formatInquiry(inquiry: any) {
  return {
    id: inquiry.id,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone ?? null,
    productId: inquiry.productId ?? null,
    message: inquiry.message,
    createdAt: inquiry.createdAt.toISOString(),
  };
}

export async function listInquiries(_req: Request, res: Response) {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  res.json(inquiries.map(formatInquiry));
}

export async function createInquiry(req: Request, res: Response) {
  const inquiry = await Inquiry.create(req.body);
  res.status(201).json(formatInquiry(inquiry));
}
