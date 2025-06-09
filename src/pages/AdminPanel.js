import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminPanel.css";

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [analyses, setAnalyses] = useState([]);
    const [messages, setMessages] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchUsers();
        fetchMessages();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (err) {
            console.error("Eroare la preluarea utilizatorilor:", err);
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/admin/messages", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(res.data);
        } catch (err) {
            console.error("Eroare la preluarea mesajelor utilizatorilor:", err);
        }
    };

    const fetchAnalyses = async (userId) => {
        setSelectedUserId(userId);
        try {
            const res = await axios.get(`http://localhost:8080/api/analyses/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAnalyses(res.data);
        } catch (err) {
            console.error("Eroare la încărcarea analizelor:", err);
        }
    };

    const handleDeleteUser = async (email) => {
        const user = users.find(u => u.email === email);
        if (!user) return;

        try {
            await axios.delete(`http://localhost:8080/api/admin/user/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
        } catch (err) {
            console.error("Eroare la ștergerea utilizatorului:", err);
        }
    };

    const handleDeleteAnalysis = async (analysisId) => {
        try {
            await axios.delete(`http://localhost:8080/api/admin/analysis/${analysisId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAnalyses(prev => prev.filter(a => a.id !== analysisId));
        } catch (err) {
            console.error("Eroare la ștergerea analizei:", err);
        }
    };

    return (
        <div className="page-container">
            <div className="background-blur" />
            <div className="overlay" />
            <h1>Panou Administrator</h1>

            <table className="admin-table">
                <thead>
                <tr>
                    <th>Nume</th>
                    <th>Email</th>
                    <th>Data nașterii</th>
                    <th>Rol</th>
                    <th>Acțiuni</th>
                </tr>
                </thead>
                <tbody>
                {users.filter(user => user.requestedRole !== "ADMIN").map((user, idx) => (
                    <tr key={idx}>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.birthDate}</td>
                        <td>{user.requestedRole}</td>
                        <td>
                            <button
                                className="action-button delete"
                                onClick={() => handleDeleteUser(user.email)}
                            >
                                Șterge utilizator
                            </button>
                            {user.requestedRole !== "DOCTOR" && (
                                <button
                                    className="action-button view"
                                    onClick={() => fetchAnalyses(user.id)}
                                >
                                    Vezi analize
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {analyses.length > 0 && (
                <div className="analyses-section">
                    <h3>Analize utilizator</h3>
                    <ul>
                        {analyses.map((analysis, idx) => (
                            <li key={idx}>
                                {analysis.testName} - {analysis.testDate} - {analysis.value}{analysis.unit}
                                <button
                                    className="action-button delete"
                                    onClick={() => handleDeleteAnalysis(analysis.id)}
                                >
                                    Șterge analiza
                                </button>
                            </li>
                        ))}
                    </ul>

                    <ul className="user-messages">
                        {messages.map((msg, idx) => (
                            <li key={idx} className={msg.read ? "read" : "unread"}>
                                <strong>{msg.userEmail}</strong>: {msg.subject} <br />
                                <p>{msg.content}</p>
                                <em>{new Date(msg.createdAt).toLocaleString()}</em>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
