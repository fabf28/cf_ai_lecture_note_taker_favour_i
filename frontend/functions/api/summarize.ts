export const onRequestPost = async ({ request }) => {
    return fetch("http://lecture-ai-workflow.favour-iheanyichukwu.workers.dev/", {
        method: "POST",
        body: request.body,
        headers: request.headers
    });
};

export const onRequestGet = async ({ request }) => {
    // This payload could be anything from within your app or from your frontend
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const newUrl = "http://lecture-ai-workflow.favour-iheanyichukwu.workers.dev/?instanceId=" + id;
    const response = await fetch(newUrl);
    return response;
};