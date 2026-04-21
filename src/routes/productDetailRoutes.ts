// src/routes/productDetailRoutes.ts

import { Router } from "express";
import {
  createDetail,
  getDetailById,
  updateDetail,
  deleteDetail,
} from "../controllers/productDetailController.js";
import {
  authMiddleware,
  roleMiddleware,
  antiSpam,
} from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @section PUBLIC ACCESS
 * Nasabah bebas baca detail syarat & ketentuan produk
 */

// Ambil detail produk berdasarkan ID/Slug
router.get("/:id", getDetailById);

/**
 * @section ADMIN ONLY (PRIVATE)
 * Cuma kasta ADMIN yang boleh ngeracik isi brosur digital ini!
 */

// Bikin detail baru buat produk yang udah ada di katalog
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  antiSpam,
  createDetail,
);

// Update isi detail (Syarat, Benefit, Sections)
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  antiSpam,
  updateDetail,
);

// Hapus detail produk (Kalo katalognya diapus, biasanya ini ikut terpanggil)
router.delete("/:id", authMiddleware, roleMiddleware(["ADMIN"]), deleteDetail);

export default router;
