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
            console.error("Error fetching messages:", err);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/support/admin/read/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMessages();
        } catch (err) {
            console.error("Error marking as read:", err);
        }
    };

    const handleDeleteMessage = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/support/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(messages.filter(msg => msg.id !== id));
        } catch (err) {
            console.error("Error deleting message:", err);
        }
    };

    return (
        <div className="admin-support-container">
            <div className="background-blur" />
            <div className="overlay" />


            <h1>Support Messages</h1>
            <div className="message-list">
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`message-card ${msg.read ? "read" : "unread"}`}
                        onClick={() => setSelectedMessage(msg)}
                    >
                        <div className="message-header">
                            <strong>{msg.userEmail}</strong>
                            {!msg.read && <span className="badge">New</span>}
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
                    <h2>Message Details</h2>
                    <p><strong>From:</strong> {selectedMessage.userEmail}</p>
                    <p><strong>Subject:</strong> {selectedMessage.subject}</p>
                    <p><strong>Content:</strong> {selectedMessage.content}</p>
                    <p><strong>Sent at:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                    {!selectedMessage.read && (
                        <button onClick={() => handleMarkAsRead(selectedMessage.id)}>Citit</button>
                    )}
                    {selectedMessage.read && (
                        <button onClick={() => handleDeleteMessage(selectedMessage.id)}>Delete Message</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminSupportMessages;
