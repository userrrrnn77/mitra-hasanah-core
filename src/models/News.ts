import mongoose, { Schema, model, Document } from "mongoose";

export interface INews extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  images: string[];
  category: string;
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    images: {
      type: [String],
      required: true,
      validate: [
        function (val: string[]) {
          return val.length <= 4;
        },
        "Maksimal hanya boleh 4 foto doang buat collage!",
      ],
    },
    category: {
      type: String,
      enum: ["Berita Koperasi", "Artikel", "Pengumuman"],
      default: "Berita Koperasi",
    },
  },
  {
    timestamps: true,
  },
);

NewsSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
});

const News =
  (mongoose.models.News as mongoose.Model<INews>) ||
  model<INews>("News", NewsSchema);
export default News;
