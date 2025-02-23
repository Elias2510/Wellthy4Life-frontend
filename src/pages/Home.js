import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <Navbar />
            <div className="home-content">
                <h1>Bine ai venit la Wellthy4Life</h1>
                <p>Aplicația care te ajută să îți monitorizezi sănătatea.</p>
                <button className="cta-button" onClick={() => navigate("/register")}>Înregistrează-te</button>
            </div>
        </div>
    );
};

export default Home;
