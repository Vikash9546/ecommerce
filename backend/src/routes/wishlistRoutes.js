import express from "express";
import { toggleWishlist, getWishlist, checkWishlist, removeFromWishlist } from "../controllers/wishlistController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/toggle", protect, toggleWishlist);
router.get("/", protect, getWishlist);
router.get("/check/:productId", protect, checkWishlist);
router.delete("/:productId", protect, removeFromWishlist);

export default router;
