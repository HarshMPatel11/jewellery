import type { Request, Response } from "express";
import { Coupon } from "../models/coupon.model";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";

const SHIPPING_CHARGE = Number(process.env.SHIPPING_CHARGE) || 0;
const TAX_RATE = Number(process.env.TAX_RATE) || 0.03;

function formatOrder(order: any) {
  return {
    id: order.id,
    status: order.status,
    items: (order.items ?? []).map((item: any, index: number) => ({
      id: index + 1,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal: order.subtotal ?? order.total,
    discount: order.discount ?? 0,
    shippingCharge: order.shippingCharge ?? 0,
    tax: order.tax ?? 0,
    couponCode: order.couponCode ?? null,
    total: order.total,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone ?? null,
    shippingAddress: order.shippingAddress ?? null,
    createdAt: order.createdAt.toISOString(),
  };
}

export async function listOrders(_req: Request, res: Response) {
  const orders = await Order.find().sort({ createdAt: 1 });
  res.json(orders.map(formatOrder));
}

export async function createOrder(req: Request, res: Response) {
  const { customerName, customerEmail, customerPhone, shippingAddress, items, couponCode } = req.body;
  const orderItems = [];
  let subtotal = 0;

  for (const item of items ?? []) {
    const product = await Product.findOne({ id: Number(item.productId) }).lean();
    if (!product) continue;

    const price = product.salePrice ?? product.price;
    orderItems.push({
      productId: Number(item.productId),
      productName: product.name,
      quantity: Number(item.quantity),
      price,
    });
    subtotal += price * Number(item.quantity);
  }

  const coupon = couponCode
    ? await Coupon.findOne({ code: String(couponCode).toUpperCase(), active: true }).lean()
    : null;
  const canApplyCoupon = coupon && subtotal >= (coupon.minOrderTotal ?? 0);
  const discount = canApplyCoupon
    ? Math.min(
        coupon.type === "fixed" ? coupon.value : subtotal * (coupon.value / 100),
        subtotal,
      )
    : 0;
  const taxableTotal = Math.max(subtotal - discount, 0);
  const tax = Math.round(taxableTotal * TAX_RATE);
  const total = taxableTotal + SHIPPING_CHARGE + tax;

  const order = await Order.create({
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    couponCode: coupon?.code ?? couponCode ?? null,
    subtotal,
    discount,
    shippingCharge: SHIPPING_CHARGE,
    tax,
    total,
    items: orderItems,
    status: "pending",
  });

  res.status(201).json(formatOrder(order));
}

export async function validateCoupon(req: Request, res: Response) {
  const code = String(req.body.code ?? "").trim().toUpperCase();
  const subtotal = Number(req.body.subtotal) || 0;

  if (!code) {
    res.status(400).json({ error: "Coupon code is required" });
    return;
  }

  const coupon = await Coupon.findOne({ code, active: true }).lean();
  if (!coupon || subtotal < (coupon.minOrderTotal ?? 0)) {
    res.status(404).json({ error: "Coupon not valid for this order" });
    return;
  }

  const discount = Math.min(
    coupon.type === "fixed" ? coupon.value : subtotal * (coupon.value / 100),
    subtotal,
  );

  res.json({
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discount,
  });
}

export async function getOrder(req: Request, res: Response) {
  const order = await Order.findOne({ id: Number(req.params.id) });
  if (!order) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(formatOrder(order));
}
