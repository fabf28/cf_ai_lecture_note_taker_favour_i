import {
	WorkflowEntrypoint,
	WorkflowEvent,
	WorkflowStep,
} from "cloudflare:workers";

/**
 * Welcome to Cloudflare Workers! This is your first Workflows application.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your Workflow in action
 * - Run `npm run deploy` to publish your application
 *
 * Learn more at https://developers.cloudflare.com/workflows
 */

// User-defined params passed to your Workflow
type Params = {
	audio: any,
	type: any
};

export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {
	async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
		// Can access bindings on `this.env`
		// Can access params on `event.payload`

		//step 1 - transcribe audio
		const transcript = await step.do("my first step", async () => {
			// Fetch a list of files from $SOME_SERVICE
			console.log(event.payload);
			const inputs = {
				audio: event.payload.audio
			};
			const response = await this.env.AI.run('@cf/openai/whisper', inputs);
			return {
				text: response.text,
			};
		});

		await step.sleep("wait on something", "1 minute");

		//step 2 - generate 
		const result = await step.do(
			"turn text into notes",
			async () => {
				const messages = [
					{
						role: "system",
						content: 'You are note maker. You are creating taking in text that is a lecture transcript. You will first make sense of the transcript, then you will turn it into keyword/phrases matched with definitions. You will then summaraize that into notes. Return the following json structure for the notes: {"notes":[{"phrase": <the phrase>, "definition" : <the defenition>}, {"phrase": <the phrase>, "definition" : <the defenition>}, {"phrase": <the phrase>, "definition" : <the defenition>}, ...], "summary" : <the summary>}'

					},
					{
						role: "user",
						content: transcript.text,
					},
				];

				const inputs = {
					messages: messages
				};

				const value = await this.env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", inputs);
				console.log(value);
				return { notes: value }
			},
		);

		return { transcript: transcript, notes: result };
	}
}
export default {
	async fetch(req: Request, env: Env): Promise<Response> {
		let url = new URL(req.url);

		if (url.pathname.startsWith("/favicon")) {
			return Response.json({}, { status: 404 });
		}

		// Get the status of an existing instance, if provided
		// GET /?instanceId=<id here>
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
		// You can also set the ID to match an ID in your own system
		// and pass an optional payload to the Workflow
		// let instance = await env.MY_WORKFLOW.create({
		// 	id: 'id-from-your-system',
		// 	params: { payload: 'to send' },
		// });
		return Response.json({
			id: instance.id,
			details: await instance.status(),
		});
	},
};
