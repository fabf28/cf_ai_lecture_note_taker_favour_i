import { useLocation } from "react-router-dom";
import Card from "../../components/Card";
import { generatePDF } from "../../utils/pdf";
import "./styles.scss";

export default function Results() {
    const location = useLocation();
    const final = location.state?.data.details.output;
    const response = final.notes.response + "}";
    const data = JSON.parse(response);

    return (
        <main className="container grid-lg d-flex flex-centered" style={{ minHeight: "100vh" }}>
            <div className="columns" style={{ width: "100%" }}>
                <div className="column col-8 col-mx-auto">
                    <Card title="Lecture Notes Ready">
                        <div className="download-section">
                            <p>Your lecture has been processed. Click below to download your notes as a PDF.</p>
                            <button
                                className="btn btn-lg download-pdf-button"
                                onClick={() => generatePDF(data, final.transcript)}
                            >
                                Download PDF
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}