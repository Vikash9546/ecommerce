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
    { name: "Kitchen & Dining", keywords: ["cookware", "cutlery", "blender", "coffee maker", "dinnerware", "toaster", "kettle", "pan", "grill", "mixing bowl"] },
    { name: "Home Decor", keywords: ["vase", "sculpture", "painting", "candle", "mirror", "clock", "rug", "curtain", "pillow", "frame"] },
    { name: "Furniture", keywords: ["sofa", "chair", "table", "bookshelf", "bed", "desk", "stool", "cabinet", "shelf", "bench"] },
    { name: "Bedding & Bath", keywords: ["towel", "bathrobe", "sheet", "duvet", "pillowcase", "bath mat", "shower curtain", "shampoo", "soap", "lotion"] },
    { name: "Garden & Outdoor", keywords: ["planter", "garden tools", "bench", "fountain", "outdoor light", "patio chair", "hose", "mower", "fence", "seeds"] },
    { name: "Cleaning Essentials", keywords: ["vacuum", "mop", "detergent", "brush", "bucket", "gloves", "spray", "sponge", "duster", "bin"] },
    { name: "Lighting", keywords: ["floor lamp", "desk lamp", "pendant light", "chandelier", "sconce", "smart bulb", "lantern", "night light", "ceiling fan", "torch"] },
    { name: "Organization", keywords: ["basket", "tray", "hooks", "rack", "organizer", "bin", "box", "hanger", "drawer", "shelf"] }
];

const adjectives = ["Premium", "Minimalist", "Modern", "Classic", "Deluxe", "Ergonomic", "Luxury", "Handcrafted", "Sustainable", "Sleek", "Durable", "Elegant", "Vintage", "Compact", "Nordic", "Artisan"];

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

            const name = `${adj} ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`;
            const price = Math.floor(Math.random() * 1800) + 200; // Prices between ₹200 and ₹2000
            const stock = Math.floor(Math.random() * 100) + 10;
            const description = `The ${name} represents the pinnacle of Lumina's ${categoryObj.name} collection. Engineered for those who demand minimalist beauty and professional performance.`;

            products.push({
                name,
                price,
                // Using 'minimalist' tag which was verified to provide high-quality, professional product shots
                image: `https://loremflickr.com/800/800/${keyword},minimalist?lock=${i}`,
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
