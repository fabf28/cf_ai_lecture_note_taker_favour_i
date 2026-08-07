import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { generatePDF } from "../../utils/pdf";
import { getLectureNotes, type LectureNotesData } from "../../utils/lectures";
import ResultsView from "./view";

export default function Results() {
    const location = useLocation();

    //fetch id from url
    const { id } = useParams();
    const lectureId = id as string;

    /**
    if (status === "errored") {
        const final = location.state?.data?.details?.__LOCAL_DEV_STEP_OUTPUTS || [];
        response = final[1]?.notes?.response || "";

        // Keep the recovery fallback if the response was cut off
        if (response && !response.includes("}]")) {
            response = response + "\"defenition\": \"\"}]}";
        }
        console.log(response);

        transcript = final[0]?.transcript || "";
    }
    */
    //if (status === "complete") {

    //backup process parsing data from worker response if not found in database
    const final = location.state?.data?.details?.output;
    const response = final?.notes?.response || "";
    const transcript = final?.transcript || "";
    const backupName = location.state?.data?.details?.params?.name;

    //calling data from database
    const [notesData, setNotesData] = useState<LectureNotesData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const parseMemoryData = () => {
            //TODO: make algorithm more efficent and store in lib or util folder
            let parsedData = { notes: [], summary: "" };
            try {
                if (response) {
                    if (typeof response === "object") {
                        parsedData = response as any;
                    } else if (typeof response === "string") {
                        const trimmed = response.trim();
                        if (trimmed !== "[object Object]") {
                            try {
                                parsedData = JSON.parse(trimmed);
                            } catch {
                                // 1. Clean trailing commas
                                let cleanStr = trimmed.replace(/,\s*$/, '');

                                // 2. Balance double quotes
                                let doubleQuotesCount = 0;
                                for (let i = 0; i < cleanStr.length; i++) {
                                    if (cleanStr[i] === '"' && (i === 0 || cleanStr[i - 1] !== '\\')) {
                                        doubleQuotesCount++;
                                    }
                                }
                                if (doubleQuotesCount % 2 !== 0) {
                                    cleanStr += '"';
                                }

                                // 3. Balance braces and brackets
                                const stack: string[] = [];
                                let insideString = false;
                                for (let i = 0; i < cleanStr.length; i++) {
                                    const char = cleanStr[i];
                                    if (char === '"' && (i === 0 || cleanStr[i - 1] !== '\\')) {
                                        insideString = !insideString;
                                        continue;
                                    }
                                    if (insideString) continue;

                                    if (char === '{') {
                                        stack.push('}');
                                    } else if (char === '[') {
                                        stack.push(']');
                                    } else if (char === '}') {
                                        if (stack[stack.length - 1] === '}') stack.pop();
                                    } else if (char === ']') {
                                        if (stack[stack.length - 1] === ']') stack.pop();
                                    }
                                }

                                while (stack.length > 0) {
                                    cleanStr += stack.pop();
                                }

                                parsedData = JSON.parse(cleanStr);
                            }
                        }
                    }
                }
            } catch (err) {
                console.warn("Failed to parse fallback memory JSON:", err);
            }
            return parsedData;
        };

        if (lectureId) {
            getLectureNotes(lectureId)
                .then((fetchedData: LectureNotesData) => {
                    console.log(fetchedData);
                    setNotesData(fetchedData);
                    setLoading(false);
                })
                .catch((err: any) => {
                    console.error("Failed to load lecture notes from database. Loaded from memory:", err);
                    const data = parseMemoryData();
                    setNotesData({
                        ...data,
                        name: backupName
                    });
                    setLoading(false);
                });
        } else {
            const data = parseMemoryData();
            setNotesData({
                ...data,
                name: backupName
            });
            setLoading(false);
        }
    }, [lectureId, response, backupName]);

    const handleDownload = () => {
        if (notesData) {
            generatePDF(notesData, transcript);
        }
    };

    const fromLanding = location.state?.fromLanding;
    const title = fromLanding ? "Lecture Notes Ready" : notesData?.name || "";
    const subTitle = fromLanding ? "Your lecture has been processed." : "";


    if (loading) {
        return (
            <div className="empty" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <div className="loading loading-lg"></div>
                <p className="empty-title h5 mt-4">Loading your lecture notes...</p>
            </div>
        );
    }

    return <ResultsView onDownload={handleDownload} title={title} subTitle={subTitle} />;
}