import { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight, SearchX } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
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

  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchQuery) ||
    p.category?.toLowerCase().includes(searchQuery) ||
    p.description?.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="container">
      {/* Hero Section */}
      {!searchQuery && (
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
        </section>
      )}

      {/* Product Grid */}
      <div style={{ marginTop: searchQuery ? '20px' : '60px' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem' }}>
            {searchQuery ? `Results for "${searchQuery}"` : "Featured Products"}
          </h2>
          <span style={{ color: 'var(--text-muted)' }}>{filteredProducts.length} items found</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px',
            paddingBottom: '60px'
          }}>
            {filteredProducts.map((p, index) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass"
                whileHover={{ y: -10, borderColor: 'var(--accent-primary)' }}
                style={{ padding: '24px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{
                  height: '240px',
                  borderRadius: '16px',
                  marginBottom: '20px',
                  overflow: 'hidden',
                  background: 'var(--bg-tertiary)'
                }}>
                  <img
                    src={p.image || "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop"}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                    {p.category}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', margin: '4px 0' }}>{p.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.description}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: 700 }}>₹{p.price}</p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary"
                    style={{ padding: '10px' }}
                    onClick={() => addToCart(p._id)}
                  >
                    <ShoppingCart size={20} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass flex flex-col items-center justify-center" style={{ padding: '100px', borderRadius: '32px', textAlign: 'center' }}>
            <SearchX size={48} color="var(--text-muted)" style={{ marginBottom: '24px' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No products found</h3>
            <p>Try searching for something else or clear the search bar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

