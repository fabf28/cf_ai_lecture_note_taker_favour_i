import { useLocation } from "react-router-dom";
import { generatePDF } from "../../utils/pdf";
import ResultsView from "./view";

export default function Results() {
    const location = useLocation();
    const final = location.state?.data.details.output;
    const response = final.notes.response + "}";
    const data = JSON.parse(response);

    const handleDownload = () => {
        generatePDF(data, final.transcript);
    };

    return <ResultsView onDownload={handleDownload} />;
}