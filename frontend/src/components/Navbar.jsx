import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingCart, Heart, Search, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const { cartCount } = useCart();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            zIndex: 1000,
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #F1F5F9',
            padding: '16px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            {/* Left: Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #FF2E5B, #FFA3B5)', position: 'relative', transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', width: '12px', height: '2px', backgroundColor: 'white', transform: 'rotate(-45deg)' }}></div>
                    <div style={{ position: 'absolute', width: '2px', height: '12px', backgroundColor: 'white', transform: 'rotate(-45deg)' }}></div>
                </div>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0F172A' }}>Lumina</span>
            </Link>

            {/* Center: Links */}
            <div className="desktop-menu" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                <Link to="/" className="nav-link" style={{ fontWeight: 600 }}>Home</Link>
                <Link to="/?category=Furniture" className="nav-link">Furniture</Link>
                <Link to="/?category=Home Decor" className="nav-link">Home Decor</Link>
                <Link to="/?category=All Lighting" className="nav-link">Lighting</Link>
                <Link to="/?category=Sales" className="nav-link" style={{ color: '#FF2E5B', fontWeight: 600 }}>Sales</Link>
            </div>

            {/* Right: Search and Icons */}
            <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <form onSubmit={handleSearch} style={{ position: 'relative', width: '240px' }}>
                    <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search curated decor..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 16px 10px 42px',
                            borderRadius: '50px',
                            border: '1px solid #E9ECEF',
                            backgroundColor: '#F8F9FA',
                            fontSize: '0.85rem',
                            outline: 'none',
                        }}
                    />
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link to="/wishlist" style={{ color: '#64748B', display: 'flex', alignItems: 'center' }}>
                        <Heart size={20} />
                    </Link>

                    <Link to="/cart" style={{ color: '#64748B', position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute', top: '-6px', right: '-8px',
                                backgroundColor: '#FF2E5B', color: 'white',
                                fontSize: '0.65rem', fontWeight: 700,
                                width: '16px', height: '16px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {token ? (
                        <Link to="/orders" style={{ display: 'block', width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #E9ECEF', marginLeft: '8px' }}>
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Link>
                    ) : (
                        <Link to="/login" style={{ color: '#64748B', display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                            <User size={22} />
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Toggle */}
            <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} style={{ display: 'none' }}>
                {isOpen ? <X size={24} color="#0F172A" /> : <Menu size={24} color="#0F172A" />}
            </button>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', borderBottom: '1px solid #E9ECEF', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                    >
                        <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text" placeholder="Search curated decor..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '50px', border: '1px solid #E9ECEF', backgroundColor: '#F8F9FA', fontSize: '0.9rem', outline: 'none' }}
                            />
                        </form>
                        <Link to="/" className="nav-link-mobile" onClick={() => setIsOpen(false)}>Home</Link>
                        <Link to="/?category=Furniture" className="nav-link-mobile" onClick={() => setIsOpen(false)}>Furniture</Link>
                        <Link to="/?category=Home Decor" className="nav-link-mobile" onClick={() => setIsOpen(false)}>Home Decor</Link>
                        <Link to="/?category=All Lighting" className="nav-link-mobile" onClick={() => setIsOpen(false)}>Lighting</Link>
                        <Link to="/?category=Sales" className="nav-link-mobile" onClick={() => setIsOpen(false)}>Sales</Link>
                        <Link to="/wishlist" className="nav-link-mobile" onClick={() => setIsOpen(false)}>Wishlist</Link>
                        <Link to="/cart" className="nav-link-mobile" onClick={() => setIsOpen(false)}>Cart ({cartCount})</Link>
                        {token ? (
                            <Link to="/orders" className="nav-link-mobile" onClick={() => setIsOpen(false)}>My Account</Link>
                        ) : (
                            <Link to="/login" className="nav-link-mobile" onClick={() => setIsOpen(false)}>Login</Link>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .nav-link {
                    color: #64748B;
                    text-decoration: none;
                    font-size: 0.95rem;
                    transition: color 0.2s ease;
                }
                .nav-link:hover {
                    color: #0F172A;
                }
                .nav-link-mobile {
                    color: #0F172A;
                    text-decoration: none;
                    font-size: 1.1rem;
                    font-weight: 600;
                    padding: 8px 0;
                    border-bottom: 1px solid #F1F5F9;
                }
                @media (max-width: 900px) {
                    .desktop-menu { display: none !important; }
                    .mobile-toggle { 
                        display: flex !important; 
                        background: transparent;
                        border: none;
                        cursor: pointer;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
