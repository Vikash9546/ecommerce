import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load env from backend folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGO_URI = "mongodb+srv://vikashkumarmystyle_db_user:Vikash@cluster0.irqq4cx.mongodb.net/?appName=Cluster0";

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    description: String,
    category: String,
    stock: Number,
});

const Product = mongoose.model("Product", productSchema);

const categories = [
    { name: "Electronics", keywords: ["tech", "gadget", "device", "laptop", "phone"] },
    { name: "Kitchen", keywords: ["cook", "chef", "pan", "kettle", "coffee"] },
    { name: "Home", keywords: ["furniture", "decor", "lamp", "pillow", "bed"] },
    { name: "Fashion", keywords: ["clothing", "style", "watch", "shoes", "bag"] },
    { name: "Personal Care", keywords: ["grooming", "shampoo", "soap", "brush", "spa"] },
    { name: "Fitness", keywords: ["gym", "workout", "yoga", "dumbbells", "sport"] },
    { name: "Stationery", keywords: ["office", "pen", "notebook", "desk", "paper"] },
    { name: "Accessories", keywords: ["jewelry", "belt", "wallet", "glasses", "hat"] },
    { name: "Decor", keywords: ["art", "plant", "vase", "frame", "mirror"] },
    { name: "Garden", keywords: ["tools", "plants", "seeds", "outdoor", "grass"] }
];

const adjectives = ["Premium", "Ultra", "Smart", "Eco", "Pro", "Essential", "Modern", "Classic", "Deluxe", "Ergonomic"];

const seed = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for bulk seeding...");

        await Product.deleteMany({});
        console.log("Cleared existing products.");

        const products = [];
        for (let i = 1; i <= 1000; i++) {
            const categoryObj = categories[Math.floor(Math.random() * categories.length)];
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const keyword = categoryObj.keywords[Math.floor(Math.random() * categoryObj.keywords.length)];

            const name = `${adj} ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} ${i}`;
            const price = Math.floor(Math.random() * 20000) + 500;
            const stock = Math.floor(Math.random() * 100) + 10;
            const description = `This is a high-quality ${name} from our ${categoryObj.name} collection. Perfect for your daily life.`;

            // Use specific Unsplash IDs or search queries with indices to ensure variation
            const image = `https://images.unsplash.com/photo-${i + 1500000000000}?auto=format&fit=crop&q=60&w=800&q=${keyword}`;
            // Better way for Unsplash variation: use source.unsplash.com with tags and random seed
            const imageUrl = `https://source.unsplash.com/featured/800x800?${keyword},${i}`;

            // Actually, source.unsplash is deprecated. Let's use a more stable pattern or curated list of IDs
            // For 1000, we can use a query and random page/ID approach

            products.push({
                name,
                price,
                image: `https://loremflickr.com/800/800/${keyword}?lock=${i}`, // Reliable placeholder for variety
                description,
                category: categoryObj.name,
                stock
            });

            if (i % 200 === 0) console.log(`Generated ${i} products...`);
        }

        await Product.insertMany(products);
        console.log("Successfully seeded 1000 products!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seed();
