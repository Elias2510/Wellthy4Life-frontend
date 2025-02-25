import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <h1 className="logo" onClick={() => navigate("/")}>Wellthy4Life</h1>
            <ul>
                <li onClick={() => navigate("/")}>Acasa</li>
                <li onClick={() => navigate("/about")}>Despre</li>

                {isAuthenticated ? (
                    <>
                        <li onClick={() => navigate("/dashboard")}>Dashboard</li>
                        <li onClick={() => navigate("/analysis")}>Adauga Analize</li>
                        <li className="logout-button" onClick={() => { logout(); navigate("/"); }}>Logout</li>
                    </>
                ) : (
                    <>
                        <li onClick={() => navigate("/login")}>Login</li>
                        <li onClick={() => navigate("/register")}>Register</li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
