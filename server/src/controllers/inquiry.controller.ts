import type { Request, Response } from "express";
import { Inquiry } from "../models/inquiry.model.js";

const PHONE_PATTERN = /^\d{10,15}$/;

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
  const phone = req.body.phone ? String(req.body.phone).trim() : "";

  if (!req.body.name || !req.body.email || !req.body.message) {
    res.status(400).json({ error: "Name, email, and message are required" });
    return;
  }

  if (phone && !PHONE_PATTERN.test(phone)) {
    res.status(400).json({ error: "Phone number must contain only 10 to 15 digits" });
    return;
  }

  const inquiry = await Inquiry.create({ ...req.body, phone: phone || null });
  res.status(201).json(formatInquiry(inquiry));
}
