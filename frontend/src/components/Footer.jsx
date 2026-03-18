import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const Footer = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [email, setEmail] = useState("");

    const handleProtectedLink = (e, path) => {
        e.preventDefault();
        if (token) {
            navigate(path);
        } else {
            toast.error("Please login to access this section");
            navigate("/login");
        }
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter an email address.");
            return;
        }
        if (!email.includes("@")) {
            toast.error("Please enter a valid email address.");
            return;
        }
        toast.success("Subscribed successfully! Welcome to Lumina.");
        setEmail("");
    };

    return (
        <footer style={{ backgroundColor: "#000000", color: "white", padding: "80px 24px 40px", marginTop: "auto" }}>
            <div className="container" style={{ display: "flex", flexWrap: "wrap", gap: "60px", justifyContent: "space-between", marginBottom: "60px" }}>

                <div style={{ flex: "1 1 250px" }}>
                    <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", textDecoration: "none", color: "white" }}>
                        <div style={{ width: "24px", height: "24px", background: "linear-gradient(45deg, #333333, #737373)", borderRadius: "6px" }}></div>
                        <span style={{ fontSize: "1.5rem", fontWeight: "800", letterSpacing: "1px" }}>Lumina</span>
                    </Link>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6", maxWidth: "300px" }}>
                        Curating timeless pieces for modern living spaces since 2012. We believe that right lighting transforms any room.
                    </p>
                    <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "white", opacity: 0.6, transition: "opacity 0.2s" }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.6}>
                            <Instagram size={20} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: "white", opacity: 0.6, transition: "opacity 0.2s" }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.6}>
                            <Twitter size={20} />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "white", opacity: 0.6, transition: "opacity 0.2s" }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.6}>
                            <Facebook size={20} />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ color: "white", opacity: 0.6, transition: "opacity 0.2s" }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.6}>
                            <Youtube size={20} />
                        </a>
                    </div>
                </div>

                <div style={{ flex: "1 1 150px" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "24px", textTransform: "uppercase", letterSpacing: "1px" }}>Shop</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <Link to="/?category=Sales" className="footer-link">Sales & Offers</Link>
                        <Link to="/?category=Show all products" className="footer-link">Show all products</Link>
                        <Link to="/?category=Furniture" className="footer-link">Furniture</Link>
                        <Link to="/?category=Home Decor" className="footer-link">Home Decor</Link>
                    </div>
                </div>

                <div style={{ flex: "1 1 150px" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "24px", textTransform: "uppercase", letterSpacing: "1px" }}>My Account</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <a href="/profile" onClick={(e) => handleProtectedLink(e, "/profile")} className="footer-link">My Profile</a>
                        <a href="/orders" onClick={(e) => handleProtectedLink(e, "/orders")} className="footer-link">Order History</a>
                        <a href="/wishlist" onClick={(e) => handleProtectedLink(e, "/wishlist")} className="footer-link">Wishlist</a>
                        <a href="/addresses" onClick={(e) => handleProtectedLink(e, "/addresses")} className="footer-link">Saved Addresses</a>
                        <a href="/payments" onClick={(e) => handleProtectedLink(e, "/payments")} className="footer-link">Payment Methods</a>
                    </div>
                </div>

                <div style={{ flex: "1 1 300px" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>Stay Inspired</h4>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "20px" }}>Join our newsletter for styling tips and exclusive offers.</p>
                    <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "10px" }}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email address"
                            style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "12px 16px", color: "white", outline: "none" }}
                        />
                        <button type="submit" style={{ backgroundColor: "var(--bg-main)", color: "#000000", border: "none", borderRadius: "8px", padding: "0 24px", fontWeight: "600", cursor: "pointer" }}>
                            Subscribe
                        </button>
                    </form>
                </div>

            </div>

            <div className="container" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <div>© 2024 Lumina Lighting & Home Decor. All rights reserved.</div>
                <div style={{ display: "flex", gap: "24px" }}>
                    <Link to="/" className="footer-link">Privacy Policy</Link>
                    <Link to="/" className="footer-link">Terms of Service</Link>
                    <Link to="/" className="footer-link">Cookie Settings</Link>
                </div>
            </div>
            <style>{`
                .footer-link {
                    color: #A3A3A3;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    font-size: 0.9rem;
                }
                .footer-link:hover {
                    color: white;
                    transform: translateX(4px);
                }
            `}</style>
        </footer>
    );
};

export default Footer;
