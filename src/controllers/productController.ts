import type { Request, Response } from "express";
import Products from "../models/Products.js";
import ProductDetail from "../models/ProductDetail.js";
import { deleteFromCloudinary } from "../middlewares/uploadMiddleware.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";

/**
 * TAMBAH PRODUK BARU
 */
export const addNewProduct = async (req: AuthRequest, res: Response) => {
  try {
    // 1. Ambil SEMUA data dari body (karena Frontend kirim JSON)
    const { id, title, fullTitle, desc, icon, category, image, publicId } =
      req.body;

    // Log buat lu buktiin sendiri di terminal nanti
    console.log("ISI BODY, BRE:", req.body);

    const cleanId = String(id).toLowerCase().trim();

    // 2. Cek duplikat
    const exists = await Products.findOne({ id: cleanId });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "ID Produk udah kepake, mbot!",
      });
    }

    // 3. Simpan langsung! Kaga usah pake req.file lagi
    const newProduct = await Products.create({
      id: cleanId,
      title,
      fullTitle,
      desc,
      icon,
      image, // Ini dapet string URL dari Cloudinary via Frontend
      publicId, // Ini dapet public_id buat hapus-hapusan nanti
      category,
    });

    res.status(201).json({
      success: true,
      message: "Produk mejeng di katalog! Lanjut isi detailnya, Bre!",
      data: newProduct,
    });
  } catch (error: any) {
    console.error("ERROR NYEKEK:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET FULL PRODUCT DATA (Catalog + Detail)
 */
export const getFullProductData = async (req: AuthRequest, res: Response) => {
  try {
    // FIX: Ambil dari params dan paksa jadi string
    const idParam = req.params.id as string;
    const cleanId = idParam.toLowerCase().trim();

    const [catalog, detail] = await Promise.all([
      Products.findOne({ id: cleanId }),
      ProductDetail.findOne({ id: cleanId }),
    ]);

    if (!catalog) {
      return res.status(404).json({
        success: false,
        message: "Produk kaga terdaftar di katalog, mbot!",
      });
    }

    const fullData = {
      ...catalog.toJSON(),
      details: detail ? detail.sections : [],
    };

    res.status(200).json({
      success: true,
      message: "Data lengkap berhasil ditarik, Wizard!",
      data: fullData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server lagi pusing pas narik data lengkap!",
      error: error.message,
    });
  }
};

/**
 * AMBIL SEMUA PRODUK (Filterable)
 */
export const getAllProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { cat } = req.query;
    let filter: any = {};

    // Cek typeof biar TS tenang kaga teriak array lagi
    if (typeof cat === "string" && ["simpanan", "pembiayaan"].includes(cat)) {
      filter.category = cat;
    }

    const data = await Products.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
/**
 * UPDATE PRODUK
 */
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Kalo upload foto baru, bersihin foto lama dulu biar kaga boncos kuota!
    if (req.file) {
      const oldProduct = await Products.findOne({ id });
      if (oldProduct?.publicId) {
        await deleteFromCloudinary(oldProduct.publicId);
      }
      updateData.image = req.file.path;
      updateData.publicId = req.file.filename;
    }

    const updated = await Products.findOneAndUpdate({ id }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Gagal update, produk ghoib!" });

    res
      .status(200)
      .json({ success: true, message: "Produk updated!", data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * DELETE PRODUK (SINKRONISASI TOTAL)
 */
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Products.findOne({ id });

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Kaga ada yang perlu diapus!" });

    // 1. Hapus aset di Cloudinary pake publicId yang valid
    if (product.publicId) {
      await deleteFromCloudinary(product.publicId);
    }

    // 2. Hapus Katalog-nya
    await Products.findOneAndDelete({ id });

    // 3. Hapus Detail-nya juga biar kaga jadi sampah (Data Yatim Piatu)!
    await ProductDetail.findOneAndDelete({ id });

    res.status(200).json({
      success: true,
      message: "Katalog & Detail Produk musnah dari bumi, bgsyad!",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
