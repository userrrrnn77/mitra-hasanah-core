// src/routes/routes.ts
import { Router } from "express";
import registrationRoutes from "./registrationRoutes.js";
import authRoutes from "./authRoutes.js";
import baitulMaalRoutes from "./baitulMaalRoutes.js";
import galleryRoutes from "./galleryRoutes.js";
import productDetailRoutes from "./productDetailRoutes.js";
import productRoutes from "./productRoutes.js";
import userRoutes from "./userRoutes.js";
import carouselRoutes from "./carouselRoutes.js";
import historyTransaction from "./historyTransactionRoutes.js";
import newsRoutes from "./newsRoutes.js"; 

const router = Router();

// Semua yang diawali /registration bakal dilempar ke registrationRoutes
router.use("/registration", registrationRoutes); // registrasi user
router.use("/auth", authRoutes); // authentication
router.use("/baitul-maal", baitulMaalRoutes); // baitul-maal routes
router.use("/gallery", galleryRoutes); // gallery routes
router.use("/carousel", carouselRoutes); //  carousel routes
router.use("/product-detail", productDetailRoutes); // detailProduct routes
router.use("/product", productRoutes); // product card
router.use("/user", userRoutes); // karyawan atau admin
router.use("/transaction", historyTransaction); // route transaction
router.use("/news", newsRoutes); // Semua rute berita resmi

export default router;
