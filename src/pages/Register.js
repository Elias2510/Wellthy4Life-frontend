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
        birthDate: "",
        requestedRole: "USER",
        accessCode: ""
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !userData.fullName ||
            !userData.email ||
            !userData.password ||
            !userData.confirmPassword
        ) {
            setMessage("Te rugăm să completezi toate câmpurile necesare.");
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            setMessage("Parolele nu se potrivesc.");
            return;
        }

        if (
            (userData.requestedRole === "ADMIN" || userData.requestedRole === "DOCTOR") &&
            !userData.accessCode
        ) {
            setMessage("Te rugăm să introduci codul pentru rolul selectat.");
            return;
        }

        try {
            const { confirmPassword, ...dataToSend } = userData;
            await axios.post("http://localhost:8080/api/users/register", dataToSend);
            setMessage("Înregistrare reușită! Redirecționare...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            console.error(error);
            setMessage("Înregistrarea a eșuat. Verifică datele introduse.");
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
                    placeholder="Email"
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

                <div className="role-select">
                    <label>
                        <input
                            type="radio"
                            name="requestedRole"
                            value="USER"
                            checked={userData.requestedRole === "USER"}
                            onChange={handleChange}
                        />
                        Utilizator (implicit)
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="requestedRole"
                            value="DOCTOR"
                            checked={userData.requestedRole === "DOCTOR"}
                            onChange={handleChange}
                        />
                        Doctor
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="requestedRole"
                            value="ADMIN"
                            checked={userData.requestedRole === "ADMIN"}
                            onChange={handleChange}
                        />
                        Administrator
                    </label>
                </div>

                {(userData.requestedRole === "DOCTOR" || userData.requestedRole === "ADMIN") && (
                    <input
                        type="text"
                        name="accessCode"
                        placeholder={`Cod de acces pentru ${userData.requestedRole}`}
                        value={userData.accessCode}
                        onChange={handleChange}
                    />
                )}

                <button type="submit">Înregistrare</button>
                <p>Ai deja un cont? <span className="link" onClick={() => navigate("/login")}>Autentificare</span></p>
            </form>
        </div>
    );
};

export default Register;
