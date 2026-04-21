// src/routes/routes.ts
import { Router } from "express";
import registrationRoutes from "./registrationRoutes.js";
import authRoutes from "./authRoutes.js";
import baitulMaalRoutes from "./baitulMaalRoutes.js";
import galleryRoutes from "./galleryRoutes.js";
import productDetailRoutes from "./productDetailRoutes.js";
import productRoutes from "./productRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

console.log("AUTH ROUTES LOADED");

// Semua yang diawali /registration bakal dilempar ke registrationRoutes
router.use("/registration", registrationRoutes); // registrasi user
router.use("/auth", authRoutes);
router.use("/baitul-maal", baitulMaalRoutes);
router.use("/gallery", galleryRoutes);
router.use("/product-detail", productDetailRoutes);
router.use("/product", productRoutes);
router.use("/user", userRoutes);

export default router;
