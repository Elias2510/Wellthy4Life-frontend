import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout, role } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <h1 className="logo" onClick={() => navigate("/")}>Wellthy4Life</h1>
            <ul>
                {isAuthenticated && role === "DOCTOR" ? (
                    <>
                        <li onClick={() => navigate("/")}>Acasă</li>
                        <li onClick={() => navigate("/patients")}>Pacienți</li>
                        <li className="logout-button" onClick={() => { logout(); navigate("/"); }}>Logout</li>
                    </>
                ) : isAuthenticated && role === "ADMIN" ? (
                    <>
                        <li onClick={() => navigate("/")}>Acasă</li>
                        <li onClick={() => navigate("/admin")}>Panou Admin</li>
                        <li className="logout-button" onClick={() => { logout(); navigate("/"); }}>Logout</li>
                    </>
                ) : isAuthenticated ? (
                    <>
                        <li onClick={() => navigate("/")}>Acasă</li>
                        <li onClick={() => navigate("/about")}>Despre</li>
                        <li onClick={() => navigate("/dashboard")}>Dashboard</li>
                        <li onClick={() => navigate("/analysis")}>Adaugă Analize</li>
                        <li className="logout-button" onClick={() => { logout(); navigate("/"); }}>Logout</li>
                    </>
                ) : (
                    <>
                        <li onClick={() => navigate("/")}>Acasă</li>
                        <li onClick={() => navigate("/about")}>Despre</li>
                        <li onClick={() => navigate("/login")}>Login</li>
                        <li onClick={() => navigate("/register")}>Register</li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
