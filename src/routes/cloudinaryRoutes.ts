// src/routes/cloudinaryRoutes.ts
import { Router } from "express";
import { getSignature } from "../controllers/cloudinaryController.js";

const router = Router();

router.get("/signature", getSignature);

export default router;
