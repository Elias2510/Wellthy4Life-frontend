import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/About.css";

const aboutSections = [
    {
        title: "Monitorizare completă",
        description: "Wellthy4Life te ajută să îți adaugi și să gestionezi analizele medicale, cu verificare automată a valorilor și alerte."
    },
    {
        title: "Grafic și istoric",
        description: "Toate analizele sunt salvate într-un istoric și afișate în grafice intuitive pentru urmărirea sănătății tale în timp."
    },
    {
        title: "Recomandări avizate",
        description: "Sistemul oferă, prin cadrele medicale conectate, sugestii utile în funcție de rezultatele tale, cu focus pe prevenție și stil de viață sănătos."
    }
];

const About = () => {
    const [expandedIndexes, setExpandedIndexes] = useState([]);

    const toggleCard = (index) => {
        setExpandedIndexes((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className="about-container">
            <Navbar />
            <div className="about-overlay" />
            <h2 className="about-title">Despre Wellthy4Life</h2>
            <div className="about-grid">
                {aboutSections.map((section, index) => (
                    <div
                        key={index}
                        className={`about-card ${expandedIndexes.includes(index) ? "expanded" : ""}`}
                        onClick={() => toggleCard(index)}
                    >
                        <h3>{section.title}</h3>
                        <div className="about-description">
                            {expandedIndexes.includes(index) && <p>{section.description}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default About;
