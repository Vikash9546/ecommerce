import express from "express";
import { addToCart, getCart, updateQuantity, removeFromCart } from "../controllers/cartController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // Apply protect to all routes below

router.post("/add", addToCart);
router.put("/update", updateQuantity);
router.delete("/remove/:productId", removeFromCart);
router.get("/", getCart);

export default router;
