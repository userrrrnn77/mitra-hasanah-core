// src/routes/routes.ts
import { Router } from "express";
import registrationRoutes from "./registrationRoutes.js";

const router = Router();

// Semua yang diawali /registration bakal dilempar ke registrationRoutes
router.use("/registration", registrationRoutes);

export default router;
