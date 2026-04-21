import { Document, Schema, model, models } from "mongoose";

export interface IGallery {
  src: string;
  alt: string;
  category?: string;
  publicId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGalleryDocument extends IGallery, Document {}

const GallerySchema = new Schema<IGalleryDocument>(
  {
    src: {
      type: String,
      required: [true, "URL gambar wajib ada, bgsyad!"],
      trim: true,
    },
    alt: {
      type: String,
      required: [false, "Alt text wajib diisi biar SEO lu gacor!"],
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
  (models.Gallery as import("mongoose").Model<IGalleryDocument>) ||
  model<IGalleryDocument>("Gallery", GallerySchema);

export default Gallery;
