import type { Request, Response } from "express";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { formatProduct } from "./product.controller.js";

export async function getCollectionsSummary(_req: Request, res: Response) {
  const [categories, allProducts] = await Promise.all([Category.find().lean(), Product.find()]);

  const collections = await Promise.all(
    categories.map(async (category) => {
      const categoryProducts = allProducts.filter((product) => product.categoryId === category.id);
      const featured = categoryProducts.find((product) => product.isFeatured) ?? categoryProducts[0] ?? null;

      return {
        name: category.name,
        slug: category.slug,
        description: category.description ?? null,
        imageUrl: category.imageUrl ?? null,
        productCount: categoryProducts.length,
        featuredProduct: featured ? await formatProduct(featured) : null,
      };
    }),
  );

  res.json({
    collections,
    totalProducts: allProducts.length,
    totalCategories: categories.length,
    featuredCount: allProducts.filter((product) => product.isFeatured).length,
    newArrivalsCount: allProducts.filter((product) => product.isNewArrival).length,
  });
}
