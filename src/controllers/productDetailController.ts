import type { Request, Response } from "express";
import ProductDetail from "../models/ProductDetail.js";
import Products from "../models/Products.js";
import { AuthRequest } from "@/middlewares/authMiddleware.js";

/**
 * CREATE PRODUCT DETAIL
 * Lu panggil ini setelah sukses bikin Katalog Products, bgsyad!
 */
export const createDetail = async (req: AuthRequest, res: Response) => {
  try {
    const { id, title, description, sections } = req.body;

    // 1. Jinakin TypeScript: Paksa ID jadi string tunggal
    const cleanId = String(id).toLowerCase().trim();

    // 2. Validasi: Apakah Katalognya beneran ada?
    // Jangan sampe bikin detail buat barang yang kaga ada di katalog, jembut!
    const catalogExists = await Products.findOne({ id: cleanId });
    if (!catalogExists) {
      return res.status(404).json({
        success: false,
        message: "Produk di katalog kaga ketemu! Bikin katalognya dulu, mbot!",
      });
    }

    // 3. Validasi: Jangan sampe detailnya dobel
    const detailExists = await ProductDetail.findBySlug(cleanId);
    if (detailExists) {
      return res.status(400).json({
        success: false,
        message: "Detail buat produk ini udah ada, update aja lah!",
      });
    }

    // 4. Handle sections (Kalo dari FormData biasanya bentuknya string JSON)
    const parsedSections =
      typeof sections === "string" ? JSON.parse(sections) : sections;

    const newDetail = await ProductDetail.create({
      id: cleanId,
      title,
      description,
      sections: parsedSections,
    });

    res.status(201).json({
      success: true,
      message: "Brosur detail berhasil dirakit, mewah bgsd!",
      data: newDetail,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET DETAIL BY ID (SLUG)
 * Route: GET /api/product-details/:id
 */
export const getDetailById = async (req: AuthRequest, res: Response) => {
  try {
    // FIX TS: Cast params.id biar kaga error toLowerCase
    const idParam = req.params.id as string;
    const cleanId = idParam.toLowerCase().trim();

    const detail = await ProductDetail.findBySlug(cleanId);
    if (!detail) {
      return res.status(404).json({
        success: false,
        message: "Detail kaga ketemu! Belom diisi kali, mbot!",
      });
    }

    res.status(200).json({ success: true, data: detail });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * UPDATE PRODUCT DETAIL
 */
export const updateDetail = async (req: AuthRequest, res: Response) => {
  try {
    const idParam = req.params.id as string;
    const cleanId = idParam.toLowerCase().trim();
    const { title, description, sections } = req.body;

    const detail = await ProductDetail.findBySlug(cleanId);
    if (!detail) {
      return res.status(404).json({
        success: false,
        message: "Data ghoib, kaga ada yang bisa di-update!",
      });
    }

    // Update field yang masuk aja
    if (title) detail.title = title;
    if (description) detail.description = description;
    if (sections) {
      detail.sections =
        typeof sections === "string" ? JSON.parse(sections) : sections;
    }

    await detail.save();

    res.status(200).json({
      success: true,
      message: "Detail berhasil diperbarui, auto-wizard!",
      data: detail,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * DELETE PRODUCT DETAIL
 */
export const deleteDetail = async (req: AuthRequest, res: Response) => {
  try {
    const idParam = req.params.id as string;
    const cleanId = idParam.toLowerCase().trim();

    const deleted = await ProductDetail.findOneAndDelete({ id: cleanId });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Emang udah kaga ada datanya, bgsd!",
      });
    }

    res.status(200).json({ success: true, message: "Detail produk musnah!" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
