import { Router } from "express";
import { createCategory, listCategories } from "../controllers/category.controller.js";

const router = Router();

router.get("/categories", listCategories);
router.post("/categories", createCategory);

export default router;
