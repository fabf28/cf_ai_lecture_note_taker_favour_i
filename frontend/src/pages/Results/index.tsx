import { useLocation } from "react-router-dom";
import "./styles.scss";

interface Note { phrase: string, definition: string };

export default function Results() {
    const location = useLocation();
    const final = location.state?.data.details.output;
    const response = final.notes.response + "}";
    const data = JSON.parse(response);

    return (
        <div className="results-container">

            {/* Summary */}
            <div className="summary-section">
                <h2>Summary</h2>
                <p>{data.summary}</p>
            </div>

            {/* Notes */}
            <div className="notes-section">
                <h2>Key Notes</h2>

                {data.notes.map((note: Note, index: number) => (
                    <div
                        key={index}
                        className="note-item"
                    >
                        <h3>{note.phrase}</h3>
                        <p>{note.definition}</p>
                    </div>
                ))}
            </div>

            {/* Transcript */}
            <div className="transcript-section">
                <h2>Transcript</h2>
                <p>{final.transcript}</p>
            </div>
        </div>
    );
}