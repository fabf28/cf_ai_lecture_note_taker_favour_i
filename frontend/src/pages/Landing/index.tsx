import { useLocation, useNavigate } from "react-router-dom";


import { useEffect, useRef, useState } from "react";
import "./styles.scss";

export default function Loading() {
    const location = useLocation();
    const id = location.state?.id;
    const dataRef = useRef({ details: { status: "", error: null, output: null } });

    const [status, setStatus] = useState("");
    const [scriptStatus, setScriptStatus] = useState("◌");
    const [notesStatus, setNotesStatus] = useState("◌");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(async () => {

            if (status != "complete")
                setStatus(dataRef.current.details.status);
            if (dataRef.current.details.status == "complete")
                setIsLoading(false);
            if (dataRef.current.details.output) {
                setScriptStatus("✅");
                setNotesStatus("✅");
            } else if (dataRef.current.details.error)
                setNotesStatus("Error: " + dataRef.current.details.error);

            // optional API request every 3 seconds
            try {
                const res = await fetch("/api/summarize/?id=" + id);
                const data = await res.json();
                dataRef.current = data;
            } catch (err) {
                console.error("Polling failed:", err);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const nextPage = () => {
        const data = dataRef.current;
        navigate("/results", { state: { data } });
    };


    return (
        <div className="loading-container">

            {isLoading &&
                <div className="loading-spinner">
                    <div className="spinner" />
                    <div className="pulse-dot" />
                </div>
            }

            <p>Status: {status}</p>
            <p>Transcript Status: {scriptStatus}</p>
            <p>Notes Status: {notesStatus}</p>
            {!isLoading && <button onClick={nextPage}>Next Page</button>}
        </div>
    );
}