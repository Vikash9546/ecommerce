import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://vikashkumarmystyle_db_user:Vikash@cluster0.irqq4cx.mongodb.net/?appName=Cluster0";

const productSchema = new mongoose.Schema({
    name: String,
    image: String,
});

const Product = mongoose.model("Product", productSchema);

const updateImage = async (name, newUrl) => {
    try {
        await mongoose.connect(MONGO_URI);
        const result = await Product.updateOne({ name: new RegExp(`^${name}$`, 'i') }, { image: newUrl });

        if (result.matchedCount > 0) {
            console.log(`✅ Successfully updated image for product: "${name}"`);
        } else {
            console.log(`❌ Product not found: "${name}"`);
            const similar = await Product.find({ name: new RegExp(name, 'i') }).limit(5);
            if (similar.length > 0) {
                console.log("Did you mean one of these?");
                similar.forEach(p => console.log(` - ${p.name}`));
            }
        }
        process.exit(0);
    } catch (error) {
        console.error("Update failed:", error);
        process.exit(1);
    }
};

const [, , name, url] = process.argv;

if (!name || !url) {
    console.log("Usage: node updateProductImage.js \"Product Name\" \"http://new-url.com/image.jpg\"");
    process.exit(1);
}

updateImage(name, url);
