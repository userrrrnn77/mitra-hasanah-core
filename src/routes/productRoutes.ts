//  src/routes/productRoutes.ts

import { Router } from "express";
import {
  addNewProduct,
  getAllProducts,
  getFullProductData,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  authMiddleware,
  roleMiddleware,
} from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @section PUBLIC ACCESS
 * Nasabah bebas intip katalog simpanan & pembiayaan
 */

// Ambil list semua produk (Filterable via query ?cat=simpanan)
router.get("/", getAllProducts);

// Ambil data gabungan Katalog + Detail (Buat halaman detail produk)
router.get("/full/:id", getFullProductData);

/**
 * @section ADMIN ONLY (PRIVATE)
 * Cuma Wizard yang boleh nambah, edit, atau musnahin produk
 */

// Tambah produk baru (Handle single image 'image')
router.post(
  "/",
  addNewProduct,
);

// Update info produk atau ganti foto katalog
router.patch(
  "/:id",
  updateProduct,
);

// Hapus total Katalog & Detail (Auto-sync Cloudinary)
router.delete("/:id", authMiddleware, roleMiddleware(["ADMIN"]), deleteProduct);

export default router;
