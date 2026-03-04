import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer style={{ backgroundColor: "#0F172A", color: "white", padding: "80px 24px 40px", marginTop: "auto" }}>
            <div className="container" style={{ display: "flex", flexWrap: "wrap", gap: "60px", justifyContent: "space-between", marginBottom: "60px" }}>

                <div style={{ flex: "1 1 250px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                        <div style={{ width: "24px", height: "24px", background: "linear-gradient(45deg, #FF2E5B, #FFA3B5)", borderRadius: "6px" }}></div>
                        <span style={{ fontSize: "1.5rem", fontWeight: "800", letterSpacing: "1px" }}>Lumina</span>
                    </div>
                    <p style={{ color: "#94A3B8", fontSize: "0.9rem", lineHeight: "1.6", maxWidth: "300px" }}>
                        Curating timeless pieces for modern living spaces since 2012. We believe that right lighting transforms any room.
                    </p>
                    <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
                        {/* Social Icons would go here */}
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)" }}></div>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)" }}></div>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)" }}></div>
                    </div>
                </div>

                <div style={{ flex: "1 1 150px" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "24px", textTransform: "uppercase", letterSpacing: "1px" }}>Shop</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <Link to="#" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.9rem" }}>New Arrivals</Link>
                        <Link to="#" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.9rem" }}>Bestsellers</Link>
                        <Link to="/?category=All Lighting" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.9rem" }}>Lighting</Link>
                        <Link to="/?category=Furniture" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.9rem" }}>Furniture</Link>
                        <Link to="/?category=Home Decor" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.9rem" }}>Home Decor</Link>
                    </div>
                </div>

                <div style={{ flex: "1 1 150px" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "24px", textTransform: "uppercase", letterSpacing: "1px" }}>Support</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <Link to="#" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.9rem" }}>Shipping & Returns</Link>
                        <Link to="#" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.9rem" }}>Store Locator</Link>
                        <Link to="/orders" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.9rem" }}>Order Tracking</Link>
                        <Link to="#" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.9rem" }}>FAQ</Link>
                        <Link to="#" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.9rem" }}>Contact Us</Link>
                    </div>
                </div>

                <div style={{ flex: "1 1 300px" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>Stay Inspired</h4>
                    <p style={{ color: "#94A3B8", fontSize: "0.9rem", marginBottom: "20px" }}>Join our newsletter for styling tips and exclusive offers.</p>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <input
                            type="text"
                            placeholder="Your email address"
                            style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "12px 16px", color: "white", outline: "none" }}
                        />
                        <button style={{ backgroundColor: "#FF2E5B", color: "white", border: "none", borderRadius: "8px", padding: "0 24px", fontWeight: "600", cursor: "pointer" }}>
                            Subscribe
                        </button>
                    </div>
                </div>

            </div>

            <div className="container" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", fontSize: "0.85rem", color: "#64748B" }}>
                <div>© 2024 Lumina Lighting & Home Decor. All rights reserved.</div>
                <div style={{ display: "flex", gap: "24px" }}>
                    <Link to="#" style={{ color: "#64748B", textDecoration: "none" }}>Privacy Policy</Link>
                    <Link to="#" style={{ color: "#64748B", textDecoration: "none" }}>Terms of Service</Link>
                    <Link to="#" style={{ color: "#64748B", textDecoration: "none" }}>Cookie Settings</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
