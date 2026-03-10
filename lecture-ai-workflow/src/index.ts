import {
	WorkflowEntrypoint,
	WorkflowEvent,
	WorkflowStep,
} from "cloudflare:workers";

type Params = {
	audio: any,
	type: any
};

export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {
	async run(event: WorkflowEvent<Params>, step: WorkflowStep) {

		//step 1 - transcribe audio
		const text = await step.do("transcribe audio recording", async () => {
			const inputs = {
				audio: event.payload.audio
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
export default {
	async fetch(req: Request, env: Env): Promise<Response> {
		let url = new URL(req.url);

		if (url.pathname.startsWith("/favicon")) {
			return Response.json({}, { status: 404 });
		}

		// Get the status of an existing instance, if provided
		let id = url.searchParams.get("instanceId");
		if (id) {
			let instance = await env.MY_WORKFLOW.get(id);
			return Response.json({
				details: await instance.status(),
			});
		}

		// Spawn a new instance and return the ID and status
		const form = await req.formData();
		const audio = form.get("audio");
		const buffer = await audio!.arrayBuffer();

		const instance = await env.MY_WORKFLOW.create({
			params: {
				audio: Array.from(new Uint8Array(buffer)),
				type: audio!.type
			}
		});

		//return response
		return Response.json({
			id: instance.id,
			details: await instance.status(),
		});
	},
};
