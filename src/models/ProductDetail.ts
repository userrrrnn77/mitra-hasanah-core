import mongoose, { Document, Model } from "mongoose";

export interface ISection {
  subtitle: string;
  items: string[];
}

export interface IProductDetail {
  id: string; // ID ini wajib COPY-PASTE dari Products.id (Katalog)
  title: string;
  description: string;
  sections: ISection[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductDetailDocument extends IProductDetail, Document {}

export interface IProductDetailModel extends Model<IProductDetailDocument> {
  findBySlug(id: string): Promise<IProductDetailDocument | null>;
}

const SectionSchema = new mongoose.Schema<ISection>(
  {
    subtitle: {
      type: String,
      required: [true, "Subtitle section kaga boleh kosong, mbot!"],
      trim: true,
    },
    items: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => Array.isArray(arr) && arr.length > 0,
        message: "Section minimal kudu punya 1 item, bgsd!",
      },
    },
  },
  { _id: false },
);

const ProductDetailSchema = new mongoose.Schema<
  IProductDetailDocument,
  IProductDetailModel
>(
  {
    id: {
      type: String,
      required: [true, "ID produk (slug) wajib diisi, samain ama katalog!"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, "Judul produk wajib diisi"],
      trim: true,
      maxlength: [150, "Judul kepanjangan, maksimal 150 karakter!"],
    },
    description: {
      type: String,
      required: [true, "Deskripsi produk wajib diisi"],
      trim: true,
      maxlength: [1000, "Deskripsi jangan curhat, maksimal 1000 karakter!"],
    },
    sections: {
      type: [SectionSchema],
      required: true,
      validate: {
        validator: (arr: ISection[]) => Array.isArray(arr) && arr.length > 0,
        message: "Minimal kasih 1 section lah biar pinter nasabahnya!",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "product_details",
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

ProductDetailSchema.statics.findBySlug = function (
  slugId: string,
): Promise<IProductDetailDocument | null> {
  return this.findOne({ id: slugId.toLowerCase().trim() }).exec();
};

ProductDetailSchema.methods.getSectionBySubtitle = function (
  subtitle: string,
): ISection | undefined {
  return (this as IProductDetailDocument).sections.find(
    (s) => s.subtitle.toLowerCase() === subtitle.toLowerCase(),
  );
};

// Export Model
const ProductDetail =
  (mongoose.models.ProductDetail as IProductDetailModel) ||
  mongoose.model<IProductDetailDocument, IProductDetailModel>(
    "ProductDetail",
    ProductDetailSchema,
  );

export default ProductDetail;
