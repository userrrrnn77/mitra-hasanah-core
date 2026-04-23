import mongoose, { Document } from "mongoose";

export interface IProducts {
  id: string; // Slug/ID Manual buat relasi
  title: string;
  fullTitle?: string;
  desc?: string;
  icon: string;
  image?: string;
  publicId?: string; // <--- WAJIB TAMBAHIN INI, BRE!
  category: "simpanan" | "pembiayaan";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductsDocument extends IProducts, Document {}

const ProductsSchema = new mongoose.Schema<IProductsDocument>(
  {
    id: {
      type: String,
      required: [true, "ID Produk (slug) wajib ada, mbot!"],
      unique: true,
      trim: true,
      lowercase: true, // Biar konsisten simpanan-pokok vs Simpanan-Pokok
      index: true,
    },
    title: { type: String, required: true, trim: true },
    fullTitle: { type: String, trim: true },
    desc: { type: String, trim: true },
    icon: { type: String, default: "help-circle", trim: true },
    image: { type: String, trim: true },
    publicId: { type: String, trim: true }, // Tempat nyimpen ID Cloudinary
    category: {
      type: String,
      enum: ["simpanan", "pembiayaan"],
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "products",
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete (ret as any)._id; // Bersihkan sampah _id
        return ret;
      },
    },
  },
);

ProductsSchema.index({ createdAt: -1 });

// Statics buat nyari produk sat-set pake id manual
ProductsSchema.statics.findByIdManual = function (id: string) {
  return this.findOne({ id: id.toLowerCase().trim() });
};

const Products =
  (mongoose.models.Products as import("mongoose").Model<IProductsDocument>) ||
  mongoose.model<IProductsDocument>("Products", ProductsSchema);

export default Products;
