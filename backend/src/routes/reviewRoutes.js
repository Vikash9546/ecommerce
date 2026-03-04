import express from "express";
import { createReview, getProductReviews, deleteReview } from "../controllers/reviewController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/product/:productId", getProductReviews); // Public - anyone can see reviews
router.delete("/:reviewId", protect, deleteReview);

export default router;
