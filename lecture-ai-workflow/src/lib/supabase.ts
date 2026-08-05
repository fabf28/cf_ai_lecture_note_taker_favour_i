import { createSupabaseContext } from "@supabase/server";
import { createAdminClient } from "@supabase/server/core";

/**
 * Maps Cloudflare Workers Env bindings to the configuration format expected by Supabase.
 */
export function getSupabaseConfig(env: Env) {
	let jwks: URL | null = null;
	try {
		if (env.SUPABASE_JWKS_URL) {
			jwks = new URL(env.SUPABASE_JWKS_URL);
		}
	} catch (e) {
		console.error("Invalid SUPABASE_JWKS_URL:", e);
	}

	return {
		url: env.SUPABASE_URL,
		publishableKeys: { default: env.SUPABASE_PUBLISHABLE_KEY },
		secretKeys: { default: env.SUPABASE_SECRET_KEY },
		jwks,
	};
}

/**
 * Creates an admin Supabase client using environment bindings.
 */
export function getSupabaseAdmin(env: Env) {
	return createAdminClient({
		env: getSupabaseConfig(env),
	});
}

/**
 * Verifies request credentials and returns the Supabase Context.
 */
export function authenticateRequest(req: Request, env: Env) {
	return createSupabaseContext(req, {
		auth: "user",
		env: getSupabaseConfig(env),
	});
}