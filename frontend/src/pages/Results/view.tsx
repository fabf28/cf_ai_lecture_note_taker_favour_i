import Card from "../../components/Card";
import "./styles.scss";

export interface ResultsViewProps {
    onDownload: () => void;
}

export default function ResultsView({ onDownload }: ResultsViewProps) {
    return (
        <main className="container grid-lg d-flex flex-centered" style={{ minHeight: "100vh" }}>
            <div className="columns" style={{ width: "100%" }}>
                <div className="column col-8 col-mx-auto">
                    <Card title="Lecture Notes Ready">
                        <div className="download-section">
                            <p>Your lecture has been processed. Click below to download your notes as a PDF.</p>
                            <button
                                className="btn btn-lg download-pdf-button"
                                onClick={onDownload}
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
