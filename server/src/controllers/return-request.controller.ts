import type { Request, Response } from "express";
import { ReturnRequest } from "../models/return-request.model";

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
  const request = await ReturnRequest.create({
    orderId: Number(req.body.orderId),
    customerName: req.body.customerName,
    customerEmail: req.body.customerEmail,
    reason: req.body.reason,
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
