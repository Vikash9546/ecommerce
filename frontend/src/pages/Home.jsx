import { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight, SearchX, Search, Plus, Minus, Trash2 } from "lucide-react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams, selectedCategory, sortOrder]);

  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  // Apply Search, Category, and Sorting
  let filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery) ||
      p.category?.toLowerCase().includes(searchQuery) ||
      p.description?.toLowerCase().includes(searchQuery);

    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (sortOrder === "low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  const clearFilters = () => {
    setSearchParams({});
    setSelectedCategory("All");
    setSortOrder("default");
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <section style={{
        padding: '60px 0 20px',
        textAlign: 'center',
        background: 'radial-gradient(circle at center, rgba(251, 113, 133, 0.1) 0%, transparent 70%)'
      }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: window.innerWidth < 768 ? '2.5rem' : '4rem', marginBottom: '20px' }}>
          Elevate Your Home
        </motion.h1>

        {!searchQuery && selectedCategory === "All" && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: '1.2rem', marginBottom: '20px', maxWidth: '600px', margin: '0 auto' }}>
            Discover the most premium essentials for modern living. Curated, minimalist, and built for your sanctuary.
          </motion.p>
        )}
      </section>

      {/* Search Bar Container */}
      <div style={{ maxWidth: '600px', margin: '20px auto 40px', position: 'relative', padding: '0 20px', zIndex: 10 }}>
        <div style={{ position: 'relative' }}>
          <Search size={22} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search household items..."
            value={searchQuery}
            onChange={(e) => setSearchParams(e.target.value ? { search: e.target.value } : {})}
            style={{
              width: '100%',
              padding: '16px 20px 16px 56px',
              borderRadius: '16px',
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              backgroundColor: 'rgba(0, 0, 0, 0.2)', // Darker translucent background
              border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle light border
              outline: 'none',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)', // Inner shadow for depth
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
              e.target.style.borderColor = 'var(--accent-primary)';
              e.target.style.boxShadow = '0 0 0 4px rgba(251, 113, 133, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
          />
        </div>
      </div>

      {/* Filter UI */}
      <div style={{ marginBottom: '40px' }}>
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-end flex-wrap gap-4">
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Categories
              </p>
              <div className="flex gap-2 scroll-x" style={{ paddingBottom: '8px' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '99px',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 items-center flex-wrap">
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Sort By
                </p>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="glass"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="default">Default</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
              </div>

              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Show Items
                </p>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="glass"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value={10}>10</option>
                  <option value={12}>12</option>
                  <option value={15}>15</option>
                </select>
              </div>

              {(searchQuery || selectedCategory !== "All" || sortOrder !== "default") && (
                <button
                  onClick={clearFilters}
                  className="btn btn-outline"
                  style={{ marginTop: '30px', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--glass-border)', width: '100%' }}></div>

          <div className="flex justify-between items-center">
            <h2 style={{ fontSize: '1.75rem' }}>
              {searchQuery ? `Results for "${searchQuery}"` : selectedCategory !== "All" ? `${selectedCategory} Products` : "Featured Products"}
            </h2>
            {/* <span style={{ color: 'var(--text-muted)' }}>{filteredProducts.length} items found</span> */}
          </div>
        </div>
      </div>

      {currentProducts.length > 0 ? (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? 'repeat(auto-fill, minmax(160px, 1fr))' : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: window.innerWidth < 768 ? '16px' : '32px',
            paddingTop: '32px',
            paddingBottom: '60px'
          }}>
            {currentProducts.map((p, index) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass"
                whileHover={{ y: -10, borderColor: 'var(--accent-primary)' }}
                style={{
                  padding: window.innerWidth < 768 ? '12px' : '24px',
                  borderRadius: '24px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Link to={`/product/${p._id}`} style={{ cursor: 'pointer', display: 'block' }}>
                  <div style={{
                    height: window.innerWidth < 768 ? '160px' : '240px',
                    borderRadius: '16px',
                    marginBottom: '16px',
                    overflow: 'hidden',
                    background: 'var(--bg-tertiary)'
                  }}>
                    <img
                      src={p.image || "https://www.freepik.com/free-photos-vectors/no-item-found"}
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
                </Link>
                <div className="flex justify-between items-center">
                  <p style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: 700 }}>₹{p.price}</p>
                  {(() => {
                    const handleAddToCart = (productId) => {
                      if (!token) {
                        navigate("/login");
                        return;
                      }
                      addToCart(productId);
                    };

                    const cartItem = cart.items.find(item => item.productId?._id === p._id);
                    if (cartItem) {
                      return (
                        <div className="flex items-center gap-3 glass" style={{ padding: '4px 8px', borderRadius: '12px' }}>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(p._id, cartItem.quantity - 1)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px' }}
                          >
                            <Trash2 size={16} color={cartItem.quantity === 1 ? "#F87171" : "currentColor"} />
                          </motion.button>
                          <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{cartItem.quantity}</span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(p._id, cartItem.quantity + 1)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px' }}
                          >
                            <Plus size={16} />
                          </motion.button>
                        </div>
                      );
                    }
                    return (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary"
                        style={{ padding: '10px' }}
                        onClick={() => handleAddToCart(p._id)}
                      >
                        <ShoppingCart size={20} />
                      </motion.button>
                    );
                  })()}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col items-center gap-6" style={{ padding: '60px 0', borderTop: '1px solid var(--glass-border)' }}>
            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className={`btn ${currentPage === 1 ? 'btn-outline' : 'btn-primary'}`}
                style={{ padding: '12px 28px', borderRadius: '99px', opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                Previous
              </button>

              <div className="flex flex-col items-center">
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                  Page {currentPage} of {totalPages || 1}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Items {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length}
                </span>
              </div>

              <button
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`btn ${currentPage === totalPages || totalPages === 0 ? 'btn-outline' : 'btn-primary'}`}
                style={{ padding: '12px 28px', borderRadius: '99px', opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="glass flex flex-col items-center justify-center" style={{ padding: '100px', borderRadius: '32px', textAlign: 'center' }}>
          <SearchX size={48} color="var(--text-muted)" style={{ marginBottom: '24px' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No products found</h3>
          <p>Try searching for something else or clear the search bar.</p>
        </div>
      )}
    </div>
  );
};

export default Home;

