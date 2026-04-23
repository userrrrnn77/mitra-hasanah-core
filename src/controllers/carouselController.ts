import { AuthRequest } from "../middlewares/authMiddleware.js";
import { Response, Request } from "express";
import { deleteFromCloudinary } from "../middlewares/uploadMiddleware.js";
import Carousel, { ICarouselDocument } from "../models/Caoursel.js";

export const addCarousel = async (req: AuthRequest, res: Response) => {
  try {
    const { image, title, publicId } = req.body;

    // 1. Validasi Input Dasar
    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Masukin dulu fotonya bre." });
    }

    // 2. CEK KAPASITAS DULU (Pake await dan kurung buka-tutup!)
    const currentCount = await Carousel.countDocuments();

    if (currentCount >= 10) {
      return res.status(400).json({
        success: false,
        message: "Udah penuh 10 bre! Hapus dulu satu kalo mau ganti baru.",
      });
    }

    // 3. BARU SIMPEN KE DATABASE
    const newCarousel = await Carousel.create({
      image,
      title: title || "Alt Carousel",
      publicId,
    });

    // 4. Response Wangi
    res.status(201).json({
      success: true,
      message: "Satu foto kenangan berhasil mendarat, Bre! 🚀",
      data: newCarousel,
    });
  } catch (error: any) {
    console.error("Gagal upload carousel bre:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllCarousel = async (req: Request, res: Response) => {
  try {
    const carousel = await Carousel.find().sort({ createdAt: -1 });

    if (!carousel)
      return res.status(404).json({
        success: false,
        message: "Carousel tidak ditemukan bre keknya tenggelam",
      });

    return res.status(200).json({
      success: true,
      message: "Nih bre data yang lu minta",
      data: carousel,
    });
  } catch (error: any) {
    console.error("Gagal ambil carousel bre, njir error: ", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteCarousel = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const wantDeleteCarousel = await Carousel.findByIdAndDelete(id);

    if (!wantDeleteCarousel)
      return res.status(404).json({
        success: false,
        message: "Error Carousel tidak ditemukan di database bre",
      });

    if (wantDeleteCarousel.publicId) {
      await deleteFromCloudinary(wantDeleteCarousel.publicId);
    }

    return res.status(200).json({
      success: true,
      message: "Berhasil dihapus bre",
      data: wantDeleteCarousel,
    });
  } catch (error: any) {
    console.error("Gagal Bre Server Engap MEMEK!", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
