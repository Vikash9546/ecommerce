import { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight, SearchX } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
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
      {!searchQuery && selectedCategory === "All" && (
        <section style={{
          padding: '60px 0',
          textAlign: 'center',
          background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)'
        }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: '4rem', marginBottom: '20px' }}>
            Elevate Your <span style={{ color: 'var(--accent-primary)' }}>Home</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Discover the most premium essentials for modern living. Curated, minimalist, and built for your sanctuary.
          </motion.p>
        </section>
      )}

      {/* Filter UI */}
      <div style={{ marginTop: searchQuery || selectedCategory !== "All" ? '20px' : '60px', marginBottom: '40px' }}>
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-end flex-wrap gap-4">
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Categories
              </p>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '99px',
                      fontSize: '0.85rem'
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
                  Show
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
                  <option value={10}>10 Items</option>
                  <option value={12}>12 Items</option>
                  <option value={15}>15 Items</option>
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
            <span style={{ color: 'var(--text-muted)' }}>{filteredProducts.length} items found</span>
          </div>
        </div>
      </div>

      {currentProducts.length > 0 ? (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px',
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

