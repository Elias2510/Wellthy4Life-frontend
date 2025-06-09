import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";
import Navbar from "../components/Navbar";

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
    const [messageType, setMessageType] = useState("");  // "success" sau "error"
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userData.fullName || !userData.email || !userData.password || !userData.confirmPassword) {
            setMessage("Te rugăm să completezi toate câmpurile necesare.");
            setMessageType("error");
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            setMessage("Parolele nu se potrivesc.");
            setMessageType("error");
            return;
        }

        if (userData.requestedRole === "DOCTOR" && !userData.accessCode) {
            setMessage("Te rugăm să introduci codul pentru rolul de doctor.");
            setMessageType("error");
            return;
        }

        try {
            const { confirmPassword, ...dataToSend } = userData;
            await axios.post("http://localhost:8080/api/users/register", dataToSend);
            setMessage("Înregistrare reușită! Redirecționare...");
            setMessageType("success");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                setMessage(error.response.data);
            } else {
                setMessage("Înregistrarea a eșuat. Verifică datele introduse.");
            }
            setMessageType("error");
        }
    };

    return (
        <div className="auth-page">
            <Navbar />
            <div className="overlay" />
            <div className="glass-card auth-card">
                <h2 className="title">Înregistrare</h2>

                {message && (
                    <p className={messageType === "success" ? "success-message" : "error-message"}>
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
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
                    <div className="form-group">
                        <label htmlFor="birthDate">Data nașterii</label>
                        <input
                            id="birthDate"
                            type="date"
                            name="birthDate"
                            value={userData.birthDate}
                            onChange={handleChange}
                        />
                    </div>



                    <div className="role-select">
                        <label>
                            <input
                                type="radio"
                                name="requestedRole"
                                value="USER"
                                checked={userData.requestedRole === "USER"}
                                onChange={handleChange}
                            />
                            Utilizator
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
                    </div>

                    {userData.requestedRole === "DOCTOR" && (
                        <input
                            type="password"
                            name="accessCode"
                            placeholder="Cod de acces pentru DOCTOR"
                            value={userData.accessCode}
                            onChange={handleChange}
                        />
                    )}

                    <button type="submit" className="cta-button">Înregistrare</button>
                </form>

                <p className="link" onClick={() => navigate("/login")}>
                    Ai deja un cont? Autentificare
                </p>
            </div>
        </div>
    );
};

export default Register;
