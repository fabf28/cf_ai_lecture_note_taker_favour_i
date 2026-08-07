import Card from "../../components/Card";
import "./styles.scss";

export interface ResultsViewProps {
    onDownload: () => void;
    title: string;
    subTitle: string;
}

export default function ResultsView({ onDownload, title, subTitle }: ResultsViewProps) {
    return (
        <main className="container grid-lg d-flex flex-centered" style={{ minHeight: "100vh" }}>
            <div className="columns" style={{ width: "100%" }}>
                <div className="column col-8 col-mx-auto">
                    <Card title={title}>
                        <div className="download-section">
                            <p>{subTitle} Click below to export your notes.</p>
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
