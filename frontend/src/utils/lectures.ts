import { supabase } from "../lib/supabase";

export interface NoteItem {
	phrase: string;
	definition: string;
}

export interface LectureNotesData {
	notes: NoteItem[];
	summary: string;
	name: string;
}

/**
 * Fetches notes, summary, and name for a given lecture ID from Supabase and formats
 * the output to match the shape: { notes: Array<{ phrase, definition }>, summary: string, name: string }
 */
export async function getLectureNotes(lectureId: number | string): Promise<LectureNotesData> {


	// 1. Fetch the notes (keywords & definitions)
	const { data: notesData, error: notesError } = await supabase
		.from("notes")
		.select("keyword, definition")
		.eq("lecture_id", lectureId);

	if (notesError) {
		throw new Error(`Failed to fetch notes: ${notesError.message}`);
	}

	const notes: NoteItem[] = (notesData || []).map((item: any) => ({
		phrase: item.keyword || "",
		definition: item.definition || "",
	}));

	// 2. Fetch the lecture summary and name
	let summary = "";
	let name = "Untitled Lecture";
	const { data: lectureData, error: lectureError } = await supabase
		.from("lectures")
		.select("*")
		.eq("id", lectureId)
		.single();

	if (lectureError) {
		throw new Error(`Failed to fetch lecture: ${lectureError.message}`);
	}

	if (lectureData) {
		summary = (lectureData as any).summary || "";
		name = (lectureData as any).name || "Untitled Lecture";
	}

	return {
		notes,
		summary,
		name,
	};
}
