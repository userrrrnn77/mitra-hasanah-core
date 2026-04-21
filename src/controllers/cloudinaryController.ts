// src/controllers/cloudinarySignature.ts
import crypto from "crypto";
import type { Request, Response } from "express";

export const getSignature = (req: Request, res: Response) => {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = "baitul-maal";

  console.log("SECRET:", process.env.CLOUDINARY_API_SECRET);

  // 🔥 STRING HARUS SESUAI PARAM FE
  const stringToSign = `folder=${folder}&timestamp=${timestamp}`;

  const signature = crypto
    .createHash("sha1")
    .update(stringToSign + process.env.CLOUDINARY_API_SECRET)
    .digest("hex");

  res.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
};
