import React, { useState } from "react";
import axios from "axios";
import "../styles/Help.css";

const Help = () => {
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");

    const handleSend = async (e) => {
        e.preventDefault();
        setMessage("");

        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("Trebuie să fii autentificat pentru a trimite un mesaj.");
            return;
        }

        try {
            await axios.post("http://localhost:8080/api/support/send", {
                subject,
                content,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessage("Mesajul a fost trimis cu succes către administrator!");
            setSubject("");
            setContent("");
        } catch (err) {
            console.error("Eroare la trimiterea mesajului:", err);
            setMessage("A apărut o eroare. Încearcă din nou.");
        }
    };

    return (
        <div className="page-container">
            <h1>Asistență Tehnică</h1>
            <form className="help-form" onSubmit={handleSend}>
                {message && <p className="form-message">{message}</p>}
                <input
                    type="text"
                    placeholder="Subiectul mesajului"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Scrie mesajul tău pentru administrator..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                    required
                ></textarea>
                <button type="submit">Trimite mesajul</button>
            </form>
        </div>
    );
};

export default Help;
