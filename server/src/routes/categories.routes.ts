import { Router } from "express";
import { createCategory, listCategories } from "../controllers/category.controller";

const router = Router();

router.get("/categories", listCategories);
router.post("/categories", createCategory);

export default router;
