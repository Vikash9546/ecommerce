import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

const Footer = () => {
    const [email, setEmail] = useState("");

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
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                        <div style={{ width: "24px", height: "24px", background: "linear-gradient(45deg, #333333, #737373)", borderRadius: "6px" }}></div>
                        <span style={{ fontSize: "1.5rem", fontWeight: "800", letterSpacing: "1px" }}>Lumina</span>
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6", maxWidth: "300px" }}>
                        Curating timeless pieces for modern living spaces since 2012. We believe that right lighting transforms any room.
                    </p>
                    <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
                        {/* Social Icons Mock */}
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)", cursor: "pointer" }}></div>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)", cursor: "pointer" }}></div>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)", cursor: "pointer" }}></div>
                    </div>
                </div>

                <div style={{ flex: "1 1 150px" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "24px", textTransform: "uppercase", letterSpacing: "1px" }}>Shop</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <Link to="/?category=Sales" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem" }}>Sales & Offers</Link>
                        <Link to="/?category=Chandeliers" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem" }}>Chandeliers</Link>
                        <Link to="/?category=All Lighting" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem" }}>Lighting</Link>
                        <Link to="/?category=Furniture" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem" }}>Furniture</Link>
                        <Link to="/?category=Home Decor" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem" }}>Home Decor</Link>
                    </div>
                </div>

                <div style={{ flex: "1 1 150px" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "24px", textTransform: "uppercase", letterSpacing: "1px" }}>My Account</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <Link to="/profile" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem" }}>My Profile</Link>
                        <Link to="/orders" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem" }}>Order History</Link>
                        <Link to="/wishlist" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem" }}>Wishlist</Link>
                        <Link to="/addresses" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem" }}>Saved Addresses</Link>
                        <Link to="/payments" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem" }}>Payment Methods</Link>
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
                    <Link to="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Privacy Policy</Link>
                    <Link to="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Terms of Service</Link>
                    <Link to="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Cookie Settings</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
