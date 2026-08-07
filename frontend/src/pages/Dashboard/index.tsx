import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import DashboardView from "./view";

export interface LectureItem {
    id: number;
    name: string;
    created_at: string;
}

export default function Dashboard() {
    const { session } = useAuth();
    const navigate = useNavigate();
    const [lectures, setLectures] = useState<LectureItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const userId = session?.user?.id;
        if (!userId) return;

        async function fetchLectures() {
            try {
                const { data, error } = await supabase
                    .from("lectures")
                    .select("id, name, created_at")
                    .eq("user_id", userId)
                    .order("created_at", { ascending: false });

                if (error) {
                    setError(error.message);
                } else {
                    setLectures(data || []);
                }
            } catch (err: any) {
                setError(err.message || "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchLectures();
    }, [session?.user?.id]);

    const handleLectureClick = (lectureId: number) => {
        navigate(`/results/${lectureId}`, {
            state: {
                fromLanding: false
            }
        });
    };

    return (
        <DashboardView
            lectures={lectures}
            loading={loading}
            error={error}
            onLectureClick={handleLectureClick}
        />
    );
}
