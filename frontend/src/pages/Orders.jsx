import { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);


  useEffect(() => {
    API.get(`order/history`)
      .then((res) => {
        // Filter out cancelled orders so they don't appear
        const activeOrders = res.data.filter(o => o.status !== 'Cancelled');
        setOrders(activeOrders);
      })
      .catch(() => setOrders([]));
  }, []);

  const [cancellingId, setCancellingId] = useState(null);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      setCancellingId(orderId);
      await API.put(`order/cancel/${orderId}`);
      // Remove the order from the list immediately
      setOrders(orders.filter(o => o._id !== orderId));
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const [cancellingItemId, setCancellingItemId] = useState(null);

  const handleCancelItem = async (orderId, itemId) => {
    if (!window.confirm("Remove this item from the order?")) return;
    try {
      setCancellingItemId(itemId);
      const res = await API.put(`order/cancel-item/${orderId}/${itemId}`);

      // If the order status is now 'Cancelled', remove it from the list
      if (res.data.status === 'Cancelled') {
        setOrders(orders.filter(o => o._id !== orderId));
      } else {
        // Otherwise update it in place
        setOrders(orders.map(o => o._id === orderId ? res.data : o));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    } finally {
      setCancellingItemId(null);
    }
  };

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
              <div className="flex items-center gap-4">
                {/* Status Badge */}
                <div className="flex items-center gap-2" style={{
                  padding: '8px 16px',
                  borderRadius: '99px',
                  background: order.status === 'Delivered' ? 'rgba(16, 185, 129, 0.1)' : order.status === 'Cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                  color: order.status === 'Delivered' ? 'var(--accent-secondary)' : order.status === 'Cancelled' ? '#EF4444' : 'var(--accent-primary)',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}>
                  {order.status === 'Delivered' ? <CheckCircle size={16} /> : order.status === 'Cancelled' ? <Package size={16} /> : <Clock size={16} />}
                  {order.status || "Processing"}
                </div>

                {/* Cancel Order Button */}
                {!['Delivered', 'Cancelled'].includes(order.status) && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="btn btn-outline"
                    disabled={cancellingId === order._id}
                    style={{
                      fontSize: '0.85rem',
                      padding: '6px 16px',
                      borderColor: '#EF4444',
                      color: '#EF4444',
                      opacity: cancellingId === order._id ? 0.5 : 1,
                      cursor: cancellingId === order._id ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {(order.items || []).map((p) => {
                const itemId = p._id || p.productId?._id;
                return (
                  <div key={itemId} className="flex gap-4 items-center" style={{ position: 'relative' }}>
                    <div style={{ width: '56px', height: '56px', background: 'var(--bg-tertiary)', borderRadius: '12px', overflow: 'hidden' }}>
                      <img
                        src={p.productId?.image || "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop"}
                        alt={p.productId?.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{p.productId?.name}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Qty: {p.quantity}</p>
                    </div>

                    {/* Item Cancel Button */}
                    {!['Delivered', 'Cancelled'].includes(order.status) && (
                      <button
                        onClick={() => handleCancelItem(order._id, itemId)}
                        disabled={cancellingItemId === itemId}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#EF4444',
                          cursor: 'pointer',
                          marginLeft: 'auto',
                          opacity: cancellingItemId === itemId ? 0.5 : 1
                        }}
                        title="Remove Item"
                      >
                        {cancellingItemId === itemId ? <Clock size={16} /> : <X size={18} />}
                      </button>
                    )}
                  </div>
                );
              })}
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
