import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { generatePDF } from "../../utils/pdf";
import { getLectureNotes, type LectureNotesData } from "../../utils/lectures";
import ResultsView from "./view";

export default function Results() {
    const location = useLocation();
    const status = location.state?.status;

    //TODO: update to typescript methods
    let lectureId = "";
    let transcript = "";
    let response = "";


    if (status === "errored") {
        const final = location.state?.data.details.__LOCAL_DEV_STEP_OUTPUTS;
        response = final[1]?.notes.response + "\"defenition\": \"\"}]}";
        console.log(response);
        lectureId = final?.lecture_id || "";
        transcript = final?.transcript || "";
    }
    else if (status === "complete") {
        const final = location.state?.data.details.output;
        response = final?.notes.response + "}";
        transcript = final[0]?.transcript || "";
        if (final.length > 2) {
            lectureId = final[2]?.lecture_id || "";
        }
    }
    const data = JSON.parse(response);

    const [notesData, setNotesData] = useState<LectureNotesData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (lectureId) {
            getLectureNotes(lectureId)
                .then((fetchedData) => {
                    setNotesData(fetchedData);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to load lecture notes from database. Loaded from memory:", err);
                    setNotesData(data);
                    setLoading(false);
                });
        } else {
            setNotesData(data);
            setLoading(false);
        }
    }, [lectureId]);

    const handleDownload = () => {
        if (notesData) {
            generatePDF(notesData, transcript);
        }
    };

    if (loading) {
        return (
            <div className="empty" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <div className="loading loading-lg"></div>
                <p className="empty-title h5 mt-4">Loading your lecture notes...</p>
            </div>
        );
    }

    return <ResultsView onDownload={handleDownload} />;
}