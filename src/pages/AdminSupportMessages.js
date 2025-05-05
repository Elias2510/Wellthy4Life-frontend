import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminSupportMessages.css";

const AdminSupportMessages = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/support/admin/all", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (err) {
            console.error("Eroare la preluarea mesajelor:", err);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/support/admin/read/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMessages();
        } catch (err) {
            console.error("Eroare la marcare ca citit:", err);
        }
    };

    return (
        <div className="admin-support-container">
            <h1>Mesaje către Suport</h1>
            <div className="message-list">
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`message-card ${msg.read ? "read" : "unread"}`}
                        onClick={() => setSelectedMessage(msg)}
                    >
                        <div className="message-header">
                            <strong>{msg.userEmail}</strong>
                            {!msg.read && <span className="badge">Nou</span>}
                        </div>
                        <div className="message-subject">{msg.subject}</div>
                        <div className="message-date">
                            {new Date(msg.createdAt).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>

            {selectedMessage && (
                <div className="message-details">
                    <h2>Detalii Mesaj</h2>
                    <p><strong>De la:</strong> {selectedMessage.userEmail}</p>
                    <p><strong>Subiect:</strong> {selectedMessage.subject}</p>
                    <p><strong>Conținut:</strong> {selectedMessage.content}</p>
                    <p><strong>Trimis la:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                    {!selectedMessage.read && (
                        <button onClick={() => handleMarkAsRead(selectedMessage.id)}>
                            Marchează ca citit
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminSupportMessages;
