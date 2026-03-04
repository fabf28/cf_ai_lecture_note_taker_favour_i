/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export { MyWorkflow } from "./workflow";


import { WorkerEntrypoint } from "cloudflare:workers";

export default class WorkflowsService extends WorkerEntrypoint {
	// Currently, entrypoints without a named handler are not supported
	async fetch() {
		return new Response(null, { status: 404 });
	}

	async createInstance(payload: any) {
		let instance = await this.env.MY_WORKFLOW.create({
			params: payload,
		});

		return Response.json({
			id: instance.id,
			details: await instance.status(),
		});
	}
}
