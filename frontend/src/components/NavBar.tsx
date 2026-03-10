import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="navbar container grid-lg">
            <section className="navbar-section">
                <Link className="navbar-brand mr-2" to="/">
                    Lecture AI
                </Link>
            </section>

            <section className="navbar-section">
                AI Lecture Note Taker
            </section>
        </header>
    );
}