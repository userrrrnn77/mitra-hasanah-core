// src/routes/newsRoutes.ts
import { Router } from "express";
import {
  createNews,
  getAllNews,
  getNewsDetailBySlug,
  deleteNews,
} from "../controllers/newsController.js";

const router = Router();

router.get("/", getAllNews);

router.get("/:slug", getNewsDetailBySlug);

router.post("/", createNews);

router.delete("/:id", deleteNews);

export default router;
