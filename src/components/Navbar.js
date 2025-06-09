import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout, role } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    const renderLinks = () => {
        if (isAuthenticated && role === "DOCTOR") {
            return (
                <>
                    <li onClick={() => { navigate("/"); closeMenu(); }}>Acasă</li>
                    <li onClick={() => { navigate("/patients"); closeMenu(); }}>Pacienți</li>
                    <li className="logout-button" onClick={() => { logout(); navigate("/"); }}>Logout</li>
                </>
            );
        } else if (isAuthenticated && role === "ADMIN") {
            return (
                <>
                    <li onClick={() => { navigate("/"); closeMenu(); }}>Acasă</li>
                    <li onClick={() => { navigate("/admin"); closeMenu(); }}>Admin Panel</li>
                    <li onClick={() => { navigate("/admin/support-messages"); closeMenu(); }}>Mesaje Suport</li>
                    <li className="logout-button" onClick={() => { logout(); navigate("/"); }}>Logout</li>
                </>
            );
        } else if (isAuthenticated) {
            return (
                <>
                    <li onClick={() => { navigate("/"); closeMenu(); }}>Acasă</li>
                    <li onClick={() => { navigate("/dashboard"); closeMenu(); }}>Dashboard</li>
                    <li onClick={() => { navigate("/analysis"); closeMenu(); }}>Analize</li>
                    <li onClick={() => { navigate("/help"); closeMenu(); }}>Ajutor</li>
                    <li className="logout-button" onClick={() => { logout(); navigate("/"); }}>Logout</li>
                </>
            );
        } else {
            return (
                <>
                    <li onClick={() => { navigate("/"); closeMenu(); }}>Acasă</li>
                    <li onClick={() => { navigate("/about"); closeMenu(); }}>Despre</li>
                    <li onClick={() => { navigate("/login"); closeMenu(); }}>Login</li>
                    <li onClick={() => { navigate("/register"); closeMenu(); }}>Register</li>
                </>
            );
        }
    };

    return (
        <>
            <div className="menu-toggle" onClick={toggleMenu}>
                {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </div>

            <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
                {renderLinks()}
            </ul>
        </>
    );
};

export default Navbar;
