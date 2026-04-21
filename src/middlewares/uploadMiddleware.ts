import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import type { Request } from "express";
import path from "path";

// ===================================
// Storage Engine Sakti (KSPPS Version)
// ===================================

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    const url = req.originalUrl.toLowerCase();

    // Logika Ternary Mewah buat nentuin folder
    const folderName = url.includes("product")
      ? "products"
      : url.includes("gallery")
        ? "gallery"
        : url.includes("baitul-maal")
          ? "baitul_maal"
          : url.includes("user") ||
              url.includes("profile") ||
              url.includes("avatar")
            ? "avatars"
            : "general";

    // Cek resource type (Support Video buat Baitul Maal)
    const isVideo = file.mimetype.startsWith("video");

    return {
      folder: `kspps_v2/${folderName}`,
      resource_type: isVideo ? "video" : "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov", "mpeg"],
      public_id: `${Date.now()}-${path.parse(file.originalname).name}`,
    };
  },
});

// Filter File: Gambar & Video Only
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(new Error("Format kaga didukung mbot! Harus Gambar atau Video!"));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB biar video kaga kena potong, bgsd!
  },
});

// ==========================================
// Shortcut Middleware buat di Route
// ==========================================

// 1. Buat User (imageProfile) & Products (image)
export const uploadSingle = (fieldName: string) => upload.single(fieldName);

// 2. Buat Gallery (src) - Pake array karena bisa upload banyak sekaligus
export const uploadGallery = upload.array("src", 10);

const maalStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video");
    return {
      folder: "baitul-maal",
      resource_type: isVideo ? "video" : "image",
      format: isVideo ? "mp4" : "webp", // Convert otomatis biar irit
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

// Middleware buat handle multiple fields
export const uploadMaal = multer({ storage: maalStorage }).fields([
  { name: "images", maxCount: 5 }, // Max 5 gambar
  { name: "videos", maxCount: 2 }, // Max 2 video (opsional)
]);

// Fungsi Hapus Massal (Wizard-Level)
export const deleteMultipleFromCloudinary = async (
  publicIds: string[],
  type: "image" | "video" = "image",
) => {
  try {
    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds, { resource_type: type });
    }
  } catch (error) {
    console.error("Cloudinary Cleanup Failed, mbot!", error);
  }
};
// ==========================================
// Delete From Cloudinary
// ==========================================

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      console.log(`✅ File ${publicId} musnah, bandwidth aman!`);
    }
  } catch (error) {
    console.error("❌ Gagal hapus file Cloudinary!", error);
  }
};
