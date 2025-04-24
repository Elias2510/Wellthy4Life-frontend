import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/PatientAnalyses.css";

const PatientAnalyses = () => {
    const { id } = useParams();
    const [analyses, setAnalyses] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState({ name: "", date: "", onlyAbnormal: false });
    const [uniqueDates, setUniqueDates] = useState([]);
    const [uniqueTestNames, setUniqueTestNames] = useState([]);
    const [recommendationText, setRecommendationText] = useState("");
    const [selectedAnalysisId, setSelectedAnalysisId] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const fetchAnalyses = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/patients/${id}/analyses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const getSeverity = (val, min, max) => {
                    if (val < min || val > max) return 2;
                    const buffer = (max - min) * 0.1;
                    if (val < min + buffer || val > max - buffer) return 1;
                    return 0;
                };

                const sorted = response.data.sort((a, b) => {
                    const severityA = getSeverity(a.value, a.normalMin, a.normalMax);
                    const severityB = getSeverity(b.value, b.normalMin, b.normalMax);
                    return severityB - severityA;
                });

                setAnalyses(sorted);
                setUniqueDates([...new Set(sorted.map(a => a.testDate))]);
                setUniqueTestNames([...new Set(sorted.map(a => a.testName))]);
            } catch (err) {
                setError("Eroare la încărcarea analizelor pacientului.");
            }
        };

        const fetchRecommendations = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/recommendations/user/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRecommendations(response.data);
            } catch (err) {
                console.error("Eroare la încărcarea recomandărilor:", err);
            }
        };

        fetchAnalyses();
        fetchRecommendations();
    }, [id]);

    const getColor = (value, min, max) => {
        if (value < min || value > max) return "#f8d7da";
        const buffer = (max - min) * 0.1;
        if (value < min + buffer || value > max - buffer) return "#fff3cd";
        return "#d4edda";
    };

    const filteredAnalyses = analyses.filter(a => {
        const matchesName = filter.name ? a.testName === filter.name : true;
        const matchesDate = filter.date ? a.testDate === filter.date : true;
        const isAbnormal = a.value < a.normalMin || a.value > a.normalMax;
        return matchesName && matchesDate && (!filter.onlyAbnormal || isAbnormal);
    });

    const handleSendRecommendation = async (analysisId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:8080/api/recommendations/add", {
                userId: id,
                analysisId: analysisId,
                recommendationText: recommendationText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccessMessage("Recomandare trimisă cu succes!");
            setTimeout(() => setSuccessMessage(""), 3000);
            setRecommendationText("");
            setSelectedAnalysisId(null);
        } catch (error) {
            console.error("Eroare la trimiterea recomandării:", error);
            setError("Eroare la trimiterea recomandării.");
        }
    };

    return (
        <div className="patient-analyses-container">
            <h2>Analize pacient</h2>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <div className="filter-controls">
                <select value={filter.name} onChange={(e) => setFilter({ ...filter, name: e.target.value })}>
                    <option value="">Toate testele</option>
                    {uniqueTestNames.map((name, idx) => (
                        <option key={idx} value={name}>{name}</option>
                    ))}
                </select>

                <select value={filter.date} onChange={(e) => setFilter({ ...filter, date: e.target.value })}>
                    <option value="">Toate datele</option>
                    {uniqueDates.map((date, idx) => (
                        <option key={idx} value={date}>{date}</option>
                    ))}
                </select>

                <label>
                    <input
                        type="checkbox"
                        checked={filter.onlyAbnormal}
                        onChange={(e) => setFilter({ ...filter, onlyAbnormal: e.target.checked })}
                    />
                    Afișează doar analizele în afara limitelor
                </label>
            </div>

            <table className="analysis-table">
                <thead>
                <tr>
                    <th>Test</th>
                    <th>Valoare</th>
                    <th>Unitate</th>
                    <th>Min</th>
                    <th>Max</th>
                    <th>Data</th>
                    <th>Recomandare</th>
                </tr>
                </thead>
                <tbody>
                {filteredAnalyses.map((a, idx) => (
                    <tr key={idx}>
                        <td>{a.testName}</td>
                        <td style={{ backgroundColor: getColor(a.value, a.normalMin, a.normalMax), fontWeight: 'bold' }}>{a.value}</td>
                        <td>{a.unit}</td>
                        <td>{a.normalMin}</td>
                        <td>{a.normalMax}</td>
                        <td>{a.testDate}</td>
                        <td>
                            {selectedAnalysisId === idx ? (
                                <div>
                                    <textarea
                                        value={recommendationText}
                                        onChange={(e) => setRecommendationText(e.target.value)}
                                        placeholder="Scrie o recomandare..."
                                        rows={3}
                                        style={{ width: '100%' }}
                                    />
                                    <button onClick={() => handleSendRecommendation(a.id)}>Trimite</button>
                                </div>
                            ) : (
                                <button onClick={() => setSelectedAnalysisId(idx)}>Recomandă</button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>Recomandări primite</h2>
            <ul className="recommendation-list">
                {recommendations.map((r, idx) => (
                    <li key={idx} className="recommendation-card">
                        <p><strong>Analiză ID:</strong> {r.analysisId}</p>
                        <p>{r.recommendationText}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PatientAnalyses;
