import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Auth.css";

const Register = () => {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await api.post("/auth/register", { email, fullName, password });
            navigate("/login");
        } catch (err) {
            setError("Înregistrare eșuată. Încercați din nou!");
        }
    };

    return (
        <div className="auth-container">
            <button className="back-button" onClick={() => navigate("/")}>← Înapoi</button>
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Înregistrare</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="text"
                    placeholder="Nume complet"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
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
                <button type="submit">Înregistrează-te</button>
                <p>Ai deja un cont? <span className="link" onClick={() => navigate("/login")}>Autentifică-te</span></p>
            </form>
        </div>
    );
};

export default Register;
