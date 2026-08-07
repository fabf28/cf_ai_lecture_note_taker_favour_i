export const onRequestPost = async ({ request, env }: { request: any; env: any }) => {
    const host = env.WORKER_HOST || "http://127.0.0.1:8787";
    
    // Clone headers and remove 'host' to let the fetch runtime set the correct destination host
    const headers = new Headers(request.headers);
    headers.delete("host");

    return fetch(`${host}/`, {
        method: "POST",
        body: request.body,
        headers: headers
    });
};

export const onRequestGet = async ({ request, env }: { request: any; env: any }) => {
    const host = env.WORKER_HOST || "http://127.0.0.1:8787";
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const newUrl = `${host}/?instanceId=${id}`;
    
    // No headers are passed here, which lets fetch generate the correct Host header automatically
    const response = await fetch(newUrl);
    return response;
};