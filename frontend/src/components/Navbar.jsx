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
            backgroundColor: 'var(--bg-main)',
            borderBottom: '1px solid var(--bg-tertiary)',
            padding: '16px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            {/* Left: Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #000000, #525252)', position: 'relative', transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', width: '12px', height: '2px', backgroundColor: 'white', transform: 'rotate(-45deg)' }}></div>
                    <div style={{ position: 'absolute', width: '2px', height: '12px', backgroundColor: 'white', transform: 'rotate(-45deg)' }}></div>
                </div>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Lumina</span>
            </Link>

            {/* Center: Links */}
            <div className="desktop-menu" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                <Link to="/" className="nav-link" style={{ fontWeight: 600 }}>Home</Link>
                <Link to="/?category=Furniture" className="nav-link">Furniture</Link>
                <Link to="/?category=Home Decor" className="nav-link">Home Decor</Link>
                <Link to="/?category=Show all products" className="nav-link">All Products</Link>
                <Link to="/?category=Sales" className="nav-link" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sales</Link>
            </div>

            {/* Right: Search and Icons */}
            <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <form onSubmit={handleSearch} style={{ position: 'relative', width: '240px' }}>
                    <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search curated decor..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 16px 10px 42px',
                            borderRadius: '50px',
                            border: '1px solid var(--glass-border)',
                            backgroundColor: 'var(--bg-secondary)',
                            fontSize: '0.85rem',
                            outline: 'none',
                            color: 'var(--text-primary)'
                        }}
                    />
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link to="/wishlist" style={{ color: "#EF4444", display: 'flex', alignItems: 'center' }}>
                        <Heart size={20} fill="#EF4444" fillOpacity={0.1} />
                    </Link>

                    <Link to="/cart" style={{ color: 'var(--text-secondary)', position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute', top: '-6px', right: '-8px',
                                backgroundColor: 'var(--accent-primary)', color: 'white',
                                fontSize: '0.65rem', fontWeight: 700,
                                width: '16px', height: '16px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {token ? (
                        <Link to="/orders" style={{ display: 'block', width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--bg-tertiary)', marginLeft: '8px' }}>
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Link>
                    ) : (
                        <Link to="/login" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                            <User size={22} />
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Toggle */}
            <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} style={{ display: 'none' }}>
                {isOpen ? <X size={24} color="var(--text-primary)" /> : <Menu size={24} color="var(--text-primary)" />}
            </button>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--bg-tertiary)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                    >
                        <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
                            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text" placeholder="Search curated decor..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '50px', border: '1px solid var(--bg-tertiary)', backgroundColor: 'var(--bg-secondary)', fontSize: '0.9rem', outline: 'none', color: 'var(--text-primary)' }}
                            />
                        </form>
                        <Link to="/" className="nav-link-mobile" onClick={() => setIsOpen(false)}>Home</Link>
                        <Link to="/?category=Furniture" className="nav-link-mobile" onClick={() => setIsOpen(false)}>Furniture</Link>
                        <Link to="/?category=Home Decor" className="nav-link-mobile" onClick={() => setIsOpen(false)}>Home Decor</Link>
                        <Link to="/?category=Show all products" className="nav-link-mobile" onClick={() => setIsOpen(false)}>All Products</Link>
                        <Link to="/?category=Sales" className="nav-link-mobile" style={{ color: 'var(--accent-primary)' }} onClick={() => setIsOpen(false)}>Sales</Link>
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
                    color: var(--text-muted);
                    text-decoration: none;
                    font-size: 0.95rem;
                    transition: color 0.2s ease;
                }
                .nav-link:hover {
                    color: var(--text-primary);
                }
                .nav-link-mobile {
                    color: var(--text-primary);
                    text-decoration: none;
                    font-size: 1.1rem;
                    font-weight: 600;
                    padding: 8px 0;
                    border-bottom: 1px solid var(--bg-tertiary);
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
