import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/Analysis.css";

const Analysis = () => {
    const [formData, setFormData] = useState({
        testName: "",
        value: "",
        unit: "",
        normalMin: "",
        normalMax: "",
        testDate: ""
    });
    const [message, setMessage] = useState("");
    const { isAuthenticated } = useContext(AuthContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setMessage("You must be logged in to add an analysis.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:8080/api/analyses/add",
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMessage("Analysis added successfully!");
            setFormData({
                testName: "",
                value: "",
                unit: "",
                normalMin: "",
                normalMax: "",
                testDate: ""
            });
        } catch (error) {
            console.error("Error adding analysis:", error);
            setMessage("Failed to add analysis. Please try again.");
        }
    };

    return (
        <div className="page-container">
            <h1>Add New Analysis</h1>
            {message && <p className="analysis-message">{message}</p>}
            <form className="analysis-form" onSubmit={handleSubmit}>
                <input type="text" name="testName" placeholder="Test Name" value={formData.testName} onChange={handleChange} />
                <input type="number" step="0.01" name="value" placeholder="Value" value={formData.value} onChange={handleChange} />
                <input type="text" name="unit" placeholder="Unit" value={formData.unit} onChange={handleChange} />
                <input type="number" step="0.01" name="normalMin" placeholder="Normal Min" value={formData.normalMin} onChange={handleChange} />
                <input type="number" step="0.01" name="normalMax" placeholder="Normal Max" value={formData.normalMax} onChange={handleChange} />
                <input type="date" name="testDate" placeholder="Test Date" value={formData.testDate} onChange={handleChange} />
                <button type="submit">Add Analysis</button>
            </form>
        </div>
    );
};

export default Analysis;
