import express from "express";
import { placeOrder } from "../controllers/orderController.js";
import { getOrderHistory } from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/place", protect, placeOrder);
router.get("/history", protect, getOrderHistory);

export default router;
