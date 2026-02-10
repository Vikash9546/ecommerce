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

app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        "http://localhost:5173",
        "https://ecommerce-kw0k.onrender.com" // Adding your specific Render URL for safety
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);

import fs from "fs";

// Serve static assets in production (optional for separate frontend deployment)
if (process.env.NODE_ENV === "production") {
    const frontendPath = path.resolve(__dirname, "../../frontend/dist");

    if (fs.existsSync(frontendPath)) {
        console.log("Production: Serving static frontend from", frontendPath);
        app.use(express.static(frontendPath));
        app.get("*", (req, res) => {
            const indexPath = path.join(frontendPath, "index.html");
            if (fs.existsSync(indexPath)) {
                res.sendFile(indexPath);
            } else {
                res.status(404).json({ message: "Frontend build not found at " + indexPath });
            }
        });
    } else {
        console.log("Production: Dedicated Backend Mode (No local frontend dist found)");
        app.get("/", (req, res) => {
            res.json({ message: "Lumina API is running", frontendUrl: process.env.FRONTEND_URL });
        });
    }
}

export default app;
