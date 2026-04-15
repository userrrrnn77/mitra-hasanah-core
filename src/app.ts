// src/app.ts

import express, {
  type NextFunction,
  type Response,
  type Request,
} from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import indexRoutes from "./routes/routes.js";

const app = express();

app.set("trust proxy", 1);

// app.use(helmet());
app.use(morgan("dev")); // Tambahin ini biar lu bisa liat log request di terminal!

app.use(
  cors({
    origin: "*",
    // methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    // allowedHeaders: ["Content-Type", "Authorization"],
    // credentials: true,
  }),
);

app.options("*", (req, res) => {
  res.status(204).end(); // Kasih tau browser: "Oke Bre, aman!"
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// 📍 API Routes
app.use("/api", indexRoutes);

// 📍 Health Check / Landing
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Backend Mitra Hasanah JosJis",
    timestamp: new Date(),
  });
});

// ⚠️ Global 404 Handler (Taruh setelah routes!)
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} Tidak Ditemukan, jangan ngasal bre!`,
  });
});

// ❌ Global Error Handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    console.error("🚨 SERVER ERROR:", err.stack);
    return res.status(500).json({
      success: false,
      message: `Terjadi Kesalahan Pada Internal Server`,
      error: process.env.NODE_ENV === "development" ? err.message : null,
    });
  }

  console.error("🚨 GHOIB ERROR:", err);
  return res.status(500).json({
    success: false,
    message: "Anjir, ada error ghoib bre!",
    error: process.env.NODE_ENV === "development" ? err : null,
  });
});

export default app;
