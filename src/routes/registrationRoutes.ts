// src/routes/registrationRoutes.ts

import { Router } from "express";
import type { Request, Response } from "express";
import {
  registration,
  isVerification,
  getAllRegistrations,
  getRegistrationById,
  deleteRegistration,
} from "../controllers/regitrationController.js";

const router = Router();

// 🔓 Public: Siapa aja boleh daftar
router.post("/", registration);

// 🔐 Admin Only
router.get("/", getAllRegistrations);
router.get("/:id", getRegistrationById);
router.patch("/verify/:id", isVerification);
router.delete("/:id", deleteRegistration);

export default router;
