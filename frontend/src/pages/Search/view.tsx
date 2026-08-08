import Card from "../../components/Card";
import "./styles.scss";

export interface SearchViewProps {
	query: string;
	onQueryChange: (val: string) => void;
	answer: string | null;
	loading: boolean;
	error: string | null;
	onSearch: (e: React.FormEvent) => void;
}

export default function SearchView({
	query,
	onQueryChange,
	answer,
	loading,
	error,
	onSearch,
}: SearchViewProps) {
	return (
		<main className="container grid-lg d-flex flex-centered" style={{ minHeight: "80vh", paddingTop: "2rem" }}>
			<div className="columns" style={{ width: "100%" }}>
				<div className="column col-8 col-mx-auto">
					<Card title="Ask Your Notes" className="search-card">
						<form onSubmit={onSearch} className="form-horizontal">
							<div className="input-group">
								<input
									type="text"
									className="form-input input-lg search-input"
									placeholder="Ask a question about your lectures..."
									value={query}
									onChange={(e) => onQueryChange(e.target.value)}
									disabled={loading}
								/>
								<button
									className={`btn btn-primary btn-lg search-button ${loading ? "loading" : ""}`}
									type="submit"
									disabled={loading || !query.trim()}
								>
									Search
								</button>
							</div>
						</form>

						{error && (
							<div className="toast toast-error mt-4 search-error">
								{error}
							</div>
						)}

						{answer && (
							<div className="card mt-4 search-result-card">
								<div className="card-header">
									<div className="card-title h5">Answer</div>
								</div>
								<div className="card-body">
									<p className="search-answer">{answer}</p>
								</div>
							</div>
						)}
					</Card>
				</div>
			</div>
		</main>
	);
}
