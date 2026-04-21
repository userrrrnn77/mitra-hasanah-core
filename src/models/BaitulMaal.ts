import mongoose, { Document, Model } from "mongoose";

export interface IBaitulMaal {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  images?: string[];
  publicIds: string[];
  videoUrl?: string[];
  features?: string[];
  category: "KESEHATAN" | "KEMANUSIAAN" | "SOSIAL";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBaitulMaalDocument extends IBaitulMaal, Document {}

export interface IBaitulMaalModel extends Model<IBaitulMaalDocument> {
  findByCategory(cat: string): Promise<IBaitulMaalDocument[]>;
}

const BaitulMaalSchema = new mongoose.Schema<
  IBaitulMaalDocument,
  IBaitulMaalModel
>(
  {
    id: {
      type: String,
      required: [true, "Slug ID program wajib diisi"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, "Slug hanya boleh huruf, angka, dan dash"],
    },
    title: {
      type: String,
      required: [true, "Judul program wajib diisi"],
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Deskripsi program tidak boleh kosong"],
      trim: true,
    },
    images: {
      type: [String],
      required: [true, "Minimal harus ada 1 foto program, bgsd!"],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "Images tidak boleh kosong",
      },
    },
    publicIds: { type: [String], required: true },
    videoUrl: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ["KESEHATAN", "KEMANUSIAAN", "SOSIAL"],
      required: [true, "Kategori program wajib ditentukan"],
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "baitul_maal",
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Partial<IBaitulMaalDocument>) => {
        delete (ret as any)._id;
        return ret;
      },
    },
  },
);

BaitulMaalSchema.index({ id: 1, category: 1 });

BaitulMaalSchema.statics.findByCategory = function (cat: string) {
  return this.find({ category: cat.toUpperCase() })
    .sort({ createdAt: -1 })
    .exec();
};

const BaitulMaal =
  (mongoose.models.BaitulMaal as IBaitulMaalModel) ||
  mongoose.model<IBaitulMaalDocument, IBaitulMaalModel>(
    "BaitulMaal",
    BaitulMaalSchema,
  );

export default BaitulMaal;
