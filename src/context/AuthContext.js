import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role");
        if (token) {
            setIsAuthenticated(true);
            setRole(storedRole || null);
        }
    }, []);

    const login = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userRole = payload.role || payload.roles?.[0] || "USER";

            localStorage.setItem("token", token);
            localStorage.setItem("role", userRole);
            setIsAuthenticated(true);
            setRole(userRole);
        } catch (err) {
            console.error("Eroare la decodarea tokenului:", err);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsAuthenticated(false);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
