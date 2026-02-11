import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { User, Phone, MapPin, Mail, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, updateProfile } = useAuth();
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
    const [message, setMessage] = useState({ type: "", text: "" });

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
        setMessage({ type: "", text: "" });
        try {
            await updateProfile(formData);
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Failed to update profile. Please try again." });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 mb-8 hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
            >
                <ArrowLeft size={20} /> Back to Shopping
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass"
                style={{ padding: '40px', borderRadius: '32px' }}
            >
                <div className="flex items-center gap-4 mb-8">
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'var(--accent-primary)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <User size={32} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Your Profile</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your personal information and address</p>
                    </div>
                </div>

                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                            padding: '16px',
                            borderRadius: '12px',
                            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: message.type === 'success' ? 'var(--accent-secondary)' : '#EF4444',
                            marginBottom: '24px',
                            border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                        }}
                    >
                        {message.text}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="glass-input"
                                    style={{ paddingLeft: '48px', width: '100%' }}
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    className="glass-input"
                                    style={{ paddingLeft: '48px', width: '100%', opacity: 0.7, cursor: 'not-allowed' }}
                                    readOnly
                                />
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email cannot be changed</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="glass-input"
                                    style={{ paddingLeft: '48px', width: '100%' }}
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-4 text-muted" size={18} />
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="glass-input"
                                style={{ paddingLeft: '48px', width: '100%', minHeight: '100px', resize: 'vertical' }}
                                placeholder="Enter your full address"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2">
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="glass-input"
                                placeholder="City"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="glass-input"
                                placeholder="State"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Zip Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                className="glass-input"
                                placeholder="Zip Code"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{
                            marginTop: '20px',
                            padding: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            width: '100%',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        <Save size={20} />
                        {loading ? "Saving Changes..." : "Save Profile"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Profile;
