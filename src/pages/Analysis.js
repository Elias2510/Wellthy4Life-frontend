import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/Analysis.css";

const predefinedTests = [
    { name: "Glicemie", unit: "mg/dL" },
    { name: "Colesterol total", unit: "mg/dL" },
    { name: "Colesterol HDL", unit: "mg/dL" },
    { name: "Colesterol LDL", unit: "mg/dL" },
    { name: "Trigliceride", unit: "mg/dL" },
    { name: "Hemoglobină", unit: "g/dL" },
    { name: "Hematocrit", unit: "%" },
    { name: "Leucocite", unit: "10^3/µL" },
    { name: "Trombocite", unit: "10^3/µL" },
    { name: "Creatinină", unit: "mg/dL" },
    { name: "Uree", unit: "mg/dL" },
    { name: "Acid uric", unit: "mg/dL" },
    { name: "TGO (AST)", unit: "U/L" },
    { name: "TGP (ALT)", unit: "U/L" },
    { name: "Bilirubină totală", unit: "mg/dL" },
    { name: "Bilirubină directă", unit: "mg/dL" },
    { name: "Calciu seric", unit: "mg/dL" },
    { name: "Fier seric", unit: "µg/dL" },
    { name: "TSH", unit: "µUI/mL" },
    { name: "FT4 (Tiroxină liberă)", unit: "ng/dL" },
    { name: "PCR (Proteina C reactivă)", unit: "mg/L" },
    { name: "Vitamina D", unit: "ng/mL" }
];

const Analysis = () => {
    const [formData, setFormData] = useState({
        testName: "",
        value: "",
        unit: "",
        normalMin: "",
        normalMax: "",
        testDate: ""
    });
    const [message, setMessage] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("manual");
    const { isAuthenticated } = useContext(AuthContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setMessage("Trebuie să fii autentificat pentru a adăuga o analiză.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:8080/api/analyses/add",
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage("Analiza a fost adăugată cu succes!");
            setFormData({
                testName: "",
                value: "",
                unit: "",
                normalMin: "",
                normalMax: "",
                testDate: ""
            });
        } catch (error) {
            console.error("Eroare la adăugarea analizei:", error);
            setMessage("Adăugarea a eșuat. Încearcă din nou.");
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        const token = localStorage.getItem("token");
        axios.post("http://localhost:8080/api/analyses/upload-pdf", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        })
            .then(() => setMessage("Setul de analize a fost procesat cu succes!"))
            .catch(() => setMessage("Eroare la procesarea fișierului."));
    };

    return (
        <div className="page-container">
            <h1>Adaugă Analize</h1>

            <div className="method-switch">
                <button onClick={() => setSelectedMethod("manual")} className={selectedMethod === "manual" ? "active" : ""}>
                    Adaugă Manual
                </button>
                <button onClick={() => setSelectedMethod("pdf")} className={selectedMethod === "pdf" ? "active" : ""}>
                    Încarcă PDF
                </button>
            </div>

            {message && <p className="analysis-message">{message}</p>}

            {selectedMethod === "manual" ? (
                <form className="analysis-form styled-form" onSubmit={handleSubmit}>
                    <div className="dual-input">
                        <label>
                            Analiză din listă:
                            <input
                                list="testNames"
                                name="testName"
                                className="input-dropdown"
                                value={formData.testName}
                                onChange={(e) => {
                                    const selected = predefinedTests.find(t => t.name === e.target.value);
                                    if (selected) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            testName: selected.name,
                                            unit: selected.unit
                                        }));
                                    } else {
                                        setFormData((prev) => ({ ...prev, testName: e.target.value }));
                                    }
                                }}
                            />
                            <datalist id="testNames">
                                {predefinedTests.map((test, index) => (
                                    <option key={index} value={test.name} />
                                ))}
                            </datalist>
                        </label>

                        <label>
                            Adauga analiza manual:
                            <input
                                type="text"
                                name="testName"
                                className="input-text"
                                onBlur={handleChange}
                            />
                        </label>
                    </div>

                    <input type="number" step="0.01" name="value" placeholder="Valoare" value={formData.value} onChange={handleChange} />

                    <div className="dual-input">
                        <label>
                            Unitate din listă:
                            <input
                                list="units"
                                name="unit"
                                className="input-dropdown"
                                value={formData.unit}
                                onChange={handleChange}
                            />
                            <datalist id="units">
                                {[...new Set(predefinedTests.map(t => t.unit))].map((unit, index) => (
                                    <option key={index} value={unit} />
                                ))}
                            </datalist>
                        </label>

                        <label>
                            Adauga unitatea manual:
                            <input
                                type="text"
                                name="unit"
                                className="input-text"
                                onBlur={handleChange}
                            />
                        </label>
                    </div>

                    <input type="number" step="0.01" name="normalMin" placeholder="Minim Normal" value={formData.normalMin} onChange={handleChange} />
                    <input type="number" step="0.01" name="normalMax" placeholder="Maxim Normal" value={formData.normalMax} onChange={handleChange} />
                    <input type="date" name="testDate" placeholder="Data Test" value={formData.testDate} onChange={handleChange} />
                    <button type="submit">Adaugă Analiza</button>
                </form>
            ) : (
                <div className="analysis-form">
                    <h3>Încarcă PDF cu analize</h3>
                    <input type="file" accept=".pdf" onChange={handleFileChange} />
                </div>
            )}
        </div>
    );
};

export default Analysis;
