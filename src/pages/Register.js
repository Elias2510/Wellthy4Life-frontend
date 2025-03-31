import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

const Register = () => {
    const [userData, setUserData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        birthDate: ""
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { fullName, email, password, confirmPassword } = userData;

        if (!fullName || !email || !password || !confirmPassword) {
            setMessage("Completează toate câmpurile necesare pentru înregistrare.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Parolele nu coincid.");
            return;
        }

        try {
            const { confirmPassword, ...dataToSend } = userData;
            await axios.post("http://localhost:8080/api/users/register", dataToSend);
            setMessage("Înregistrare cu succes... Redirecționare către logare.");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setMessage("Înregistrare nereușită. Încearcă din nou.");
        }
    };

    return (
        <div className="auth-container">
            <button className="back-button" onClick={() => navigate("/")}>← Înapoi</button>
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Înregistrare</h2>
                {message && <p className="error-message">{message}</p>}
                <input
                    type="text"
                    name="fullName"
                    placeholder="Nume complet"
                    value={userData.fullName}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Adresă de email"
                    value={userData.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Parolă"
                    value={userData.password}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmă parola"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="birthDate"
                    placeholder="Data nașterii"
                    value={userData.birthDate}
                    onChange={handleChange}
                />
                <button type="submit">Înregistrare</button>
                <p>Ai deja un cont? <span className="link" onClick={() => navigate("/login")}>Loghează-te</span></p>
            </form>
        </div>
    );
};

export default Register;
