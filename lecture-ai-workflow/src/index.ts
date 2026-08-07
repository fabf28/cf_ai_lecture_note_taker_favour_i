import { authenticateRequest } from "./lib/supabase";
import type { Params } from "./workflow";

export { MyWorkflow } from "./workflow";

export default {
	async fetch(req: Request, env: Env, executionCtx: ExecutionContext): Promise<Response> {
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

		// Authenticate request using Supabase JWT
		const { error: authError } = await authenticateRequest(req, env);

		if (authError) {
			return Response.json({
				error: authError.message,
				code: authError.code
			}, {
				status: authError.status
			});
		}

		// Spawn a new instance and return the ID and status

		//ensure path is string
		let path = "";
		let name = "Untitled Lecture";
		const contentType = req.headers.get("content-type") || "";
		if (contentType.includes("application/json")) {
			const body = (await req.json()) as any;
			if (typeof body === "string") {
				path = body;
			} else if (body && typeof body === "object") {
				if ("path" in body) path = body.path;
				if ("name" in body) name = body.name;
			}
		} else {
			// fallback to text
			path = await req.text();
		}

		//path clean up
		path = path.trim().replace(/^"|"$/g, "");

		if (!path) {
			return Response.json({ error: "Missing path parameter" }, { status: 400 });
		}

		const instance = await env.MY_WORKFLOW.create({
			params: {
				path: path,
				name: name
			}
		});

		//return response
		return Response.json({
			id: instance.id,
			details: await instance.status(),
		});
	},
};
