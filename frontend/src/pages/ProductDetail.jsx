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
    const [adding, setAdding] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const { addToCart } = useCart();
    const { token } = useAuth();

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        API.get(`products/${id}`)
            .then((res) => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch product:", err);
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = async () => {
        if (!token) {
            navigate("/login");
            return;
        }
        setAdding(true);
        try {
            await addToCart(product._id);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (err) {
            console.error("Add to cart failed:", err);
        } finally {
            setAdding(false);
        }
    };

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
        <div className="container" style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: 'calc(var(--nav-height, 80px) + 20px) 16px 40px',
            overflowX: 'hidden'
        }}>
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 mb-8 hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
            >
                <ArrowLeft size={20} /> <span className="hidden md:inline">Back to Collection</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                {/* Product Image Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full relative"
                >
                    <div className="glass rounded-[2rem] overflow-hidden relative group aspect-square flex items-center justify-center p-4 md:p-8"
                        style={{
                            background: 'var(--card-bg, var(--bg-secondary))',
                            maxHeight: '600px',
                            margin: '0 auto'
                        }}>
                        <img
                            src={product.image}
                            alt={product.name}
                            className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                    </div>
                </motion.div>

                {/* Product Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col gap-6 w-full"
                    style={{ minWidth: 0 }} // Prevent text overflow in flex items
                >
                    <div className="space-y-4">
                        <span className="inline-block px-4 py-1.5 rounded-full glass" style={{
                            color: 'var(--primary)',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            background: 'rgba(var(--accent-primary-rgb), 0.1)'
                        }}>
                            {product.category}
                        </span>
                        <h1 className="font-bold leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>{product.name}</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center text-yellow-500">
                                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                            </div>
                            <span className="text-muted text-sm md:text-base">(128 Verified Reviews)</span>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-4 flex-wrap">
                        <span className="text-4xl md:text-5xl font-bold text-primary">₹{product.price}</span>
                        {product.oldPrice && (
                            <span className="text-xl line-through text-muted">₹{product.oldPrice}</span>
                        )}
                    </div>

                    <p className="text-muted leading-relaxed" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
                        {product.description || "Experience the pinnacle of design and functionality with this premium piece from Lumina. Meticulously crafted using the finest materials, it seamlessly blends aesthetic elegance with durable performance for the modern home."}
                    </p>

                    <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={adding || product.stock === 0}
                                className={`btn ${showSuccess ? 'btn-success' : 'btn-primary'} flex-1 text-lg py-5 px-8 flex items-center justify-center gap-3 transition-all active:scale-95`}
                                style={{
                                    borderRadius: '16px',
                                    background: showSuccess ? 'var(--accent-secondary)' : undefined,
                                    width: '100%'
                                }}
                            >
                                {adding ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                                ) : showSuccess ? (
                                    <>Success! <ShieldCheck size={22} /></>
                                ) : (
                                    <><ShoppingCart size={22} /> Add to Cart</>
                                )}
                            </button>
                        </div>
                        <p className="text-sm text-muted flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {product.stock > 0 ? `${product.stock} units available in stock` : 'Out of stock'}
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                        {[
                            { icon: <ShieldCheck size={20} />, title: "Quality Assured", desc: "100% Original" },
                            { icon: <Truck size={20} />, title: "Fast Delivery", desc: "Express Shipping" },
                            { icon: <RefreshCw size={20} />, title: "Easy Returns", desc: "14-Day Policy" },
                            { icon: <Star size={20} />, title: "Premium Support", desc: "24/7 Help" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 glass p-4 rounded-2xl">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                                    {item.icon}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <p className="font-semibold text-sm truncate">{item.title}</p>
                                    <p className="text-xs text-muted truncate">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetail;
