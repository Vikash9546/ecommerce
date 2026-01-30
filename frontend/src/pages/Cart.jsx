import { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { ShoppingBag, Trash2, CreditCard, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const userId = "user123";

  useEffect(() => {
    API.get(`/cart/${userId}`).then((res) => setCart(res.data)).catch(() => setCart({ products: [] }));
  }, []);

  const placeOrder = async () => {
    try {
      await API.post("/order/place");
      alert("Order placed successfully!");
      setCart({ products: [] });
    } catch (err) {
      alert("Failed to place order. Ensure you are logged in.");
    }
  };

  const products = cart?.products || [];
  const total = products.reduce((acc, p) => acc + (p.productId?.price || 0) * p.quantity, 0);

  return (
    <div className="container" style={{ paddingBottom: '100px' }}>
      <div className="flex items-center gap-4" style={{ marginBottom: '40px' }}>
        <ShoppingBag size={32} color="var(--accent-primary)" />
        <h2 style={{ fontSize: '2.5rem' }}>Your Bag</h2>
      </div>

      <div className="grid" style={{
        gridTemplateColumns: products.length > 0 ? '1fr 350px' : '1fr',
        gap: '40px',
        alignItems: 'start'
      }}>
        <div className="flex flex-col gap-4">
          {products.map((p, index) => (
            <motion.div
              key={p.productId?._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass"
              style={{ padding: '20px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}
            >
              <div style={{ width: '100px', height: '100px', background: 'var(--bg-tertiary)', borderRadius: '16px' }}></div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{p.productId?.name}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Quantity: {p.quantity}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  ₹{(p.productId?.price || 0) * p.quantity}
                </p>
                <button className="btn btn-outline" style={{ padding: '8px', borderRadius: '12px', color: '#F87171', borderColor: 'rgba(248, 113, 113, 0.2)' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
          {products.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass"
              style={{ padding: '80px 40px', borderRadius: '32px', textAlign: 'center' }}
            >
              <ShoppingBag size={48} color="var(--text-muted)" style={{ margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Your bag is empty</h3>
              <p style={{ marginBottom: '32px' }}>Looks like you haven't added anything to your bag yet.</p>
              <Link to="/" className="btn btn-primary">
                Start Shopping <ArrowRight size={18} />
              </Link>
            </motion.div>
          )}
        </div>

        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass"
            style={{ padding: '32px', borderRadius: '32px', position: 'sticky', top: '120px' }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Order Summary</h3>
            <div className="flex justify-between" style={{ marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between" style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
              <span>Shipping</span>
              <span style={{ color: 'var(--accent-secondary)' }}>Free</span>
            </div>
            <div style={{ height: '1px', background: 'var(--glass-border)', marginBottom: '24px' }}></div>
            <div className="flex justify-between" style={{ marginBottom: '32px', fontSize: '1.5rem', fontWeight: 700 }}>
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={placeOrder}>
              <CreditCard size={18} /> Checkout
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cart;
