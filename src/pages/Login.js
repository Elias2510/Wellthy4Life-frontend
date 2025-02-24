import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:8080/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (err) {
            console.error("Login error:", err);
            setError("Invalid email or password");
        }
    };


    return (
        <div className="auth-container">
            <button className="back-button" onClick={() => navigate("/")}>← Back</button>
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
                <p>Don't have an account? <span className="link" onClick={() => navigate("/register")}>Sign up now</span></p>
            </form>
        </div>
    );
};

export default Login;
