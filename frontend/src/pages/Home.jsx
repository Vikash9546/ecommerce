import { useEffect, useState } from "react";
import API from "../api/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Search, Heart, SlidersHorizontal, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "Show all products";
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortOrder, setSortOrder] = useState("Most Popular");
  const [priceRange, setPriceRange] = useState(2000);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const categories = ["Show all products", "Furniture", "Home Decor", "Sales"];
  const colors = ["#000000", "#FFFFFF", "#737373", "#EF4444", "#3B82F6", "#F59E0B"];
  const colorNames = {
    "#000000": "Black",
    "#FFFFFF": "White",
    "#737373": "Gray",
    "#EF4444": "Red",
    "#3B82F6": "Blue",
    "#F59E0B": "Gold"
  };
  const materials = ["Brass", "Glass", "Wood"];

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const { cart, addToCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    API.get("products")
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));

    if (token) {
      API.get("wishlist")
        .then((res) => setWishlistIds(res.data.map(item => item.product?._id)))
        .catch(() => { });
    }
  }, [token]);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
      // Scroll to main content area smoothly
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } else {
      setSelectedCategory("Show all products");
    }
  }, [searchParams]);

  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  // Apply Search, Category, Price, Color, Material
  let filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery) ||
      p.category?.toLowerCase().includes(searchQuery) ||
      p.description?.toLowerCase().includes(searchQuery);

    const apiCat = p.category || "";
    const matchesCategory = selectedCategory === "Show all products" || apiCat.includes(selectedCategory) || selectedCategory.includes(apiCat);

    const matchesPrice = (p.price || 0) <= priceRange;

    // Deterministically assign color and material based on ID for mockup filtering (since they are not in DB schema)
    const idNum1 = p._id ? p._id.charCodeAt(p._id.length - 1) : 0;
    const idNum2 = p._id ? p._id.charCodeAt(p._id.length - 2) : 0;
    const pColor = p.color || colors[idNum1 % colors.length];
    const pMaterial = p.material || materials[idNum2 % materials.length];

    const matchesColor = !selectedColor || pColor === selectedColor;
    const matchesMaterial = selectedMaterials.length === 0 || selectedMaterials.includes(pMaterial);

    return matchesSearch && matchesCategory && matchesPrice && matchesColor && matchesMaterial;
  });

  if (sortOrder === "Price: Low to High") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "Price: High to Low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceRange, selectedColor, selectedMaterials, sortOrder]);

  const handleClearFilters = () => {
    setSelectedCategory("Show all products");
    setPriceRange(2000);
    setSelectedColor(null);
    setSelectedMaterials([]);
    setSortOrder("Most Popular");
    setSearchParams({});
    toast.success("Filters cleared");
  };

  const hasActiveFilters = selectedCategory !== "Show all products" || priceRange !== 2000 || selectedColor !== null || selectedMaterials.length > 0 || searchParams.get("search");

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  return (
    <div style={{ backgroundColor: "var(--bg-main)", minHeight: "100vh" }}>

      {/* Hero Section */}
      <div style={{ padding: "0 24px" }}>
        <div className="home-hero">
          {/* Faded Background Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="hero-video-bg"
            style={{ opacity: 0.3 }}
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-sturdy-antique-wooden-furniture-in-a-sunny-home-40324-large.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay" style={{ background: "linear-gradient(to right, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 100%)" }}></div>

          {/* Decorative Elements */}
          <div style={{ position: "absolute", right: "10%", top: "40%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0, 0, 0, 0.15) 0%, transparent 70%)", transform: "translateY(-50%)", zIndex: 0 }}></div>
          <div className="home-hero-text" style={{ zIndex: 0 }}>LUMINA</div>

          <div style={{ position: "relative", zIndex: 1, maxWidth: "600px" }}>
            <div style={{ color: "#FFFFFF", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>Home /</span> Products
            </div>
            <h1 style={{ color: "#FFFFFF", fontSize: "4rem", fontWeight: "800", lineHeight: "1.1", marginBottom: "24px", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
              Illuminate Your<br />Space
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "40px", maxWidth: "480px" }}>
              Explore our curated selection of high-quality furniture and home decor designed to elevate your living space.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container home-layout" style={{ padding: "40px 24px" }}>

        {/* Left Sidebar - Filters */}
        <div className="home-sidebar">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <SlidersHorizontal size={20} color="var(--accent-primary)" />
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>Filters</h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                style={{
                  background: "none",
                  border: "none",
                  color: "#EF4444",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(239, 68, 68, 0.05)"
                }}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div style={{ marginBottom: "32px" }}>
            <h4 style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Category</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {categories.map(cat => (
                <label key={cat} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <div style={{
                    width: "18px", height: "18px",
                    borderRadius: "4px",
                    border: selectedCategory === cat ? "none" : "2px solid var(--bg-tertiary)",
                    backgroundColor: selectedCategory === cat ? "var(--accent-primary)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {selectedCategory === cat && <div style={{ width: "10px", height: "10px", backgroundColor: "white" }}></div>} {/* Mock checkmark */}
                  </div>
                  <span style={{ fontSize: "0.95rem", color: selectedCategory === cat ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: selectedCategory === cat ? "600" : "400" }}>{cat}</span>
                  <input
                    type="radio"
                    name="category"
                    style={{ display: "none" }}
                    checked={selectedCategory === cat}
                    onChange={() => {
                      setSelectedCategory(cat);
                      setSearchParams(prev => { prev.set("category", cat); return prev; });
                    }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div style={{ marginBottom: "32px" }}>
            <h4 style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Price Range</h4>
            <input
              type="range"
              min="0" max="2500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent-primary)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: "600" }}>
              <span>₹0</span>
              <span>₹{priceRange}+</span>
            </div>
          </div>

          {/* Color Filter */}
          <div style={{ marginBottom: "32px" }}>
            <h4 style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Color</h4>
            <div style={{ display: "flex", gap: "12px" }}>
              {colors.map((color, i) => (
                <div key={i}
                  onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                  title={colorNames[color]}
                  style={{
                    width: "28px", height: "28px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    border: "1px solid rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    boxShadow: selectedColor === color ? `0 0 0 2px var(--bg-main), 0 0 0 4px var(--accent-primary)` : "none",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                  {selectedColor === color && (
                    <div style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: (color === "#FFFFFF" || color === "#F59E0B") ? "black" : "white"
                    }}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Material Filter */}
          <div>
            <h4 style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Material</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {materials.map(mat => (
                <label key={mat} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <div style={{
                    width: "18px", height: "18px",
                    borderRadius: "4px",
                    border: selectedMaterials.includes(mat) ? "none" : "2px solid var(--bg-tertiary)",
                    backgroundColor: selectedMaterials.includes(mat) ? "var(--accent-primary)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {selectedMaterials.includes(mat) && <div style={{ width: "10px", height: "10px", backgroundColor: "white" }}></div>}
                  </div>
                  <span style={{ fontSize: "0.95rem", color: selectedMaterials.includes(mat) ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: selectedMaterials.includes(mat) ? "600" : "400" }}>{mat}</span>
                  <input
                    type="checkbox"
                    style={{ display: "none" }}
                    checked={selectedMaterials.includes(mat)}
                    onChange={() => {
                      setSelectedMaterials(prev =>
                        prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
                      );
                    }}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Area - Products Grid */}
        <div className="home-content">

          {/* Toolbar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <div style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
              Showing <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                {filteredProducts.length > 0 ? (currentPage - 1) * productsPerPage + 1 : 0} - {Math.min(currentPage * productsPerPage, filteredProducts.length)}
              </span> of <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>{filteredProducts.length}</span> products
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              Sort by:
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{ border: "none", backgroundColor: "transparent", fontWeight: "600", color: "var(--text-primary)", cursor: "pointer", outline: "none" }}
              >
                <option>Most Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {currentProducts.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "30px" }}>
              {currentProducts.map((p, index) => {
                const handleAddToCart = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!token) {
                    navigate("/login");
                    return;
                  }
                  addToCart(p._id);
                  toast.success("Added to cart");
                };

                const handleToggleWishlist = async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!token) {
                    toast.error("Please login to use wishlist");
                    navigate("/login");
                    return;
                  }
                  try {
                    const res = await API.post("wishlist/toggle", { productId: p._id });
                    if (res.data.wishlisted) {
                      setWishlistIds([...wishlistIds, p._id]);
                      toast.success("Added to wishlist");
                    } else {
                      setWishlistIds(wishlistIds.filter(id => id !== p._id));
                      toast.success("Removed from wishlist");
                    }
                  } catch (err) {
                    toast.error("Failed to update wishlist");
                  }
                };

                return (
                  <Link to={`/product/${p._id}`} key={p._id} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                    <div style={{ backgroundColor: "var(--bg-main)", borderRadius: "16px", padding: "16px", border: "1px solid var(--bg-tertiary)", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", transition: "transform 0.2s", ":hover": { transform: "translateY(-4px)" } }}>
                      <div style={{ position: "relative", backgroundColor: "var(--bg-secondary)", borderRadius: "12px", height: "220px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img
                          src={p.image || (p.images && p.images[0]) || "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=600&auto=format&fit=crop"}
                          alt={p.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
                        />
                        <button
                          onClick={handleToggleWishlist}
                          style={{ position: "absolute", top: "12px", right: "12px", width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.9)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", cursor: "pointer", zIndex: 10 }}
                        >
                          <Heart size={16} color={wishlistIds.includes(p._id) ? "#EF4444" : "var(--text-muted)"} fill={wishlistIds.includes(p._id) ? "#EF4444" : "none"} />
                        </button>
                        {index % 3 === 0 && (
                          <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "var(--accent-primary)", color: "white", fontSize: "0.7rem", fontWeight: "700", padding: "4px 8px", borderRadius: "4px", letterSpacing: "1px" }}>
                            SALE
                          </div>
                        )}
                      </div>

                      <div style={{ fontSize: "0.75rem", color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700", marginBottom: "4px" }}>
                        {p.category || "All Products"}
                      </div>
                      <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 12px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {p.name}
                      </h3>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontWeight: "700", color: "#2563EB", fontSize: "1.1rem" }}>
                          ₹{p.price?.toFixed(2) || p.price}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: "60px", textAlign: "center", color: "var(--text-muted)", backgroundColor: "var(--bg-main)", borderRadius: "20px", border: "1px solid var(--bg-tertiary)" }}>
              <Search size={40} color="var(--bg-tertiary)" style={{ margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "8px" }}>No products found</h3>
              <p>Try adjusting your category or price filters.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "40px", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => {
                  setCurrentPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid var(--bg-tertiary)", backgroundColor: currentPage === 1 ? "var(--bg-secondary)" : "white", color: currentPage === 1 ? "var(--bg-tertiary)" : "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: currentPage === 1 ? "not-allowed" : "pointer", transition: "all 0.2s" }}
              >
                &lt;
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  style={{ width: "40px", height: "40px", borderRadius: "50%", border: currentPage === i + 1 ? "none" : "1px solid var(--bg-tertiary)", backgroundColor: currentPage === i + 1 ? "var(--accent-primary)" : "white", color: currentPage === i + 1 ? "white" : "var(--text-secondary)", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => {
                  setCurrentPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid var(--bg-tertiary)", backgroundColor: currentPage === totalPages ? "var(--bg-secondary)" : "white", color: currentPage === totalPages ? "var(--bg-tertiary)" : "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: currentPage === totalPages ? "not-allowed" : "pointer", transition: "all 0.2s" }}
              >
                &gt;
              </button>
            </div>
          )}

        </div>
      </div>


    </div>
  );
};

export default Home;
