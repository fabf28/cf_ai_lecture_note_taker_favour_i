import { useLocation } from "react-router-dom";

interface Note { phrase: string, definition: string };

export default function Results() {
    const location = useLocation();
    const result = location.state?.data;
    console.log("results");
    console.log(result);
    const data = JSON.parse(result.output.notes);
    console.log(data);
    console.log(data.response);

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
        </div>
    );
}