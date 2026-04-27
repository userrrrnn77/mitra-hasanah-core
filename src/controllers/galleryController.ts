import { Request, Response } from "express";
import Gallery from "../models/Galery.js"; // Pastiin path model lu bener
import { deleteFromCloudinary } from "../middlewares/uploadMiddleware.js"; // Buat fungsi delete nanti

// @desc    Upload Foto ke Galeri (Direct JSON)
// @route   POST /api/gallery
export const uploadGallery = async (req: Request, res: Response) => {
  try {
    // Lu ganti 'images' jadi 'items' di FE ya, bgsyad!
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Mana barangnya mbot?! Minimal satu lah, mau foto apa video bebas!",
      });
    }

    const galleryData = items.map((item: any) => {
      // 🕵️ Validasi Size (Cuma buat jaga-jaga kalo FE lu jebol)
      if (item.type === "video" && item.size > 50 * 1024 * 1024) {
        throw new Error(
          `Video ${item.name || "lu"} kegedean, Jembot! Maks 50MB!`,
        );
      }

      return {
        src: item.src,
        publicId: item.publicId,
        type: item.type || "image",
        alt: item.alt || "Konten Gallery",
        category: item.category || "umum",
      };
    });

    // Bulk Insert: Langsung hajar ke MongoDB
    const newItems = await Gallery.insertMany(galleryData);

    res.status(201).json({
      success: true,
      // Pake kata 'Konten' biar aman buat foto maupun video!
      message: `${newItems.length} konten berhasil mejeng, Wizard!`,
      data: newItems,
    });
  } catch (error: any) {
    console.error("Gagal Upload Galeri, mbot!:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server lu lagi puyeng, bgsyad!",
    });
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
