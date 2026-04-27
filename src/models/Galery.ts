import mongoose, { Document } from "mongoose";

export interface IGallery {
  src: string;
  alt: string;
  category?: string;
  type: "image" | "video"
  publicId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGalleryDocument extends IGallery, Document {}

const GallerySchema = new mongoose.Schema<IGalleryDocument>(
  {
    src: {
      type: String,
      required: [true, "URL gambar wajib ada, bgsyad!"],
      trim: true,
    },
    type: {
      type: String,
      enum: ['image', "video"],
      default: "image",
      required: true
    },
    alt: {
      type: String,
      required: false,
      trim: true,
      maxlength: [100, "Alt text jangan kepanjangan, jembut!"],
    },
    category: {
      type: String,
      default: "umum",
      trim: true,
      lowercase: true,
    },
    publicId: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "gallery",
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Partial<IGalleryDocument>) => {
        delete (ret as any)._id;
        return ret;
      },
    },
  },
);

GallerySchema.index({ createdAt: -1 });

const Gallery =
  (mongoose.models.Gallery as import("mongoose").Model<IGalleryDocument>) ||
  mongoose.model<IGalleryDocument>("Gallery", GallerySchema);

export default Gallery;
