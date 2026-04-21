// src/routes/userRoutes.ts

import { Router } from "express";
import {
  
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateProfile,
} from "../controllers/userController.js";
import {
  authMiddleware,
  roleMiddleware,
  antiSpam,
} from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @section PUBLIC / SEMI-PUBLIC
 * Register bisa lu buka buat umum atau kunci pake ADMIN.
 * Di sini gue kasih antiSpam biar kaga ada yang bikin akun bot, bgsd!
 */
router.post("/createUser", antiSpam, createUser);

/**
 * @section PRIVATE (ADMIN ONLY)
 * Cuma kasta ADMIN yang boleh liat, edit, atau musnahin user lain!
 */

// Ambil semua user & ambil satu user
router.get("/", authMiddleware, roleMiddleware(["ADMIN"]), getAllUsers);
router.get("/:id", authMiddleware, roleMiddleware(["ADMIN"]), getUserById);

// Update data user (Misal ganti role atau reset sesuatu)
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  antiSpam,
  updateProfile,
);

// Musnahkan user dari DB
router.delete("/:id", authMiddleware, roleMiddleware(["ADMIN"]), deleteUser);

export default router;
