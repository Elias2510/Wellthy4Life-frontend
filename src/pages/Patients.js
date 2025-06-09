import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Patients.css";

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:8080/api/patients/all", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPatients(response.data);
            } catch (err) {
                setError("Eroare la încărcarea pacienților.");
            }
        };

        fetchPatients();
    }, []);

    return (

        <div className="patients-container">
            <h2>Lista Pacienților</h2>
            <div className="background-blur" />
            <div className="overlay" />
            {error && <p className="error-message">{error}</p>}
            <ul className="patients-list">
                {patients.map((patient) => (
                    <li key={patient.id} className="patient-card" onClick={() => navigate(`/pacient/${patient.id}`)}>
                        <h3>{patient.fullName}</h3>
                        <p>Data nașterii: {patient.birthDate}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Patients;
