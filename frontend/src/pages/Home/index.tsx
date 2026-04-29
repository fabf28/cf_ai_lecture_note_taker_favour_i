// src/pages/Home.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import "./styles.scss";

type RecorderStatus = "idle" | "recording" | "stopped" | "error";

function pickSupportedMimeType() {
    const candidates = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/ogg",
    ];

    for (const type of candidates) {
        if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return ""; // Let browser choose
}

export default function Home() {
    const [status, setStatus] = useState<RecorderStatus>("idle");
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);

    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const mimeType = useMemo(() => pickSupportedMimeType(), []);
    const navigate = useNavigate();

    useEffect(() => {
        // cleanup object URLs + mic stream on unmount
        return () => {
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function startRecording() {
        setError(null);

        try {
            // Ask for microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            chunksRef.current = [];

            const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (e: BlobEvent) => {
                if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onerror = () => {
                setStatus("error");
                setError("Recording failed. Please try again.");
            };

            recorder.onstop = () => {
                try {
                    const blob = new Blob(chunksRef.current, {
                        type: recorder.mimeType || "audio/webm",
                    });

                    setAudioBlob(blob);

                    // Replace existing object URL
                    setAudioUrl((prev) => {
                        if (prev) URL.revokeObjectURL(prev);
                        return URL.createObjectURL(blob);
                    });

                    setStatus("stopped");

                    // Stop mic tracks (releases microphone indicator)
                    stream.getTracks().forEach((t) => t.stop());
                    streamRef.current = null;
                } catch {
                    setStatus("error");
                    setError("Could not finalize recording.");
                }
            };

            recorder.start(); // you can pass timeslice ms if you want streaming chunks
            setStatus("recording");
        } catch (err) {
            setStatus("error");
            setError(
                err instanceof Error
                    ? err.message
                    : "Microphone permission denied or unavailable."
            );
        }
    }

    function stopRecording() {
        const recorder = mediaRecorderRef.current;
        if (!recorder) return;

        if (recorder.state === "recording") {
            recorder.stop();
        }
    }

    function resetRecording() {
        setAudioBlob(null);
        setAudioUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        setStatus("idle");
        setError(null);
        chunksRef.current = [];
    }

    async function uploadRecording() {
        if (!audioBlob) return;

        // Prefer sending Blob directly (octet-stream) OR use FormData.
        // Here’s FormData (most compatible):
        const fd = new FormData();
        fd.append("audio", audioBlob, "lecture.webm");

        // TODO: change to your API endpoint (Cloudflare Pages Function or Worker)
        const res = await fetch("/api/summarize", {
            method: "POST",
            body: fd,
        });

        if (!res.ok) {
            setError(`Upload failed (${res.status}).`);
            return;
        }

        const data = await res.json();
        const id = data.id;

        //navigate to /results and pass an ID
        navigate("/loading", { state: { id } });
    }

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
                                            download="lecture.webm"
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