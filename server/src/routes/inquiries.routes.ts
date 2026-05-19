import { Router } from "express";
import { createInquiry, listInquiries } from "../controllers/inquiry.controller";

const router = Router();

router.get("/inquiries", listInquiries);
router.post("/inquiries", createInquiry);

export default router;
