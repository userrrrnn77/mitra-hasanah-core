// src/routes/registrationRoutes.ts

import { Router } from "express";
import type { Request, Response } from "express";
import {
  registration,
  isVerification,
  getAllRegistrations,
  getRegistrationById,
} from "../controllers/regitrationController";
import connectDB from "config/db";

const router = Router();

// 🔓 Public: Siapa aja boleh daftar
router.post("/", async (req: Request, res: Response) => {
  try {
    await connectDB();
    await registration(req, res);
    res.status(200).json({ success: true, message: "Masuk bre" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔐 Admin Only
router.get("/", getAllRegistrations);
router.get("/:id", getRegistrationById);
router.patch("/verify/:id", isVerification);

export default router;
