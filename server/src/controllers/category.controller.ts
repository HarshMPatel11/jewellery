import type { Request, Response } from "express";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";

export async function listCategories(_req: Request, res: Response) {
  const categories = await Category.find().lean();
  const results = await Promise.all(
    categories.map(async (category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? null,
      imageUrl: category.imageUrl ?? null,
      productCount: await Product.countDocuments({ categoryId: category.id }),
    })),
  );
  res.json(results);
}

export async function createCategory(req: Request, res: Response) {
  const category = await Category.create(req.body);
  res.status(201).json({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? null,
    imageUrl: category.imageUrl ?? null,
    productCount: 0,
  });
}
