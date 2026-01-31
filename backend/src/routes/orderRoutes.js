import express from "express";
import { placeOrder, cancelOrder, getOrderHistory } from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/place", protect, placeOrder);
router.put("/cancel/:id", protect, cancelOrder);
router.get("/history", protect, getOrderHistory);

export default router;
