import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/api";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(false);
    const userId = "user123"; // Using the placeholder as per existing implementation

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await API.get(`/cart/${userId}`);
            if (res.data) {
                setCart(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch cart:", err);
            setCart({ items: [] });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (productId, quantity = 1) => {
        try {
            const res = await API.post("/cart/add", { userId, productId, quantity });
            setCart(res.data);
            return res.data;
        } catch (err) {
            console.error("Failed to add to cart:", err);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const res = await API.put("/cart/update", { userId, productId, quantity });
            setCart(res.data);
        } catch (err) {
            console.error("Failed to update quantity:", err);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const res = await API.delete(`/cart/remove/${userId}/${productId}`);
            setCart(res.data);
        } catch (err) {
            console.error("Failed to remove from cart:", err);
        }
    };

    const clearCart = () => {
        setCart({ items: [] });
    };

    const cartCount = cart?.items ? cart.items.reduce((acc, item) => acc + item.quantity, 0) : 0;
    const cartTotal = cart?.items ? cart.items.reduce((acc, item) => acc + (item.productId?.price || 0) * item.quantity, 0) : 0;

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            cartCount,
            cartTotal,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
