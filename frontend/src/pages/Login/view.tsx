import type { FormEvent } from "react";
import Card from "../../components/Card";
import "./styles.scss";

type LoginViewProps = {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    isSignUp: boolean;
    loading: boolean;
    error: string | null;
    success: string | null;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    toggleMode: () => void;
};

export default function LoginView({
    email,
    setEmail,
    password,
    setPassword,
    isSignUp,
    loading,
    error,
    success,
    handleSubmit,
    toggleMode,
}: LoginViewProps) {
    return (
        <main className="container grid-lg d-flex flex-centered login-page-main" style={{ minHeight: "85vh" }}>
            <div className="columns animate-fade-in" style={{ width: "100%" }}>
                <div className="column col-8 col-mx-auto col-md-10 col-sm-12">
                    <Card title={isSignUp ? "Create an Account" : "Welcome Back"}>
                        <p className="login-subtitle text-gray mb-4">
                            {isSignUp
                                ? "Sign up to start transforming your lectures into notes"
                                : "Sign in to access your AI lecture notes"}
                        </p>

                        {error && (
                            <div className="toast toast-error mb-4">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="toast toast-success mb-4">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group mb-3">
                                <label className="form-label text-small uppercase font-weight-bold" htmlFor="email-input">
                                    Email Address
                                </label>
                                <div className="has-icon-left">
                                    <input
                                        type="email"
                                        id="email-input"
                                        className="form-input custom-input"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                    <i className="form-icon icon icon-mail"></i>
                                </div>
                            </div>

                            <div className="form-group mb-4">
                                <label className="form-label text-small uppercase font-weight-bold" htmlFor="password-input">
                                    Password
                                </label>
                                <div className="has-icon-left">
                                    <input
                                        type="password"
                                        id="password-input"
                                        className="form-input custom-input"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                    <i className="form-icon icon icon-people"></i>
                                </div>
                            </div>

                            <div className="d-flex flex-column align-items-center">
                                <button
                                    type="submit"
                                    className={`btn btn-lg custom-submit-btn ${loading ? "loading" : ""}`}
                                    disabled={loading}
                                >
                                    {isSignUp ? "Create Account" : "Sign In"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-link custom-toggle-btn mt-3"
                                    onClick={toggleMode}
                                    disabled={loading}
                                >
                                    {isSignUp
                                        ? "Already have an account? Sign In"
                                        : "New to Lecture AI? Sign Up"}
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </main>
    );
}
