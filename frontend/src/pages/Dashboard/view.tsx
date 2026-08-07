import Card from "../../components/Card";
import "./styles.scss";
import type { LectureItem } from "./index";

export interface DashboardViewProps {
    lectures: LectureItem[];
    loading: boolean;
    error: string | null;
    onLectureClick: (id: number) => void;
}

export default function DashboardView({
    lectures,
    loading,
    error,
    onLectureClick
}: DashboardViewProps) {
    return (
        <main className="container grid-lg d-flex flex-centered" style={{ minHeight: "100vh" }}>
            <div className="columns" style={{ width: "100%" }}>
                <div className="column col-8 col-mx-auto">
                    <Card title="Your Lectures">
                        {loading ? (
                            <div className="d-flex flex-column align-center justify-center p-4">
                                <div className="loading loading-lg"></div>
                                <p className="text-gray mt-2">Loading your dashboard...</p>
                            </div>
                        ) : error ? (
                            <div className="toast toast-error mb-2">
                                {error}
                            </div>
                        ) : lectures.length === 0 ? (
                            <div className="text-center p-4">
                                <p className="text-gray">You haven't recorded any lectures yet.</p>
                                <a className="btn btn-primary mt-2" href="/">
                                    Record Your First Lecture
                                </a>
                            </div>
                        ) : (
                            <div className="lecture-list mt-2">
                                {lectures.map((lecture) => (
                                    <div
                                        key={lecture.id}
                                        className="lecture-item"
                                        onClick={() => onLectureClick(lecture.id)}
                                    >
                                        <div className="lecture-info">
                                            <span className="lecture-name">{lecture.name}</span>
                                            <span className="lecture-date">
                                                {new Date(lecture.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <span className="view-notes-arrow">View Notes &rarr;</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </main>
    );
}
