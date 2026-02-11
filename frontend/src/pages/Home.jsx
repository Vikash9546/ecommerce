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
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    API.get("products")
      .then((res) => {
        setProducts(res.data);
      })
      .finally(() => setLoading(false));
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
        padding: '80px 0 40px',
        textAlign: 'center',
        background: 'radial-gradient(circle at center, rgba(251, 113, 133, 0.1) 0%, transparent 70%)'
      }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            marginBottom: '20px',
            fontWeight: 800,
            lineHeight: 1.1
          }}>
          Elevate Your Home
        </motion.h1>

        {!searchQuery && selectedCategory === "All" && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              marginBottom: '20px',
              maxWidth: '600px',
              margin: '0 auto',
              color: 'var(--text-secondary)'
            }}>
            Discover premium essentials for modern living. Curated, minimalist, and built for your sanctuary.
          </motion.p>
        )}
      </section>

      {/* Search Bar Container */}
      <div style={{ maxWidth: '600px', margin: '0 auto 60px', position: 'relative', padding: '0 20px', zIndex: 10 }}>
        <div style={{ position: 'relative' }}>
          <Search size={22} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search household items..."
            value={searchQuery}
            onChange={(e) => setSearchParams(e.target.value ? { search: e.target.value } : {})}
            style={{
              width: '100%',
              padding: '18px 20px 18px 56px',
              borderRadius: '20px',
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--glass-border)',
              outline: 'none',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </div>
      </div>

      {/* Filter UI */}
      <div style={{ marginBottom: '48px' }}>
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-end flex-wrap gap-6">
            <div className="w-full lg:w-auto">
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>
                Explore Categories
              </p>
              <div className="flex gap-3 scroll-x" style={{ paddingBottom: '12px' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                    style={{
                      padding: '10px 24px',
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

            <div className="flex gap-6 items-center flex-wrap">
              <div className="flex flex-col gap-2">
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Sort</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="glass"
                  style={{
                    padding: '10px 16px',
                    borderRadius: '12px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    border: '1px solid var(--glass-border)',
                    background: 'var(--bg-secondary)'
                  }}
                >
                  <option value="default">Newest First</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
              </div>

              {(searchQuery || selectedCategory !== "All" || sortOrder !== "default") && (
                <button
                  onClick={clearFilters}
                  className="btn btn-outline"
                  style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: '#F87171', alignSelf: 'flex-end', padding: '10px 20px' }}
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-8 border-t border-white/5">
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700 }}>
              {searchQuery ? `Search results for "${searchQuery}"` : selectedCategory !== "All" ? `${selectedCategory} Collection` : "Featured Essentials"}
            </h2>
            <span className="text-muted text-sm">{filteredProducts.length} items</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : currentProducts.length > 0 ? (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: '32px',
            paddingBottom: '80px'
          }}>
            {currentProducts.map((p, index) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % 12) * 0.05 }}
                className="glass group hover-up"
                style={{
                  padding: '20px',
                  borderRadius: '28px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Link to={`/product/${p._id}`} style={{ cursor: 'pointer', display: 'block' }}>
                  <div style={{
                    aspectRatio: '1/1',
                    borderRadius: '20px',
                    marginBottom: '20px',
                    overflow: 'hidden',
                    background: 'var(--bg-tertiary, #1C1C26)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                  }}>
                    <img
                      src={p.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=400"}
                      alt={p.name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      className="group-hover:scale-110"
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
                      {p.category}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', margin: '8px 0', fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</h3>
                    <p style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.5
                    }}>
                      {p.description}
                    </p>
                  </div>
                </Link>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                  <p style={{ fontSize: '1.4rem', color: 'var(--text-primary)', fontWeight: 700 }}>₹{p.price}</p>
                  {(() => {
                    const handleAddToCartClick = (e, productId) => {
                      e.preventDefault();
                      if (!token) {
                        navigate("/login");
                        return;
                      }
                      addToCart(productId);
                    };

                    const cartItem = cart.items.find(item => item.productId?._id === p._id);
                    if (cartItem) {
                      return (
                        <div className="flex items-center gap-3 glass" style={{ padding: '6px 12px', borderRadius: '14px', background: 'rgba(251, 113, 133, 0.1)' }}>
                          <button
                            onClick={() => updateQuantity(p._id, cartItem.quantity - 1)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex' }}
                          >
                            <Trash2 size={16} color={cartItem.quantity === 1 ? "#F87171" : "currentColor"} />
                          </button>
                          <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{cartItem.quantity}</span>
                          <button
                            onClick={() => updateQuantity(p._id, cartItem.quantity + 1)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex' }}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      );
                    }
                    return (
                      <button
                        className="btn btn-primary"
                        style={{ padding: '12px', borderRadius: '16px' }}
                        onClick={(e) => handleAddToCartClick(e, p._id)}
                      >
                        <ShoppingCart size={20} />
                      </button>
                    );
                  })()}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="glass flex flex-col items-center justify-center animate-fade-in" style={{ padding: '120px 40px', borderRadius: '40px', textAlign: 'center' }}>
          <div className="p-6 bg-white/5 rounded-full mb-6">
            <SearchX size={48} color="var(--text-muted)" />
          </div>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '12px', fontWeight: 700 }}>No products found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>We couldn't find any products matching your current criteria. Try adjusting your filters or search terms.</p>
          <button onClick={clearFilters} className="btn btn-primary mt-8">Clear All Filters</button>
        </div>
      )
      }
    </div >
  );
};

export default Home;
