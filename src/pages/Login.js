import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "../styles/Auth.css";
import Navbar from "../components/Navbar";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post("http://localhost:8080/auth/login", { email, password });
            const token = response.data.token;
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userRole = payload.role || payload.roles?.[0] || "USER";

            login(token, userRole);
            navigate("/"); // Redirecționare către pagina Acasă
        } catch (err) {
            console.error("Login error:", err);
            setError("Email sau parolă incorecte");
        }
    };

    return (
        <div className="auth-page">
            <Navbar />
            <div className="overlay" />
            <div className="glass-card auth-card">
                <h2 className="title">Autentificare</h2>
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Parolă"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="cta-button">Login</button>
                </form>

                <p className="link" onClick={() => navigate("/register")}>
                    Nu ai cont? Înregistrează-te
                </p>
            </div>
        </div>
    );
};

export default Login;
