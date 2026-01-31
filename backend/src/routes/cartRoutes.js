import express from "express";
import { addToCart, getCart, updateQuantity, removeFromCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", addToCart);
router.put("/update", updateQuantity);
router.delete("/remove/:userId/:productId", removeFromCart);
router.get("/:userId", getCart);

export default router;
