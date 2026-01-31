import express from "express";
import { placeOrder, cancelOrder, cancelOrderItem, getOrderHistory } from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/place", protect, placeOrder);
router.put("/cancel/:id", protect, cancelOrder);
router.put("/cancel-item/:orderId/:itemId", protect, cancelOrderItem);
router.get("/history", protect, getOrderHistory);

export default router;
