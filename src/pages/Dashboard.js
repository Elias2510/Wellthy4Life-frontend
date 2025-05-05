import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [analyses, setAnalyses] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [filteredAnalyses, setFilteredAnalyses] = useState([]);
    const [filterName, setFilterName] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('');
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
                setFilteredAnalyses(analysesRes.data);
            } catch (err) {
                console.error('Eroare la încărcarea datelor:', err);
                setError('Nu s-au putut încărca datele. Verifică autentificarea.');
            }
        };

        fetchData();
    }, [isAuthenticated]);

    const getSeverity = (value, min, max) => {
        if (value < min || value > max) return 'red';
        const buffer = (max - min) * 0.1;
        if (value < min + buffer || value > max - buffer) return 'yellow';
        return 'green';
    };

    const getValueColor = (severity) => {
        if (severity === 'red') return '#f8d7da';
        if (severity === 'yellow') return '#fff3cd';
        if (severity === 'green') return '#d4edda';
        return '#eee';
    };

    const getRecommendationText = (analysisId) => {
        const rec = recommendations.find(r => r.analysisId === analysisId);
        return rec ? rec.recommendationText : '-';
    };

    const handleFilter = () => {
        let filtered = [...analyses];

        if (filterName.trim()) {
            filtered = filtered.filter(a =>
                a.testName.toLowerCase().includes(filterName.toLowerCase())
            );
        }

        if (filterDate) {
            filtered = filtered.filter(a => a.testDate === filterDate);
        }

        if (filterSeverity) {
            filtered = filtered.filter(a =>
                getSeverity(a.value, a.normalMin, a.normalMax) === filterSeverity
            );
        }

        setFilteredAnalyses(filtered);
    };

    useEffect(() => {
        handleFilter();
    }, [filterName, filterDate, filterSeverity, analyses]);

    const uniqueDates = [...new Set(analyses.map(a => a.testDate))];

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

            <div className="filters">
                <input
                    type="text"
                    placeholder="Filtru după nume analiză"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                />
                <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
                    <option value="">Toate datele</option>
                    {uniqueDates.map((date, idx) => (
                        <option key={idx} value={date}>{date}</option>
                    ))}
                </select>
                <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
                    <option value="">Toate severitățile</option>
                    <option value="red">Critice (roșu)</option>
                    <option value="yellow">Aproape de limită (galben)</option>
                    <option value="green">Normale (verde)</option>
                </select>
            </div>

            {error && <p className="error-message">{error}</p>}
            {filteredAnalyses.length > 0 ? (
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
                    {filteredAnalyses.map((analysis) => {
                        const severity = getSeverity(analysis.value, analysis.normalMin, analysis.normalMax);
                        return (
                            <tr key={analysis.id}>
                                <td>{analysis.testName}</td>
                                <td style={{
                                    backgroundColor: getValueColor(severity),
                                    fontWeight: 'bold',
                                    color: '#222'
                                }}>
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
