import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

const AnalysisCharts = () => {
    const [analyses, setAnalyses] = useState([]);
    const [selectedTest, setSelectedTest] = useState("");
    const [chartData, setChartData] = useState([]);
    const [uniqueTests, setUniqueTests] = useState([]);
    const chartRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnalyses = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:8080/api/analyses/user", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAnalyses(response.data);

                const tests = [...new Set(response.data.map((a) => a.testName))];
                setUniqueTests(tests);
            } catch (error) {
                console.error("Eroare la încărcarea analizelor:", error);
            }
        };
        fetchAnalyses();
    }, []);

    useEffect(() => {
        if (selectedTest && analyses.length > 0) {
            const filtered = analyses
                .filter((a) => a.testName === selectedTest)
                .sort((a, b) => new Date(a.testDate) - new Date(b.testDate))
                .map((a) => ({
                    date: a.testDate,
                    value: a.value,
                    normalMin: a.normalMin,
                    normalMax: a.normalMax,
                }));
            setChartData(filtered);
        }
    }, [selectedTest, analyses]);

    const handleExportPDF = () => {
        if (!chartRef.current) return;
        html2canvas(chartRef.current).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
            pdf.save(`Grafic_${selectedTest}.pdf`);
        });
    };

    return (
        <div className="chart-section">
            <h2 style={{ fontSize: "1.5rem", color: "#2f4f4f", marginBottom: "1rem" }}>Vizualizare Analize</h2>

            <div style={{ display: "flex", gap: "20px", marginBottom: "2rem" }}>
                <button
                    style={{ padding: "10px 20px", borderRadius: "8px", background: "#a7c7e7", border: "none", cursor: "pointer", fontWeight: "bold" }}
                    onClick={() => navigate("/dashboard")}
                >
                    Vezi lista de analize
                </button>

            </div>

            <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "20px" }}
            >
                <option value="">Selectează o analiză</option>
                {uniqueTests.map((test, index) => (
                    <option key={index} value={test}>
                        {test}
                    </option>
                ))}
            </select>

            {chartData.length > 0 && (
                <>
                    <div
                        ref={chartRef}
                        style={{ width: "100%", height: 300, maxWidth: "900px", margin: "0 auto" }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{ top: 10, right: 40, bottom: 30, left: 10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} angle={-35} textAnchor="end" height={60} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend verticalAlign="top" height={36} />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    name="Valoare"
                                    stroke="#007bff"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="normalMin"
                                    name="Minim normal"
                                    stroke="#82ca9d"
                                    strokeDasharray="5 5"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="normalMax"
                                    name="Maxim normal"
                                    stroke="#ff7f7f"
                                    strokeDasharray="5 5"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <button
                        onClick={handleExportPDF}
                        style={{ marginTop: 20, padding: "8px 16px", borderRadius: "8px", background: "#a7c7e7", border: "none", cursor: "pointer", fontWeight: "bold" }}
                    >
                        Exportă ca PDF
                    </button>
                </>
            )}
        </div>
    );
};

export default AnalysisCharts;
