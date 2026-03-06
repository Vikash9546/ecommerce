import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Phone, MapPin, Mail, Save, Package, Heart, CreditCard, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
    const { user, updateProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                address: user.address || "",
                city: user.city || "",
                state: user.state || "",
                zipCode: user.zipCode || ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile(formData);
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = () => {
        logout();
        navigate("/");
    };

    return (
        <div style={{ backgroundColor: "var(--bg-secondary)", minHeight: "100vh", paddingBottom: "100px" }}>
            <div className="container" style={{ padding: "40px 24px" }}>

                {/* Header Section */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
                    <div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>
                            Account &gt; <span style={{ color: "var(--accent-primary)" }}>Profile</span>
                        </div>
                        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>My Profile</h1>
                    </div>
                </div>

                <div className="account-layout">

                    {/* Left Sidebar */}
                    <div className="account-sidebar">
                        {/* User Info */}
                        <div style={{ borderBottom: "1px solid var(--bg-tertiary)", paddingBottom: "24px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "4px" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>{user?.name || "User"}</h3>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>{user?.email || "user@example.com"}</p>
                        </div>

                        {/* Navigation Links */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", backgroundColor: "var(--bg-secondary)", color: "var(--accent-primary)", textDecoration: "none", transition: "all 0.2s" }}>
                                <User size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "600" }}>My Profile</span>
                            </Link>

                            <Link to="/orders" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "var(--text-muted)", textDecoration: "none", transition: "all 0.2s" }}>
                                <Package size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>My Orders</span>
                            </Link>

                            <Link to="/wishlist" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "var(--text-muted)", textDecoration: "none", transition: "all 0.2s" }}>
                                <Heart size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>Wishlist</span>
                            </Link>

                            <Link to="/addresses" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "var(--text-muted)", textDecoration: "none", transition: "all 0.2s" }}>
                                <MapPin size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>Saved Addresses</span>
                            </Link>

                            <Link to="/payments" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "var(--text-muted)", textDecoration: "none", transition: "all 0.2s" }}>
                                <CreditCard size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>Payment Methods</span>
                            </Link>
                        </div>

                        {/* Sign Out */}
                        <div style={{ marginTop: "40px", borderTop: "1px solid var(--bg-tertiary)", paddingTop: "20px" }}>
                            <button onClick={handleSignOut} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", width: "100%", textAlign: "left" }}>
                                <LogOut size={18} />
                                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="account-content" style={{ backgroundColor: "var(--bg-main)", borderRadius: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", padding: "30px" }}>
                        <div style={{ marginBottom: "24px" }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 8px 0" }}>Personal Information</h2>
                            <p style={{ color: "var(--text-muted)", margin: 0 }}>Manage your details and delivery addresses.</p>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500" }}>Full Name</label>
                                    <div style={{ position: "relative" }}>
                                        <User style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} size={18} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: "10px", border: "1px solid var(--bg-tertiary)", backgroundColor: "var(--bg-secondary)", fontSize: "0.95rem", outline: "none" }}
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500" }}>Email Address</label>
                                    <div style={{ position: "relative" }}>
                                        <Mail style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} size={18} />
                                        <input
                                            type="email"
                                            value={user?.email || ""}
                                            style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: "10px", border: "1px solid var(--bg-tertiary)", backgroundColor: "var(--bg-tertiary)", fontSize: "0.95rem", outline: "none", color: "var(--text-muted)", cursor: "not-allowed" }}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500" }}>Phone Number</label>
                                    <div style={{ position: "relative" }}>
                                        <Phone style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} size={18} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: "10px", border: "1px solid var(--bg-tertiary)", backgroundColor: "var(--bg-secondary)", fontSize: "0.95rem", outline: "none" }}
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ height: "1px", backgroundColor: "var(--bg-tertiary)", margin: "10px 0" }}></div>

                            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0" }}>Delivery Information</h3>

                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <label style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500" }}>Street Address</label>
                                <div style={{ position: "relative" }}>
                                    <MapPin style={{ position: "absolute", left: "16px", top: "16px", color: "var(--text-muted)" }} size={18} />
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        style={{ width: "100%", padding: "16px 16px 16px 42px", borderRadius: "10px", border: "1px solid var(--bg-tertiary)", backgroundColor: "var(--bg-secondary)", fontSize: "0.95rem", outline: "none", minHeight: "100px", resize: "vertical", fontFamily: "inherit" }}
                                        placeholder="Enter your full address"
                                    />
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "24px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500" }}>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid var(--bg-tertiary)", backgroundColor: "var(--bg-secondary)", fontSize: "0.95rem", outline: "none" }}
                                        placeholder="City"
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500" }}>State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid var(--bg-tertiary)", backgroundColor: "var(--bg-secondary)", fontSize: "0.95rem", outline: "none" }}
                                        placeholder="State"
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <label style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500" }}>Zip Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid var(--bg-tertiary)", backgroundColor: "var(--bg-secondary)", fontSize: "0.95rem", outline: "none" }}
                                        placeholder="Zip Code"
                                    />
                                </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        backgroundColor: "var(--accent-primary)",
                                        color: "white",
                                        padding: "16px 32px",
                                        borderRadius: "50px",
                                        border: "none",
                                        fontWeight: "600",
                                        fontSize: "1rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        cursor: loading ? "not-allowed" : "pointer",
                                        opacity: loading ? 0.7 : 1,
                                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
                                    }}
                                >
                                    <Save size={20} />
                                    {loading ? "Saving Changes..." : "Save Profile"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
