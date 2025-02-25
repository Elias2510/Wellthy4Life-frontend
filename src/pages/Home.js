import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Home.css";

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div className="home-container">
            <div className="home-content">
                <h1>Wellthy4Life</h1>
                <p>Aplicația care te ajută să îți monitorizezi sănătatea.</p>

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
