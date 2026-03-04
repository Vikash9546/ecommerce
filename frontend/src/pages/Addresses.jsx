import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { User, Package, Heart, MapPin, CreditCard, LogOut, Plus } from "lucide-react";

const Addresses = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = () => {
        logout();
        navigate("/");
    };

    return (
        <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh", paddingBottom: "100px" }}>
            <div className="container" style={{ padding: "40px 24px" }}>

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
                    <div>
                        <div style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>
                            Account &gt; <span style={{ color: "#FF2E5B" }}>Addresses</span>
                        </div>
                        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: "#0F172A", margin: 0 }}>Saved Addresses</h1>
                    </div>
                </div>

                <div className="account-layout">

                    {/* Left Sidebar */}
                    <div className="account-sidebar">
                        <div style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: "24px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "4px" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0F172A", margin: 0 }}>{user?.name || "User"}</h3>
                            <p style={{ fontSize: "0.85rem", color: "#64748B", margin: 0 }}>{user?.email || "user@example.com"}</p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "#64748B", textDecoration: "none" }}>
                                <User size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>My Profile</span>
                            </Link>

                            <Link to="/orders" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "#64748B", textDecoration: "none" }}>
                                <Package size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>My Orders</span>
                            </Link>

                            <Link to="/wishlist" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "#64748B", textDecoration: "none" }}>
                                <Heart size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>Wishlist</span>
                            </Link>

                            <Link to="/addresses" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", backgroundColor: "#FFF0F3", color: "#FF2E5B", textDecoration: "none" }}>
                                <MapPin size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "600" }}>Saved Addresses</span>
                            </Link>

                            <Link to="/payments" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "#64748B", textDecoration: "none" }}>
                                <CreditCard size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>Payment Methods</span>
                            </Link>
                        </div>

                        <div style={{ marginTop: "40px", borderTop: "1px solid #F1F5F9", paddingTop: "20px" }}>
                            <button onClick={handleSignOut} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "none", border: "none", color: "#64748B", cursor: "pointer", width: "100%", textAlign: "left" }}>
                                <LogOut size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="account-content">
                        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", padding: "30px" }}>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                                <div>
                                    <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0F172A", margin: "0 0 4px 0" }}>Default Address</h2>
                                    <p style={{ color: "#64748B", margin: 0, fontSize: "0.9rem" }}>This address is used for all your deliveries.</p>
                                </div>
                                <button
                                    onClick={() => navigate("/profile")}
                                    style={{
                                        backgroundColor: "#0F172A", color: "white", padding: "10px 20px",
                                        borderRadius: "50px", border: "none", fontWeight: "600", fontSize: "0.9rem",
                                        cursor: "pointer", display: "flex", alignItems: "center", gap: "8px"
                                    }}
                                >
                                    Edit Address
                                </button>
                            </div>

                            {user?.address ? (
                                <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", position: "relative" }}>
                                    <div style={{ position: "absolute", top: "24px", right: "24px", backgroundColor: "#ECFDF5", color: "#10B981", padding: "4px 12px", borderRadius: "50px", fontSize: "0.75rem", fontWeight: "700" }}>
                                        DEFAULT
                                    </div>
                                    <h3 style={{ margin: "0 0 12px 0", fontSize: "1.1rem", color: "#0F172A" }}>{user?.name}</h3>
                                    <p style={{ margin: "0 0 6px 0", color: "#475569", lineHeight: "1.5" }}>{user?.address}</p>
                                    <p style={{ margin: "0 0 16px 0", color: "#475569" }}>
                                        {user?.city}, {user?.state} {user?.zipCode}
                                    </p>
                                    <p style={{ margin: 0, color: "#64748B", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }}>
                                        <span style={{ fontWeight: "600", color: "#0F172A" }}>Phone:</span> {user?.phone || "Not provided"}
                                    </p>
                                </div>
                            ) : (
                                <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#F8F9FA", borderRadius: "16px" }}>
                                    <MapPin size={40} color="#94A3B8" style={{ marginBottom: "16px" }} />
                                    <h3 style={{ margin: "0 0 8px 0", color: "#0F172A" }}>No Address Saved</h3>
                                    <p style={{ color: "#64748B", marginBottom: "20px" }}>You haven't added a delivery address yet.</p>
                                    <button
                                        onClick={() => navigate("/profile")}
                                        style={{ backgroundColor: "#FF2E5B", color: "white", padding: "12px 24px", borderRadius: "50px", border: "none", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}
                                    >
                                        <Plus size={18} /> Add New Address
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Addresses;
