import { useEffect, useState } from "react";
import API from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Package, Heart, MapPin, CreditCard, LogOut } from "lucide-react";

const Orders = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get(`order/history`)
      .then((res) => {
        const activeOrders = res.data.filter(o => o.status !== 'Cancelled');
        setOrders(activeOrders);
      })
      .catch(() => setOrders([]));
  }, []);

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
              Account &gt; <span style={{ color: "var(--accent-primary)" }}>Orders</span>
            </div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>Order History</h1>
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
              <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "var(--text-muted)", textDecoration: "none", transition: "all 0.2s" }}>
                <User size={18} />
                <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>My Profile</span>
              </Link>

              <Link to="/orders" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", backgroundColor: "var(--bg-secondary)", color: "var(--accent-primary)", textDecoration: "none", transition: "all 0.2s" }}>
                <Package size={18} />
                <span style={{ fontSize: "0.95rem", fontWeight: "600" }}>My Orders</span>
              </Link>

              <Link to="/wishlist" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "var(--text-muted)", textDecoration: "none", transition: "all 0.2s" }}>
                <Heart size={18} color="#EF4444" fill="#EF4444" fillOpacity={0.1} />
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
          <div className="account-content">

            {/* Order History Table */}
            <div className="scroll-x" style={{ backgroundColor: "var(--bg-main)", borderRadius: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", marginBottom: "40px" }}>
              <div style={{ minWidth: "600px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", padding: "20px 30px", borderBottom: "1px solid var(--bg-tertiary)", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                  <div>Order</div>
                  <div>Date</div>
                  <div>Status</div>
                  <div style={{ textAlign: "right" }}>Action</div>
                </div>

                {orders.length === 0 ? (
                  <div style={{ padding: "60px 30px", textAlign: "center", color: "var(--text-muted)" }}>
                    No orders found.
                  </div>
                ) : (
                  <div>
                    {orders.map((order, index) => {
                      const date = new Date(order.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

                      let statusBg = "var(--bg-tertiary)";
                      let statusColor = "var(--text-muted)";

                      if (order.status === 'Delivered') {
                        statusBg = "var(--bg-secondary)";
                        statusColor = "var(--text-primary)";
                      } else if (order.status === 'Processing') {
                        statusBg = "var(--bg-secondary)";
                        statusColor = "var(--text-primary)";
                      } else if (order.status === 'Shipped') {
                        statusBg = "var(--bg-secondary)";
                        statusColor = "var(--text-primary)";
                      }

                      return (
                        <div key={order._id || index} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", padding: "20px 30px", borderBottom: index < orders.length - 1 ? "1px solid var(--bg-tertiary)" : "none", alignItems: "center" }}>
                          <div style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "0.95rem" }}>
                            #{String(order._id || "").slice(-6).toUpperCase()}
                          </div>
                          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                            {date}
                          </div>
                          <div>
                            <span style={{ backgroundColor: statusBg, color: statusColor, padding: "6px 12px", borderRadius: "50px", fontSize: "0.8rem", fontWeight: "600", display: "inline-block" }}>
                              • {order.status || "Processing"}
                            </span>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <button className="btn" style={{ backgroundColor: "var(--accent-primary)", color: "white", padding: "8px 20px", borderRadius: "50px", fontSize: "0.85rem", fontWeight: "600" }}>
                              Track Order
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {orders.length > 0 && (
                  <div style={{ padding: "20px", textAlign: "center", borderTop: "1px solid var(--bg-tertiary)" }}>
                    <Link to="#" style={{ color: "var(--accent-primary)", fontWeight: "600", fontSize: "0.9rem", textDecoration: "none" }}>View All Orders</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended for You */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>Recommended for You</h2>
                <Link to="/" style={{ color: "var(--accent-primary)", fontWeight: "600", fontSize: "0.9rem", textDecoration: "none" }}>Shop More +</Link>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "24px" }}>
                {/* Dummy Products to match design */}
                {[
                  { name: "Velvet Lounge Chair", category: "Furniture -> Seating", price: 299.00, img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600&auto=format&fit=crop" },
                  { name: "Aura Brass Floor Lamp", category: "Decor -> Lighting", price: 145.00, img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop" },
                  { name: "Ceramic Vase Set", category: "Decor -> Accessories", price: 89.00, img: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=600&auto=format&fit=crop" }
                ].map((prod, idx) => (
                  <div key={idx} style={{ backgroundColor: "var(--bg-main)", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                    <div style={{ position: "relative", backgroundColor: "var(--bg-secondary)", borderRadius: "12px", height: "180px", marginBottom: "16px" }}>
                      <img src={prod.img} alt={prod.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }} />
                      <button style={{ position: "absolute", top: "10px", right: "10px", width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.8)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", cursor: "pointer" }}>
                        <Heart size={16} color="var(--text-muted)" fill="none" />
                      </button>
                    </div>
                    <div style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "0.95rem", marginBottom: "4px" }}>{prod.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "12px" }}>{prod.category}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontWeight: "700", color: "#2563EB", fontSize: "1.1rem" }}>₹{prod.price.toFixed(2)}</div>
                      <button style={{ padding: "6px", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--bg-tertiary)", borderRadius: "8px", cursor: "pointer" }}>
                        <Package size={16} color="var(--text-primary)" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
