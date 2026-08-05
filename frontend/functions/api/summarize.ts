
export const onRequestPost = async ({ request, env }: { request: any; env: any }) => {
    const host = env.WORKER_HOST || "http://127.0.0.1:8787";
    return fetch(`${host}/`, {
        method: "POST",
        body: request.body,
        headers: request.headers
    });
};

export const onRequestGet = async ({ request, env }: { request: any; env: any }) => {
    const host = env.WORKER_HOST || "http://127.0.0.1:8787";
    // This payload could be anything from within your app or from your frontend
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const newUrl = `${host}/?instanceId=${id}`;
    const response = await fetch(newUrl);
    return response;
};