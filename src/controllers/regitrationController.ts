// src/controllers/regitrationController.ts

import type { Request, Response } from "express";
import Registration, {
  type RegistrationDocument,
} from "../models/Registration";
import mongoose from "mongoose";

export const registration = async (req: Request, res: Response) => {
  try {
    // 🔐 Destructure (whitelist manual)
    const {
      fullName,
      birthPlace,
      birthDate,
      gender,
      addressKTP,
      addressDomisili,
      phoneNumber,
      ktpNumber,
      occupation,
      maritalStatus,
      education,
      religion,
      monthlyIncome,
      selectedProduct,
      initialDeposit,
      heirName,
      heirAddress,
    } = req.body;

    // ⚠️ Basic validation (fail fast)
    if (
      !fullName ||
      !birthPlace ||
      !birthDate ||
      !gender ||
      !addressKTP ||
      !addressDomisili ||
      !phoneNumber ||
      !ktpNumber ||
      !occupation ||
      !maritalStatus ||
      !education ||
      !religion ||
      !monthlyIncome ||
      !selectedProduct ||
      !initialDeposit
    ) {
      return res.status(400).json({
        success: false,
        message: "Data wajib belum lengkap",
      });
    }

    // 🔁 Optional: normalize data kecil-kecilan
    const normalizedPhone = phoneNumber.replace(/^0/, "62");

    // 🔍 Cek duplicate KTP
    const exists = await Registration.exists({ ktpNumber });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "NIK sudah terdaftar",
      });
    }

    // 🧱 Build clean object (TS infer otomatis)
    const data = {
      fullName,
      birthPlace,
      birthDate,
      gender,
      addressKTP,
      addressDomisili,
      phoneNumber: normalizedPhone,
      ktpNumber,
      occupation,
      maritalStatus,
      education,
      religion,
      monthlyIncome,
      selectedProduct,
      initialDeposit,
      heirName,
      heirAddress,
      // ❗ isVerified gak diambil dari user
    };

    // 💾 Insert
    const result = await Registration.create(data);

    // 📤 Response minimal (jangan expose semua)
    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: {
        id: result._id,
        fullName: result.fullName,
        isVerified: result.isVerified,
      },
    });
  } catch (error: any) {
    // ❌ Duplicate key (unique index)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "NIK sudah terdaftar",
      });
    }

    // ❌ Validation mongoose
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("❌ Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const isVerification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // ✅ validasi ObjectId
    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({
        success: false,
        message: "Format ID tidak valid",
      });
    }

    const pendaftar = await Registration.findById(id);

    if (!pendaftar) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    if (pendaftar.isVerified) {
      return res.status(409).json({
        success: false,
        message: "User sudah terverifikasi",
      });
    }

    pendaftar.isVerified = true;
    await pendaftar.save();

    return res.status(200).json({
      success: true,
      message: "User berhasil diverifikasi",
      data: {
        id: pendaftar._id,
        fullName: pendaftar.fullName,
        isVerified: pendaftar.isVerified,
      },
    });
  } catch (error) {
    console.error("❌ Verification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
