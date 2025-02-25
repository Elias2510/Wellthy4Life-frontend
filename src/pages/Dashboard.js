import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [analyses, setAnalyses] = useState([]);
    const [error, setError] = useState('');
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnalyses = async () => {
            if (!isAuthenticated) {
                setError('Trebuie să fii autentificat pentru a vedea analizele tale.');
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/analyses/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAnalyses(response.data);
            } catch (err) {
                console.error('Eroare la preluarea analizelor:', err);
                setError('Nu s-au putut încărca analizele. Verifică autentificarea.');
            }
        };

        fetchAnalyses();
    }, [isAuthenticated]);

    const handleEdit = (id) => {
        navigate(`/edit-analysis/${id}`);
    };

    return (
        <div className="page-container">
            <h1>Analizele Tale Medicale</h1>
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
                        <th>Acțiuni</th>
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
                            <td>
                                <button
                                    onClick={() => handleEdit(analysis.id)}
                                    className="edit-button"
                                >
                                    Editează
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Nu au fost găsite analize.</p>
            )}
        </div>
    );
};

export default Dashboard;
