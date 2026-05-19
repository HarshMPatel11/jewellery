import type { Request, Response } from "express";
import { Order } from "../models/order.model.js";
import { ReturnRequest } from "../models/return-request.model.js";

function formatReturnRequest(request: any) {
  return {
    id: request.id,
    orderId: request.orderId,
    customerName: request.customerName,
    customerEmail: request.customerEmail,
    reason: request.reason,
    status: request.status,
    createdAt: request.createdAt.toISOString(),
  };
}

export async function listReturnRequests(_req: Request, res: Response) {
  const requests = await ReturnRequest.find().sort({ createdAt: -1 });
  res.json(requests.map(formatReturnRequest));
}

export async function createReturnRequest(req: Request, res: Response) {
  const orderId = Number(req.body.orderId);
  const customerName = String(req.body.customerName ?? "").trim();
  const customerEmail = String(req.body.customerEmail ?? "").trim().toLowerCase();
  const reason = String(req.body.reason ?? "").trim();

  if (!orderId || !customerName || !customerEmail || !reason) {
    res.status(400).json({ error: "Order, customer details, and reason are required" });
    return;
  }

  const order = await Order.findOne({ id: orderId }).lean();
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  if (String(order.customerEmail).toLowerCase() !== customerEmail) {
    res.status(400).json({ error: "Return request email must match the order email" });
    return;
  }

  const request = await ReturnRequest.create({
    orderId,
    customerName,
    customerEmail,
    reason,
  });

  res.status(201).json(formatReturnRequest(request));
}

export async function updateReturnRequest(req: Request, res: Response) {
  const request = await ReturnRequest.findOneAndUpdate(
    { id: Number(req.params.id) },
    { status: req.body.status },
    { new: true },
  );

  if (!request) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(formatReturnRequest(request));
}
