import { Hono, Context, Next } from "hono";
import { cors } from "hono/cors";
import { withSupabase } from "@supabase/server/adapters/hono";
import { AuthError } from "@supabase/server";
import { getSupabaseConfig } from "./lib/supabase";
import { getStatus, startWorkflow } from "./controllers/workflowController";
import { searchNotes } from "./controllers/searchController";

export { MyWorkflow } from "./workflow";

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for all routes
app.use("*", cors());

// Reusable middleware helper to protect any route and map Cloudflare's c.env bindings
const protect = () => async (c: Context, next: Next) => {
	const middleware = withSupabase({
		auth: "user",
		env: getSupabaseConfig(c.env),
	});
	return middleware(c, next);
};

// Error handler to format Supabase AuthError JSON responses
app.onError((err, c) => {
	if (err.cause instanceof AuthError) {
		return c.json(
			{
				error: err.message,
				code: err.cause.code,
			},
			err.cause.status as any
		);
	}
	return c.json({ error: err.message || "Internal Server Error" }, 500);
});


// Handle favicon requests
app.get("/favicon*", (c) => c.json({}, 404));


//workflow routes
// Route GET /?instanceId=... to check status (public)
app.get("/", getStatus);

// Route POST / to create/trigger workflow (authenticated)
app.post("/", protect(), startWorkflow);



//similarity search routes
app.get("/search/all", protect(), searchNotes);


export default app;
