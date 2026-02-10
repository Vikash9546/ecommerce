import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { token } = useAuth();

    useEffect(() => {
        API.get(`/products/${id}`)
            .then((res) => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch product:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!product) return (
        <div className="container text-center py-20">
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Product Not Found</h2>
            <button onClick={() => navigate("/")} className="btn btn-primary">Back to Home</button>
        </div>
    );

    return (
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 mb-8 hover:text-primary transition-colors"
                style={{ color: 'var(--text-muted)' }}
            >
                <ArrowLeft size={20} /> Back to Collection
            </button>

            <div className={`grid grid-cols-1 md:grid-cols-2 ${window.innerWidth < 768 ? 'gap-6' : 'gap-12'} items-start`}>
                {/* Product Image */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass aspect-square rounded-3xl overflow-hidden relative group"
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </motion.div>

                {/* Product Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6"
                >
                    <div>
                        <span style={{
                            color: 'var(--primary)',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            {product.category}
                        </span>
                        <h1 style={{ fontSize: window.innerWidth < 768 ? '2rem' : '3rem', fontWeight: 700, marginTop: '8px' }}>{product.name}</h1>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center text-yellow-400">
                                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                            </div>
                            <span style={{ color: 'var(--text-muted)' }}>(128 Reviews)</span>
                        </div>
                    </div>

                    <div style={{ fontSize: window.innerWidth < 768 ? '1.8rem' : '2.5rem', fontWeight: 600, color: 'var(--primary)' }}>
                        ₹{product.price}
                    </div>

                    <p style={{
                        fontSize: window.innerWidth < 768 ? '0.95rem' : '1.1rem',
                        color: 'var(--text-muted)',
                        lineHeight: '1.8',
                        maxWidth: '600px'
                    }}>
                        {product.description || "Experience the pinnacle of design and functionality with this premium piece from Lumina. Meticulously crafted using the finest materials, it seamlessly blends aesthetic elegance with durable performance for the modern home."}
                    </p>

                    <div className="flex flex-col gap-4 mt-4">
                        <button
                            onClick={() => {
                                if (!token) {
                                    navigate("/login");
                                    return;
                                }
                                addToCart(product._id);
                            }}
                            className="btn btn-primary w-full md:w-auto text-lg py-4 px-12 flex items-center justify-center gap-3"
                        >
                            <ShoppingCart size={22} /> Add to Cart
                        </button>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Stock available: {product.stock || 50} units
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <ShieldCheck className="text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">Quality Assured</p>
                                <p className="text-sm text-muted">100% Original</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Truck className="text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">Fast Delivery</p>
                                <p className="text-sm text-muted">2-3 Business Days</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <RefreshCw className="text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">Easy Returns</p>
                                <p className="text-sm text-muted">14 Day Policy</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetail;
