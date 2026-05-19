import { Router } from "express";
import { getCollectionsSummary } from "../controllers/collection.controller.js";

const router = Router();

router.get("/collections/summary", getCollectionsSummary);

export default router;
