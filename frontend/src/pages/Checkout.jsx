import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import toast from "react-hot-toast";
import { CreditCard, Landmark, Component, Check, ArrowRight, Loader2 } from "lucide-react";

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, fetchCart } = useCart();
    const { token } = useAuth();

    const [loading, setLoading] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        zipCode: ""
    });
    const [deliveryMode, setDeliveryMode] = useState("standard");
    const [paymentMethod, setPaymentMethod] = useState("card");

    const [paymentData, setPaymentData] = useState({
        cardNumber: "",
        expiry: "",
        cvv: "",
        name: ""
    });

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        API.get("auth/profile")
            .then(res => {
                const user = res.data;
                if (user) {
                    const names = user.name ? user.name.split(" ") : ["", ""];
                    setShippingAddress({
                        firstName: names[0] || "",
                        lastName: names.slice(1).join(" ") || "",
                        address: user.address || "",
                        city: user.city || "",
                        zipCode: user.zipCode || ""
                    });
                    setPaymentData(prev => ({ ...prev, name: user.name || "" }));
                }
            })
            .catch(err => console.error(err));
    }, [token, navigate]);

    const handlePlaceOrder = async () => {
        if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.zipCode) {
            toast.error("Please fill in required address fields");
            return;
        }

        try {
            setLoading(true);
            await API.post("order/place", { shippingAddress });

            toast.success("Order Confirmed! 🥂");
            await fetchCart();

            setTimeout(() => {
                navigate("/orders");
            }, 2000);

        } catch (err) {
            console.error(err);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cart?.items?.length === 0) {
        return (
            <div className="container" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Your cart is empty</h2>
                <button onClick={() => navigate("/")} className="btn btn-primary" style={{ borderRadius: "50px", padding: "12px 30px" }}>Continue Shopping</button>
            </div>
        );
    }

    const shippingCost = deliveryMode === "standard" ? 0 : 15;
    const tax = cartTotal * 0.08;
    const total = cartTotal + shippingCost + tax;

    return (
        <div style={{ backgroundColor: "var(--bg-secondary)", minHeight: "100vh", paddingBottom: "100px" }}>
            <div className="container" style={{ padding: "40px 24px" }}>

                {/* Breadcrumb */}
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "20px", display: "flex", gap: "8px" }}>
                    <Link to="/" style={{ color: "var(--text-muted)" }}>Home</Link>
                    <span>/</span>
                    <Link to="/cart" style={{ color: "var(--text-muted)" }}>Cart</Link>
                    <span>/</span>
                    <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>Checkout</span>
                </div>

                <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "30px", color: "var(--text-primary)" }}>Checkout</h1>

                <div className="checkout-layout">

                    {/* Left Column - Forms */}
                    <div style={{ flex: "1 1 500px", display: "flex", flexDirection: "column", gap: "40px" }}>

                        {/* 1. Shipping Information */}
                        <div style={{ backgroundColor: "var(--bg-main)", padding: "30px", borderRadius: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                            <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "var(--accent-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>1</div>
                                Shipping Information
                            </h2>
                            <div className="checkout-grid">
                                <div className="input-group" style={{ marginBottom: "0" }}>
                                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>First Name</label>
                                    <input
                                        value={shippingAddress.firstName}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                                        placeholder="e.g. Alexander"
                                        style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--bg-tertiary)", borderRadius: "10px" }}
                                    />
                                </div>
                                <div className="input-group" style={{ marginBottom: "0" }}>
                                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>Last Name</label>
                                    <input
                                        value={shippingAddress.lastName}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                                        placeholder="e.g. Pierce"
                                        style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--bg-tertiary)", borderRadius: "10px" }}
                                    />
                                </div>
                                <div className="input-group checkout-grid-span" style={{ marginBottom: "0" }}>
                                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>Street Address</label>
                                    <input
                                        value={shippingAddress.address}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                        placeholder="House number and street name"
                                        style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--bg-tertiary)", borderRadius: "10px" }}
                                    />
                                </div>
                                <div className="input-group" style={{ marginBottom: "0" }}>
                                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>City</label>
                                    <input
                                        value={shippingAddress.city}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                        placeholder="City"
                                        style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--bg-tertiary)", borderRadius: "10px" }}
                                    />
                                </div>
                                <div className="input-group" style={{ marginBottom: "0" }}>
                                    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>Zip Code</label>
                                    <input
                                        value={shippingAddress.zipCode}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                                        placeholder="10001"
                                        style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--bg-tertiary)", borderRadius: "10px" }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Delivery Method */}
                        <div style={{ backgroundColor: "var(--bg-main)", padding: "30px", borderRadius: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                            <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "var(--accent-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>2</div>
                                Delivery Method
                            </h2>
                            <div className="checkout-grid">
                                <div
                                    onClick={() => setDeliveryMode("standard")}
                                    style={{ border: deliveryMode === "standard" ? "2px solid var(--accent-primary)" : "2px solid var(--bg-tertiary)", borderRadius: "12px", padding: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: deliveryMode === "standard" ? "var(--bg-secondary)" : "var(--bg-main)" }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: deliveryMode === "standard" ? "0" : "2px solid var(--bg-tertiary)", backgroundColor: deliveryMode === "standard" ? "var(--accent-primary)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {deliveryMode === "standard" && <Check size={12} color="white" />}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>Standard Delivery</div>
                                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>4-7 business days</div>
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: "600", color: "var(--accent-primary)" }}>Free</div>
                                </div>

                                <div
                                    onClick={() => setDeliveryMode("express")}
                                    style={{ border: deliveryMode === "express" ? "2px solid var(--accent-primary)" : "2px solid var(--bg-tertiary)", borderRadius: "12px", padding: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: deliveryMode === "express" ? "var(--bg-secondary)" : "var(--bg-main)" }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: deliveryMode === "express" ? "0" : "2px solid var(--bg-tertiary)", backgroundColor: deliveryMode === "express" ? "var(--accent-primary)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {deliveryMode === "express" && <Check size={12} color="white" />}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>Express Delivery</div>
                                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>1-2 business days</div>
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>₹15.00</div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Payment Method */}
                        <div style={{ backgroundColor: "var(--bg-main)", padding: "30px", borderRadius: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                            <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "var(--accent-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>3</div>
                                Payment Method
                            </h2>
                            <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
                                <button onClick={() => setPaymentMethod("card")} className="btn" style={{ backgroundColor: paymentMethod === "card" ? "var(--text-primary)" : "var(--bg-secondary)", color: paymentMethod === "card" ? "white" : "var(--text-muted)", borderRadius: "8px", padding: "10px 20px", fontSize: "0.9rem", flex: 1 }}>
                                    <CreditCard size={18} /> Credit Card
                                </button>
                                <button onClick={() => setPaymentMethod("upi")} className="btn" style={{ backgroundColor: paymentMethod === "upi" ? "var(--text-primary)" : "var(--bg-secondary)", color: paymentMethod === "upi" ? "white" : "var(--text-muted)", borderRadius: "8px", padding: "10px 20px", fontSize: "0.9rem", flex: 1 }}>
                                    <Component size={18} /> UPI
                                </button>
                                <button onClick={() => setPaymentMethod("netbanking")} className="btn" style={{ backgroundColor: paymentMethod === "netbanking" ? "var(--text-primary)" : "var(--bg-secondary)", color: paymentMethod === "netbanking" ? "white" : "var(--text-muted)", borderRadius: "8px", padding: "10px 20px", fontSize: "0.9rem", flex: 1 }}>
                                    <Landmark size={18} /> Net Banking
                                </button>
                            </div>

                            {paymentMethod === "card" && (
                                <div className="checkout-grid">
                                    <div className="input-group checkout-grid-span" style={{ marginBottom: "0" }}>
                                        <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>Cardholder Name</label>
                                        <input
                                            value={paymentData.name}
                                            onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
                                            placeholder="Full name on card"
                                            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--bg-tertiary)", borderRadius: "10px" }}
                                        />
                                    </div>
                                    <div className="input-group checkout-grid-span" style={{ marginBottom: "0" }}>
                                        <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>Card Number</label>
                                        <div style={{ position: "relative" }}>
                                            <CreditCard size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                                            <input
                                                value={paymentData.cardNumber}
                                                onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                                                placeholder="0000 0000 0000 0000"
                                                style={{ paddingLeft: "42px", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--bg-tertiary)", borderRadius: "10px", width: "100%" }}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group" style={{ marginBottom: "0" }}>
                                        <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>Expiration Date</label>
                                        <input
                                            value={paymentData.expiry}
                                            onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
                                            placeholder="MM / YY"
                                            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--bg-tertiary)", borderRadius: "10px" }}
                                        />
                                    </div>
                                    <div className="input-group" style={{ marginBottom: "0" }}>
                                        <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>CVV</label>
                                        <input
                                            value={paymentData.cvv}
                                            onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                                            placeholder="123"
                                            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--bg-tertiary)", borderRadius: "10px" }}
                                        />
                                    </div>
                                </div>
                            )}

                        </div>

                    </div>

                    {/* Right Column - Order Summary */}
                    <div style={{ flex: "1 1 350px", backgroundColor: "var(--bg-main)", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.06)", position: "sticky", top: "120px" }}>
                        <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "24px" }}>Order Summary</h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "30px", borderBottom: "1px solid var(--bg-tertiary)", paddingBottom: "24px" }}>
                            {cart?.items?.map((item) => (
                                <div key={item.productId?._id} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                                    <div style={{ width: "60px", height: "60px", backgroundColor: "var(--bg-secondary)", borderRadius: "8px", overflow: "hidden" }}>
                                        <img src={item.productId?.images?.[0] || item.productId?.image || 'https://via.placeholder.com/60'} alt={item.productId?.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: "600", fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "2px" }}>{item.productId?.name}</div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Qty: {item.quantity}</div>
                                    </div>
                                    <div style={{ fontWeight: "600", color: "var(--accent-primary)" }}>₹{item.productId?.price?.toFixed(2) || (item.productId?.price)}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
                            <input placeholder="Promo Code" style={{ flex: 1, backgroundColor: "var(--bg-secondary)", border: "1px solid var(--bg-tertiary)", borderRadius: "8px", padding: "10px 16px" }} />
                            <button className="btn" style={{ backgroundColor: "var(--text-primary)", color: "white", borderRadius: "8px", padding: "10px 20px" }}>Apply</button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                                <span>Subtotal</span>
                                <span>₹{cartTotal?.toFixed(2)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                                <span>Shipping</span>
                                <span style={{ color: shippingCost === 0 ? "var(--text-primary)" : "var(--text-secondary)" }}>{shippingCost === 0 ? "Free" : `₹${shippingCost.toFixed(2)}`}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                                <span>Tax (8%)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-primary)", fontSize: "1.2rem", fontWeight: "700", marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed var(--bg-tertiary)" }}>
                                <span>Total</span>
                                <span style={{ color: "var(--accent-primary)" }}>₹{total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: "100%", padding: "16px", borderRadius: "50px", fontSize: "1.05rem", fontWeight: "600", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", backgroundColor: "var(--accent-primary)" }}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Place Order <ArrowRight size={20} /></>}
                        </button>
                        <div style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "16px" }}>
                            SECURE PAYMENT PROCESSED VIA STRIPE ENCRYPTION
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
