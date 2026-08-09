import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import "./styles.scss";

export default function Navbar() {
    const { session, loading } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <header className="navbar container grid-lg">
            <section className="navbar-section">
                <Link className="navbar-brand mr-2" to="/">
                    Lecture AI
                </Link>
                {session && (
                    <>
                        <Link className="navbar-brand mr-2" to="/dashboard">
                            Dashboard
                        </Link>
                        <Link className="navbar-brand mr-2" to="/search">
                            Search
                        </Link>
                    </>
                )}
            </section>

            <section className="navbar-section">
                {!loading && (
                    session ? (
                        <div className="navbar-auth">
                            <span className="user-email text-gray mr-2 hide-sm">{session.user?.email}</span>
                            <button 
                                className="navbar-brand" 
                                style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }} 
                                onClick={handleSignOut}
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <Link className="navbar-brand" to="/login">
                            Sign In
                        </Link>
                    )
                )}
            </section>
        </header>
    );
}