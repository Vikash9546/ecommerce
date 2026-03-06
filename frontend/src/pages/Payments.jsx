import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { User, Package, Heart, MapPin, CreditCard, LogOut, Plus } from "lucide-react";

const Payments = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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
                            Account &gt; <span style={{ color: "var(--accent-primary)" }}>Payments</span>
                        </div>
                        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>Payment Methods</h1>
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

                            <Link to="/wishlist" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "var(--text-muted)", textDecoration: "none" }}>
                                <Heart size={18} color="#EF4444" fill="#EF4444" fillOpacity={0.1} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>Wishlist</span>
                            </Link>

                            <Link to="/addresses" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "var(--text-muted)", textDecoration: "none" }}>
                                <MapPin size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>Saved Addresses</span>
                            </Link>

                            <Link to="/payments" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", backgroundColor: "var(--bg-secondary)", color: "var(--accent-primary)", textDecoration: "none" }}>
                                <CreditCard size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "600" }}>Payment Methods</span>
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

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                                <div>
                                    <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 4px 0" }}>Saved Cards</h2>
                                    <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Manage your saved payment methods for faster checkout.</p>
                                </div>
                                <button
                                    onClick={() => { }}
                                    style={{
                                        backgroundColor: "var(--text-primary)", color: "white", padding: "10px 20px",
                                        borderRadius: "50px", border: "none", fontWeight: "600", fontSize: "0.9rem",
                                        cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", opacity: 0.5
                                    }}
                                    disabled
                                >
                                    <Plus size={18} /> Add New Card
                                </button>
                            </div>

                            <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "var(--bg-secondary)", borderRadius: "16px", border: "1px dashed var(--bg-tertiary)" }}>
                                <CreditCard size={48} color="var(--text-muted)" style={{ marginBottom: "16px", opacity: 0.5 }} />
                                <h3 style={{ margin: "0 0 8px 0", color: "var(--text-primary)", fontSize: "1.1rem" }}>No Payment Methods Found</h3>
                                <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.95rem" }}>
                                    Cards used during checkout will automatically be saved here securely.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payments;
