// src/pages/Home.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        console.log("Server response:", data);
        // You can navigate to /results and pass an ID, etc.
        navigate("/result", { state: { data } });
    }

    return (
        <main className="container grid-lg">
            <div className="columns">
                <div className="column col-8 col-mx-auto">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title h4">Record a Lecture</div>
                            <div className="card-subtitle text-gray">
                                Press <b>Start</b>, record your lecture, then <b>Stop</b>. We’ll
                                save it as an <code>audioBlob</code>.
                            </div>
                        </div>

                        <div className="card-body">
                            {error && (
                                <div className="toast toast-error mb-2">
                                    {error}
                                </div>
                            )}

                            <div className="mb-2">
                                <span className="label mr-2">
                                    Status: {status === "idle" ? "Ready" : status}
                                </span>
                                <span className="label label-secondary">
                                    Format: {mimeType || "browser default"}
                                </span>
                            </div>

                            <div className="btn-group">
                                <button
                                    className="btn btn-primary"
                                    onClick={startRecording}
                                    disabled={status === "recording"}
                                >
                                    Start recording
                                </button>

                                <button
                                    className="btn"
                                    onClick={stopRecording}
                                    disabled={status !== "recording"}
                                >
                                    Stop
                                </button>

                                <button
                                    className="btn btn-link"
                                    onClick={resetRecording}
                                    disabled={status === "recording"}
                                >
                                    Reset
                                </button>
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
                                        <button className="btn btn-success" onClick={uploadRecording}>
                                            Upload for transcription
                                        </button>

                                        <a
                                            className="btn btn-link ml-2"
                                            href={audioUrl ?? undefined}
                                            download="lecture.webm"
                                        >
                                            Download
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="card-footer text-gray">
                            Tip: Keep recordings under a few minutes while testing, then scale up.
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}