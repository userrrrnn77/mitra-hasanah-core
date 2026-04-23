import { Router } from "express";
import {
  addCarousel,
  getAllCarousel,
  deleteCarousel,
} from "../controllers/carouselController.js";
import {
  authMiddleware,
  roleMiddleware,
  antiSpam,
} from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getAllCarousel);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  antiSpam,
  addCarousel,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  deleteCarousel,
);

export default router;
