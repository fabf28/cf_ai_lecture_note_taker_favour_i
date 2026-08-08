import { Context } from "hono";
import { searchAllNotes } from "../services/searchService";

export async function searchNotes(c: Context) {
	const query = c.req.query("query");
	if (!query) {
		return c.json({ error: "Missing query parameter" }, 400);
	}

	const userId = c.var.supabaseContext?.userClaims?.id;
	if (!userId) {
		return c.json({ error: "Unauthorized: Missing user ID" }, 401);
	}

	try {
		// Call the decoupled service to handle similarity matching
		const results = await searchAllNotes(c.env, query, userId);
		return c.json({ results });
	} catch (error: any) {
		return c.json({ error: error.message || "An unexpected error occurred during similarity search" }, 500);
	}
}
