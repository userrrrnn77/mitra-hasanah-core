// src/routes/galleryRoutes.ts

import { Router } from "express";
import {
  uploadGallery as uploadGalleryController,
  deleteGallery,
  getAllGallery,
} from "../controllers/galleryController.js";
import {
  authMiddleware,
  roleMiddleware,
  antiSpam,
} from "../middlewares/authMiddleware.js";
import { uploadGallery as uploadGalleryMIddleware } from "../middlewares/uploadMiddleware.js";

const router = Router();

/**
 * @section PUBLIC ACCESS
 * Siapa aja boleh liat kebersamaan KSPPS, biar makin percaya!
 */
router.get("/", getAllGallery);

/**
 * @section ADMIN ONLY (PRIVATE)
 * Cuma Wizard yang boleh nambahin atau apus dokumentasi
 */

// Bulk Upload Foto (Max 10 foto sekaligus sesuai middleware lu)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  antiSpam,
  uploadGalleryController,
);

// Hapus satu foto dokumentasi
router.delete("/:id", authMiddleware, roleMiddleware(["ADMIN"]), deleteGallery);

export default router;
