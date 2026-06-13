import { Router } from "express";
import {
  deleteHistoryTransaction,
  getAllHistoryTransaction,
  getDetailHistoryTransaction,
  updateTransaction,
  uploadTransaction,
} from "../controllers/historyTransactionController.js";
import { roleMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// public
router.post("/uploadTransaction", uploadTransaction);
// admin
router.get(
  "/historyTransaction",
  roleMiddleware(["ADMIN"]),
  getAllHistoryTransaction,
);
router.get(
  "/historyTransaction/:id",
  roleMiddleware(["ADMIN"]),
  getDetailHistoryTransaction,
);
router.patch("historyUpdate/:id", roleMiddleware(["ADMIN"]), updateTransaction);
router.delete(
  "/deleteTransaction/:id",
  roleMiddleware(["ADMIN"]),
  deleteHistoryTransaction,
);

export default router;
