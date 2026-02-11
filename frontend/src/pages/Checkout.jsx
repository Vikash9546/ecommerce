import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CreditCard, CheckCircle, ArrowRight, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import toast from "react-hot-toast";

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, fetchCart } = useCart();
    const { token } = useAuth();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        address: "",
        city: "",
        state: "",
        zipCode: ""
    });
    const [paymentData, setPaymentData] = useState({
        cardNumber: "4242 4242 4242 4242",
        expiry: "12/26",
        cvc: "123",
        name: ""
    });

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        // Fetch user profile to pre-fill address
        API.get("auth/profile")
            .then(res => {
                const user = res.data;
                if (user) {
                    setShippingAddress({
                        address: user.address || "",
                        city: user.city || "",
                        state: user.state || "",
                        zipCode: user.zipCode || ""
                    });
                    setPaymentData(prev => ({ ...prev, name: user.name || "" }));
                }
            })
            .catch(err => console.error("Failed to fetch profile for checkout:", err));
    }, [token, navigate]);

    const handleNextStep = () => {
        if (step === 1) {
            // Validate address
            if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.zipCode) {
                toast.error("Please fill in all address fields");
                return;
            }
        }
        setStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setStep(prev => prev - 1);
    };

    const handlePlaceOrder = async () => {
        try {
            setLoading(true);
            const res = await API.post("order/place", { shippingAddress });

            // Success toast
            toast.success("Order Confirmed! 🥂", {
                duration: 4000,
                icon: '🎉',
                style: {
                    borderRadius: '16px',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--glass-border)',
                }
            });

            await fetchCart(); // Clear cart

            // Move to success step
            setStep(3);

            // Auto redirect after a delay
            setTimeout(() => {
                navigate("/orders");
            }, 3000);

        } catch (err) {
            console.error(err);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cart?.items?.length === 0 && step < 3) {
        return (
            <div className="container text-center py-20">
                <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Your cart is empty</h2>
                <button onClick={() => navigate("/")} className="btn btn-primary">Continue Shopping</button>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
            {/* Stepper Progress */}
            <div className="flex justify-between items-center mb-12 relative" style={{ padding: '0 40px' }}>
                <div style={{ position: 'absolute', top: '50%', left: '40px', right: '40px', height: '2px', background: 'var(--glass-border)', zIndex: 0 }}></div>
                <div style={{ position: 'absolute', top: '50%', left: '40px', width: `${(step - 1) * 50}%`, height: '2px', background: 'var(--accent-primary)', zIndex: 0, transition: 'width 0.5s ease' }}></div>

                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center gap-2" style={{ zIndex: 1, position: 'relative' }}>
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: step >= s ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                border: '2px solid',
                                borderColor: step >= s ? 'var(--accent-primary)' : 'var(--glass-border)',
                                color: step >= s ? 'white' : 'var(--text-muted)',
                                fontWeight: 700,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {step > s ? <CheckCircle size={20} /> : s}
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: step >= s ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                            {s === 1 ? "Address" : s === 2 ? "Payment" : "Confirmed"}
                        </span>
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="glass"
                        style={{ padding: '40px', borderRadius: '32px' }}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <MapPin className="text-primary" />
                            <h2 style={{ fontSize: '1.75rem' }}>Shipping Address</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="input-group col-span-2">
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Street Address</label>
                                <input
                                    value={shippingAddress.address}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                    placeholder="123 Luxury Lane"
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>City</label>
                                <input
                                    value={shippingAddress.city}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                    placeholder="New Delhi"
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>State</label>
                                <input
                                    value={shippingAddress.state}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                    placeholder="Delhi"
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Zip Code</label>
                                <input
                                    value={shippingAddress.zipCode}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                                    placeholder="110001"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-12">
                            <button
                                onClick={handleNextStep}
                                className="btn btn-primary"
                                style={{ padding: '12px 32px', borderRadius: '16px' }}
                            >
                                Continue to Payment <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="glass"
                        style={{ padding: '40px', borderRadius: '32px' }}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <CreditCard className="text-secondary" />
                            <h2 style={{ fontSize: '1.75rem' }}>Payment Method</h2>
                        </div>

                        <div className="p-6 glass mb-8" style={{ border: '2px solid var(--accent-primary)', background: 'linear-gradient(135deg, rgba(251, 113, 133, 0.1), transparent)' }}>
                            <div className="flex justify-between items-start mb-12">
                                <div style={{ width: '50px', height: '35px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px' }}></div>
                                <ShieldCheck size={24} className="text-primary" />
                            </div>
                            <p style={{ fontSize: '1.4rem', letterSpacing: '4px', marginBottom: '8px' }}>{paymentData.cardNumber}</p>
                            <div className="flex justify-between">
                                <span>{paymentData.name.toUpperCase()}</span>
                                <span>{paymentData.expiry}</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-12">
                            <div className="flex justify-between text-muted">
                                <span>Items Subtotal</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-muted">
                                <span>Shipping Fee</span>
                                <span className="text-secondary">Free</span>
                            </div>
                            <div style={{ height: '1px', background: 'var(--glass-border)' }}></div>
                            <div className="flex justify-between font-bold text-xl">
                                <span>Order Total</span>
                                <span>₹{cartTotal}</span>
                            </div>
                        </div>

                        <div className="flex justify-between gap-4 mt-8">
                            <button onClick={handlePrevStep} className="btn btn-outline" style={{ borderRadius: '16px' }}>
                                <ArrowLeft size={18} /> Back
                            </button>
                            <button
                                onClick={handlePlaceOrder}
                                className="btn btn-primary flex-1"
                                disabled={loading}
                                style={{ padding: '12px 32px', borderRadius: '16px' }}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Complete Purchase <ArrowRight size={18} /></>}
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 12 }}
                            style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--accent-secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyCenter: 'center', marginBottom: '32px' }}
                        >
                            <CheckCircle size={56} style={{ margin: 'auto' }} />
                        </motion.div>
                        <h1 style={{ fontSize: '3rem', marginBottom: '16px', fontWeight: 800 }}>Order Confirmed!</h1>
                        <p className="text-xl text-muted mb-12" style={{ maxWidth: '500px' }}>
                            Your premium items are being prepared for shipment. You'll receive a confirmation email shortly.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => navigate("/orders")} className="btn btn-primary" style={{ padding: '12px 32px', borderRadius: '99px' }}>
                                View My Orders
                            </button>
                            <button onClick={() => navigate("/")} className="btn btn-outline" style={{ padding: '12px 32px', borderRadius: '99px' }}>
                                Continue Shopping
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Checkout;
