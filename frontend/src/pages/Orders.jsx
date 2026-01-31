import { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);


  useEffect(() => {
    API.get(`/order/history`).then((res) => setOrders(res.data)).catch(() => setOrders([]));
  }, []);

  return (
    <div className="container" style={{ paddingBottom: '100px' }}>
      <div className="flex items-center gap-4" style={{ marginBottom: '40px' }}>
        <Package size={32} color="var(--accent-primary)" />
        <h2 style={{ fontSize: '2.5rem' }}>Your Orders</h2>
      </div>

      <div className="flex flex-col gap-6">
        {orders.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass"
            style={{ padding: '32px', borderRadius: '32px' }}
          >
            <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Order ID</p>
                <h3 style={{ fontSize: '1.1rem', letterSpacing: '1px' }}>#{order._id.slice(-8).toUpperCase()}</h3>
              </div>
              <div className="flex items-center gap-2" style={{
                padding: '8px 16px',
                borderRadius: '99px',
                background: order.status === 'Delivered' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                color: order.status === 'Delivered' ? 'var(--accent-secondary)' : 'var(--accent-primary)',
                fontSize: '0.9rem',
                fontWeight: 600
              }}>
                {order.status === 'Delivered' ? <CheckCircle size={16} /> : <Clock size={16} />}
                {order.status || "Processing"}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {(order.items || []).map((p) => (
                <div key={p.productId?._id} className="flex gap-4 items-center">
                  <div style={{ width: '56px', height: '56px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}></div>
                  <div>
                    <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{p.productId?.name}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Qty: {p.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Total Amount</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>₹{order.totalAmount}</p>
            </div>
          </motion.div>
        ))}
        {orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass"
            style={{ padding: '80px 40px', borderRadius: '32px', textAlign: 'center' }}
          >
            <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 24px' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No orders yet</h3>
            <p style={{ marginBottom: '32px' }}>Your order history will appear here once you make a purchase.</p>
            <Link to="/" className="btn btn-primary">
              Continue Shopping <ArrowRight size={18} />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Orders;
