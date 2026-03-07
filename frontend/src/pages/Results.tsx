import { useLocation } from "react-router-dom";

export default function Results() {
    const location = useLocation();
    const data = location.state?.data;
    console.log(data);

    return (
        <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
            <h1>Lecture Summary</h1>

            {/* Summary */}
            <div style={{ marginBottom: "30px" }}>
                <h2>Summary</h2>
                <p>{data.summary}</p>
            </div>

            {/* Notes */}
            <div>
                <h2>Key Notes</h2>

                {data.notes.map((note, index) => (
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
        </div>
    );
}