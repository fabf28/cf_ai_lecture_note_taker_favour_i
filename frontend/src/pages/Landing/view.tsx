import "./styles.scss";

export interface LandingViewProps {
    status: string;
    scriptStatus: string;
    notesStatus: string;
    isLoading: boolean;
    nextPage: () => void;
}

export default function LandingView({
    status,
    scriptStatus,
    notesStatus,
    isLoading,
    nextPage,
}: LandingViewProps) {
    return (
        <div className="loading-container">
            {isLoading && (
                <div className="loading-spinner">
                    <div className="spinner" />
                    <div className="pulse-dot" />
                </div>
            )}

            <p>Status: {status}</p>
            <p>Transcript Status: {scriptStatus}</p>
            <p>Notes Status: {notesStatus}</p>
            {!isLoading && <button onClick={nextPage}>Next Page</button>}
        </div>
    );
}
