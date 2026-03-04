import Wishlist from "../models/Wishlist.js";
import mongoose from "mongoose";

// Toggle wishlist (add if not exists, remove if exists)
export const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.userId;

        const existing = await Wishlist.findOne({ user: userId, product: productId });

        if (existing) {
            await Wishlist.deleteOne({ _id: existing._id });
            return res.json({ wishlisted: false, message: "Removed from wishlist" });
        }

        await Wishlist.create({ user: userId, product: productId });
        res.json({ wishlisted: true, message: "Added to wishlist" });
    } catch (err) {
        console.error("Wishlist toggle error:", err.message);
        res.status(500).json({ message: "Error updating wishlist" });
    }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const items = await Wishlist.find({ user: req.userId })
            .populate("product")
            .sort({ createdAt: -1 });

        res.json(items);
    } catch (err) {
        console.error("Get wishlist error:", err.message);
        res.status(500).json({ message: "Error fetching wishlist" });
    }
};

// Check if a product is wishlisted
export const checkWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.json({ wishlisted: false });
        }

        const existing = await Wishlist.findOne({ user: req.userId, product: productId });
        res.json({ wishlisted: !!existing });
    } catch (err) {
        res.status(500).json({ message: "Error checking wishlist" });
    }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        await Wishlist.deleteOne({ user: req.userId, product: productId });
        res.json({ message: "Removed from wishlist" });
    } catch (err) {
        res.status(500).json({ message: "Error removing from wishlist" });
    }
};
