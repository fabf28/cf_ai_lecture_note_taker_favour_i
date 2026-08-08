import { Hono, Context, Next } from "hono";
import { cors } from "hono/cors";
import { authenticateRequest } from "./lib/supabase";
import { getStatus, startWorkflow } from "./controllers/workflowController";

export { MyWorkflow } from "./services/workflow";

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for all routes
app.use("*", cors());

// Authentication Middleware using Supabase JWT
const authMiddleware = async (c: Context, next: Next) => {
	const { error: authError } = await authenticateRequest(c.req.raw, c.env);

	if (authError) {
		return c.json(
			{
				error: authError.message,
				code: authError.code,
			},
			authError.status as any
		);
	}
	await next();
};

// Handle favicon requests
app.get("/favicon*", (c) => c.json({}, 404));

// Route GET /?instanceId=... to check status (public)
app.get("/", getStatus);

// Route POST / to create/trigger workflow (authenticated)
app.post("/", authMiddleware, startWorkflow);

export default app;
