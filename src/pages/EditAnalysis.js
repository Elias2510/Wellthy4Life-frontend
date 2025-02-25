import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EditAnalysis.css';

const EditAnalysis = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        testName: '',
        value: '',
        unit: '',
        normalMin: '',
        normalMax: '',
        testDate: '',
        doctorRecommendations: '',
        repeatInterval: '',
        patientData: ''
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/api/analyses/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Asigurați-vă că datele sunt în formatul corect pentru starea formData
                setFormData({
                    testName: response.data.testName || '',
                    value: response.data.value || '',
                    unit: response.data.unit || '',
                    normalMin: response.data.normalMin || '',
                    normalMax: response.data.normalMax || '',
                    testDate: response.data.testDate ? response.data.testDate.split('T')[0] : '',
                    doctorRecommendations: response.data.doctorRecommendations || '',
                    repeatInterval: response.data.repeatInterval || '',
                    patientData: response.data.patientData || ''
                });
            } catch (err) {
                console.error('Eroare la preluarea analizei:', err);
                setError('Nu s-au putut încărca datele analizei.');
            }
        };

        fetchAnalysis();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/api/analyses/update/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage('Analiza a fost actualizată cu succes!');
            navigate('/dashboard');
        } catch (err) {
            console.error('Eroare la actualizarea analizei:', err);
            setError('Nu s-a putut actualiza analiza. Încearcă din nou.');
        }
    };

    return (
        <div className="edit-analysis-container">
            <h1>Editează Analiza</h1>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            <form className="edit-analysis-form" onSubmit={handleSubmit}>
                {/* Secțiunea Date despre analiză */}
                <section>
                    <h2>Date despre analiză</h2>
                    <label>
                        Nume Test:
                        <input
                            type="text"
                            name="testName"
                            value={formData.testName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Valoare:
                        <input
                            type="number"
                            step="0.01"
                            name="value"
                            value={formData.value}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Unitate:
                        <input
                            type="text"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Minim Normal:
                        <input
                            type="number"
                            step="0.01"
                            name="normalMin"
                            value={formData.normalMin}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Maxim Normal:
                        <input
                            type="number"
                            step="0.01"
                            name="normalMax"
                            value={formData.normalMax}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Data Test:
                        <input
                            type="date"
                            name="testDate"
                            value={formData.testDate}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    {/* Butonul de actualizare plasat imediat după secțiunea de date */}
                    <button type="submit">Actualizează Analiza</button>
                </section>

                {/* Secțiunea Recomandări din partea medicului */}
                <section>
                    <h2>Recomandări din partea medicului</h2>
                    <label>
                        Recomandări:
                        <textarea
                            name="doctorRecommendations"
                            value={formData.doctorRecommendations}
                            onChange={handleChange}
                        />
                    </label>
                </section>

                {/* Secțiunea Interval repetare analiză */}
                <section>
                    <h2>Interval repetare analiză</h2>
                    <label>
                        Interval (zile):
                        <input
                            type="number"
                            name="repeatInterval"
                            value={formData.repeatInterval}
                            onChange={handleChange}
                        />
                    </label>
                </section>

                {/* Secțiunea Date pacient */}
                <section>
                    <h2>Date pacient</h2>
                    <label>
                        Date pacient:
                        <textarea
                            name="patientData"
                            value={formData.patientData}
                            onChange={handleChange}
                        />
                    </label>
                </section>
            </form>
        </div>
    );
};

export default EditAnalysis;
