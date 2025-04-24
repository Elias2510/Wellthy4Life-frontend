import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import EditAnalysis from './pages/EditAnalysis';
import AnalysisCharts from './pages/AnalysisCharts';
import Pacienti from './pages/Patients';
import PatientAnalyses from './pages/PatientAnalyses'; // <- Adăugat

import Navbar from './components/Navbar';
import './App.css';



function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/analysis" element={<Analysis />} />
                    <Route path="/edit-analysis/:id" element={<EditAnalysis />} />
                    <Route path="/charts" element={<AnalysisCharts />} />
                    <Route path="/patients" element={<Pacienti />} />



                    <Route path="/pacient/:id" element={<PatientAnalyses />} />



                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
