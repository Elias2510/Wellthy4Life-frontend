import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminPanel.css";

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [analyses, setAnalyses] = useState([]);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        birthDate: "",
        requestedRole: "USER",
    });
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchUsers();
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

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/admin/user/add", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage("Utilizator adăugat cu succes.");
            setFormData({ fullName: "", email: "", password: "", birthDate: "", requestedRole: "USER" });
            fetchUsers();
        } catch (err) {
            setMessage("Eroare la adăugarea utilizatorului.");
        }
    };

    return (
        <div className="page-container">
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
                {users.map((user, idx) => (
                    <tr key={idx}>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.birthDate}</td>
                        <td>{user.requestedRole}</td>
                        <td>
                            <button className="action-button delete" onClick={() => handleDeleteUser(user.email)}>Șterge utilizator</button>
                            <button className="action-button view" onClick={() => fetchAnalyses(user.id)}>Vezi analize</button>
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
                                <button className="action-button delete" onClick={() => handleDeleteAnalysis(analysis.id)}>Șterge analiza</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <form className="add-user-form" onSubmit={handleAddUser}>
                <h3>Adaugă utilizator nou</h3>
                {message && <p>{message}</p>}
                <input type="text" placeholder="Nume complet" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <input type="password" placeholder="Parolă" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                <input type="date" placeholder="Data nașterii" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} />
                <select value={formData.requestedRole} onChange={(e) => setFormData({ ...formData, requestedRole: e.target.value })}>
                    <option value="USER">USER</option>
                    <option value="DOCTOR">DOCTOR</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
                <button type="submit">Adaugă utilizator</button>
            </form>
        </div>
    );
};

export default AdminPanel;
