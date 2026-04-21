import { Document, Schema, model, models } from "mongoose";

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

const ProductsSchema = new Schema<IProductsDocument>(
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

// Statics buat nyari produk sat-set pake id manual
ProductsSchema.statics.findByIdManual = function (id: string) {
  return this.findOne({ id: id.toLowerCase().trim() });
};

const Products =
  (models.Products as import("mongoose").Model<IProductsDocument>) ||
  model<IProductsDocument>("Products", ProductsSchema);

export default Products;
