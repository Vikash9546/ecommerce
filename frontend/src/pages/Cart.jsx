import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Plus, Minus, Search, Trash2, ShoppingBag, CreditCard, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import API from "../api/api";

const Cart = () => {
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { cart, updateQuantity, removeFromCart, cartTotal, loading: cartLoading, fetchCart } = useCart();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const products = cart?.items || [];

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
              style={{ padding: '24px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}
            >
              <div style={{ width: '120px', height: '120px', background: 'var(--bg-tertiary)', borderRadius: '16px', overflow: 'hidden' }}>
                <img
                  src={p.productId?.image || "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop"}
                  alt={p.productId?.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{p.productId?.name}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 glass" style={{ padding: '4px 12px', borderRadius: '12px' }}>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQuantity(p.productId?._id, p.quantity - 1)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex' }}
                    >
                      {p.quantity === 1 ? <Trash2 size={16} color="#F87171" /> : <Minus size={16} />}
                    </motion.button>
                    <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{p.quantity}</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQuantity(p.productId?._id, p.quantity + 1)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex' }}
                    >
                      <Plus size={16} />
                    </motion.button>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  ₹{(p.productId?.price || 0) * p.quantity}
                </p>
                {p.quantity > 1 && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>₹{p.productId?.price} each</p>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFromCart(p.productId?._id)}
                  style={{ background: 'transparent', border: 'none', color: '#F87171', cursor: 'pointer', marginTop: '12px' }}
                >
                  <Trash2 size={20} />
                </motion.button>
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
              <p style={{ marginBottom: '32px' }}>Looks like you haven't added any premium household items yet.</p>
              <Link to="/" className="btn btn-primary" style={{ padding: '12px 32px', borderRadius: '99px' }}>
                Explore Collection <ArrowRight size={18} />
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
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between" style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
              <span>Shipping</span>
              <span style={{ color: 'var(--accent-secondary)' }}>Free</span>
            </div>
            <div style={{ height: '1px', background: 'var(--glass-border)', marginBottom: '24px' }}></div>
            <div className="flex justify-between" style={{ marginBottom: '32px', fontSize: '1.5rem', fontWeight: 700 }}>
              <span>Total</span>
              <span>₹{cartTotal}</span>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', cursor: 'pointer' }}
              onClick={handleCheckout}
            >
              <ArrowRight size={18} /> Proceed to Checkout
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cart;
