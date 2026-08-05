import type { FormEvent } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import LoginView from "./view";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { session } = useAuth();
    const navigate = useNavigate();

    // If user is already logged in, redirect them to home
    useEffect(() => {
        if (session) {
            navigate("/", { replace: true });
        }
    }, [session, navigate]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!email || !password || (isSignUp && !confirmPassword)) {
            setError("Please fill in all fields.");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // Password length validation
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        // Password confirmation matching validation
        if (isSignUp && password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            if (isSignUp) {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (signUpError) throw signUpError;

                // Handle duplicate email check when User Enumeration Protection is enabled in Supabase
                if (data.user && data.user.identities && data.user.identities.length === 0) {
                    throw new Error("This email is already registered. Please sign in instead.");
                }

                if (data.session) {
                    // Signed up and logged in immediately (email verification disabled)
                    navigate("/");
                } else {
                    // Email verification enabled
                    setSuccess("Check your email for the confirmation link!");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                }
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (signInError) throw signInError;
                navigate("/");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignUp((prev) => !prev);
        setError(null);
        setSuccess(null);
        setPassword("");
        setConfirmPassword("");
    };

    return (
        <LoginView
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isSignUp={isSignUp}
            loading={loading}
            error={error}
            success={success}
            handleSubmit={handleSubmit}
            toggleMode={toggleMode}
        />
    );
}
