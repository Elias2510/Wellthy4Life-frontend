import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';

import AnalysisCharts from './pages/AnalysisCharts';
import Pacienti from './pages/Patients';
import PatientAnalyses from './pages/PatientAnalyses'; // <- Adăugat
import AdminPanel from './pages/AdminPanel'; // adaugă importul
import Navbar from './components/Navbar';
import './App.css';
import Help from './pages/Help';
import AdminSupportMessages from './pages/AdminSupportMessages';
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

                    <Route path="/charts" element={<AnalysisCharts />} />
                    <Route path="/patients" element={<Pacienti />} />



                    <Route path="/admin" element={<AdminPanel />} />



                    <Route path="/help" element={<Help />} />



                    <Route path="/admin/support-messages" element={<AdminSupportMessages />} />

                    <Route path="/pacient/:id" element={<PatientAnalyses />} />



                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
