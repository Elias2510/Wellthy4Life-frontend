import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Home.css";
import Navbar from "../components/Navbar"; // menține componenta Navbar

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div className="home-container">
            <Navbar />
            <div className="overlay" />
            <div className="glass-card">
                <h1 className="title">Wellthy4Life</h1>
                <p className="subtitle">Partenerul tău pentru o viață sănătoasă</p>

                {isAuthenticated ? (
                    <h2 className="welcome-message">Bine ai venit!</h2>
                ) : (
                    <button className="cta-button" onClick={() => navigate("/register")}>
                        Înregistrează-te
                    </button>
                )}
            </div>
        </div>
    );
};

export default Home;
