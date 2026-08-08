import { getSupabaseAdmin } from "../lib/supabase";

export async function searchAllNotes(env: Env, query: string, userId: string) {
	// 1. Generate text embedding for the query string using Workers AI
	const embeddingResponse = (await env.AI.run("@cf/baai/bge-base-en-v1.5", {
		text: query,
	})) as { data: number[][] };

	const queryEmbedding = embeddingResponse.data[0];
	if (!queryEmbedding) {
		throw new Error("Failed to generate query embedding");
	}

	// 2. Call the Supabase stored procedure to find matching notes
	const supabase = getSupabaseAdmin(env);
	const { data, error } = await (supabase as any).rpc("match_notes", {
		query_embedding: queryEmbedding,
		match_threshold: 0.4, // Cosine similarity match threshold
		match_count: 10,       // Max notes returned
		query_user_id: userId,
	});

	if (error) {
		throw new Error(error.message);
	}

	// 3. Create response using matching notes as context
	const systemPrompt = `
		You are a notes assistant. You answer questions using only the note excerpts provided as context below — never from outside knowledge or assumptions.

		Rules:
		- Base your answer strictly on the provided notes. Do not add information that isn't in them.
		- If the notes don't contain enough information to answer, say so plainly — don't guess or fill gaps with general knowledge.
		- If the notes partially answer the question, answer what you can and note what's missing.
		- Keep your response short and conversational — 1 to 4 sentences for simple questions, a short paragraph or brief list only if the question genuinely requires it. This is a chat interface; the user does not want a long response.
		- Do not repeat the question back before answering.
		- Do not mention "the context," "the provided notes," or that you were given excerpts — just answer naturally, as if you already know the person's notes.
		- If multiple notes are relevant, synthesize them into one coherent answer rather than listing each source separately.
		`
	const userPrompt = `Notes:
		${data.map((c: { keyword: string; definition: string }) => `- ${c.keyword}: ${c.definition}`).join("\n")}

		Question: ${query}`;

	const response: any = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
		messages: [
			{ role: "system", content: systemPrompt },
			{ role: "user", content: userPrompt },
		],
		max_tokens: 200, // hard cap to reinforce brevity at the API level too
	});

	return response;
}
