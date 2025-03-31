import Navbar from "../components/Navbar";
import "../styles/About.css";

const aboutSections = [
    {
        id: 1,
        text: (
            <>
                <strong>Wellthy4Life</strong> este o aplicație web concepută pentru gestionarea și monitorizarea analizelor medicale.
            </>
        )
    },
    {
        id: 2,
        text: (
            <>
                Aplicația oferă utilizatorilor posibilitatea de a adăuga și gestiona rezultatele analizelor medicale, verificând automat
                dacă valorile sunt în parametrii normali și oferind recomandări pentru vizite medicale.
            </>
        )
    },
    {
        id: 3,
        text: (
            <>
                Wellthy4Life înregistrează istoricul analizelor într-o bază de date, prezentându-le sub formă de grafice și statistici
                intuitive, facilitând urmărirea evoluției stării de sănătate în timp.
            </>
        )
    },
    {
        id: 4,
        text: (
            <>
                Cu ajutorul memento-urilor personalizate, aplicația trimite notificări pentru reînnoirea analizelor, contribuind la
                prevenirea problemelor de sănătate prin monitorizare regulată și recomandări bazate pe valorile individuale.
            </>
        )
    }
];

const About = () => {
    return (
        <div className="page-container">
            <Navbar />
            <div className="page-content">
                <h2>Despre Wellthy4Life</h2>
                <div className="bubble-wrapper">
                    {aboutSections.map((section) => (
                        <div key={section.id} className="info-bubble">
                            {section.text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
