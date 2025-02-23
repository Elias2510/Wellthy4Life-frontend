import Navbar from "../components/Navbar";
import "../styles/About.css";

const About = () => {
    return (
        <div className="about-container">
            <Navbar />
            <div className="about-content">
                <h2>Despre Wellthy4Life</h2>
                <p>
                    <strong>Wellthy4Life</strong> este o aplicație web concepută pentru gestionarea și monitorizarea analizelor medicale.
                </p>
                <p>
                    Aplicația oferă utilizatorilor posibilitatea de a adăuga și gestiona rezultatele analizelor medicale, verificând automat
                    dacă valorile sunt în parametrii normali și oferind recomandări pentru vizite medicale.
                </p>
                <p>
                    Wellthy4Life înregistrează istoricul analizelor într-o bază de date, prezentându-le sub formă de grafice și statistici
                    intuitive, facilitând urmărirea evoluției stării de sănătate în timp.
                </p>
                <p>
                    Cu ajutorul memento-urilor personalizate, aplicația trimite notificări pentru reînnoirea analizelor, contribuind la
                    prevenirea problemelor de sănătate prin monitorizare regulată și recomandări bazate pe valorile individuale.
                </p>
            </div>
        </div>
    );
};

export default About;
