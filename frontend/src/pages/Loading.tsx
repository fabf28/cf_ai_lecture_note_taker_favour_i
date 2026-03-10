import { useLocation, useNavigate } from "react-router-dom";


import { useEffect, useRef, useState } from "react";

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
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                fontFamily: "Arial, sans-serif",
            }}
        >

            {isLoading &&
                < div style={{ display: "flex", gap: "20px" }}>
                    <div
                        style={{
                            width: "30px",
                            height: "30px",
                            border: "4px solid #ccc",
                            borderTop: "4px solid #333",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                        }}
                    />
                    <div
                        style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#333",
                            borderRadius: "50%",
                            animation: "pulse 1s ease-in-out infinite",
                        }}
                    />
                </div>
            }

            <p>Status: {status}</p>
            <p>Transcript Status: {scriptStatus}</p>
            <p>Notes Status: {notesStatus}</p>
            {!isLoading && <button onClick={nextPage}>Next Page</button>}

            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.6); opacity: 1; }
          }
        `}
            </style>
        </div >
    );
}