import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/PatientAnalyses.css";

const PatientAnalyses = () => {
    const { id } = useParams();
    const [analyses, setAnalyses] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalyses = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:8080/api/patients/${id}/analyses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const getSeverity = (val, min, max) => {
                    if (val < min || val > max) return 2; // roșu
                    const buffer = (max - min) * 0.1;
                    if (val < min + buffer || val > max - buffer) return 1; // galben
                    return 0; // verde
                };

                const sorted = response.data.sort((a, b) => {
                    const severityA = getSeverity(a.value, a.normalMin, a.normalMax);
                    const severityB = getSeverity(b.value, b.normalMin, b.normalMax);
                    return severityB - severityA;
                });

                setAnalyses(sorted);
            } catch (err) {
                setError("Eroare la încărcarea analizelor pacientului.");
            }
        };

        fetchAnalyses();
    }, [id]);

    const getColor = (value, min, max) => {
        if (value < min || value > max) return "#f8d7da"; // roșu
        const buffer = (max - min) * 0.1;
        if (value < min + buffer || value > max - buffer) return "#fff3cd"; // galben
        return "#d4edda"; // verde
    };

    return (
        <div className="patient-analyses-container">
            <h2>Analize pacient</h2>
            {error && <p className="error-message">{error}</p>}
            <table className="analysis-table">
                <thead>
                <tr>
                    <th>Test</th>
                    <th>Valoare</th>
                    <th>Unitate</th>
                    <th>Min</th>
                    <th>Max</th>
                    <th>Data</th>
                </tr>
                </thead>
                <tbody>
                {analyses.map((a, idx) => (
                    <tr key={idx}>
                        <td>{a.testName}</td>
                        <td style={{ backgroundColor: getColor(a.value, a.normalMin, a.normalMax), fontWeight: 'bold' }}>{a.value}</td>
                        <td>{a.unit}</td>
                        <td>{a.normalMin}</td>
                        <td>{a.normalMax}</td>
                        <td>{a.testDate}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatientAnalyses;