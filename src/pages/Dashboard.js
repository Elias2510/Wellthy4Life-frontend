import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Dashboard.css";

const Dashboard = () => {
    const [analyses, setAnalyses] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalyses = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("You must be logged in to see your analyses.");
                    return;
                }

                const response = await axios.get("http://localhost:8080/api/analyses/user", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setAnalyses(response.data);
            } catch (err) {
                console.error("Error fetching analyses:", err);
                setError("Failed to load analyses. Check your authentication.");
            }
        };

        fetchAnalyses();
    }, []);

    return (
        <div className="page-container">
            <h1>Your Medical Analyses</h1>
            {error && <p className="error-message">{error}</p>}
            {analyses.length > 0 ? (
                <table className="analysis-table">
                    <thead>
                    <tr>
                        <th>Test Name</th>
                        <th>Value</th>
                        <th>Unit</th>
                        <th>Normal Min</th>
                        <th>Normal Max</th>
                        <th>Test Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {analyses.map((analysis) => (
                        <tr key={analysis.id}>
                            <td>{analysis.testName}</td>
                            <td>{analysis.value}</td>
                            <td>{analysis.unit}</td>
                            <td>{analysis.normalMin}</td>
                            <td>{analysis.normalMax}</td>
                            <td>{analysis.testDate}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No analyses found.</p>
            )}
        </div>
    );
};

export default Dashboard;
