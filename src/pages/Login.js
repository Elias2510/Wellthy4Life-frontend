import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
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
            const response = await api.post("/auth/login", {
                email: email.toLowerCase(),
                password
            });
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError("Autentificare eșuată. Verifică datele introduse!");
        }
    };

    return (
        <div className="auth-container">
            <button className="back-button" onClick={() => navigate("/")}>← Înapoi</button>
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Autentificare</h2>
                {error && <p className="error-message">{error}</p>}
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
                <button type="submit">Autentificare</button>
                <p>Utilizator nou? <span className="link" onClick={() => navigate("/register")}>Înregistrează-te</span></p>
            </form>
        </div>
    );
};

export default Login;
