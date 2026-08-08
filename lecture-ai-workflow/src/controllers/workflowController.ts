import { Context } from "hono";
import { createWorkflowInstance, getWorkflowInstanceStatus } from "../services/workflowService";

export async function getStatus(c: Context) {
	const instanceId = c.req.query("instanceId");
	if (!instanceId) {
		return c.json({ error: "Missing instanceId parameter" }, 400);
	}

	try {
		const details = await getWorkflowInstanceStatus(c.env, instanceId);
		return c.json({ details });
	} catch (error: any) {
		return c.json({ error: error.message || "Failed to retrieve workflow status" }, 500);
	}
}

export async function startWorkflow(c: Context) {
	let path = "";
	let name = "Untitled Lecture";

	try {
		const contentType = c.req.header("content-type") || "";
		if (contentType.includes("application/json")) {
			const body = await c.req.json();
			if (typeof body === "string") {
				path = body;
			} else if (body && typeof body === "object") {
				if ("path" in body) path = body.path;
				if ("name" in body) name = body.name;
			}
		} else {
			// fallback to text
			path = await c.req.text();
		}
	} catch (err) {
		// fallback to text in case json parse fails
		try {
			path = await c.req.text();
		} catch {
			return c.json({ error: "Invalid request body" }, 400);
		}
	}

	path = path.trim().replace(/^"|"$/g, "");

	if (!path) {
		return c.json({ error: "Missing path parameter" }, 400);
	}

	const userId = c.var.supabaseContext?.userClaims?.id;
	if (!userId) {
		return c.json({ error: "Unauthorized: Missing user ID" }, 401);
	}

	try {
		const { id, status } = await createWorkflowInstance(c.env, path, name, userId);
		return c.json({
			id,
			details: status,
		});
	} catch (error: any) {
		return c.json({ error: error.message || "Failed to start workflow" }, 500);
	}
}
