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
import '../styles/AnalysisCharts.css';
import backgroundImage from '../styles/auth.jpg';

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
                    headers: { Authorization: `Bearer ${token}` }
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
            <div className="overlay" />
            <h2>Vizualizare Analize</h2>
            <div className="overlay"></div> {}
            <div className="background-blur" />
            <div style={{ display: "flex", gap: "20px", marginBottom: "2rem", zIndex: 2 }}>
                <button onClick={() => navigate("/dashboard")}>Vezi lista de analize</button>
            </div>

            <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
            >
                <option value="">Selectează o analiză</option>
                {uniqueTests.map((test, index) => (
                    <option key={index} value={test}>{test}</option>
                ))}
            </select>

            {chartData.length > 0 && (
                <>
                    <div className="chart-container" ref={chartRef}>

                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{ top: 10, right: 40, bottom: 30, left: 10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} angle={-35} textAnchor="end" height={60} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend verticalAlign="top" height={36} />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    name="Valoare"
                                    stroke="#60a5fa"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="normalMin"
                                    name="Minim normal"
                                    stroke="#34d399"
                                    strokeDasharray="5 5"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="normalMax"
                                    name="Maxim normal"
                                    stroke="#f87171"
                                    strokeDasharray="5 5"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <button onClick={handleExportPDF}>
                        Exportă ca PDF
                    </button>
                </>
            )}
        </div>
    );
};

export default AnalysisCharts;