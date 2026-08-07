import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { generatePDF } from "../../utils/pdf";
import { getLectureNotes, type LectureNotesData } from "../../utils/lectures";
import ResultsView from "./view";

export default function Results() {
    const location = useLocation();
    const status = location.state?.status;

    let lectureId = "";
    let transcript = "";
    let response = "";
    const backupName = location.state?.data?.details?.params?.name;

    if (status === "errored") {
        const final = location.state?.data?.details?.__LOCAL_DEV_STEP_OUTPUTS || [];
        response = final[1]?.notes?.response || "";

        // Keep the recovery fallback if the response was cut off
        if (response && !response.includes("}]")) {
            response = response + "\"defenition\": \"\"}]}";
        }
        console.log(response);

        transcript = final[0]?.transcript || "";
        if (final.length > 2) {
            lectureId = final[2]?.id || "";
        }
    }
    else if (status === "complete") {
        const final = location.state?.data?.details?.output;
        if (final) {
            response = final.notes?.response || "";
            transcript = final.transcript || "";
            lectureId = final.lecture_id || "";
        }
    }

    let data = { notes: [], summary: "" };
    try {
        if (response) {
            const trimmed = response.trim();
            try {
                data = JSON.parse(trimmed);
            } catch {
                data = JSON.parse(trimmed + "}");
            }
        }
    } catch (err) {
        console.error("Failed to parse response JSON:", err);
    }
    console.log(data);
    const [notesData, setNotesData] = useState<LectureNotesData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (lectureId) {
            getLectureNotes(lectureId)
                .then((fetchedData) => {
                    console.log(fetchedData);
                    setNotesData(fetchedData);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to load lecture notes from database. Loaded from memory:", err);
                    setNotesData({
                        ...data,
                        name: backupName
                    });
                    setLoading(false);
                });
        } else {
            setNotesData({
                ...data,
                name: backupName
            });
            setLoading(false);
        }
    }, [lectureId, data, backupName]);

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