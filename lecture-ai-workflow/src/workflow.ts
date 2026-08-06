import {
	WorkflowEntrypoint,
	WorkflowEvent,
	WorkflowStep,
} from "cloudflare:workers";
import { getSupabaseAdmin } from "./lib/supabase";

export type Params = {
	path: string;
};

export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {
	async run(event: WorkflowEvent<Params>, step: WorkflowStep) {

		//step 0 - download audio from Supabase
		const audioData = await step.do("download audio from supabase", async () => {
			const path = event.payload.path;
			const supabase = getSupabaseAdmin(this.env);

			const { data, error } = await supabase.storage
				.from('recordings')
				.download(path);

			if (error) {
				throw error;
			}

			const buffer = await data.arrayBuffer();
			return Array.from(new Uint8Array(buffer));
		});

		//step 1 - transcribe audio
		const text = await step.do("transcribe audio recording", async () => {
			const inputs = {
				audio: audioData
			};
			const response = await this.env.AI.run('@cf/openai/whisper', inputs);
			return {
				transcript: response.text,
			};
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

		return { transcript: text.transcript, notes: result.notes };
	}
}
