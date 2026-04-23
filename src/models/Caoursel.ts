import mongoose, { Document, Model } from "mongoose";

export interface ICarousel extends Document {
  image: string;
  title: string;
  publicId: string;
}

export interface ICarouselDocument extends ICarousel, Document {}

const CarouselSchema = new mongoose.Schema<ICarouselDocument>(
  {
    image: { type: String, required: [true, "Minimal Upload 1 Gambar bre"] },
    title: { type: String, required: true },
    publicId: { type: String },
  },
  {
    timestamps: true,
  },
);

CarouselSchema.index({ createdAt: -1 });

const Carousel =
  (mongoose.models.Carousel as import("mongoose").Model<ICarouselDocument>) ||
  mongoose.model<ICarouselDocument>("Carousel", CarouselSchema);

export default Carousel;
