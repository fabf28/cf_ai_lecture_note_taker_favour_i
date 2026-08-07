import {
	WorkflowEntrypoint,
	WorkflowEvent,
	WorkflowStep,
} from "cloudflare:workers";
import { getSupabaseAdmin } from "./lib/supabase";

export type Params = {
	path: string;
	name: string;
};

export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {
	async run(event: WorkflowEvent<Params>, step: WorkflowStep) {

		const getResponseText = (notesObj: any): string => {
			if (!notesObj) return "";
			if (typeof notesObj === "string") return notesObj.trim();
			if (typeof notesObj.response === "string") return notesObj.response.trim();
			if (notesObj.response && typeof notesObj.response.toString === "function") {
				return notesObj.response.toString().trim();
			}
			return JSON.stringify(notesObj).trim();
		};

		//step 0 - download audio from Supabase
		//const audioData = await step.do("download audio from supabase", async () => {

		//step 1 - transcribe audio
		const text = await step.do("transcribe audio recording from supabase", async () => {
			try {
				const path = event.payload.path;
				const supabase = getSupabaseAdmin(this.env);

				const { data, error } = await supabase.storage
					.from('recordings')
					.download(path);

				if (error) {
					throw new Error(error.message || JSON.stringify(error));
				}

				const buffer = await data.arrayBuffer();

				const base64 = Buffer.from(buffer).toString('base64')

				const response = await this.env.AI.run('@cf/openai/whisper-large-v3-turbo', {
					audio: base64,
				})

				return {
					transcript: response.text,
					error: null
				};

			} catch (err) {
				// Force it into a real, string-message Error before it hits Workflows' state layer
				const message = err instanceof Error ? err.message : JSON.stringify(err);
				return {
					transcript: "",
					error: message
				};
			}

		});

		//step 2 - generate json
		const result = await step.do(
			"turn text into notes",
			async () => {
				const messages = [
					{
						role: "system",
						content: `
						You are an AI that converts lecture transcripts into structured study notes.

						Task:
						1. Read the lecture transcript.
						2. Identify important key phrases or concepts.
						3. Provide a short definition for each phrase.
						4. Provide a concise overall summary of the lecture.

						Output requirements:
						- Return ONLY valid JSON.
						- Do NOT include markdown, code blocks, or explanations.
						- The response must strictly follow this schema:

						{
						"notes": [
							{
							"phrase": "string",
							"definition": "string"
							}
						],
						"summary": "string"
						}

						Rules:
						- Include 5–15 notes depending on transcript length.
						- Phrases should be short (1–5 words).
						- Definitions should be clear and concise.
						- Summary should be 2–4 sentences.
						`
					},
					{
						role: "user",
						content: text.transcript
					}
				];

				const inputs = {
					messages: messages
				};

				const value = await this.env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", inputs);
				return { notes: value };
			},
		);

		//step 3 - save lecture to database
		const lectureDbRow = await step.do("create lecture database row", async () => {
			const path = event.payload.path;
			const supabase = getSupabaseAdmin(this.env);

			let summary = "";
			try {
				const responseText = getResponseText(result.notes);
				const fullJsonText = responseText.endsWith("}") ? responseText : responseText + "}";
				const parsed = JSON.parse(fullJsonText);
				summary = parsed.summary || "";
			} catch (e) {
				console.error("Failed to parse notes JSON for summary:", e);
			}

			const { data, error } = await (supabase as any)
				.from('lectures')
				.insert({
					recording_path: path,
					transcript: text.transcript,
					summary: summary,
					name: event.payload.name,
					user_id: path.split('/')[0]
				})
				.select('id')
				.single();

			if (error) {
				throw new Error(error.message || JSON.stringify(error));
			}

			return data as { id: number };
		});

		//step 4 - save keywords and definitions to database
		await step.do("create note database rows", async () => {
			const path = event.payload.path;
			const supabase = getSupabaseAdmin(this.env);

			let notesList: { phrase: string; definition: string }[] = [];
			try {
				const responseText = getResponseText(result.notes);
				const fullJsonText = responseText.endsWith("}") ? responseText : responseText + "}";
				const parsed = JSON.parse(fullJsonText);
				notesList = parsed.notes || [];
			} catch (e) {
				console.error("Failed to parse notes JSON:", e);
			}

			const rowsToInsert = notesList.map((item) => ({
				keyword: item.phrase || "",
				definition: item.definition || "",
				lecture_id: lectureDbRow.id,
				user_id: path.split('/')[0]
			}));

			if (rowsToInsert.length > 0) {
				const { error } = await (supabase as any)
					.from('notes')
					.insert(rowsToInsert);

				if (error) {
					throw new Error(error.message || JSON.stringify(error));
				}
			}
		});

		return { lecture_id: lectureDbRow.id, name: event.payload.name, transcript: text.transcript, notes: result.notes };
	}
}
