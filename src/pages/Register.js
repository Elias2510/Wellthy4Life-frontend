import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

const Register = () => {
    const [userData, setUserData] = useState({
        fullName: "",
        email: "",
        password: "",
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
        if (!userData.fullName || !userData.email || !userData.password) {
            setMessage("Please fill in all required fields.");
            return;
        }
        try {
            await axios.post("http://localhost:8080/api/users/register", userData);
            setMessage("Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setMessage("Registration failed. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <button className="back-button" onClick={() => navigate("/")}>← Back</button>
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                {message && <p className="error-message">{message}</p>}
                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
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
                    placeholder="Password"
                    value={userData.password}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="birthDate"
                    placeholder="Birth Date"
                    value={userData.birthDate}
                    onChange={handleChange}
                />
                <button type="submit">Register</button>
                <p>Already have an account? <span className="link" onClick={() => navigate("/login")}>Log in</span></p>
            </form>
        </div>
    );
};

export default Register;
