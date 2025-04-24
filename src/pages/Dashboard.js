import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [analyses, setAnalyses] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState('');
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated) {
                setError('Trebuie să fii autentificat pentru a vedea analizele tale.');
                return;
            }

            try {
                const token = localStorage.getItem('token');

                const [analysesRes, recommendationsRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/analyses/user', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://localhost:8080/api/recommendations/user', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setAnalyses(analysesRes.data);
                setRecommendations(recommendationsRes.data);
            } catch (err) {
                console.error('Eroare la încărcarea datelor:', err);
                setError('Nu s-au putut încărca datele. Verifică autentificarea.');
            }
        };

        fetchData();
    }, [isAuthenticated]);

    const getValueColor = (value, min, max) => {
        if (min == null || max == null || value == null) return '#eee';
        if (value < min || value > max) return '#f8d7da';
        const buffer = (max - min) * 0.1;
        if (value < min + buffer || value > max - buffer) return '#fff3cd';
        return '#d4edda';
    };

    const getRecommendationText = (analysisId) => {
        const rec = recommendations.find(r => r.analysisId === analysisId);
        return rec ? rec.recommendationText : '-';
    };

    return (
        <div className="page-container">
            <h1>Analizele Tale Medicale</h1>

            <button
                style={{
                    marginBottom: "20px",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    background: "#a7c7e7",
                    color: "#2f4f4f",
                    fontWeight: "bold",
                    cursor: "pointer",
                    border: "none"
                }}
                onClick={() => navigate("/charts")}
            >
                Vezi graficele tale
            </button>

            {error && <p className="error-message">{error}</p>}
            {analyses.length > 0 ? (
                <table className="analysis-table">
                    <thead>
                    <tr>
                        <th>Nume Test</th>
                        <th>Valoare</th>
                        <th>Unitate</th>
                        <th>Minim Normal</th>
                        <th>Maxim Normal</th>
                        <th>Data Test</th>
                        <th>Recomandare</th>
                    </tr>
                    </thead>
                    <tbody>
                    {analyses.map((analysis) => {
                        const bgColor = getValueColor(analysis.value, analysis.normalMin, analysis.normalMax);
                        return (
                            <tr key={analysis.id}>
                                <td>{analysis.testName}</td>
                                <td style={{ backgroundColor: bgColor, fontWeight: 'bold', color: '#222' }}>
                                    {analysis.value}
                                </td>
                                <td>{analysis.unit}</td>
                                <td>{analysis.normalMin}</td>
                                <td>{analysis.normalMax}</td>
                                <td>{analysis.testDate}</td>
                                <td>{getRecommendationText(analysis.id)}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            ) : (
                <p>Nu au fost găsite analize.</p>
            )}
        </div>
    );
};

export default Dashboard;
