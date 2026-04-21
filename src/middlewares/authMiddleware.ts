import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUserDocument, UserDocument } from "../models/User.js";
import { rateLimit } from "express-rate-limit";

const rateLimitFn: any = rateLimit;

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

export interface AuthRequest extends Request {
  user?: UserDocument;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Otorisasi ditolak, token kaga ketemu bre",
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) throw new Error("JWT_SECRET kaga ada di .env bre,");

    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User-nya udah kaga ada di DB.",
      });
    }

    req.user = user;
    next();
  } catch (error: any) {
    const msg =
      error.name === "TokenExpiredError"
        ? "Token expired, login lagi sana!"
        : "Token palsu lu, mau ngapain?";
    res.status(401).json({ success: false, message: msg });
  }
};

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Data user kaga ketemu, login dulu bgsd!",
      });
    }

    const userRole = req.user.role.toUpperCase();
    const roles = allowedRoles.map((r) => r.toUpperCase());

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak: Lu cuma "${req.user.role}", kaga level masuk sini mbot!`,
      });
    }

    next();
  };
};

export const loginLimiter = rateLimitFn({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req: AuthRequest, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Lu login mulu kayak mau ngerampok, tunggu 15 menit lagi bgsd!",
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const antiSpam = rateLimitFn({
  windowMs: 1 * 60 * 1000,
  max: 5,
  handler: (req: AuthRequest, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Sabar jembut, jari lu kaga usah kenceng-kenceng ngetap-nya!",
    });
  },
});
