import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingCart, Package, User, LogOut, Layout, Menu, X, Search, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const token = localStorage.getItem("token");
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="glass" style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            zIndex: 1000,
            margin: '16px 24px',
            borderRadius: '16px',
            padding: '12px 24px'
        }}>
            <div className="container flex justify-between items-center">
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 'fit-content' }}>
                    <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        style={{ width: '40px', height: '40px', background: 'var(--accent-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Layout size={24} color="white" />
                    </motion.div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.04em' }}>Lumina</span>
                </Link>


                {/* Desktop Menu */}
                <div className="desktop-menu flex gap-4 items-center">
                    <button onClick={toggleTheme} className="nav-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/orders" className="nav-link"><Package size={20} /></Link>
                    <Link to="/cart" className="nav-link" style={{ position: 'relative' }}>
                        <ShoppingCart size={20} />
                    </Link>
                    {token ? (
                        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 12px' }}>
                            <LogOut size={18} />
                        </button>
                    ) : (
                        <Link to="/login" className="btn btn-primary" style={{ padding: '8px 20px' }}>
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} style={{ display: 'none' }}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className="flex flex-col gap-4" style={{ paddingTop: '20px' }}>
                            <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
                            <Link to="/orders" className="nav-link" onClick={() => setIsOpen(false)}>Orders</Link>
                            <Link to="/cart" className="nav-link" onClick={() => setIsOpen(false)}>Cart</Link>
                            {token ? (
                                <button onClick={handleLogout} className="btn btn-outline" style={{ justifyContent: 'start' }}>
                                    <LogOut size={18} /> Logout
                                </button>
                            ) : (
                                <Link to="/login" className="btn btn-primary" onClick={() => setIsOpen(false)}>Login</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        .nav-link {
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .nav-link:hover {
          color: var(--text-primary);
          background: var(--glass-bg);
        }
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { 
            display: flex !important; 
            background: transparent;
            border: none;
            color: var(--text-primary);
            cursor: pointer;
          }
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
