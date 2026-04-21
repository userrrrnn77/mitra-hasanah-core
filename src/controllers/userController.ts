import type { Request, Response } from "express";
import User from "../models/User.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Data kaga lengkap, bgsd!" });
    }

    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Nomor HP udah dipake, mbot!" });
    }

    const imageProfile = req.file ? req.file.path : undefined;

    const newUser = await User.create({
      name,
      phone,
      password,
      role: "ADMIN",
      imageProfile,
    });

    res.status(201).json({
      success: true,
      message: "Register berhasil, selamat datang di KSPPS!",
      data: newUser,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server mual-mual!",
      error: error.message,
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, phone, password, role } = req.body;

    if (!name || !phone || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Lengkapin field-nya, jembut!" });
    }

    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User udah ada, taik!" });
    }

    const imageProfile = req.file ? req.file.path : undefined;

    const newUser = await User.create({
      name,
      phone,
      password,
      role: role || "ADMIN",
      imageProfile,
    });

    res.status(201).json({
      success: true,
      message: "Admin baru berhasil ditanam!",
      data: newUser,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal nanam user!",
      error: error.message,
    });
  }
};

/**
 * AMBIL SEMUA USER (ADMIN ONLY)
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Tarik semua user, tapi password jangan dibawa, bahaya bgsd!
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * AMBIL USER BY ID
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User-nya kaga ketemu, ghoib kali!",
      });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { name, phone, password, imageProfile } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User kaga ketemu, mbot!" });
    }

    // Logic Update Opsional: Ganti cuma kalo ada isinya
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (password) user.password = password; // Otomatis ke-hash pas .save()
    if (imageProfile) {
      user.imageProfile = imageProfile;
    }

    if (req.file) {
      user.imageProfile = req.file.path;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profil udah diupdate, makin ganteng lu Bre!",
      data: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        imageProfile: user.imageProfile,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal update, jembut!",
      error: error.message,
    });
  }
};

/**
 * DELETE USER (ADMIN ONLY)
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Mau apus apa mbot? User kaga ada!" });
    }

    // Proteksi: Jangan sampe admin apus akunnya sendiri secara konyol!
    if (user._id.toString() === req.user?._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Kaga bisa apus akun sendiri bgsd! Masa mau bunuh diri?",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User berhasil dimusnahkan dari database!",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
