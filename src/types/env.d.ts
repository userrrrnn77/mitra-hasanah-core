// src/types/env.d.ts

declare namespace NodeJs {
  interface ProcessEnv {
    MONGO_URI: string;
    JWT_SECRET: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    PORT: string;
    NODE_ENV: "development" | "production";
  }
}
