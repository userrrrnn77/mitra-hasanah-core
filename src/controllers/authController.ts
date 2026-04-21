import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Controller buat Login Admin
 * Route: POST /api/auth/login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Nomor HP ama Password wajib diisi!",
      });
    }

    const user = await User.findOne({ phone }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User kaga terdaftar, Typo kali lu!",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password salah, Inget-inget lagi sana!",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      success: true,
      message: "Login sukses! Selamat datang, Wizard!",
      token,
      user: {
        _id: user._id.toString(),
        name: user.name,
        phone: user.phone,
        role: user.role,
        imageProfile: user.imageProfile,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server meledak, Cek log sana!",
      error: error.message,
    });
  }
};

/**
 * Controller Logout
 * Route: POST /api/auth/logout
 */
export const logout = async (_req: Request, res: Response) => {
  try {
    // Kalo lu pake Cookie, lu bisa clear di sini:
    // res.clearCookie('token');

    res.status(200).json({
      success: true,
      message: "Logout sukses! Token lu udah expired secara moral, bgsd!",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal logout, lu terjebak selamanya!",
      error: error.message,
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(404).json({ success: false, message: "User kaga ada" });
    }

    // PAKSA ambil data mentah dan pastiin _id ada
    const userData = req.user.toObject();

    res.status(200).json({
      success: true,
      user: {
        ...userData,
        _id: req.user._id.toString(), // PAKSA JADI STRING BERE!
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal ambil data user.",
      error: error.message,
    });
  }
};
