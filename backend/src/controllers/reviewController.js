import Review from "../models/Review.js";
import mongoose from "mongoose";

// Create or update a review
export const createReview = async (req, res) => {
    try {
        const { productId, rating, title, comment } = req.body;
        const userId = req.userId;

        if (!rating || !comment) {
            return res.status(400).json({ message: "Rating and comment are required" });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        // Upsert: update if exists, create if not
        const review = await Review.findOneAndUpdate(
            { user: userId, product: productId },
            { rating, title, comment },
            { upsert: true, new: true, runValidators: true }
        );

        const populated = await Review.findById(review._id).populate("user", "name email");
        res.status(201).json(populated);
    } catch (err) {
        console.error("Create review error:", err.message);
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Error creating review" });
    }
};

// Get all reviews for a product
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID", reviews: [], totalReviews: 0, avgRating: 0, breakdown: [] });
        }

        const reviews = await Review.find({ product: productId })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        // Calculate stats
        const totalReviews = reviews.length;
        const avgRating = totalReviews > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
            : 0;

        const breakdown = [5, 4, 3, 2, 1].map(star => {
            const count = reviews.filter(r => r.rating === star).length;
            return {
                star,
                count,
                pct: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0,
            };
        });

        res.json({ reviews, totalReviews, avgRating: parseFloat(avgRating), breakdown });
    } catch (err) {
        console.error("Get reviews error:", err.message);
        res.status(500).json({ message: "Error fetching reviews" });
    }
};

// Delete a review (only the author)
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }

        await Review.deleteOne({ _id: reviewId });
        res.json({ message: "Review deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting review" });
    }
};
