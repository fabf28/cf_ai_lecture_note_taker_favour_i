import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SearchView from "./view";

export default function Search() {
	const { session } = useAuth();
	const [query, setQuery] = useState("");
	const [answer, setAnswer] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;

		setLoading(true);
		setError(null);
		setAnswer(null);

		try {
			const token = session?.access_token;
			const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`, {
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`,
				},
			});

			if (!res.ok) {
				const errorData = await res.json().catch(() => ({}));
				throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
			}

			const data = await res.json();
			setAnswer(data.results?.response || "No response generated.");
		} catch (err: any) {
			setError(err.message || "An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<SearchView
			query={query}
			onQueryChange={setQuery}
			answer={answer}
			loading={loading}
			error={error}
			onSearch={handleSearch}
		/>
	);
}
