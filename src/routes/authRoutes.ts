// src/routes/authRoutes.ts

import { Router } from "express";
import { login, getMe, logout } from "../controllers/authController.js";
import { register } from "../controllers/userController.js"; // Import dari sebelah
import { antiSpam, authMiddleware, loginLimiter } from "../middlewares/authMiddleware.js"; // Sesuai file lu bgsd!

const router = Router();

// 1. Register (Public - Tapi bisa lu tambahin authMiddleware kalo mau ketat)
router.post("/register", antiSpam, register);

// 2. Login (Pake loginLimiter lu yang max 10 itu)
router.post("/login", loginLimiter, login);

// 3. Get Profil (Pake authMiddleware)
router.get("/me", authMiddleware, getMe);

// 4. Logout (Pake authMiddleware)
router.post("/logout", authMiddleware, logout);

export default router;
