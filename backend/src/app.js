import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. CORS Configuration
app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        "http://localhost:5173",
        "https://ecommerce-lime-coral.vercel.app"
    ].filter(Boolean),
    credentials: true
}));

app.use(express.json());

// 2. Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);

// 3. Health Check / Root Route
app.get("/", (req, res) => {
    res.json({
        message: "Lumina API is running",
        production: process.env.NODE_ENV === "production"
    });
});

export default app;
