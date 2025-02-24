// src/pages/Analysis.js
import React, { useState } from "react";
import axios from "axios";
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validare: testName, value, unit și testDate sunt obligatorii
        if (!formData.testName || !formData.value || !formData.unit || !formData.testDate) {
            setMessage("Please fill in all required fields.");
            return;
        }
        try {
            // Pentru moment, userId este fix (1). Ulterior extrage-l din autentificare.
            const response = await axios.post("http://localhost:8080/api/analyses/add", {
                userId: 7,
                testName: formData.testName,
                value: parseFloat(formData.value),
                unit: formData.unit,
                normalMin: formData.normalMin ? parseFloat(formData.normalMin) : null,
                normalMax: formData.normalMax ? parseFloat(formData.normalMax) : null,
                testDate: formData.testDate
            });
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
        <div className="analysis-container">
            <header className="analysis-header">
                <h1>Add New Analysis</h1>
                {message && <p className="analysis-message">{message}</p>}
                <form className="analysis-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="testName"
                        placeholder="Test Name"
                        value={formData.testName}
                        onChange={handleChange}
                        className="analysis-input"
                    />
                    <input
                        type="number"
                        step="0.01"
                        name="value"
                        placeholder="Value"
                        value={formData.value}
                        onChange={handleChange}
                        className="analysis-input"
                    />
                    <input
                        type="text"
                        name="unit"
                        placeholder="Unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className="analysis-input"
                    />
                    <input
                        type="number"
                        step="0.01"
                        name="normalMin"
                        placeholder="Normal Min"
                        value={formData.normalMin}
                        onChange={handleChange}
                        className="analysis-input"
                    />
                    <input
                        type="number"
                        step="0.01"
                        name="normalMax"
                        placeholder="Normal Max"
                        value={formData.normalMax}
                        onChange={handleChange}
                        className="analysis-input"
                    />
                    <input
                        type="date"
                        name="testDate"
                        placeholder="Test Date"
                        value={formData.testDate}
                        onChange={handleChange}
                        className="analysis-input"
                    />
                    <button type="submit" className="analysis-add-button">
                        Add Analysis
                    </button>
                </form>
            </header>
        </div>
    );
};

export default Analysis;
