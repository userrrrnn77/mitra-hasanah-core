import { AuthRequest } from "../middlewares/authMiddleware.js";
import { Response, Request } from "express";
import { deleteFromCloudinary } from "../middlewares/uploadMiddleware.js";
import Carousel, { ICarouselDocument } from "../models/Caoursel.js";

export const addCarousel = async (req: AuthRequest, res: Response) => {
  try {
    const { image, title } = req.body; // kenapa req.body, karena gambar langsung upload ke cloud db cuma nerima json bre seperti biasa ya bre

    if (!image && !title) {
      return res
        .status(400)
        .json({ success: false, message: "Masukin dulu fieldnya bre." });
    }

    const carouselData = image.map((img: ICarouselDocument) => ({
      image: img.image,
      title: img.title || "Alt Carousel",
      publicId: img.publicId,
    }));

    if (carouselData.length >= 10) {
      return res.status(400).json({
        success: false,
        message:
          "Maks Gambar 10 bre, kalo mau upload yang baru minimal hapus 1 dulu",
      });
    }

    const existingCount = await Carousel.countDocuments();

    if (existingCount + carouselData.length > 10) {
      return res.status(400).json({
        success: false,
        message: `Kapasitas sisa cuma ${10 - existingCount} bre! Jangan maruk lah bgsd.`,
      });
    }

    const newCarousel = await Carousel.insertMany(carouselData);

    res.status(201).json({
      success: true,
      message: `${newCarousel.length} carousel berhasil di upload bre`,
      data: newCarousel,
    });
  } catch (error: any) {
    console.error("Gagal upload carousel bre", error.message);
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
