import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<h1 style={{ textAlign: "center", marginTop: "50px" }}>Bine ai venit la Wellthy4Life!</h1>} />
        </Routes>
      </Router>
  );
}

export default App;
