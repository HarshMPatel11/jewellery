import { Router } from "express";
import {
  createReturnRequest,
  listReturnRequests,
  updateReturnRequest,
} from "../controllers/return-request.controller";

const router = Router();

router.get("/return-requests", listReturnRequests);
router.post("/return-requests", createReturnRequest);
router.patch("/return-requests/:id", updateReturnRequest);

export default router;
