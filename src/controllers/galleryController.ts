import { Request, Response } from "express";
import Gallery from "@/models/Galery.js"; // Pastiin path model lu bener
import { deleteFromCloudinary } from "../middlewares/uploadMiddleware.js"; // Buat fungsi delete nanti

// @desc    Upload Foto ke Galeri (Direct JSON)
// @route   POST /api/gallery
export const uploadGallery = async (req: Request, res: Response) => {
  try {
    // Frontend kirim: { images: [{ src: "...", publicId: "..." }, ...] }
    const { images } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Mana fotonya mbot?! Minimal satu lah!",
      });
    }

    // 1. Mapping data biar sesuai skema DB lu
    const galleryData = images.map((img: any) => ({
      src: img.src,
      publicId: img.publicId,
      caption: img.caption || "",
    }));

    // 2. Insert Massal (Bulk Insert) - Lebih kenceng daripada nge-loop save()
    const newPhotos = await Gallery.insertMany(galleryData);

    res.status(201).json({
      success: true,
      message: `${newPhotos.length} foto berhasil mejeng di galeri!`,
      data: newPhotos,
    });
  } catch (error: any) {
    console.error("Gagal Upload Galeri, mbot!:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Ambil Semua Foto Galeri
// @route   GET /api/gallery
export const getAllGallery = async (_req: Request, res: Response) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 }); // Foto terbaru di atas
    res.status(200).json({
      success: true,
      data: photos,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Hapus Satu Foto
// @route   DELETE /api/gallery/:id
export const deleteGallery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const photo = await Gallery.findById(id);
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Fotonya kaga ketemu, mungkin udah musnah!",
      });
    }

    // 1. Hapus di Cloudinary dulu biar bandwidth aman
    if (photo.publicId) {
      await deleteFromCloudinary(photo.publicId);
    }

    // 2. Hapus di Database
    await Gallery.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Foto resmi dibuang dari peradaban!",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
