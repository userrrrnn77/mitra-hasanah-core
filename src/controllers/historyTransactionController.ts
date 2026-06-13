import { Request, Response } from "express";
import HistoryTransaction from "../models/HistoryTranscation.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import Registration from "../models/Registration.js";

export const uploadTransaction = async (req: Request, res: Response) => {
  try {
    const { buktiTransfer, buktiKTP, registrationId } = req.body;

    const nasabah = await Registration.findOne({
      ktpNumber: req.body.registrationId,
    });

    const nasabahId = nasabah?._id?.toString() || "";

    if (!nasabahId) {
      return res
        .status(404)
        .json({ success: false, message: "Registrasi Id Tidak DItemukan" });
    }

    if (!buktiKTP || !buktiTransfer) {
      return res.status(400).json({
        success: false,
        message: "Upload bukti Transfer Dan Scan KTP anda terlebih dahulu",
      });
    }

    const newHistoryTransaction = await HistoryTransaction.create({
      registrationId: nasabahId,
      buktiKTP,
      buktiTransfer,
    });

    return res.status(200).json({
      success: true,
      message: "Berkah! BuktiTransfer Berhasil dikirim..",
      data: newHistoryTransaction,
    });
  } catch (error: any) {
    console.log("Error Server 500", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllHistoryTransaction = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const allHistoryTransaction = await HistoryTransaction.find().sort({
      createdAt: -1,
    });

    if (!allHistoryTransaction) {
      return res
        .status(404)
        .json({ success: false, message: "Tidak ditemukan apa apa..." });
    }

    return res.status(200).json({
      success: true,
      message: "Berhasil ambil data",
      data: allHistoryTransaction,
    });
  } catch (error: any) {
    console.log("Erro Ghaib saat ambil semua data trasasksi", error.message);
    return res.status(500).json({
      success: false,
      message: "Gagal Ambil Data Transanksi di GETALLTRANSACTION",
      error: error.message,
    });
  }
};

export const getDetailHistoryTransaction = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const detailTransaction = await HistoryTransaction.findById(req.params.id);

    if (!detailTransaction) {
      return res.status(404).json({
        success: false,
        message: "Detail Data transaksi tidak di temukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Berhasil Ambil data detail transaksi",
      data: detailTransaction,
    });
  } catch (error: any) {
    console.log("Gagal Ambil data detail transaksi", error.message);
    return res.status(500).json({
      success: false,
      meesage: "Gagal GET by id Detail Transaksi",
      error: error.message,
    });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { buktiKTP, buktiTransfer } = req.body;

    if (!buktiKTP && !buktiTransfer) {
      return res.status(400).json({
        success: false,
        message:
          "Apa yang mau di-patch kalo gada data baru yang dikirim, mbot!",
      });
    }

    const transactionUpdate = await HistoryTransaction.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(buktiKTP && { buktiKTP }),
          ...(buktiTransfer && { buktiTransfer }),
        },
      },
      { new: true },
    );

    if (!transactionUpdate) {
      return res.status(404).json({
        success: false,
        message: "Data transaksi jembot ini tidak ditemukan!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data transaksi berhasil di-patch kasta dewa, Bre!",
      data: transactionUpdate,
    });
  } catch (error: any) {
    console.log("Gagal patch data transaksi", error.message);
    return res.status(500).json({
      success: false,
      message: "Gagal Eksekusi Server PATCH Update Transaction",
      error: error.message,
    });
  }
};

export const deleteHistoryTransaction = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const id = req.params;
    const deleteTranscation = await HistoryTransaction.findByIdAndDelete(id);

    if (!deleteTranscation) {
      return res.status(404).json({
        success: false,
        message: "History tersebut tidak di temukan di database",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Berhasil Hapus History Transaksi" });
  } catch (error: any) {
    console.log("Gagal Hapus History Transaksi", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error Gagal Hapus transaksi",
      error: error.message,
    });
  }
};
