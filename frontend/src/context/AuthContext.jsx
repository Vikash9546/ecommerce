import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        const res = await API.post("auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        // In a real app, you might decode the token or fetch user profile here
        // For simplicity, we'll just set a placeholder or decode if possible
        setUser({ email });
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        window.location.href = "/login";
    };

    const signup = async (name, email, password) => {
        const res = await API.post("auth/register", { name, email, password });
        return res.data;
    };

    useEffect(() => {
        if (token) {
            // Validate token or fetch user profile
            // For now, we'll just assume it's valid if present
            setUser({ email: "authenticated_user" }); // Placeholder
        }
        setLoading(false);
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, signup, isAuthenticated: !!token }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
