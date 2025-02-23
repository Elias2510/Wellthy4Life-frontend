import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <h1 className="logo" onClick={() => navigate("/")}>Wellthy4Life</h1>
            <ul>
                <li onClick={() => navigate("/")}>Home</li>
                <li onClick={() => navigate("/about")}>About</li>
                <li onClick={() => navigate("/login")}>Login</li>
                <li onClick={() => navigate("/register")}>Register</li>
                <li onClick={() => navigate("/analysis")}>Analysis</li>
                <li onClick={() => navigate("/dashboard")}>Dashboard</li>
            </ul>
        </nav>
    );
};

export default Navbar;
