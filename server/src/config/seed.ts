import { Coupon } from "../models/coupon.model";

export async function seedDefaults() {
  await Coupon.updateOne(
    { code: "WELCOME10" },
    {
      code: "WELCOME10",
      type: "percentage",
      value: 10,
      minOrderTotal: 1000,
      active: true,
    },
    { upsert: true },
  );
}
