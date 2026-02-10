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
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);

import fs from "fs";

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
    const frontendPath = path.resolve(__dirname, "../../frontend/dist");
    console.log("Production Mode: Serving static files from", frontendPath);

    if (fs.existsSync(frontendPath)) {
        console.log("Frontend dist found. Contents:", fs.readdirSync(frontendPath));
    } else {
        console.warn("WARNING: Frontend dist NOT found at", frontendPath);
        try {
            const rootPath = path.resolve(__dirname, "../..");
            console.log("Root directory contents:", fs.readdirSync(rootPath));
        } catch (e) {
            console.error("Could not read root directory");
        }
    }

    app.use(express.static(frontendPath));
    app.get("*", (req, res) => {
        const indexPath = path.join(frontendPath, "index.html");
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            console.error("Requested file not found:", indexPath);
            res.status(404).send("Frontend build not found. Please check Render logs for 'Frontend dist' status.");
        }
    });
}

export default app;
