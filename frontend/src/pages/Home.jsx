import { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight } from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const userId = "user123";

  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
  }, []);

  const addToCart = async (productId) => {
    await API.post("/cart/add", {
      userId,
      productId,
      quantity: 1,
    });
    alert("Added to cart");
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <section style={{
        padding: '60px 0',
        textAlign: 'center',
        background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)'
      }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '4rem', marginBottom: '20px' }}>
          Future of <span style={{ color: 'var(--accent-primary)' }}>Shopping</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Experience the most premium and fast ecommerce platform built with cutting-edge technology.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4">
          <button className="btn btn-primary">Shop Now <ArrowRight size={18} /></button>
          <button className="btn btn-outline">Learn More</button>
        </motion.div>
      </section>

      {/* Product Grid */}
      <div style={{ marginTop: '60px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '32px' }}>Featured Products</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '32px',
          paddingBottom: '60px'
        }}>
          {products.map((p, index) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass"
              whileHover={{ y: -10, borderColor: 'var(--accent-primary)' }}
              style={{ padding: '24px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ height: '200px', background: 'var(--bg-tertiary)', borderRadius: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Product Image</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{p.name}</h3>
              <p style={{ marginBottom: '20px', fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: 700 }}>₹{p.price}</p>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => addToCart(p._id)}
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

