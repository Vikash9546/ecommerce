import { useEffect, useState } from "react";
import API from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { User, Package, Heart, MapPin, CreditCard, LogOut, Trash2, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

const Wishlist = () => {
    const { user, token, logout } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchWishlist();
    }, [token]);

    const fetchWishlist = async () => {
        try {
            const res = await API.get("wishlist");
            setItems(res.data);
        } catch (err) {
            console.error("Failed to fetch wishlist:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await API.delete(`wishlist/${productId}`);
            setItems(items.filter(item => item.product?._id !== productId));
            toast.success("Removed from wishlist");
        } catch (err) {
            toast.error("Failed to remove item");
        }
    };

    const handleAddToCart = (productId) => {
        addToCart(productId);
        toast.success("Added to cart");
    };

    const handleSignOut = () => {
        logout();
        navigate("/");
    };

    return (
        <div style={{ backgroundColor: "var(--bg-secondary)", minHeight: "100vh", paddingBottom: "100px" }}>
            <div className="container" style={{ padding: "40px 24px" }}>

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
                    <div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>
                            Account &gt; <span style={{ color: "var(--accent-primary)" }}>Wishlist</span>
                        </div>
                        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>My Wishlist</h1>
                    </div>
                </div>

                <div className="account-layout">

                    {/* Left Sidebar */}
                    <div className="account-sidebar">
                        <div style={{ borderBottom: "1px solid var(--bg-tertiary)", paddingBottom: "24px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "4px" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>{user?.name || "User"}</h3>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>{user?.email || "user@example.com"}</p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "var(--text-muted)", textDecoration: "none" }}>
                                <User size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>My Profile</span>
                            </Link>
                            <Link to="/orders" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "var(--text-muted)", textDecoration: "none" }}>
                                <Package size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>My Orders</span>
                            </Link>
                            <Link to="/wishlist" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", backgroundColor: "var(--bg-secondary)", color: "var(--accent-primary)", textDecoration: "none" }}>
                                <Heart size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "600" }}>Wishlist</span>
                            </Link>
                            <Link to="/addresses" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "var(--text-muted)", textDecoration: "none" }}>
                                <MapPin size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>Saved Addresses</span>
                            </Link>
                            <Link to="/payments" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "var(--text-muted)", textDecoration: "none" }}>
                                <CreditCard size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>Payment Methods</span>
                            </Link>
                        </div>

                        <div style={{ marginTop: "40px", borderTop: "1px solid var(--bg-tertiary)", paddingTop: "20px" }}>
                            <button onClick={handleSignOut} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", width: "100%", textAlign: "left" }}>
                                <LogOut size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="account-content">
                        <div style={{ backgroundColor: "var(--bg-main)", borderRadius: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", padding: "30px" }}>

                            {loading ? (
                                <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid var(--bg-tertiary)", borderTopColor: "var(--accent-primary)", animation: "spin 1s linear infinite" }} />
                                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                                </div>
                            ) : items.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                                    <Heart size={64} color="var(--bg-tertiary)" style={{ marginBottom: "20px" }} />
                                    <h3 style={{ fontSize: "1.3rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>Your wishlist is empty</h3>
                                    <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>Start adding products you love to your wishlist!</p>
                                    <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "var(--accent-primary)", color: "white", padding: "12px 28px", borderRadius: "50px", textDecoration: "none", fontWeight: "600", fontSize: "0.95rem" }}>
                                        <ShoppingBag size={18} /> Browse Products
                                    </Link>
                                </div>
                            ) : (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
                                    {items.map((item) => {
                                        const p = item.product;
                                        if (!p) return null;
                                        return (
                                            <div key={item._id} style={{ border: "1px solid var(--bg-tertiary)", borderRadius: "16px", overflow: "hidden", transition: "box-shadow 0.2s", position: "relative" }}>
                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => handleRemove(p._id)}
                                                    style={{
                                                        position: "absolute", top: "12px", right: "12px", zIndex: 2,
                                                        width: "36px", height: "36px", borderRadius: "50%",
                                                        backgroundColor: "rgba(255,255,255,0.9)", border: "none",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        cursor: "pointer", backdropFilter: "blur(4px)",
                                                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                                                    }}
                                                >
                                                    <Trash2 size={16} color="#EF4444" />
                                                </button>

                                                <Link to={`/product/${p._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                                    <div style={{ height: "200px", backgroundColor: "var(--bg-secondary)", overflow: "hidden" }}>
                                                        <img src={p.image || (p.images && p.images[0])} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                    </div>
                                                    <div style={{ padding: "16px" }}>
                                                        <div style={{ fontSize: "0.7rem", color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700", marginBottom: "6px" }}>
                                                            {p.category || "Product"}
                                                        </div>
                                                        <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</h4>
                                                        <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-primary)" }}>₹{p.price}</div>
                                                    </div>
                                                </Link>

                                                <div style={{ padding: "0 16px 16px" }}>
                                                    <button
                                                        onClick={() => handleAddToCart(p._id)}
                                                        style={{
                                                            width: "100%", padding: "10px", borderRadius: "50px",
                                                            backgroundColor: "var(--accent-primary)", color: "white", border: "none",
                                                            fontWeight: "600", fontSize: "0.85rem", cursor: "pointer",
                                                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                                                        }}
                                                    >
                                                        <ShoppingBag size={16} /> Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
