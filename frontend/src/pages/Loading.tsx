import { useLocation } from "react-router-dom";


import { useEffect, useState } from "react";

export default function Loading() {
    const location = useLocation();
    const id = location.state?.id;
    console.log(id);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const interval = setInterval(async () => {
            setTick((prev) => prev + 1); // forces rerender

            // optional API request every 3 seconds
            try {
                const res = await fetch("/api/status");
                const data = await res.json();
                console.log("Polling response:", data);
            } catch (err) {
                console.error("Polling failed:", err);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

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
            <h1>Loading</h1>

            <div style={{ display: "flex", gap: "20px" }}>
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

            <p>Checking status...</p>
            <p>Refresh count: {tick}</p>

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
        </div>
    );
}