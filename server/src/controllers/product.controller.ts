import type { Request, Response } from "express";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

type ProductLike = {
  id?: number | null;
  name: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  categoryId?: number | null;
  images?: string[];
  tags?: string[];
  material?: string | null;
  goldPurity?: string | null;
  weight?: number | null;
  variants?: Array<{ size?: string | null; weight?: number | null; color?: string | null }>;
  stoneType?: string | null;
  diamondDetails?: string | null;
  makingCharges?: number | null;
  hallmark?: string | null;
  sku?: string | null;
  inStock?: boolean;
  stockCount?: number | null;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  shortDescription?: string | null;
  createdAt: Date;
};

export async function formatProduct(product: ProductLike) {
  const productId = product.id ?? 0;
  const [category, reviews] = await Promise.all([
    product.categoryId != null ? Category.findOne({ id: product.categoryId }).lean() : null,
    Review.find({ productId }).lean(),
  ]);

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : null;

  return {
    id: productId,
    name: product.name,
    description: product.description ?? null,
    price: product.price,
    salePrice: product.salePrice ?? null,
    categoryId: product.categoryId ?? null,
    categoryName: category?.name ?? null,
    images: product.images ?? [],
    tags: product.tags ?? [],
    material: product.material ?? null,
    goldPurity: product.goldPurity ?? null,
    weight: product.weight ?? null,
    variants: product.variants ?? [],
    stoneType: product.stoneType ?? null,
    diamondDetails: product.diamondDetails ?? null,
    makingCharges: product.makingCharges ?? null,
    hallmark: product.hallmark ?? null,
    sku: product.sku ?? null,
    inStock: product.inStock ?? true,
    stockCount: product.stockCount ?? null,
    isFeatured: product.isFeatured ?? false,
    isNewArrival: product.isNewArrival ?? false,
    isBestSeller: product.isBestSeller ?? false,
    isTrending: product.isTrending ?? false,
    shortDescription: product.shortDescription ?? null,
    averageRating,
    reviewCount: reviews.length,
    createdAt: product.createdAt.toISOString(),
  };
}

function numberParam(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function listProducts(req: Request, res: Response) {
  const filter: Record<string, unknown> = {};
  const limit = Math.min(Number(req.query.limit) || 50, 100);
  const offset = Number(req.query.offset) || 0;

  if (req.query.category) {
    const category = await Category.findOne({ slug: String(req.query.category) }).lean();
    filter.categoryId = category?.id ?? -1;
  }

  if (req.query.search) {
    filter.name = { $regex: String(req.query.search), $options: "i" };
  }

  const priceFilter: Record<string, number> = {};
  if (req.query.minPrice !== undefined) priceFilter.$gte = Number(req.query.minPrice);
  if (req.query.maxPrice !== undefined) priceFilter.$lte = Number(req.query.maxPrice);
  if (Object.keys(priceFilter).length) filter.price = priceFilter;
  if (req.query.featured === "true") filter.isFeatured = true;
  if (req.query.inStock === "true") filter.inStock = true;

  const products = await Product.find(filter).skip(offset).limit(limit);
  res.json(await Promise.all(products.map(formatProduct)));
}

export async function createProduct(req: Request, res: Response) {
  const product = await Product.create(req.body);
  res.status(201).json(await formatProduct(product));
}

export async function listFlaggedProducts(flag: string, _req: Request, res: Response) {
  const products = await Product.find({ [flag]: true }).limit(8);
  res.json(await Promise.all(products.map(formatProduct)));
}

export async function getProduct(req: Request, res: Response) {
  const id = numberParam(req.params.id);
  if (id == null) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const product = await Product.findOne({ id });
  if (!product) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(await formatProduct(product));
}

export async function updateProduct(req: Request, res: Response) {
  const id = numberParam(req.params.id);
  if (id == null) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const product = await Product.findOneAndUpdate({ id }, req.body, { new: true });
  if (!product) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(await formatProduct(product));
}

export async function deleteProduct(req: Request, res: Response) {
  const id = numberParam(req.params.id);
  if (id == null) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await Product.deleteOne({ id });
  res.status(204).send();
}

export async function getProductReviews(req: Request, res: Response) {
  const id = numberParam(req.params.id);
  if (id == null) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const reviews = await Review.find({ productId: id }).lean();
  res.json(
    reviews.map((review) => ({
      id: review.id,
      productId: review.productId,
      customerName: review.customerName,
      rating: review.rating,
      comment: review.comment ?? null,
      createdAt: review.createdAt.toISOString(),
    })),
  );
}
