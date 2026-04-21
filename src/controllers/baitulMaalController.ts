import type { Request, Response } from "express";
import BaitulMaal from "../models/BaitulMaal.js";
import { deleteMultipleFromCloudinary } from "../middlewares/uploadMiddleware.js";
import { AuthRequest } from "@/middlewares/authMiddleware.js";

export const createProgram = async (req: AuthRequest, res: Response) => {
  try {
    const {
      id,
      title,
      tagline,
      description,
      category,
      features,
      images,
      videoUrl,
    } = req.body;

    // 🔥 VALIDASI BARU (bukan files lagi)
    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Minimal 1 gambar, bre!",
      });
    }

    const program = await BaitulMaal.create({
      id: String(id).toLowerCase().trim(),
      title,
      tagline,
      description,
      category,
      images,
      videoUrl: videoUrl || [],
      features,
      publicIds: [], // optional kalau ga dipakai
    });

    res.status(201).json({
      success: true,
      message: "Program sosial berhasil rilis!",
      data: program,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/**
 * GET ALL PROGRAMS (Filterable by Category)
 * Route: GET /api/baitul-maal?cat=SOSIAL
 */
export const getAllPrograms = async (req: AuthRequest, res: Response) => {
  try {
    const { cat } = req.query;
    let filter: any = {};

    // Cek kategori, kalo ada kita filter, kalo kaga tarik semua
    if (
      typeof cat === "string" &&
      ["KESEHATAN", "KEMANUSIAAN", "SOSIAL"].includes(cat.toUpperCase())
    ) {
      filter.category = cat.toUpperCase();
    }

    const programs = await BaitulMaal.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: programs.length,
      data: programs,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET PROGRAM BY ID (Slug)
 * Route: GET /api/baitul-maal/:id
 */
export const getProgramById = async (req: AuthRequest, res: Response) => {
  try {
    const idParam = req.params.id as string;
    const cleanId = idParam.toLowerCase().trim();

    const program = await BaitulMaal.findOne({ id: cleanId });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program yang lu cari kaga ada, mbot!",
      });
    }

    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * UPDATE PROGRAM (Kategori & Aset)
 * Route: PUT /api/baitul-maal/:id
 */
export const updateProgram = async (req: AuthRequest, res: Response) => {
  try {
    const idParam = req.params.id as string;
    const cleanId = idParam.toLowerCase().trim();
    const updateData = { ...req.body };
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // 1. Cari dulu data lamanya
    const oldProgram = await BaitulMaal.findOne({ id: cleanId });
    if (!oldProgram) {
      return res.status(404).json({
        success: false,
        message: "Mau update apa mbot? Datanya kaga ada!",
      });
    }

    // 2. Logic Update Images (Kalo ada file baru)
    if (files && files["images"]) {
      // Hapus semua foto lama di Cloudinary biar kaga nyampah
      if (oldProgram.publicIds && oldProgram.publicIds.length > 0) {
        await deleteMultipleFromCloudinary(oldProgram.publicIds, "image");
      }

      // Masukin data foto yang baru
      updateData.images = files["images"].map((f) => f.path);
      updateData.publicIds = files["images"].map((f) => f.filename);
    }

    // 3. Logic Update Videos (Opsional)
    if (files && files["videos"]) {
      // Kalo lu mau handle hapus video lama, logicnya sama kyk images
      updateData.videoUrl = files["videos"].map((f) => f.path);
    }

    // 4. Handle features (Kalo dikirim stringified array)
    if (updateData.features) {
      updateData.features =
        typeof updateData.features === "string"
          ? JSON.parse(updateData.features)
          : updateData.features;
    }

    // 5. Eksekusi Update
    const updated = await BaitulMaal.findOneAndUpdate(
      { id: cleanId },
      updateData,
      { returnDocument: "after" }, 
    );

    res.status(200).json({
      success: true,
      message: "Program sosial berhasil di-update, Wizard!",
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal update program, server meriang!",
      error: error.message,
    });
  }
};

export const deleteProgram = async (req: AuthRequest, res: Response) => {
  try {
    const idParam = req.params.id as string;
    const program = await BaitulMaal.findOne({
      id: idParam.toLowerCase().trim(),
    });

    if (!program)
      return res
        .status(404)
        .json({ success: false, message: "Program ghoib!" });

    // Hapus SEMUA gambar di Cloudinary sak karepe!
    if (program.publicIds.length > 0) {
      await deleteMultipleFromCloudinary(program.publicIds, "image");
    }

    // Hapus video juga kalo ada (opsional)
    // Note: Kalo lu simpen publicId video, caranya sama kyk image.

    await BaitulMaal.findOneAndDelete({ id: program.id });

    res
      .status(200)
      .json({ success: true, message: "Program & Aset Cloudinary musnah!" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
