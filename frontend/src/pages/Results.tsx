import { useLocation } from "react-router-dom";

interface Note { phrase: string, definition: string };

export default function Results() {
    const location = useLocation();
    const final = location.state?.data.details.output;
    const response = final.notes.response + "}";
    const data = JSON.parse(response);

    return (
        <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>

            {/* Summary */}
            <div style={{ marginBottom: "30px" }}>
                <h2>Summary</h2>
                <p>{data.summary}</p>
            </div>

            {/* Notes */}
            <div>
                <h2>Key Notes</h2>

                {data.notes.map((note: Note, index: number) => (
                    <div
                        key={index}
                        style={{
                            padding: "15px",
                            marginBottom: "15px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                        }}
                    >
                        <h3>{note.phrase}</h3>
                        <p>{note.definition}</p>
                    </div>
                ))}
            </div>

            {/* Transcript */}
            <div style={{ marginBottom: "30px" }}>
                <h2>Transcript</h2>
                <p>{final.transcript}</p>
            </div>
        </div>
    );
}