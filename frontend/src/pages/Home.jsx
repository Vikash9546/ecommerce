import { useEffect, useState } from "react";
import API from "../api/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Search, Heart, SlidersHorizontal, ChevronDown } from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "All Lighting";
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortOrder, setSortOrder] = useState("Most Popular");
  const [priceRange, setPriceRange] = useState(2000);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const categories = ["All Lighting", "Chandeliers", "Floor Lamps", "Lanterns", "Furniture", "Home Decor", "Sales"];
  const colors = ["#000000", "#FFFFFF", "#FBBF24", "#9CA3AF"];
  const materials = ["Brass", "Glass", "Wood"];

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const { cart, addToCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get("products")
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
      // Scroll to main content area smoothly
      window.scrollTo({ top: 400, behavior: 'smooth' });
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
    const matchesCategory = selectedCategory === "All Lighting" || apiCat.includes(selectedCategory) || selectedCategory.includes(apiCat);

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

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>

      {/* Hero Section */}
      <div style={{ padding: "0 24px" }}>
        <div className="home-hero">
          {/* Decorative Elements */}
          <div style={{ position: "absolute", right: "10%", top: "40%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255, 46, 91, 0.15) 0%, transparent 70%)", transform: "translateY(-50%)" }}></div>
          <div className="home-hero-text">LUMINA</div>

          <div style={{ position: "relative", zIndex: 1, maxWidth: "600px" }}>
            <div style={{ color: "#FF2E5B", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#9CA3AF" }}>Home /</span> Lighting
            </div>
            <h1 style={{ color: "#FFFFFF", fontSize: "4rem", fontWeight: "800", lineHeight: "1.1", marginBottom: "24px" }}>
              Illuminate Your<br />Space
            </h1>
            <p style={{ color: "#9CA3AF", fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "40px", maxWidth: "480px" }}>
              Discover our curated range of chandeliers, floor lamps, and lanterns designed to transform your home.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container home-layout" style={{ padding: "40px 24px" }}>

        {/* Left Sidebar - Filters */}
        <div className="home-sidebar">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px" }}>
            <SlidersHorizontal size={20} color="#FF2E5B" />
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#0F172A", margin: 0 }}>Filters</h3>
          </div>

          {/* Category Filter */}
          <div style={{ marginBottom: "32px" }}>
            <h4 style={{ fontSize: "0.85rem", color: "#64748B", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Category</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {categories.map(cat => (
                <label key={cat} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <div style={{
                    width: "18px", height: "18px",
                    borderRadius: "4px",
                    border: selectedCategory === cat ? "none" : "2px solid #CBD5E1",
                    backgroundColor: selectedCategory === cat ? "#FF2E5B" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {selectedCategory === cat && <div style={{ width: "10px", height: "10px", backgroundColor: "white" }}></div>} {/* Mock checkmark */}
                  </div>
                  <span style={{ fontSize: "0.95rem", color: selectedCategory === cat ? "#0F172A" : "#64748B", fontWeight: selectedCategory === cat ? "600" : "400" }}>{cat}</span>
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
            <h4 style={{ fontSize: "0.85rem", color: "#64748B", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Price Range</h4>
            <input
              type="range"
              min="0" max="2500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#FF2E5B" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "0.85rem", color: "#0F172A", fontWeight: "600" }}>
              <span>₹0</span>
              <span>₹{priceRange}+</span>
            </div>
          </div>

          {/* Color Filter */}
          <div style={{ marginBottom: "32px" }}>
            <h4 style={{ fontSize: "0.85rem", color: "#64748B", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Color</h4>
            <div style={{ display: "flex", gap: "12px" }}>
              {colors.map((color, i) => (
                <div key={i}
                  onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                  style={{
                    width: "24px", height: "24px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    border: color === "#FFFFFF" ? "1px solid #E2E8F0" : "none",
                    cursor: "pointer",
                    boxShadow: selectedColor === color ? "0 0 0 2px white, 0 0 0 4px #FF2E5B" : "none",
                    transition: "all 0.2s"
                  }}></div>
              ))}
            </div>
          </div>

          {/* Material Filter */}
          <div>
            <h4 style={{ fontSize: "0.85rem", color: "#64748B", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Material</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {materials.map(mat => (
                <label key={mat} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <div style={{
                    width: "18px", height: "18px",
                    borderRadius: "4px",
                    border: selectedMaterials.includes(mat) ? "none" : "2px solid #CBD5E1",
                    backgroundColor: selectedMaterials.includes(mat) ? "#FF2E5B" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {selectedMaterials.includes(mat) && <div style={{ width: "10px", height: "10px", backgroundColor: "white" }}></div>}
                  </div>
                  <span style={{ fontSize: "0.95rem", color: selectedMaterials.includes(mat) ? "#0F172A" : "#64748B", fontWeight: selectedMaterials.includes(mat) ? "600" : "400" }}>{mat}</span>
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
            <div style={{ fontSize: "0.95rem", color: "#64748B" }}>
              Showing <span style={{ fontWeight: "600", color: "#0F172A" }}>
                {filteredProducts.length > 0 ? (currentPage - 1) * productsPerPage + 1 : 0} - {Math.min(currentPage * productsPerPage, filteredProducts.length)}
              </span> of <span style={{ fontWeight: "600", color: "#0F172A" }}>{filteredProducts.length}</span> products
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", color: "#64748B" }}>
              Sort by:
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{ border: "none", backgroundColor: "transparent", fontWeight: "600", color: "#0F172A", cursor: "pointer", outline: "none" }}
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
                };

                return (
                  <Link to={`/product/${p._id}`} key={p._id} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                    <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", transition: "transform 0.2s", ":hover": { transform: "translateY(-4px)" } }}>
                      <div style={{ position: "relative", backgroundColor: "#F3F4F6", borderRadius: "12px", height: "220px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img
                          src={p.image || (p.images && p.images[0]) || "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=600&auto=format&fit=crop"}
                          alt={p.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
                        />
                        <button style={{ position: "absolute", top: "12px", right: "12px", width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.9)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", cursor: "pointer" }}>
                          <Heart size={16} color={index === 0 ? "#FF2E5B" : "#94A3B8"} fill={index === 0 ? "#FF2E5B" : "none"} />
                        </button>
                        {index % 3 === 0 && (
                          <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#FF2E5B", color: "white", fontSize: "0.7rem", fontWeight: "700", padding: "4px 8px", borderRadius: "4px", letterSpacing: "1px" }}>
                            SALE
                          </div>
                        )}
                      </div>

                      <div style={{ fontSize: "0.75rem", color: "#FF2E5B", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700", marginBottom: "4px" }}>
                        {p.category || "Lighting"}
                      </div>
                      <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "#0F172A", margin: "0 0 12px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {p.name}
                      </h3>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontWeight: "700", color: "#0F172A", fontSize: "1.1rem" }}>
                          ₹{p.price?.toFixed(2) || p.price}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: "60px", textAlign: "center", color: "#64748B", backgroundColor: "white", borderRadius: "20px" }}>
              <Search size={40} color="#CBD5E1" style={{ margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#0F172A", marginBottom: "8px" }}>No products found</h3>
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
                style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid #E2E8F0", backgroundColor: currentPage === 1 ? "#F8F9FA" : "white", color: currentPage === 1 ? "#CBD5E1" : "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", cursor: currentPage === 1 ? "not-allowed" : "pointer", transition: "all 0.2s" }}
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
                  style={{ width: "40px", height: "40px", borderRadius: "50%", border: currentPage === i + 1 ? "none" : "1px solid #E2E8F0", backgroundColor: currentPage === i + 1 ? "#FF2E5B" : "white", color: currentPage === i + 1 ? "white" : "#64748B", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
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
                style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid #E2E8F0", backgroundColor: currentPage === totalPages ? "#F8F9FA" : "white", color: currentPage === totalPages ? "#CBD5E1" : "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", cursor: currentPage === totalPages ? "not-allowed" : "pointer", transition: "all 0.2s" }}
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
