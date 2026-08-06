import Card from "../../components/Card";
import "./styles.scss";
import type { RecorderStatus } from "./index";

export interface HomeViewProps {
    status: RecorderStatus;
    error: string | null;
    audioBlob: Blob | null;
    audioUrl: string | null;
    startRecording: () => void;
    stopRecording: () => void;
    resetRecording: () => void;
    uploadRecording: () => void;
    onDownloadAudio: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function HomeView({
    status,
    error,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
    uploadRecording,
    onDownloadAudio,
}: HomeViewProps) {
    return (
        <main className="container grid-lg d-flex flex-centered" style={{ minHeight: "100vh" }}>
            <div className="columns" style={{ width: "100%" }}>
                <div className="column col-8 col-mx-auto">
                    <Card title="Record a Lecture">
                        {error && (
                            <div className="toast toast-error mb-2">
                                {error}
                            </div>
                        )}


                        <div className="btn-group">
                            <button
                                className={`record-circle ${status === "recording" ? "recording" : ""}`}
                                onClick={startRecording}
                                disabled={status === "recording"}
                                title="Start recording"
                            >
                            </button>

                            {status === "recording" && (
                                <button
                                    className="stop-square"
                                    onClick={stopRecording}
                                    disabled={status !== "recording"}
                                    title="Stop recording"
                                >
                                </button>
                            )}

                            {status === "stopped" && (
                                <button
                                    className="reset-loop"
                                    onClick={resetRecording}
                                    title="Reset"
                                >
                                    ↻
                                </button>
                            )}
                        </div>


                        {audioBlob && (
                            <div className="mt-2">
                                <div className="divider" />
                                <p className="text-gray m-0">
                                    Recorded: <b>{(audioBlob.size / 1024).toFixed(1)} KB</b>{" "}
                                    ({audioBlob.type || "unknown type"})
                                </p>

                                {audioUrl && (
                                    <div className="mt-2">
                                        <audio controls src={audioUrl} style={{ width: "100%" }} />
                                    </div>
                                )}

                                <div className="mt-2">
                                    <button className="make-notes-button" onClick={uploadRecording} title="Make Notes">
                                        <img src="/pen.svg" alt="Make Notes" />
                                    </button>

                                    <a
                                        className="download-arrow ml-2"
                                        href={audioUrl ?? undefined}
                                        onClick={onDownloadAudio}
                                        title="Download"
                                    >
                                        ↓
                                    </a>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </main>
    );
}
