import { Request, Response } from "express";
import News from "../models/News.js";

// src/controllers/newsController.ts

export const createNews = async (req: Request, res: Response) => {
  try {
    // 🚀 INJEKSI LOG DEWA: Kita telanjangi datanya di sini, Bre!
    console.log("============================================");
    console.log("🔥 [ALERTI] ADA REQUEST POST NEWS MASUK!");
    console.log("📦 ISI REQ.BODY :", JSON.stringify(req.body, null, 2));
    console.log("🔗 URL REQUEST  :", req.originalUrl);
    console.log("============================================");

    const { title, excerpt, content, images, category } = req.body;

    // Validasi input data utama demi keamanan database
    if (!title || !excerpt || !content || !images) {
      return res.status(400).json({
        success: false,
        message:
          "Data judul, ringkasan, isi konten, dan gambar wajib diisi semua, Bre.",
      });
    }

    // Eksekusi penyimpanan data ke MongoDB Atlas
    const newNews = await News.create({
      title,
      excerpt,
      content,
      images,
      category,
    });

    return res.status(201).json({
      success: true,
      message:
        "Berita premium berhasil disimpan ke database dengan sukses, Bre!",
      data: newNews,
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllNews = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const { search, category } = req.query;

    const queryEngine: any = {};

    if (search) {
      queryEngine.title = { $regex: search, $options: "i" };
    }

    if (category) {
      queryEngine.category = category;
    }

    const skip = (page - 1) * limit;

    const [newsList, totalDocuments] = await Promise.all([
      News.find(queryEngine)
        .select("-content")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      News.countDocuments(queryEngine),
    ]);

    const totalPages = Math.ceil(totalDocuments / limit);

    return res.status(200).json({
      success: true,
      message: "Daftar berita berhasil dimuat dengan performa terbaik, Bre!",
      meta: {
        totalResults: totalDocuments,
        showingResults: newsList.length,
        currentPage: page,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      data: newsList,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getNewsDetailBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const article = await News.findOne({ slug });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Detail berita tidak ditemukan di dalam database, Bre.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data detail berita berhasil dimuat secara utuh dan lengkap!",
      data: article,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedArticle = await News.findByIdAndDelete(id);

    if (!deletedArticle) {
      return res.status(404).json({
        success: false,
        message: "Gagal menghapus! ID berita yang dituju tidak ditemukan.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Berita berhasil dihapus secara permanen dengan aman, Bre.",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
