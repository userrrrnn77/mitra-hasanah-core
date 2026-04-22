// src/routes/baitulMaalRoutes.ts

import { Router } from "express";
import {
  createProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
} from "../controllers/baitulMaalController.js";
import {
  authMiddleware,
  roleMiddleware,
  antiSpam,
} from "../middlewares/authMiddleware.js";
import { uploadMaal } from "../middlewares/uploadMiddleware.js";

const router = Router();

/**
 * @section PUBLIC ACCESS
 * Nasabah atau calon donatur bebas liat daftar program
 */

// Ambil semua program (Bisa filter via query ?cat=KESEHATAN)
router.get("/", getAllPrograms);

// Ambil detail satu program pake ID/Slug
router.get("/:id", getProgramById);

/**
 * @section ADMIN ONLY (PRIVATE)
 * Jalur khusus Wizard buat manajemen konten
 */

// Rilis program baru (Handle Multiple Images & Videos)
router.post(
  "/",
  // authMiddleware,
  // roleMiddleware(["ADMIN"]),
  // antiSpam,
  createProgram,
);

// Update data program & aset Cloudinary
router.patch(
  "/:id",
  // authMiddleware,
  // roleMiddleware(["ADMIN"]),
  // antiSpam,
  updateProgram,
);

// Musnahkan program beserta seluruh aset fotonya
router.delete("/:id", authMiddleware, roleMiddleware(["ADMIN"]), deleteProgram);

export default router;
