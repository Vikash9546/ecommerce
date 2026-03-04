import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { Heart, Star, Truck, ShieldCheck, ArrowLeft, Plus, Minus, Check, ArrowRight, ArrowLeft as ArrowLeftIcon, MessageSquare } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(0);
    const { addToCart } = useCart();
    const { token } = useAuth();
    const [relatedProducts, setRelatedProducts] = useState([]);

    // Wishlist & Reviews State
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState({ totalReviews: 0, avgRating: 0, breakdown: [] });
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        // Fetch current product
        API.get(`products/${id}`)
            .then((res) => {
                setProduct(res.data);
                setLoading(false);
                // Fetch recommended
                API.get("products")
                    .then(relatedRes => {
                        const all = relatedRes.data.filter(p => p._id !== id).slice(0, 3);
                        setRelatedProducts(all);
                    })
                    .catch(() => { });
            })
            .catch((err) => {
                console.error("Failed to fetch product:", err);
                setLoading(false);
            });

        // Fetch Wishlist status
        if (token) {
            API.get(`wishlist/check/${id}`).then(res => setIsWishlisted(res.data.wishlisted)).catch(() => { });
        }

        // Fetch Reviews
        API.get(`reviews/product/${id}`).then(res => {
            setReviews(res.data.reviews);
            setReviewStats({
                totalReviews: res.data.totalReviews,
                avgRating: res.data.avgRating,
                breakdown: res.data.breakdown
            });
        }).catch(() => { });

        window.scrollTo(0, 0);
    }, [id, token]);

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid #F1F5F9", borderTopColor: "#FF2E5B", animation: "spin 1s linear infinite" }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (!product) return (
        <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#0F172A' }}>Product Not Found</h2>
            <button onClick={() => navigate("/")} className="btn" style={{ padding: '12px 30px', backgroundColor: '#FF2E5B', color: 'white', borderRadius: '50px' }}>Back to Shop</button>
        </div>
    );

    const colors = ["#FDE047", "#DBEAFE", "#FFFFFF"]; // Mock colors for standard display
    const images = product.images?.length > 0 ? product.images : [
        product.image || "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=600&auto=format&fit=crop"
    ];

    const mainImage = images[0];

    const handleAddToCart = () => {
        if (!token) {
            navigate("/login");
            return;
        }
        for (let i = 0; i < quantity; i++) {
            addToCart(product._id);
        }
        toast.success("Added to cart");
    };

    const handleToggleWishlist = async () => {
        if (!token) {
            toast.error("Please login to use wishlist");
            navigate("/login");
            return;
        }
        try {
            const res = await API.post("wishlist/toggle", { productId: product._id });
            setIsWishlisted(res.data.wishlisted);
            if (res.data.wishlisted) toast.success("Added to wishlist");
            else toast.success("Removed from wishlist");
        } catch (err) {
            toast.error("Failed to update wishlist");
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!token) {
            toast.error("Please login to write a review");
            navigate("/login");
            return;
        }
        if (!reviewComment.trim()) return;

        setSubmittingReview(true);
        try {
            const res = await API.post("reviews", {
                productId: product._id,
                rating: reviewRating,
                comment: reviewComment,
            });
            toast.success("Review submitted!");
            setShowReviewForm(false);
            setReviewComment("");

            // Reload reviews to show the new stats
            const reviewRes = await API.get(`reviews/product/${id}`);
            setReviews(reviewRes.data.reviews);
            setReviewStats({
                totalReviews: reviewRes.data.totalReviews,
                avgRating: reviewRes.data.avgRating,
                breakdown: reviewRes.data.breakdown
            });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };

    return (
        <div style={{ backgroundColor: "#FFFFFF", minHeight: "100vh", paddingBottom: "80px" }}>
            <div className="container" style={{ padding: "40px 24px" }}>

                {/* Breadcrumbs */}
                <div style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "30px", display: "flex", gap: "8px", fontWeight: "500" }}>
                    <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
                    <span>/</span>
                    <Link to={`/?category=${product.category || 'Lighting'}`} style={{ color: "#64748B", textDecoration: "none" }}>{product.category || "Lighting"}</Link>
                    <span>/</span>
                    <span style={{ color: "#0F172A", fontWeight: "700" }}>{product.name}</span>
                </div>

                <div className="product-detail-layout">

                    {/* Left Column: Images & Details */}
                    <div style={{ flex: "1 1 60%" }}>

                        {/* Main Image */}
                        <div className="product-detail-image-container" style={{
                            width: "100%",
                            height: "550px",
                            backgroundColor: "#F3F4F6",
                            borderRadius: "24px",
                            overflow: "hidden",
                            marginBottom: "20px"
                        }}>
                            <img
                                src={mainImage}
                                alt={product.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>

                        {/* Thumbnails */}
                        <div style={{ display: "flex", gap: "16px", marginBottom: "60px" }}>
                            {images.slice(0, 4).map((img, i) => (
                                <div key={i} style={{
                                    width: "120px",
                                    height: "120px",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    border: i === 0 ? "2px solid #FF2E5B" : "2px solid transparent",
                                    position: "relative",
                                    cursor: "pointer",
                                    backgroundColor: "#F3F4F6"
                                }}>
                                    <img src={img} alt={`Thumb ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    {i === 3 && images.length > 4 && (
                                        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "0.9rem" }}>
                                            + {images.length - 4} more
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Specifications */}
                        <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0F172A", marginBottom: "20px" }}>Product Specifications</h3>
                        <div style={{ border: "1px solid #F1F5F9", borderRadius: "16px", padding: "20px", marginBottom: "60px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "20px", padding: "12px 0", borderBottom: "1px solid #F1F5F9" }}>
                                <span style={{ color: "#64748B", fontSize: "0.95rem" }}>Dimensions</span>
                                <span style={{ color: "#0F172A", fontSize: "0.95rem", fontWeight: "500" }}>24" W x 32" H</span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "20px", padding: "12px 0", borderBottom: "1px solid #F1F5F9" }}>
                                <span style={{ color: "#64748B", fontSize: "0.95rem" }}>Material</span>
                                <span style={{ color: "#0F172A", fontSize: "0.95rem", fontWeight: "500" }}>Reclaimed Wood, Steel, Glass</span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "20px", padding: "12px 0", borderBottom: "1px solid #F1F5F9" }}>
                                <span style={{ color: "#64748B", fontSize: "0.95rem" }}>Bulb Type</span>
                                <span style={{ color: "#0F172A", fontSize: "0.95rem", fontWeight: "500" }}>E26 Edison Bulbs (Included)</span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "20px", padding: "12px 0" }}>
                                <span style={{ color: "#64748B", fontSize: "0.95rem" }}>Power Source</span>
                                <span style={{ color: "#0F172A", fontSize: "0.95rem", fontWeight: "500" }}>Hardwired</span>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0F172A" }}>Customer Reviews ({reviewStats.totalReviews})</h3>
                            <button
                                onClick={() => {
                                    if (!token) {
                                        toast.error("Please login to write a review");
                                        navigate("/login");
                                        return;
                                    }
                                    setShowReviewForm(!showReviewForm);
                                }}
                                style={{ background: "none", border: "none", color: "#FF2E5B", fontWeight: "600", cursor: "pointer", fontSize: "0.95rem" }}
                            >
                                {showReviewForm ? "Cancel" : "Write a Review"}
                            </button>
                        </div>

                        {showReviewForm && (
                            <div style={{ padding: "24px", backgroundColor: "#F8F9FA", borderRadius: "16px", marginBottom: "24px" }}>
                                <h4 style={{ margin: "0 0 16px 0", fontSize: "1.1rem" }}>Write Your Review</h4>
                                <form onSubmit={handleSubmitReview}>
                                    <div style={{ marginBottom: "16px" }}>
                                        <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "#475569" }}>Rating</label>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={24}
                                                    color={star <= reviewRating ? "#FBBF24" : "#E2E8F0"}
                                                    fill={star <= reviewRating ? "#FBBF24" : "none"}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => setReviewRating(star)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: "16px" }}>
                                        <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "#475569" }}>Review Comment</label>
                                        <textarea
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            placeholder="What do you think about this product?"
                                            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0", minHeight: "100px", fontFamily: "inherit" }}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        style={{ backgroundColor: "#0F172A", color: "white", padding: "10px 24px", borderRadius: "50px", border: "none", fontWeight: "600", cursor: "pointer" }}
                                    >
                                        {submittingReview ? "Submitting..." : "Submit Review"}
                                    </button>
                                </form>
                            </div>
                        )}

                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {reviews.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#F8F9FA", borderRadius: "16px" }}>
                                    <MessageSquare size={32} color="#94A3B8" style={{ marginBottom: "12px" }} />
                                    <p style={{ color: "#64748B", margin: 0 }}>No reviews yet. Be the first to review this product!</p>
                                </div>
                            ) : (
                                reviews.map((review) => (
                                    <div key={review._id} style={{ border: "1px solid #F1F5F9", borderRadius: "16px", padding: "24px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                                            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                                                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", fontWeight: "700" }}>
                                                    {review.user?.name ? review.user.name.charAt(0).toUpperCase() : "U"}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: "700", color: "#0F172A", fontSize: "0.95rem" }}>{review.user?.name || "Anonymous User"}</div>
                                                    <div style={{ display: "flex", gap: "2px", color: "#FBBF24" }}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} color={i < review.rating ? "#FBBF24" : "#E2E8F0"} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p style={{ color: "#475569", fontSize: "0.95rem", fontStyle: "italic", lineHeight: "1.6" }}>
                                            "{review.comment}"
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>

                    {/* Right Column: Add to Cart Form (Sticky) */}
                    <div style={{ flex: "1 1 30%", position: "sticky", top: "120px" }}>

                        <div style={{ color: "#FF2E5B", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px" }}>
                            {product.category || "LIGHTING COLLECTION"}
                        </div>

                        <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: "#0F172A", lineHeight: "1.1", marginBottom: "16px", letterSpacing: "-0.02em" }}>
                            {product.name}
                        </h1>

                        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
                            <span style={{ fontSize: "2rem", fontWeight: "800", color: "#0F172A" }}>₹{product.price}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ display: "flex", color: "#FBBF24" }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill={i < Math.round(reviewStats.avgRating) ? "currentColor" : "none"} color={i < Math.round(reviewStats.avgRating) ? "#FBBF24" : "#E2E8F0"} />
                                    ))}
                                </div>
                                <span style={{ color: "#64748B", fontSize: "0.85rem", fontWeight: "500" }}>({reviewStats.totalReviews} Reviews)</span>
                            </div>
                        </div>

                        <p style={{ color: "#475569", lineHeight: "1.7", fontSize: "1rem", marginBottom: "32px", fontWeight: "400" }}>
                            {product.description || "Elevate your space with our Vintage Chandelier. Featuring industrial-style exposed bulbs and a handcrafted wooden frame, it represents the pinnacle of Lumina's Lighting collection. Engineered for both modern warmth and timeless elegance."}
                        </p>

                        <div style={{ marginBottom: "32px" }}>
                            <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#0F172A", marginBottom: "12px" }}>Bulb Color</div>
                            <div style={{ display: "flex", gap: "12px" }}>
                                {colors.map((color, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedColor(i)}
                                        style={{
                                            width: "36px", height: "36px", borderRadius: "50%",
                                            backgroundColor: color,
                                            border: "1px solid #E2E8F0",
                                            boxShadow: selectedColor === i ? "0 0 0 2px white, 0 0 0 4px #FF2E5B" : "none",
                                            cursor: "pointer",
                                            transition: "all 0.2s"
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "16px", marginBottom: "40px" }}>
                            {/* Quantity */}
                            <div style={{ display: "flex", alignItems: "center", backgroundColor: "#F8F9FA", borderRadius: "50px", padding: "4px" }}>
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "none", backgroundColor: "transparent", color: "#0F172A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Minus size={16} />
                                </button>
                                <span style={{ width: "30px", textAlign: "center", fontWeight: "700", color: "#0F172A", fontSize: "1.1rem" }}>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "none", backgroundColor: "transparent", color: "#0F172A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Plus size={16} />
                                </button>
                            </div>

                            {/* Add to Cart */}
                            <button
                                onClick={handleAddToCart}
                                style={{ flex: 1, backgroundColor: "#FF2E5B", color: "white", border: "none", borderRadius: "50px", fontSize: "1rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "0 24px", boxShadow: "0 10px 25px rgba(255, 46, 91, 0.2)" }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                                Add to Cart
                            </button>

                            {/* Wishlist */}
                            <button
                                onClick={handleToggleWishlist}
                                style={{
                                    width: "52px", height: "52px", borderRadius: "50%",
                                    border: isWishlisted ? "1px solid #FF2E5B" : "1px solid #E2E8F0",
                                    backgroundColor: isWishlisted ? "#FFF0F3" : "white",
                                    color: isWishlisted ? "#FF2E5B" : "#0F172A",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: "pointer", transition: "all 0.2s"
                                }}
                            >
                                <Heart size={20} fill={isWishlisted ? "#FF2E5B" : "none"} />
                            </button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "40px", paddingBottom: "40px", borderBottom: "1px solid #F1F5F9" }}>
                            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                <Truck color="#FF2E5B" size={24} style={{ opacity: 0.8 }} />
                                <div>
                                    <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0F172A" }}>Free Delivery</div>
                                    <div style={{ fontSize: "0.75rem", color: "#64748B" }}>Orders over ₹500</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                <ShieldCheck color="#FF2E5B" size={24} style={{ opacity: 0.8 }} />
                                <div>
                                    <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0F172A" }}>2 Year Warranty</div>
                                    <div style={{ fontSize: "0.75rem", color: "#64748B" }}>Certified Lumina product</div>
                                </div>
                            </div>
                        </div>

                        {/* Ratings Breakdown Block */}
                        <div style={{ backgroundColor: "#F8F9FA", borderRadius: "16px", padding: "24px" }}>
                            <h4 style={{ fontSize: "1rem", fontWeight: "800", color: "#0F172A", margin: "0 0 20px 0" }}>Ratings Breakdown</h4>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "30px" }}>
                                <div>
                                    <div style={{ fontSize: "3rem", fontWeight: "900", color: "#0F172A", lineHeight: "1" }}>{reviewStats.avgRating}<span style={{ fontSize: "1rem", fontWeight: "500", color: "#64748B" }}> / 5.0</span></div>
                                </div>
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {reviewStats.breakdown.length > 0 ? reviewStats.breakdown.map(r => (
                                        <div key={r.star} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#0F172A", width: "10px" }}>{r.star}</span>
                                            <div style={{ flex: 1, height: "6px", backgroundColor: "#E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
                                                <div style={{ width: `${r.pct}%`, height: "100%", backgroundColor: "#FF2E5B", borderRadius: "10px", transition: "width 0.5s ease" }} />
                                            </div>
                                            <span style={{ fontSize: "0.75rem", color: "#64748B", width: "24px", textAlign: "right" }}>{r.pct}%</span>
                                        </div>
                                    )) : (
                                        [5, 4, 3, 2, 1].map(star => (
                                            <div key={star} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#0F172A", width: "10px" }}>{star}</span>
                                                <div style={{ flex: 1, height: "6px", backgroundColor: "#E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
                                                    <div style={{ width: `0%`, height: "100%", backgroundColor: "#FF2E5B", borderRadius: "10px" }} />
                                                </div>
                                                <span style={{ fontSize: "0.75rem", color: "#64748B", width: "24px", textAlign: "right" }}>0%</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* You May Also Like Section */}
                {relatedProducts.length > 0 && (
                    <div style={{ marginTop: "100px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#0F172A" }}>You May Also Like</h2>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <button style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid #E2E8F0", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#0F172A" }}>
                                    <ArrowLeftIcon size={18} />
                                </button>
                                <button style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid #E2E8F0", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#0F172A" }}>
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "30px" }}>
                            {relatedProducts.map(rp => (
                                <Link to={`/product/${rp._id}`} key={rp._id} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                                    <div style={{ border: "1px solid #F1F5F9", borderRadius: "20px", padding: "20px", backgroundColor: "white", transition: "box-shadow 0.2s", ":hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.05)" } }}>
                                        <div style={{ height: "260px", backgroundColor: "#F8F9FA", borderRadius: "12px", marginBottom: "20px", overflow: "hidden" }}>
                                            <img src={rp.image || (rp.images && rp.images[0])} alt={rp.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        </div>
                                        <div style={{ fontSize: "0.7rem", color: "#FF2E5B", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700", marginBottom: "8px" }}>
                                            {rp.category || "LIGHTING"}
                                        </div>
                                        <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0F172A", marginBottom: "12px" }}>{rp.name}</h3>
                                        <p style={{ color: "#64748B", fontSize: "0.9rem", lineHeight: "1.5", marginBottom: "20px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                            {rp.description || "The Elegant Lamp represents the pinnacle of Lumina's Lighting collection."}
                                        </p>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0F172A" }}>₹{rp.price}</span>
                                            <button style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#FF2E5B", border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
