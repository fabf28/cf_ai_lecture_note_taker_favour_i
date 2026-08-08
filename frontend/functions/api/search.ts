export const onRequestGet = async ({ request, env }: { request: any; env: any }) => {
    const host = env.WORKER_HOST || "http://127.0.0.1:8787";
    const url = new URL(request.url);
    const query = url.searchParams.get("query");
    
    // Pass the Authorization header containing the user's Supabase JWT access token
    const headers = new Headers();
    const authHeader = request.headers.get("Authorization");
    if (authHeader) {
        headers.set("Authorization", authHeader);
    }

    const response = await fetch(`${host}/search/all?query=${encodeURIComponent(query || "")}`, {
        headers: headers
    });
    return response;
};
